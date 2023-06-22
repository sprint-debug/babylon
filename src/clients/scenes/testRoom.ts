import * as BABYLON from "@babylonjs/core"
import { Engine } from "@babylonjs/core/Engines/engine"
import { Scene } from "@babylonjs/core/scene"
import { CreateSceneClass } from "../createScene"

// required imports
import "@babylonjs/core/Loading/loadingScreen"
import "@babylonjs/loaders/glTF"
import "@babylonjs/core/Materials/standardMaterial"
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader"

//import roomEnvironment from "../../src/assets/environment/room.env"

import { AssetLoader } from "../assetSystem/loader/assetLoader"
import { eAssetType } from "../assetSystem/definitions"
//import { TestParticle } from "../testParticle/testParticle"

import testroomEnvironment from "../../assets/environment/environmentSpecular.env"


export class TestRoom implements CreateSceneClass {
    createScene = async (
        engine: Engine//,
        //canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine)

        // debug 용
        void Promise.all([
            import("@babylonjs/core/Debug/debugLayer"),
            import("@babylonjs/inspector"),
        ]).then((_values) => {
            scene.debugLayer.show({
                handleResize: true,
                overlay: true,
                globalRoot: document.getElementById("#root") || undefined,
            })
        })



        //Test Code : -------------------------------------------------------------------
        const assetLoader = new AssetLoader(scene)
        //await assetLoader.clearCache() //테스트 도중 귀찮아서 우선 항상 제거한다.

        /*
        //await assetLoader.loadAssetIntoScene(eAssetType.Cubemap, "W4s0PCx0V6LyQMkWrZWuu") //Cubemap => scene.env 바로 적용
        const result = await assetLoader.loadAssetIntoScene(eAssetType.Model_glb, "1Sa5ZfVB9CCu1KGWpdScHQ") //boombox => 스케일 100으로 너무 작음
        //const result = await assetLoader.loadAssetIntoScene(eAssetType.Model_glb, "129jrz2GCi7tVHJuRZAmTw") //HCR2 Formula


        //console.log(result)

        result.loadedObjects.meshes[0].scaling.scaleInPlace(100)
        result.loadedObjects.meshes[0].position.set(0, 0, 0)
        */

        //Item 테스트 : -------------------------------------------------------------------
        //await assetLoader.loadAssetIntoScene(eAssetType.Item, "1szXFgtTCUJTbsvV7NNlg")
        await assetLoader.loadAssetIntoScene(eAssetType.Item, "2BrRqIC796CDiiba0pl236")
        //await assetLoader.loadAssetIntoScene(eAssetType.Item, "1a7bMBbZ2ALsy457iomvJY")
        //await assetLoader.loadAssetIntoScene(eAssetType.Model_glb, "1tRvQ01OlmgElGbhQmX68")
        //await assetLoader.loadAssetIntoScene(eAssetType.Particle, "testparticle998");


        //환경설정 : ----------------------------------------------------------------------
        const camera = new BABYLON.ArcRotateCamera("camera", 1.567, 1.315, 11.0, new BABYLON.Vector3(0, 2.8, 0), scene)
        camera.wheelPrecision = 12
        camera.lowerRadiusLimit = 2.0
        camera.upperRadiusLimit = 23.0
        camera.useBouncingBehavior = true
        camera.attachControl()

        const hemiLight = new BABYLON.HemisphericLight("hemi sphere light", new BABYLON.Vector3(0.65, 0.66, 0.37), scene)
        hemiLight.intensity = 0.5

        const directionalLight = new BABYLON.DirectionalLight("directional light", new BABYLON.Vector3(-1.00, -1.00, -0.5), scene)
        directionalLight.intensity = 2.0

        const cubeTexture = new BABYLON.CubeTexture(testroomEnvironment, scene)
        scene.createDefaultSkybox(cubeTexture, true, 1000, 0.3, true)

        // PostProcess 설정 : -------------------------------------------------------------
        var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera])
        defaultPipeline.bloomEnabled = true
        defaultPipeline.bloomWeight = 0.3
        defaultPipeline.glowLayerEnabled = false
        defaultPipeline.imageProcessing.colorCurvesEnabled = true
        defaultPipeline.imageProcessing.contrast = 1.3
        defaultPipeline.imageProcessing.exposure = 1.2

        return scene
    };
}

export default new TestRoom()
