import { Nullable } from "@babylonjs/core"
import * as BABYLON from "@babylonjs/core"
import { IAssetLoader, eAssetType, IAssetPackageFileLoader, IAssetLoadingResult } from "../definitions"
import { AssetPackageFileLoader } from "../package/assetPacakgeFileLoader"
import { Constants } from "../constants"
import { AssetUtils } from "../assetUtils"
import { IAssetManifest } from "../jsonTypes/manifest/assetManifest"
import { IAssetManifest_Item } from "../jsonTypes/manifest/assetManifest_Item"
import { eAssetUnit, IAssetUnitLoader } from "./unitLoader/assetUnitLoader"
import { AssetUnitLoader_Model_glb } from "./unitLoader/assetUnitLoader_Model_glb"
import { AssetUnitLoader_Particle } from "./unitLoader/assetUnitLoader_Particle"
import { IVirtualItemTreeNode, VirtualItemTreeBuilder } from "./nodeProcessors/virtualItemTreeBuilder"
import { MetadataProcessor } from "./nodeProcessors/metadataProcessor"

//---------------------------------------------------------------------------------------
// Interanl Types
//---------------------------------------------------------------------------------------
interface IAssetLoadingContext {
    result: IAssetLoadingResult,

    assetInfo: {
        assetType: eAssetType,
        assetId: string,
    },
    parent: Nullable<BABYLON.AbstractMesh>,
}

//---------------------------------------------------------------------------------------
// AssetLoader
//---------------------------------------------------------------------------------------
export class AssetLoader implements IAssetLoader {
    private _packageFileLoader: Nullable<IAssetPackageFileLoader> = null
    private _scene: Nullable<BABYLON.Scene> = null
    private _assetUnitLoaders = new Map<string, IAssetUnitLoader>()

    constructor(scene: Nullable<BABYLON.Scene> = null) {
        this._scene = scene || BABYLON.EngineStore.LastCreatedScene
        if (this._scene) {
            this._packageFileLoader = new AssetPackageFileLoader(this._scene)
        }

        this._assetUnitLoaders.set(eAssetUnit.Model_glb, new AssetUnitLoader_Model_glb(this._scene, this._packageFileLoader))
        this._assetUnitLoaders.set(eAssetUnit.Particle, new AssetUnitLoader_Particle(this._scene, this._packageFileLoader))
    }

    async loadAssetIntoScene(assetType: eAssetType, assetId: string, parent: Nullable<BABYLON.AbstractMesh> = null): Promise<IAssetLoadingResult> {
        let context: IAssetLoadingContext = {
            result: {
                errors: [],
                loadedObjects: {
                    meshes: [],
                    particleSystems: [],
                    skeletons: [],
                    animationGroups: [],
                    transformNodes: [],
                    geometries: [],
                    lights: []
                }
            },
            assetInfo: {
                assetType,
                assetId
            },
            parent: parent,
        }

        if (this._scene) {
            if (this._packageFileLoader) {
                const objectUrl = await this._packageFileLoader.loadFile(assetType, assetId, Constants.MANIFEST_FILENAME)
                const manifest = await AssetUtils.readJsonFromUrl<IAssetManifest>(objectUrl)
                if (manifest) {
                    switch (manifest.main.type) {
                        case "Item":
                        case "Avatar":
                        case "Land":
                            await this._loadAssetIntoScene_Item(manifest, context)
                            break
                        default:
                            await this._loadAssetIntoScene_Asset(manifest, context)
                            break
                    }
                }
            }
        }

        this._postProcessForCreatedNodes(context)

        return context.result
    }

    async clearCache(): Promise<void> {
        await this._packageFileLoader?.clearCache()
    }

    //-----------------------------------------------------------------------------------
    // loadAssetIntoScene Helpers (Item)
    //-----------------------------------------------------------------------------------
    private async _loadAssetIntoScene_Item(manifest: IAssetManifest, context: IAssetLoadingContext): Promise<void> {
        const treeNodeBuilder = new VirtualItemTreeBuilder(this._packageFileLoader)
        const rootNodes = await treeNodeBuilder.build(manifest as IAssetManifest_Item, context.assetInfo.assetType, context.assetInfo.assetId)

        for (let ii = 0;ii < rootNodes.length;++ii) {
            const node = rootNodes[ii]
            await this._createSceneNode_recusively(node, context)
        }
    }

