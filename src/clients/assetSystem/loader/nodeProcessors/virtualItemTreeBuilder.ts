import { Nullable } from "@babylonjs/core"
import * as BABYLON from "@babylonjs/core"
import { Constants } from "../../constants"
import { IAssetPackageFileLoader, eAssetType } from "../../definitions"
import { IAssetManifest_Item, IItemJsonChildData, IItemJsonParamData } from "../../jsonTypes/manifest/assetManifest_Item"
import { AssetUtils } from "../../assetUtils"
import { ParamaterProcessor } from "./parameterProcessor"

export interface IVirtualItemTreeNode {
    id: number,
    indexPath: string,
    parent: Nullable<IVirtualItemTreeNode>,
    children: Array<IVirtualItemTreeNode>,
    childParams: Array<IItemJsonParamData>,
    asset: {
        id: string,
        type: string
    },
    values: {
        name: string,
        pos: BABYLON.Vector3
        rot: BABYLON.Quaternion
        scale: BABYLON.Vector3
    },
    metadata: any
}


export interface IBuildTreeContext {
    parentNode: Nullable<IVirtualItemTreeNode>,
    allNodes: Array<IVirtualItemTreeNode>,

    currentAsset: {
        type: eAssetType,
        id: string,
    },
}

export class VirtualItemTreeBuilder {
    private _callerAssetStack = Array<string>() //에셋 순환 참조 방지
    private _packageFileLoader: Nullable<IAssetPackageFileLoader> = null

    constructor(packageFileLoader: Nullable<IAssetPackageFileLoader>) {
        this._packageFileLoader = packageFileLoader

    }

    async build(manifest: IAssetManifest_Item, assetType: eAssetType, assetId: string): Promise<Array<IVirtualItemTreeNode>> {
        const treeContext = {
            parentNode: null,
            allNodes: new Array<IVirtualItemTreeNode>(),
            currentAsset: {
                type: assetType,
                id: assetId
            }
        }

        await this._build_recursively(manifest, treeContext)

        const rootNodes = new Array<IVirtualItemTreeNode>()
        treeContext.allNodes.forEach(n => {
            if (n.parent === null) {
                rootNodes.push(n)
            }
        })

        return rootNodes
    }

    private async _build_recursively(manifest: IAssetManifest_Item, context: IBuildTreeContext): Promise<void> {
        const hasCircularRef = !this.BEGINE_DETECT_ASSET_CIRCULAR_REF(context.currentAsset.id)
        if (hasCircularRef) {
            return
        }

        if (manifest.main.type !== "Item") {
            console.error(`VirtualItemTreeBuilder._build_recursively() : ${context.currentAsset.id} is not Item Type!!`)
            return
        }

        //노드를 생성한다.
        const nodesInCurrentItem = new Array<IVirtualItemTreeNode>()
        manifest.main.child.forEach((c) => {

            nodesInCurrentItem.push({
                id: c.i,
                indexPath: context.parentNode ? `${context.parentNode.indexPath}/${c.i}` : `${c.i}`,
                parent: null,
                children: new Array<IVirtualItemTreeNode>,
                childParams: new Array<IItemJsonParamData>,

                asset: {
                    id: c.id,
                    type: c.t
                },
                values: {
                    name: this._makeNodeName(c),
                    pos: new BABYLON.Vector3,
                    rot: BABYLON.Quaternion.FromEulerAngles(0, 0, 0),
                    scale: new BABYLON.Vector3(1.0, 1.0, 1.0),
                },
                metadata: undefined
            })
        })


        //현재 manifest의 param들을 적용한다.
        manifest.main.param.forEach((param) => this._applyParamToTargetNodes(param, nodesInCurrentItem, context))

        //parent로 부터 전달 받은 파라메터 처리
        if (context.parentNode) {
            context.parentNode.childParams.forEach((param) => this._applyParamToTargetNodes(param, nodesInCurrentItem, context))
        }

        //nodesInCurrentItem -> allNodes
        nodesInCurrentItem.forEach(n => {
            if (n.parent === null) {
                n.parent = context.parentNode
                if (n.parent) {
                    n.parent.children.push(n)
                }
            }
        })
        context.allNodes = context.allNodes.concat(nodesInCurrentItem)

        // child item을 재귀 처리한다
        for (let ii = 0;ii < nodesInCurrentItem.length;++ii) {
            const node = nodesInCurrentItem[ii]
            if (node) {
                if ("" != node.asset.id) {
                    if (node.asset.type == "Item") {
                        const objectUrl = await this._packageFileLoader!.loadFile(eAssetType.Item, node.asset.id, Constants.MANIFEST_FILENAME)
                        const mainfestChild = await AssetUtils.readJsonFromUrl<IAssetManifest_Item>(objectUrl)
                        if (mainfestChild) {
                            const assetTypeChild = AssetUtils.convertStringToAssetType(node.asset.type)
                            if (eAssetType.None != assetTypeChild) {
                                context.parentNode = node
                                context.currentAsset = {
                                    type: assetTypeChild,
                                    id: node.asset.id
                                }
                                await this._build_recursively(mainfestChild, context) //재귀
                            }
                        }
                    }
                }
            }
        }

        this.END_DETECT_ASSET_CIRCULAR_REF()
    }

    private _applyParamToTargetNodes(param: IItemJsonParamData, targetNodes: Array<IVirtualItemTreeNode>, context: IBuildTreeContext): void {
        if (param) {
            if ((param.i).indexOf(Constants.ITEM_INDEX_PATH_SEPERATOR) < 0) {
                const targetId = parseInt(param.i)
                const target = targetNodes.find((n) => n.id == targetId)
                if (target) {
                    ParamaterProcessor.processParam(target, param, targetNodes, context)
                }
                else {
                    console.error(`AssetLoader._buildItemVirtualTree() => could not find a target, p.i = ${param.i}`)
                }
            }
            else {
                const splittedpath = (param.i).split(Constants.ITEM_INDEX_PATH_SEPERATOR)
                const targetId = parseInt(splittedpath[0])
                const target = targetNodes.find((n) => n.id == targetId)
                if (target) {
                    splittedpath.shift()
                    target.childParams.push({
                        n: param.n,
                        i: splittedpath.join(Constants.ITEM_INDEX_PATH_SEPERATOR),
                        v: param.v
                    })
                }
                else {
                    console.error(`AssetLoader._buildItemVirtualTree() => could not find a target, targetId = ${targetId}`)
                }
            }
        }
    }



    private _makeNodeName(childData: IItemJsonChildData): string {
        if (childData) {
            if (childData.n !== "") {
                return childData.n
            }
            else if (childData.id !== "") {
                return `${childData.id} (${childData.t})`
            }
        }

        return `item ${childData.i}`
    }

    //-----------------------------------------------------------------------------------
    // Detect Asset Circular Reference
    //-----------------------------------------------------------------------------------
    private BEGINE_DETECT_ASSET_CIRCULAR_REF(assetId: string): boolean {
        if (this._callerAssetStack.includes(assetId)) {
            const idx = this._callerAssetStack.indexOf(assetId)
            const circularRef = this._callerAssetStack.slice(idx).join("=>")
            const msg = `${assetId} has circular asset reference , ${circularRef}`
            console.error(`AssetLoader._loadAssetIntoScene_Recursively() : circular reference detected , ${msg}`)
            return false
        }

        this._callerAssetStack.push(assetId)
        return true
    }

    private END_DETECT_ASSET_CIRCULAR_REF() {
        this._callerAssetStack.pop()
    }
}