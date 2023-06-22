import * as BABYLON from "@babylonjs/core"
import { BoxParticleEmitter, Color3, Color4, ConeParticleEmitter, CylinderDirectedParticleEmitter, CylinderParticleEmitter, Effect, EngineStore, GPUParticleSystem, GetClass, HemisphericParticleEmitter, IParticleEmitterType, IParticleSystem, MeshParticleEmitter, Nullable, ParticleSystem, ParticleSystemSet, PointParticleEmitter, Scene, SphereDirectedParticleEmitter, SphereParticleEmitter, SubEmitter, Texture, ThinEngine, Vector3 } from "@babylonjs/core";
import { IAssetPackageFileLoader, eAssetType } from "../../definitions";

export class ParticleParser_Internal
{
    private static _scene: Nullable<BABYLON.Scene> = null
    private static _packageFileLoader: Nullable<IAssetPackageFileLoader> = null
    private static _assetInfo: { assetType: eAssetType; assetId: string }

    public static async Parse(scene:Scene, packageFileLoader: IAssetPackageFileLoader, assetInfo: { assetType: eAssetType; assetId: string }, particleJson: Nullable<string>, baseTextureUrl: string, gpu: boolean = false, capacity: number = 0): Promise<Nullable<BABYLON.ISceneLoaderAsyncResult>>
    {
        this._scene = scene as Scene;
        this._packageFileLoader = packageFileLoader;
        this._assetInfo = assetInfo;

        if (!particleJson)
        {
            console.error("Particle json is Invliad.");
            return null;
        }

        if (gpu && !BABYLON.GPUParticleSystem.IsSupported) {
            console.error("Particle system with GPU is not supported.");
            return null;
        }

        //console.log("ParticleParser_Internal::Parse() : " + particleJson);
        const newData = JSON.parse(particleJson);

        //console.log("ParticleParser_Internal::Parse() systems : " + JSON.stringify(newData.main.systems));

        let particleSet = await this._Parse(baseTextureUrl, newData, scene, gpu, capacity);

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
        //console.log("ddddddd: " + particleSet.systems[0]);
        
        if (particleSet.emitterNode) {
            if (particleSet.emitterNode instanceof BABYLON.AbstractMesh)
                retV.meshes.push(particleSet.emitterNode);
        }

        //console.log("asdfasdf p: " + retV.particleSystems.getClassName());
        JSON.stringify(retV.particleSystems[0]);
        
        //console.log("ParticleParser_Internal::Parse() created particle count : " + particleSet.systems.length);
        particleSet.systems.forEach(p => {
            p.start();
            retV.particleSystems.push(p);
        });

        //console.log("asdfasdf retV: " + JSON.stringify(retV.particleSystems[0]));
        return retV;
    }