    private async _createSceneNode_recusively(node: IVirtualItemTreeNode, context: IAssetLoadingContext): Promise<void> {
        let createdMesh: Nullable<BABYLON.AbstractMesh> = null
        if (node.asset.id === "" || node.asset.type === "Item") {
            createdMesh = new BABYLON.AbstractMesh(node.values.name)
        }
        else {
            const assetType = AssetUtils.convertStringToAssetType(node.asset.type)
            const assetId = node.asset.id

            const objectUrl = await this._packageFileLoader!.loadFile(assetType, assetId, Constants.MANIFEST_FILENAME)
            const manifest = await AssetUtils.readJsonFromUrl<IAssetManifest>(objectUrl)
            if (manifest) {
                const importResult = await this._loadAssetIntoScene_Asset_helper(manifest, { assetType, assetId })
                if (importResult) {
                    importResult.meshes.forEach(mesh => {
                        if (mesh.parent === null) {
                            mesh.parent = context.parent
                        }
                    })
                    this._mergeSceneImportResult(context, importResult)
                    if (importResult.meshes.length > 0) {
                        createdMesh = importResult.meshes[0]
                        createdMesh.name = node.values.name
                    }
                }
            }
        }

        if (createdMesh) {
            createdMesh.parent = context.parent
            createdMesh.position = node.values.pos
            if (createdMesh.rotationQuaternion) {
                createdMesh.rotationQuaternion = createdMesh.rotationQuaternion?.multiply(node.values.rot)
            }
            else {
                createdMesh.rotationQuaternion = node.values.rot
            }
            createdMesh.scaling = createdMesh.scaling.multiply(node.values.scale)
            createdMesh.metadata = node.metadata

            for (let ii = 0;ii < node.children.length;++ii) {
                context.parent = createdMesh
                context.assetInfo = { assetId: node.asset.id, assetType: AssetUtils.convertStringToAssetType(node.asset.type) }
                await this._createSceneNode_recusively(node.children[ii], context)
            }
        }

        context.parent = null
        context.assetInfo = { assetType: eAssetType.None, assetId: "" }
    }

    //-----------------------------------------------------------------------------------
    // loadAssetIntoScene Helpers (Asset)
    //-----------------------------------------------------------------------------------
    private async _loadAssetIntoScene_Asset(manifest: IAssetManifest, context: IAssetLoadingContext): Promise<void> {
        if (manifest) {
            let importResult = await this._loadAssetIntoScene_Asset_helper(manifest, context.assetInfo)
            if (importResult) {
                importResult.meshes.forEach(mesh => {
                    if (mesh.parent === null) {
                        mesh.parent = context.parent
                    }
                })
                this._mergeSceneImportResult(context, importResult)
            }
        }
    }

    private async _loadAssetIntoScene_Asset_helper(manifest: IAssetManifest, assetInfo: { assetType: eAssetType, assetId: string }): Promise<Nullable<BABYLON.ISceneLoaderAsyncResult>> {
        let unitLoader: IAssetUnitLoader | undefined = undefined

        if (manifest) {
            if (this._assetUnitLoaders.get(manifest.main.type)) {
                unitLoader = this._assetUnitLoaders.get(manifest.main.type)
            }
        }

        if (unitLoader) {
            return await unitLoader.loadAssetUnit(manifest, assetInfo)
        }

        return null
    }

    //-----------------------------------------------------------------------------------
    // 노드 생성후 후처리 작업
    //-----------------------------------------------------------------------------------
    private async _postProcessForCreatedNodes(context: IAssetLoadingContext): Promise<void> {
        for (let ii = 0;ii < context.result.loadedObjects.lights.length;++ii) {
            const node = context.result.loadedObjects.lights[ii]
            await MetadataProcessor.processMetadata(node)
        }

        for (let ii = 0;ii < context.result.loadedObjects.meshes.length;++ii) {
            const node = context.result.loadedObjects.meshes[ii]
            await MetadataProcessor.processMetadata(node)
        }

        for (let ii = 0;ii < context.result.loadedObjects.transformNodes.length;++ii) {
            const node = context.result.loadedObjects.transformNodes[ii]
            await MetadataProcessor.processMetadata(node)
        }
    }


    //-----------------------------------------------------------------------------------
    // Mesh Import Result 합치기
    //-----------------------------------------------------------------------------------
    private _mergeSceneImportResult(context: IAssetLoadingContext, importResult: BABYLON.ISceneLoaderAsyncResult): void {
        const meshes = context.result.loadedObjects.meshes.concat(importResult.meshes)
        const particleSystems = context.result.loadedObjects.particleSystems.concat(importResult.particleSystems)
        const skeletons = context.result.loadedObjects.skeletons.concat(importResult.skeletons)
        const animationGroups = context.result.loadedObjects.animationGroups.concat(importResult.animationGroups)
        const transformNodes = context.result.loadedObjects.transformNodes.concat(importResult.transformNodes)
        const geometries = context.result.loadedObjects.geometries.concat(importResult.geometries)
        const lights = context.result.loadedObjects.lights.concat(importResult.lights)

        const result = {
            meshes: meshes,
            particleSystems: particleSystems,
            skeletons: skeletons,
            animationGroups: animationGroups,
            transformNodes: transformNodes,
            geometries: geometries,
            lights: lights,
        }

        context.result.loadedObjects = result //이게 최선인가?
    }

    //-----------------------------------------------------------------------------------
    // Print Virtual Item Tree (Debug용)
    //-----------------------------------------------------------------------------------
    /*
    private _printVirtualItemTree(node: IVirtualItemTreeNode): void {
        if (node) {
            let debug = { msg: "" }
            this._makeVirtualItemTreeNodeDegugText(node, debug, 0)
            console.log("Virtual Item Tree : -----------------------")
            console.log(debug.msg)
            console.log("-------------------------------------------\n\n")
        }
    }

    private _makeVirtualItemTreeNodeDegugText(node: IVirtualItemTreeNode, debug: { msg: string }, depth: number = 0): void {
        if (node) {
            debug.msg += '-'.repeat(depth)
            debug.msg += `${node.values.name} ${node.indexPath}\n`
            node.children.forEach(n => {
                this._makeVirtualItemTreeNodeDegugText(n, debug, depth + 1)
            })
        }
    }
    */
}


