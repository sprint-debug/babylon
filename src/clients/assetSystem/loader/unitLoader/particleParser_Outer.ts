import * as BABYLON from "@babylonjs/core"
import { Color3, EngineStore, GPUParticleSystem, Nullable, ParticleSystem, ParticleSystemSet, Scene } from "@babylonjs/core";

export class ParticleParser_Outer
{
    public static async Parse(scene: Scene, baseAssetUrl: string, assetName: string, gpu: boolean = false, capacity: number = 0): Promise<Nullable<BABYLON.ISceneLoaderAsyncResult>>
    {
        const json = await this._DownloadJson_FromBabylonParticle(scene, baseAssetUrl, assetName);
        //console.log("sssss : "+ json);
        if (json)
        {
            const baseTextureUrl = baseAssetUrl + "/textures/";
            return this._CreateParticle_ByJson(scene, json, baseTextureUrl, gpu, capacity);
        }

        return null;
    }

    private static async _DownloadJson_FromBabylonParticle(scene: Scene, baseAssetUrl: string, assetName: string): Promise<string>
    {
        const token = {};
        scene.addPendingData(token);

        return new Promise((resolve, reject) => {
            return BABYLON.Tools.LoadFile(
                `${baseAssetUrl}/systems/${assetName}.json`,
                (data) => {
                    scene.removePendingData(token);
                    return resolve(data.toString());
                },
                undefined,
                undefined,
                undefined,
                () => {
                    scene.removePendingData(token);
                    return reject(`An error occurred with the creation of your particle system. Check if your assetName '${assetName}' exists.`);
                }
            );
        });
    }

    private static async _CreateParticle_ByJson(scene: Scene, particleJson: Nullable<string>, baseTextureUrl: string, gpu: boolean = false, capacity: number = 0): Promise<Nullable<BABYLON.ISceneLoaderAsyncResult>>
    {
        if (!particleJson)
        {
            console.error("Particle json is Invliad.");
            return null;
        }

        if (gpu && !BABYLON.GPUParticleSystem.IsSupported) {
            console.error("Particle system with GPU is not supported.");
            return null;
        }

        const newData = JSON.parse(particleJson);
        console.log("aaa : " + particleJson);
        let particleSet = await this._Parse(scene, baseTextureUrl, newData, gpu, capacity);

        const retV = {
            meshes: new Array<BABYLON.AbstractMesh>,
            particleSystems: new Array<BABYLON.IParticleSystem>,
            skeletons: new Array<BABYLON.Skeleton>,
            animationGroups: new Array<BABYLON.AnimationGroup>,
            transformNodes: new Array<BABYLON.TransformNode>,
            geometries: new Array<BABYLON.Geometry>,
            lights: new Array<BABYLON.Light>
        }

        //console.log(JSON.stringify(particleSet.systems));
        console.log(particleSet);
        
        if (particleSet.emitterNode) {
            if (particleSet.emitterNode instanceof BABYLON.AbstractMesh)
                retV.meshes.push(particleSet.emitterNode);
        }

        particleSet.systems.forEach(p => {
            retV.particleSystems.push(p);
            p.start();
        });

        console.log("asdfasdf retV: " + retV);
        return retV;
    }

    private static async _Parse(scene: Scene, baseTextureUrl: string, data: any, gpu = false, capacity?: number): Promise<ParticleSystemSet> {
        const result = new ParticleSystemSet();

        scene = scene || EngineStore.LastCreatedScene;

        for (const system of data.systems) {
            result.systems.push(gpu ? GPUParticleSystem.Parse(system, scene, baseTextureUrl, true, capacity) : ParticleSystem.Parse(system, scene, baseTextureUrl, true, capacity));
        }

        if (data.emitter) {
            const options = data.emitter.options;
            switch (data.emitter.kind) {
                case "Sphere":
                    result.setEmitterAsSphere(
                        {
                            diameter: options.diameter,
                            segments: options.segments,
                            color: Color3.FromArray(options.color),
                        },
                        data.emitter.renderingGroupId,
                        scene
                    );
                    break;
            }
        }

        return result;
    }
}
