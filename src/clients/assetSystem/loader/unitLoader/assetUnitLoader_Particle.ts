import * as BABYLON from "@babylonjs/core"
import { Nullable } from "@babylonjs/core"
import { IAssetPackageFileLoader, eAssetType } from "../../definitions"
import { IAssetManifest } from "../../jsonTypes/manifest/assetManifest"
import { IAssetManifest_Particle } from "../../jsonTypes/manifest/assetManifest_Particle"
import { IAssetUnitLoader } from "./assetUnitLoader"
import { ParticleParser_Internal } from "./particleParser_Internal"

export class AssetUnitLoader_Particle implements IAssetUnitLoader {
    private _scene: Nullable<BABYLON.Scene> = null
    private _packageFileLoader: Nullable<IAssetPackageFileLoader> = null

    constructor(scene: Nullable<BABYLON.Scene> = null, packageFileLoader: Nullable<IAssetPackageFileLoader>) {
        this._scene = scene || BABYLON.EngineStore.LastCreatedScene
        this._packageFileLoader = packageFileLoader
    }
    async loadAssetUnit(manifest: IAssetManifest, assetInfo: { assetType: eAssetType; assetId: string }): Promise<Nullable<BABYLON.ISceneLoaderAsyncResult>> {
        const _manifest: IAssetManifest_Particle = manifest as IAssetManifest_Particle
        if (!_manifest) {
            console.error("qwerty : " + JSON.stringify(manifest));
            return null
        }

        console.log("AssetUnitLoader_Particle::loadAssetUnit() manifest : \n" + _manifest);

        {   // 유니티에서 익스포트된 effect 사용
            //console.log("qwer : " + JSON.stringify(manifest));
            //return this._loadCustomParticle(_manifest, assetInfo);
        }
        
        {   // 외부 바빌론 effect 사용 테스트
            // https://assets.babylonjs.com/particles/systems/sun.json
            // sun, explosion, fire, rain, smoke
            //let baseAssetUrl = "https://assets.babylonjs.com/particles";
            //let assetName = "sun"
            //return ParticleParser_Outer.Parse(this._scene!, baseAssetUrl, assetName, false, 2000);
        }

        {   // 앞으로 사용할 유니티에서 익스포트된 바빌론 format의 json
            // let assetRoot = await this._packageFileLoader!.loadFile(assetInfo.assetType, assetInfo.assetId, Constants.MANIFEST_FILENAME);
            // assetRoot = assetRoot.replace(Constants.MANIFEST_FILENAME, "");
            //console.log("fffffff : " + assetRoot);
            return ParticleParser_Internal.Parse(this._scene!, this._packageFileLoader!, assetInfo, JSON.stringify(manifest), "", false, 2000);
        }
    }

    // async _loadCustomParticle(manifest: IAssetManifest_Particle, assetInfo: { assetType: eAssetType; assetId: string }): Promise<Nullable<BABYLON.ISceneLoaderAsyncResult>> {
    //     let emitMesh = null

    //     if (false) {
    //         // 나중에 쓸건데 빌드오류 방지용
    //         emitMesh = Mesh.CreateBox("mesh_" + assetInfo.assetId, 1.0, this._scene)
    //     }

    //     // Create a particle system
    //     var particleSystem = new ParticleSystem("particle_" + assetInfo.assetId, 2000, this._scene!)

    //     // Where the particles come from
    //     if (emitMesh) {
    //         particleSystem.emitter = emitMesh // the starting object, the emitter
    //     }
    //     particleSystem.minEmitBox = manifest.main.minEmitBox
    //     particleSystem.maxEmitBox = manifest.main.maxEmitBox

    //     // Colors of all particles
    //     particleSystem.color1 = manifest.main.color1
    //     particleSystem.color2 = manifest.main.color2

    //     // Size of each particle (random between...
    //     particleSystem.minSize = manifest.main.minSize
    //     particleSystem.maxSize = manifest.main.maxSize

    //     // Life time of each particle (random between...
    //     particleSystem.minLifeTime = manifest.main.minLifeTime
    //     particleSystem.maxLifeTime = manifest.main.maxLifeTime

    //     // Emission rate
    //     particleSystem.emitRate = manifest.main.emitRate

    //     // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
    //     particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE

    //     // Set the gravity of all particles
    //     var g = manifest.main.gravity
    //     particleSystem.gravity = new Vector3(g.x, g.y, g.z)

    //     // Direction of each particle after it has been emitted
    //     particleSystem.direction1 = manifest.main.direction1
    //     particleSystem.direction2 = manifest.main.direction2

    //     // Angular speed, in radians
    //     particleSystem.minAngularSpeed = manifest.main.minAngularSpeed
    //     particleSystem.maxAngularSpeed = manifest.main.maxAngularSpeed

    //     // Speed
    //     particleSystem.minEmitPower = manifest.main.minEmitPower
    //     particleSystem.maxEmitPower = manifest.main.maxEmitPower
    //     particleSystem.updateSpeed = manifest.main.updateSpeed


    //     //Texture of each particle
    //     if (manifest.main.particleTextureName)
    //     {
    //         const assetUrl = await this._packageFileLoader!.loadFile(assetInfo.assetType, assetInfo.assetId, manifest.main.particleTextureName);
    //         particleSystem.particleTexture = new Texture(assetUrl, this._scene);
    //         // particleSystem.particleTexture = new Texture(assetUrl, this._scene, true, false);

    //         // particleSystem.isAnimationSheetEnabled = true;
    //         // particleSystem.spriteCellHeight = 512;
    //         // particleSystem.spriteCellWidth = 256;
    //         // particleSystem.startSpriteCellID = 0;
    //         // particleSystem.endSpriteCellID = 64;
    //         // particleSystem.spriteCellChangeSpeed = 5;
    //     }

        

    //     // Start the particle system
    //     particleSystem.start()

    //     /*
    //     // Fountain's animation
    //     var keys = [];
    //     var animation = new Animation("animation", "rotation.x", 30, Animation.ANIMATIONTYPE_FLOAT,
    //                                                                 Animation.ANIMATIONLOOPMODE_CYCLE);
    //     // At the animation key 0, the value of scaling is "1"
    //     keys.push({
    //         frame: 0,
    //         value: 0
    //     });

    //     // At the animation key 50, the value of scaling is "0.2"
    //     keys.push({
    //         frame: 50,
    //         value: Math.PI
    //     });

    //     // At the animation key 100, the value of scaling is "1"
    //     keys.push({
    //         frame: 100,
    //         value: 0
    //     });

    //     // Launch animation
    //     animation.setKeys(keys);
    //     fountain.animations.push(animation);
    //     //scene.beginAnimation(fountain, 0, 100, true);
    //     */

    //     // new BABYLON.ISceneLoaderAsyncResult();
    //     // return ;


    //     const retV = {
    //         meshes: new Array<BABYLON.AbstractMesh>,
    //         particleSystems: new Array<BABYLON.IParticleSystem>,
    //         skeletons: new Array<BABYLON.Skeleton>,
    //         animationGroups: new Array<BABYLON.AnimationGroup>,
    //         transformNodes: new Array<BABYLON.TransformNode>,
    //         geometries: new Array<BABYLON.Geometry>,
    //         lights: new Array<BABYLON.Light>
    //     }

    //     if (null !== emitMesh) {
    //         retV.meshes.push(emitMesh)
    //     }

    //     retV.particleSystems.push(particleSystem)

    //     return retV
    // }
}