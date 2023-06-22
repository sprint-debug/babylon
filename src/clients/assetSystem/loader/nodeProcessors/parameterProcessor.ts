import * as BABYLON from "@babylonjs/core"
import { IItemJsonParamData } from "../../jsonTypes/manifest/assetManifest_Item"
import { IVirtualItemTreeNode, IBuildTreeContext } from "./virtualItemTreeBuilder"
import { JsonUtils } from "../../jsonUtils"

export class ParamaterProcessor {
    static processParam(target: IVirtualItemTreeNode, param: IItemJsonParamData, tmpNodes: Array<IVirtualItemTreeNode>, context: IBuildTreeContext) {
        if (target) {
            switch (param.n) {
                case "SetPosition":
                    ParamaterProcessor._processParam_SetPosition(target, param)
                    break
                case "SetRotation":
                    ParamaterProcessor._processParam_SetRotation(target, param)
                    break
                case "SetScale":
                    ParamaterProcessor._processParam_SetScale(target, param)
                    break

                case "SetParent":
                    ParamaterProcessor._processParam_SetParent(target, param, tmpNodes, context)
                    break

                case "SetMetadata":
                    ParamaterProcessor._processParam_SetMetadata(target, param)
                    break

                default:
                    console.error(`AssetLoader._processItemJsonParam_SetParent() : param ${param.n} has no handler!!`)
                    break
            }
        }
    }

    private static _processParam_SetPosition(target: IVirtualItemTreeNode, param: IItemJsonParamData) {
        let v = new BABYLON.Vector3
        if (JsonUtils.parseToVector3(param.v, v)) {
            target.values.pos = v
        }
    }

    private static _processParam_SetRotation(target: IVirtualItemTreeNode, param: IItemJsonParamData) {
        let v = new BABYLON.Vector3
        if (JsonUtils.parseToVector3(param.v, v)) {
            const angleX = BABYLON.Tools.ToRadians(v.x)
            const angleY = BABYLON.Tools.ToRadians(v.y)
            const angleZ = BABYLON.Tools.ToRadians(v.z)
            target.values.rot = BABYLON.Quaternion.FromEulerAngles(angleX, angleY, angleZ)
        }
    }

    private static _processParam_SetScale(target: IVirtualItemTreeNode, param: IItemJsonParamData) {
        let v = new BABYLON.Vector3
        if (JsonUtils.parseToVector3(param.v, v)) {
            target.values.scale = v
        }
    }

    private static _processParam_SetParent(target: IVirtualItemTreeNode, param: IItemJsonParamData, inProgressNodes: Array<IVirtualItemTreeNode>, context: IBuildTreeContext) {

        let parentNode = null
        if (param.v.indexOf("/") < 0) {
            const parentId = parseInt(param.v)
            parentNode = inProgressNodes.find((n) => n.id === parentId)
        }
        else {
            const paramValueToIndexPath = target.parent ? `${target.parent.indexPath}/${param.v}` : `${param.v}`
            parentNode = context.allNodes.find((n) => n.indexPath == paramValueToIndexPath)
        }

        if (parentNode) {
            target.parent = parentNode
            if (parentNode.children.indexOf(target) < 0) {
                parentNode.children.push(target)
            }
            else {
                console.error("AssetLoader._processItemJsonParam_SetParent() : target is already in parentNode.children")
            }
        }
        else {
            console.error("AssetLoader._processItemJsonParam_SetParent() : could not find the parent node")
        }
    }

    private static _processParam_SetMetadata(target: IVirtualItemTreeNode, param: IItemJsonParamData) {
        if (param.v) {
            target.metadata = param.v
        }
    }
}