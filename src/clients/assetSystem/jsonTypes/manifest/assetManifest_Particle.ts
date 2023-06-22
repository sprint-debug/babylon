import { IAssetManifest } from "./assetManifest"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import { Color4 } from "@babylonjs/core/Maths/math.color"

/**
 * Item Manifest.json
 * (https://docs.google.com/spreadsheets/d/1yqfSkIAjAIfqYmP8UW-Jx0_Ho-tsnAmr6tmKXOVkaiI/edit#gid=836007209)
 */

export interface IAssetManifest_Particle extends IAssetManifest {
    format: number
    main:
    {
        type: string,
        systems: ParticleInfo[]
    }
}

export interface ParticleInfo
{
    name: string,
    id: string,

    capacity: number,
    emitterId: string,
    emitter: Vector3,
    worldOffset: Vector3,

    particleEmitterType: ParticleEmitterType,

    textureName: string,
    invertY: boolean,
    animations: string[], // 어떤 자료형인지 원형을 모르겠음
    startDelay: number,

    renderingGroupId: number,
    isBillboardBased: boolean,
    billboardMode: number,
    minAngularSpeed: number,
    maxAngularSpeed: number,
    minSize: number,
    maxSize: number,
    minScaleX: number,
    maxScaleX: number,
    minScaleY: number,
    maxScaleY: number,
    minEmitPower: number,
    maxEmitPower: number,
    minLifeTime: number,
    maxLifeTime: number,
    emitRate: number,
    gravity: Vector3,
    noiseStrength: Vector3,
    color1: Color4,
    color2: Color4,
    colorDead: Color4,
    updateSpeed: number,

    targetStopDuration: number,
    blendMode: number,
    preWarmCycles: number,
    preWarmStepOffset: number,
    minInitialRotation: number,
    maxInitialRotation: number,

    isAnimationSheetEnabled: boolean,
    spriteRandomStartCell: boolean,
    spriteCellWidth: number,
    spriteCellHeight: number,
    startSpriteCellID: number,
    endSpriteCellID: number,
    spriteCellChangeSpeed: number,
    
    colorGradients: ParticleGradient,
    rampGradients: ParticleGradient,
    useRampGradients: boolean,
    colorRampGradients: ParticleGradient,
    
    textureMask: Color4,
    customShader: string,
    preventAutoStart: boolean,

    subEmitters: any,
}

export interface SubEmitterInfo
{
    type: number,
    inheritDirection: boolean,
    inheritedVelocityAmount: number,

    particleSystem: ParticleInfo
}

export interface ParticleEmitterType
{
    type: string,

    radius: number,
    angle: number,
    directionRandomizer: number,

    radiusRange: number,
    heightRange: number,
    emitFromSpawnPointOnly: boolean,

    direction1: Vector3,
    direction2: Vector3,
    minEmitBox: Vector3,
    maxEmitBox: Vector3,

    meshId: string,
    useMeshNormalsForDirection: boolean
}

export interface ParticleGradient
{
    gradient: number,
    color1: Color4
}