    private static async _Parse(baseTextureUrl: string, data: any, scene: Scene, gpu = false, capacity?: number): Promise<ParticleSystemSet> {
        const result = new ParticleSystemSet();

        scene = scene || EngineStore.LastCreatedScene;

        for (const system of data.main.systems) {
            //console.log("_Parse() system : " + JSON.stringify(system));
            result.systems.push(gpu ? await this._Parse_GPUParticleSystem(system, scene, baseTextureUrl, true, capacity) : await this._Parse_ParticleSystem(system, scene, baseTextureUrl, true, capacity));
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

    private static _Parse_GPUParticleSystem(parsedParticleSystem: any, sceneOrEngine: Scene | ThinEngine, rootUrl: string, doNotStart = false, capacity?: number): GPUParticleSystem {
        const name = parsedParticleSystem.name;
        let engine: ThinEngine;
        let scene: Nullable<Scene>;

        if (sceneOrEngine instanceof ThinEngine) {
            engine = sceneOrEngine;
        } else {
            scene = sceneOrEngine as Scene;
            engine = scene.getEngine();
        }

        const particleSystem = new GPUParticleSystem(
            name,
            { capacity: capacity || parsedParticleSystem.capacity, randomTextureSize: parsedParticleSystem.randomTextureSize },
            sceneOrEngine,
            null,
            parsedParticleSystem.isAnimationSheetEnabled
        );
        //particleSystem._rootUrl = rootUrl;

        if (parsedParticleSystem.customShader && (engine as any).createEffectForParticles) {
            const program = parsedParticleSystem.customShader;
            const defines: string = program.shaderOptions.defines.length > 0 ? program.shaderOptions.defines.join("\n") : "";
            const custom: Nullable<Effect> = (engine as any).createEffectForParticles(
                program.shaderPath.fragmentElement,
                program.shaderOptions.uniforms,
                program.shaderOptions.samplers,
                defines,
                undefined,
                undefined,
                undefined,
                particleSystem
            );
            particleSystem.setCustomEffect(custom, 0);
            particleSystem.customShader = program;
        }

        if (parsedParticleSystem.id) {
            particleSystem.id = parsedParticleSystem.id;
        }

        if (parsedParticleSystem.activeParticleCount) {
            particleSystem.activeParticleCount = parsedParticleSystem.activeParticleCount;
        }

        this._ParseParticleSystemImpl(parsedParticleSystem, particleSystem, rootUrl);

        // Auto start
        if (parsedParticleSystem.preventAutoStart) {
            particleSystem.preventAutoStart = parsedParticleSystem.preventAutoStart;
        }

        if (!doNotStart && !particleSystem.preventAutoStart) {
            particleSystem.start();
        }

        return particleSystem;
    }

    private static async _Parse_ParticleSystem(parsedParticleSystem: any, sceneOrEngine: Scene | ThinEngine, rootUrl: string, doNotStart = false, capacity?: number): Promise<ParticleSystem>
    {
        const name = parsedParticleSystem.name;
        let custom: Nullable<Effect> = null;
        let program: any = null;
        let engine: ThinEngine;
        let scene: Nullable<Scene>;

        if (sceneOrEngine instanceof ThinEngine) {
            engine = sceneOrEngine;
        } else {
            scene = sceneOrEngine as Scene;
            engine = scene.getEngine();
        }

        //console.log("[fffffffff] 1 : " + JSON.stringify(parsedParticleSystem));
        

        if (parsedParticleSystem.customShader && (engine as any).createEffectForParticles) {
            program = parsedParticleSystem.customShader;
            const defines: string = program.shaderOptions.defines.length > 0 ? program.shaderOptions.defines.join("\n") : "";
            custom = (engine as any).createEffectForParticles(program.shaderPath.fragmentElement, program.shaderOptions.uniforms, program.shaderOptions.samplers, defines);
        }
        const particleSystem = new ParticleSystem(name, capacity || parsedParticleSystem.capacity, sceneOrEngine, custom, parsedParticleSystem.isAnimationSheetEnabled);
        
        //console.log("[fffffffff] 2 : " + JSON.stringify(particleSystem.getClassName()));

        particleSystem.customShader = program;
        //particleSystem._rootUrl = rootUrl;

        if (parsedParticleSystem.id) {
            particleSystem.id = parsedParticleSystem.id;
        }

        // SubEmitters
        if (parsedParticleSystem.subEmitters) {
            particleSystem.subEmitters = [];
            const cellArray = [];
            for (const cell of parsedParticleSystem.subEmitters) {
                cell.capacity = 5;
                cellArray.push(SubEmitter.Parse(cell, sceneOrEngine, rootUrl));
            }

            particleSystem.subEmitters.push(cellArray);
        }

        await this._ParseParticleSystemImpl(parsedParticleSystem, particleSystem, rootUrl);

        if (parsedParticleSystem.textureMask) {
            particleSystem.textureMask = Color4.FromArray(parsedParticleSystem.textureMask);
        }

        // Auto start
        if (parsedParticleSystem.preventAutoStart) {
            particleSystem.preventAutoStart = parsedParticleSystem.preventAutoStart;
        }

        if (!doNotStart && !particleSystem.preventAutoStart) {
            particleSystem.start();
        }

        return particleSystem;
    }

    public static async _ParseParticleSystemImpl(parsedParticleSystem: any, particleSystem: IParticleSystem, rootUrl: string)
    {
        if (parsedParticleSystem.textureName)
        {
            let blobUrl = await this._packageFileLoader!.loadFile(this._assetInfo.assetType, this._assetInfo.assetId, parsedParticleSystem.textureName);

            let isMipmap = parsedParticleSystem.isAnimationSheetEnabled;
            let invertY = parsedParticleSystem.invertY !== undefined ? parsedParticleSystem.invertY : false;
            particleSystem.particleTexture = new Texture(blobUrl, this._scene, isMipmap, invertY);

            particleSystem.particleTexture!.name = parsedParticleSystem.textureName;

            parsedParticleSystem.texture = null;
            parsedParticleSystem.textureName = null;
        }

        // Emitter
        if (!parsedParticleSystem.emitterId && parsedParticleSystem.emitterId !== 0 && parsedParticleSystem.emitter === undefined)
        {
            particleSystem.emitter = Vector3.Zero();
        }
        else if (parsedParticleSystem.emitterId && this._scene)
        {
            particleSystem.emitter = this._scene.getLastMeshById(parsedParticleSystem.emitterId);
        }
        else
        {
            //particleSystem.emitter = Vector3.FromArray(parsedParticleSystem.emitter);
            particleSystem.emitter = this._parseVector3(parsedParticleSystem.emitter);
        }

        particleSystem.isLocal = !!parsedParticleSystem.isLocal;

        // Misc.
        if (parsedParticleSystem.renderingGroupId !== undefined) {
            particleSystem.renderingGroupId = parsedParticleSystem.renderingGroupId;
        }

        if (parsedParticleSystem.isBillboardBased !== undefined) {
            particleSystem.isBillboardBased = parsedParticleSystem.isBillboardBased;
        }

        if (parsedParticleSystem.billboardMode !== undefined) {
            particleSystem.billboardMode = parsedParticleSystem.billboardMode;
        }

        if (parsedParticleSystem.useLogarithmicDepth !== undefined) {
            particleSystem.useLogarithmicDepth = parsedParticleSystem.useLogarithmicDepth;
        }

        if (parsedParticleSystem.animations) {
            for (let animationIndex = 0; animationIndex < parsedParticleSystem.animations.length; animationIndex++) {
                const parsedAnimation = parsedParticleSystem.animations[animationIndex];
                const internalClass = GetClass("BABYLON.Animation");
                if (internalClass) {
                    particleSystem.animations.push(internalClass.Parse(parsedAnimation));
                }
            }
            particleSystem.beginAnimationOnStart = parsedParticleSystem.beginAnimationOnStart;
            particleSystem.beginAnimationFrom = parsedParticleSystem.beginAnimationFrom;
            particleSystem.beginAnimationTo = parsedParticleSystem.beginAnimationTo;
            particleSystem.beginAnimationLoop = parsedParticleSystem.beginAnimationLoop;
        }

        if (parsedParticleSystem.autoAnimate && this._scene) {
            this._scene.beginAnimation(
                particleSystem,
                parsedParticleSystem.autoAnimateFrom,
                parsedParticleSystem.autoAnimateTo,
                parsedParticleSystem.autoAnimateLoop,
                parsedParticleSystem.autoAnimateSpeed || 1.0
            );
        }

        // Particle system
        particleSystem.startDelay = parsedParticleSystem.startDelay | 0;
        particleSystem.minAngularSpeed = parsedParticleSystem.minAngularSpeed;
        particleSystem.maxAngularSpeed = parsedParticleSystem.maxAngularSpeed;
        particleSystem.minSize = parsedParticleSystem.minSize;
        particleSystem.maxSize = parsedParticleSystem.maxSize;

        if (parsedParticleSystem.minScaleX) {
            particleSystem.minScaleX = parsedParticleSystem.minScaleX;
            particleSystem.maxScaleX = parsedParticleSystem.maxScaleX;
            particleSystem.minScaleY = parsedParticleSystem.minScaleY;
            particleSystem.maxScaleY = parsedParticleSystem.maxScaleY;
        }

        if (parsedParticleSystem.preWarmCycles !== undefined) {
            particleSystem.preWarmCycles = parsedParticleSystem.preWarmCycles;
            particleSystem.preWarmStepOffset = parsedParticleSystem.preWarmStepOffset;
        }

        if (parsedParticleSystem.minInitialRotation !== undefined) {
            particleSystem.minInitialRotation = parsedParticleSystem.minInitialRotation;
            particleSystem.maxInitialRotation = parsedParticleSystem.maxInitialRotation;
        }

        particleSystem.minLifeTime = parsedParticleSystem.minLifeTime;
        particleSystem.maxLifeTime = parsedParticleSystem.maxLifeTime;
        particleSystem.minEmitPower = parsedParticleSystem.minEmitPower;
        particleSystem.maxEmitPower = parsedParticleSystem.maxEmitPower;
        particleSystem.emitRate = parsedParticleSystem.emitRate;
        
        //particleSystem.gravity = Vector3.FromArray(parsedParticleSystem.gravity);
        particleSystem.gravity = this._parseVector3(parsedParticleSystem.gravity);
        if (parsedParticleSystem.noiseStrength !== Vector3.Zero)
        {
            //particleSystem.noiseStrength = Vector3.FromArray(parsedParticleSystem.noiseStrength);
            particleSystem.noiseStrength = this._parseVector3(parsedParticleSystem.noiseStrength);
        }
        // particleSystem.color1 = Color4.FromArray(parsedParticleSystem.color1);
        // particleSystem.color2 = Color4.FromArray(parsedParticleSystem.color2);
        // particleSystem.colorDead = Color4.FromArray(parsedParticleSystem.colorDead);
        particleSystem.color1 = this._parseColor4(parsedParticleSystem.color1);
        particleSystem.color2 = this._parseColor4(parsedParticleSystem.color2);
        particleSystem.colorDead = this._parseColor4(parsedParticleSystem.colorDead);
        particleSystem.updateSpeed = parsedParticleSystem.updateSpeed;
        particleSystem.targetStopDuration = parsedParticleSystem.targetStopDuration;
        particleSystem.blendMode = parsedParticleSystem.blendMode;

        if (parsedParticleSystem.colorGradients) {
            for (const colorGradient of parsedParticleSystem.colorGradients)
            {
                let c1 = this._parseColor4(colorGradient.color1);
                let c2 = this._parseColor4(colorGradient.color2);
                particleSystem.addColorGradient(
                    colorGradient.gradient,
                    //Color4.FromArray(colorGradient.color1),
                    //colorGradient.color2 ? colorGradient.color2 : undefined
                    c1,
                    c2
                );
            }
        }

        if (parsedParticleSystem.rampGradients) {
            for (const rampGradient of parsedParticleSystem.rampGradients)
            {
                //particleSystem.addRampGradient(rampGradient.gradient, Color3.FromArray(rampGradient.color));
                particleSystem.addRampGradient(rampGradient.gradient, rampGradient.color);
            }
            particleSystem.useRampGradients = parsedParticleSystem.useRampGradients;
        }

        if (parsedParticleSystem.colorRemapGradients) {
            for (const colorRemapGradient of parsedParticleSystem.colorRemapGradients) {
                particleSystem.addColorRemapGradient(
                    colorRemapGradient.gradient,
                    colorRemapGradient.factor1 !== undefined ? colorRemapGradient.factor1 : colorRemapGradient.factor,
                    colorRemapGradient.factor2
                );
            }
        }

        if (parsedParticleSystem.alphaRemapGradients) {
            for (const alphaRemapGradient of parsedParticleSystem.alphaRemapGradients) {
                particleSystem.addAlphaRemapGradient(
                    alphaRemapGradient.gradient,
                    alphaRemapGradient.factor1 !== undefined ? alphaRemapGradient.factor1 : alphaRemapGradient.factor,
                    alphaRemapGradient.factor2
                );
            }
        }

        if (parsedParticleSystem.sizeGradients) {
            for (const sizeGradient of parsedParticleSystem.sizeGradients) {
                particleSystem.addSizeGradient(sizeGradient.gradient, sizeGradient.factor1 !== undefined ? sizeGradient.factor1 : sizeGradient.factor, sizeGradient.factor2);
            }
        }

        if (parsedParticleSystem.angularSpeedGradients) {
            for (const angularSpeedGradient of parsedParticleSystem.angularSpeedGradients) {
                particleSystem.addAngularSpeedGradient(
                    angularSpeedGradient.gradient,
                    angularSpeedGradient.factor1 !== undefined ? angularSpeedGradient.factor1 : angularSpeedGradient.factor,
                    angularSpeedGradient.factor2
                );
            }
        }

        if (parsedParticleSystem.velocityGradients) {
            for (const velocityGradient of parsedParticleSystem.velocityGradients) {
                particleSystem.addVelocityGradient(
                    velocityGradient.gradient,
                    velocityGradient.factor1 !== undefined ? velocityGradient.factor1 : velocityGradient.factor,
                    velocityGradient.factor2
                );
            }
        }

        if (parsedParticleSystem.dragGradients) {
            for (const dragGradient of parsedParticleSystem.dragGradients) {
                particleSystem.addDragGradient(dragGradient.gradient, dragGradient.factor1 !== undefined ? dragGradient.factor1 : dragGradient.factor, dragGradient.factor2);
            }
        }

        if (parsedParticleSystem.emitRateGradients) {
            for (const emitRateGradient of parsedParticleSystem.emitRateGradients) {
                particleSystem.addEmitRateGradient(
                    emitRateGradient.gradient,
                    emitRateGradient.factor1 !== undefined ? emitRateGradient.factor1 : emitRateGradient.factor,
                    emitRateGradient.factor2
                );
            }
        }

        if (parsedParticleSystem.startSizeGradients) {
            for (const startSizeGradient of parsedParticleSystem.startSizeGradients) {
                particleSystem.addStartSizeGradient(
                    startSizeGradient.gradient,
                    startSizeGradient.factor1 !== undefined ? startSizeGradient.factor1 : startSizeGradient.factor,
                    startSizeGradient.factor2
                );
            }
        }

        if (parsedParticleSystem.lifeTimeGradients) {
            for (const lifeTimeGradient of parsedParticleSystem.lifeTimeGradients) {
                particleSystem.addLifeTimeGradient(
                    lifeTimeGradient.gradient,
                    lifeTimeGradient.factor1 !== undefined ? lifeTimeGradient.factor1 : lifeTimeGradient.factor,
                    lifeTimeGradient.factor2
                );
            }
        }

        if (parsedParticleSystem.limitVelocityGradients) {
            for (const limitVelocityGradient of parsedParticleSystem.limitVelocityGradients) {
                particleSystem.addLimitVelocityGradient(
                    limitVelocityGradient.gradient,
                    limitVelocityGradient.factor1 !== undefined ? limitVelocityGradient.factor1 : limitVelocityGradient.factor,
                    limitVelocityGradient.factor2
                );
            }
            particleSystem.limitVelocityDamping = parsedParticleSystem.limitVelocityDamping;
        }

        if (parsedParticleSystem.noiseTexture && this._scene) {
            const internalClass = GetClass("BABYLON.ProceduralTexture");
            particleSystem.noiseTexture = internalClass.Parse(parsedParticleSystem.noiseTexture, this._scene, rootUrl);
        }

        // Emitter
        let emitterType: IParticleEmitterType;
        if (parsedParticleSystem.particleEmitterType)
        {
            switch (parsedParticleSystem.particleEmitterType.type)
            {
                case "SphereParticleEmitter":
                    emitterType = this._CreateEmitter_Sphere(parsedParticleSystem);
                    break;
                case "SphereDirectedParticleEmitter":
                    emitterType = this._CreateEmitter_SphereDirected(parsedParticleSystem);
                    break;
                case "ConeEmitter":
                case "ConeParticleEmitter":
                    emitterType = this._CreateEmitter_Cone(parsedParticleSystem);
                    break;
                case "CylinderParticleEmitter":
                    emitterType = this._CreateEmitter_Cylinder(parsedParticleSystem);
                    break;
                case "CylinderDirectedParticleEmitter":
                    emitterType = this._CreateEmitter_CylinderDirected(parsedParticleSystem);
                    break;
                case "HemisphericParticleEmitter":
                    emitterType = this._CreateEmitter_Hemispheric(parsedParticleSystem);
                    break;
                case "PointParticleEmitter":
                    emitterType = this._CreateEmitter_Point(parsedParticleSystem);
                    break;
                case "MeshParticleEmitter":
                    emitterType = this._CreateEmitter_Mesh(parsedParticleSystem);
                    break;
                case "BoxEmitter":
                case "BoxParticleEmitter":
                default:
                    emitterType = this._CreateEmitter_Box(parsedParticleSystem);
                    break;
            }

            //emitterType.parse(parsedParticleSystem.particleEmitterType, this._scene);
        }
        else
        {
            emitterType = this._CreateEmitter_Box(parsedParticleSystem);
        }
        particleSystem.particleEmitterType = emitterType;

        // Animation sheet
        particleSystem.isAnimationSheetEnabled = parsedParticleSystem.isAnimationSheetEnabled ?? false;
        particleSystem.startSpriteCellID = parsedParticleSystem.startSpriteCellID;
        particleSystem.endSpriteCellID = parsedParticleSystem.endSpriteCellID;
        particleSystem.spriteCellLoop = parsedParticleSystem.spriteCellLoop ?? true;
        particleSystem.spriteCellWidth = parsedParticleSystem.spriteCellWidth;
        particleSystem.spriteCellHeight = parsedParticleSystem.spriteCellHeight;
        particleSystem.spriteCellChangeSpeed = parsedParticleSystem.spriteCellChangeSpeed;
        particleSystem.spriteRandomStartCell = parsedParticleSystem.spriteRandomStartCell;

        particleSystem.disposeOnStop = parsedParticleSystem.disposeOnStop ?? false;
        particleSystem.manualEmitCount = parsedParticleSystem.manualEmitCount ?? -1;

        particleSystem.start();
    }

    private static _parseVector3(v:any): Vector3 {
        const t = v as Vector3;
        return new Vector3(t.x, t.y, t.z);
    }

    private static _parseColor4(c:any): Color4 {
        const t = c as Color4;
        return new Color4(t.r, t.g, t.b, t.a);
    }

    private static _CreateEmitter_Sphere(data: any): IParticleEmitterType
    {
        let emitter = new SphereParticleEmitter();
        emitter.radius              = data.radius;
        emitter.radiusRange         = data.radiusRange;
        emitter.directionRandomizer = data.directionRandomizer;

        return emitter;
    }

    private static _CreateEmitter_SphereDirected(data: any): IParticleEmitterType
    {
        let emitter = new SphereDirectedParticleEmitter();

        emitter.radius              = data.radius;
        emitter.radiusRange         = data.radiusRange;
        emitter.directionRandomizer = data.directionRandomizer;

        emitter.direction1 = this._parseVector3(data.particleEmitterType.direction1);
        emitter.direction2 = this._parseVector3(data.particleEmitterType.direction2);

        return emitter;
    }

    private static _CreateEmitter_Cone(data: any): IParticleEmitterType
    {
        let emitter = new ConeParticleEmitter();
        emitter.radius                  = data.particleEmitterType.radius;
        emitter.angle                   = data.particleEmitterType.angle;
        emitter.directionRandomizer     = data.particleEmitterType.directionRandomizer;

        emitter.radiusRange             = data.particleEmitterType.radiusRange;
        emitter.heightRange             = data.particleEmitterType.heightRange;
        emitter.emitFromSpawnPointOnly  = data.particleEmitterType.emitFromSpawnPointOnly;

        return emitter;
    }

    private static _CreateEmitter_Cylinder(data: any): IParticleEmitterType
    {
        let emitter = new CylinderParticleEmitter();
        emitter.radius              = data.particleEmitterType.radius;
        emitter.height              = data.particleEmitterType.height;
        emitter.radiusRange         = data.particleEmitterType.radiusRange;
        emitter.directionRandomizer = data.particleEmitterType.directionRandomizer;

        return emitter;
    }

    private static _CreateEmitter_CylinderDirected(data: any): IParticleEmitterType
    {
        let emitter = new CylinderDirectedParticleEmitter();
        emitter.radius              = data.particleEmitterType.radius;
        emitter.height              = data.particleEmitterType.height;
        emitter.radiusRange         = data.particleEmitterType.radiusRange;
        emitter.directionRandomizer = data.particleEmitterType.directionRandomizer;

        emitter.direction1 = this._parseVector3(data.particleEmitterType.direction1);
        emitter.direction2 = this._parseVector3(data.particleEmitterType.direction2);

        return emitter;
    }

    private static _CreateEmitter_Hemispheric(data: any): IParticleEmitterType
    {
        let emitter = new HemisphericParticleEmitter();
        emitter.radius              = data.particleEmitterType.radius;
        emitter.radiusRange         = data.particleEmitterType.radiusRange;
        emitter.directionRandomizer = data.particleEmitterType.directionRandomizer;

        return emitter;
    }

    private static _CreateEmitter_Point(data: any): IParticleEmitterType
    {
        let emitter = new PointParticleEmitter();
        emitter.direction1 = this._parseVector3(data.particleEmitterType.direction1);
        emitter.direction2 = this._parseVector3(data.particleEmitterType.direction2);

        return emitter;
    }

    private static _CreateEmitter_Mesh(data: any): IParticleEmitterType
    {
        let emitter = new MeshParticleEmitter();
        emitter.direction1 = this._parseVector3(data.particleEmitterType.direction1);
        emitter.direction2 = this._parseVector3(data.particleEmitterType.direction2);

        if (data.particleEmitterType.meshId)
        {
            emitter.mesh = this._scene!.getLastMeshById(data.particleEmitterType.meshId);
        }

        emitter.useMeshNormalsForDirection = data.particleEmitterType.useMeshNormalsForDirection;

        return emitter;
    }

    private static _CreateEmitter_Box(data: any): IParticleEmitterType
    {
        let emitter = new BoxParticleEmitter();
        emitter.direction1 = this._parseVector3(data.particleEmitterType.direction1);
        emitter.direction2 = this._parseVector3(data.particleEmitterType.direction2);
        emitter.minEmitBox = this._parseVector3(data.particleEmitterType.minEmitBox);
        emitter.maxEmitBox = this._parseVector3(data.particleEmitterType.maxEmitBox);

        return emitter;
    }
}