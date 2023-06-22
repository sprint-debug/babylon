import { Nullable } from "@babylonjs/core"
import * as BABYLON from "@babylonjs/core"

import { IAssetUnitLoader } from "./assetUnitLoader"
import { eAssetType, IAssetPackageFileLoader } from "../../definitions"
import { IAssetManifest } from "../../jsonTypes/manifest/assetManifest"
import { IAssetManifest_Model_glb } from "../../jsonTypes/manifest/assetManifest_Model_glb"


export class AssetUnitLoader_Model_glb implements IAssetUnitLoader {
    private _scene: Nullable<BABYLON.Scene> = null
    private _assetContainerCache = new Map<string, BABYLON.AssetContainer>()
    private _packageFileLoader: Nullable<IAssetPackageFileLoader> = null

    constructor(scene: Nullable<BABYLON.Scene> = null, packageFileLoader: Nullable<IAssetPackageFileLoader>) {
        this._scene = scene || BABYLON.EngineStore.LastCreatedScene
        this._packageFileLoader = packageFileLoader
    }

    async loadAssetUnit(manifest: IAssetManifest, assetInfo: { assetType: eAssetType; assetId: string }): Promise<Nullable<BABYLON.ISceneLoaderAsyncResult>> {
        const _manifest: IAssetManifest_Model_glb = manifest as IAssetManifest_Model_glb
        if (!_manifest) {
            return null
        }

        let assetContainer = this._assetContainerCache.get(assetInfo.assetId)
        if (!assetContainer) {
            if (_manifest) {
                const modelFile = _manifest.main.modelfile
                if (modelFile && this._packageFileLoader) {
                    const assetUrl = await this._packageFileLoader.loadFile(assetInfo.assetType, assetInfo.assetId, modelFile)
                    assetContainer = await BABYLON.SceneLoader.LoadAssetContainerAsync("", assetUrl, this._scene, undefined, ".glb")
                    this._assetContainerCache.set(assetInfo.assetId, assetContainer)
                    //씬에 사용하는 texture는 올려주자
                    assetContainer.textures.forEach((tex) => {
                        this._scene?.addTexture(tex)
                    })
                }
            }
        }

        if (assetContainer) {
            const result = {
                meshes: new Array<BABYLON.AbstractMesh>,
                particleSystems: new Array<BABYLON.IParticleSystem>,
                skeletons: new Array<BABYLON.Skeleton>,
                animationGroups: new Array<BABYLON.AnimationGroup>,
                transformNodes: new Array<BABYLON.TransformNode>,
                geometries: new Array<BABYLON.Geometry>,
                lights: new Array<BABYLON.Light>
            }

            const entries = assetContainer.instantiateModelsToScene()

            //InstantiatedEntries node 처리
            for (let node of entries.rootNodes) {
                if (node instanceof BABYLON.AbstractMesh) {
                    result.meshes.push(node)
                }
                else if (node instanceof BABYLON.TransformNode) {
                    result.transformNodes.push(node)
                }
                else if (node instanceof BABYLON.Light) {
                    result.lights.push(node)
                }
            }

            //InstantiatedEntries skeletons 처리
            entries.skeletons = entries.skeletons

            //animation animationGroups 처리
            entries.animationGroups = entries.animationGroups

            //scale과 rot 처리
            for (let node of entries.rootNodes) {
                if (node instanceof BABYLON.TransformNode) {
                    if (_manifest.main.scale) {
                        node.scaling = node.scaling.multiply(new BABYLON.Vector3(_manifest.main.scale, _manifest.main.scale, _manifest.main.scale))
                    }

                    if (_manifest.main.rotAngle) {
                        if (node.rotationQuaternion) {
                            node.rotationQuaternion = node.rotationQuaternion?.multiply(BABYLON.Quaternion.FromEulerAngles(0, BABYLON.Tools.ToRadians(_manifest.main.rotAngle), 0))
                        }
                    }
                }
            }


            //기본 에니메이션 실행
            if (entries.animationGroups.length > 0) {
                if (_manifest.main.playAnim) {
                    const idx = entries.animationGroups.findIndex(g => g.name == _manifest.main.playAnim?.animationGroupName)
                    if (idx >= 0) {
                        entries.animationGroups[idx].start(true, _manifest.main.playAnim.speed)
                    }
                }
                else {
                    entries.animationGroups[0].start(true)
                }
            }

            return result
        }

        return null
    }
}