import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import testRoom from './scenes/testRoom'
import setupEnv from './scenes/setupEnv'


export const sceneList = [
    {
        name: "testRoom",
        component: testRoom,
    },
    {
        name: "setupEnv",
        component: setupEnv,
    }
]

export interface CreateSceneClass {
    createScene: (engine: Engine, canvas: HTMLCanvasElement) => Promise<Scene>
    preTasks?: Promise<unknown>[]
}

export interface CreateSceneModule {
    default: CreateSceneClass
}

export const getSceneModuleWithName = (
    name = 'testRoom'
): CreateSceneClass => {

    const scene = sceneList.find(scene => scene.name === name)

    return scene ? scene.component : testRoom

    // return require(/* @vite-ignore */'./scenes/' + name).then((module: CreateSceneModule) => {
    //     return module.default
    // })

    // To build quicker, replace the above return statement with:

    // return import('./scenes/defaultWithTexture').then((module: CreateSceneModule)=> {
    //     return module.default;
    // });
};

