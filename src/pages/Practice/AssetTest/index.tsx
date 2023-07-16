import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
    Scene,
    SceneLoader,
    ArcRotateCamera,
    HemisphericLight,
    Vector3,
    MeshBuilder,
    FollowCamera,
    ArcFollowCamera,
    FreeCamera,
    ActionManager,
    ExecuteCodeAction,
    Tools,
    UniversalCamera,
    Camera,
    Viewport,
    StandardMaterial,
    Color3,
    Mesh,
    Space,
    Axis,
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import { LoadInspectorControl } from '@/clients/util/LoadInspectorControl';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';
import { CustomInputController } from '@/clients/util/CustomInputController';
import { IsometricCamera } from '@/clients/util/IsometricCamera';
import { InputTypeEnum } from '@/clients/util/CustomInputControllerType';
import { RTSCameraKeyboardController } from '@/clients/util/RTSCameraKeyboardController';
import { RTSCameraMouseController } from '@/clients/util/RTSCameraMouseController';
import { RTSCameraWheelController } from '@/clients/util/RTSCameraWheelController';




// import Recast from 'recast-detour'
// import { RecastJSPlugin } from '@babylonjs/core/Navigation/Plugins/recastJSPlugin';

const onSceneReady = (scene: Scene) => {

    /** 230705 recast 라이브러리 현재 UMD, ESM 모듈 로딩 방식 차이로
     * 제대로 로딩안됨. 해결하려면 추가적 시간 필요
     * 현재 바빌론팀 관련하여 작업 중.  다른 작업으로 이동
     */


    // async function buildNav() {
    //   console.log('buildNav');
    //   const recast = await Recast();
    //   const navigationPlugin: RecastJSPlugin = new RecastJSPlugin(recast);
    //   console.log('recast loaded');
    //   // const navPlugin = new RecastJSPlugin();
    //   console.log('nav plugin loaded ');
    //   return navPlugin;
    // }
    // const navPlugin = buildNav();
    // logger.log('nav ')


    // debug 용
    const canvas = scene.getEngine().getRenderingCanvas();
    canvas!.height = 800;
    canvas!.width = 1000;

    /** inspector 활성화 및 전환 시 통신이벤트 */
    LoadInspectorControl(scene, canvas);

    const light = new HemisphericLight("light", new Vector3(0, 50, 0), scene);
    light.intensity = 0.6;


    // This creates and positions a free camera (non-mesh)
    let camera = new UniversalCamera("camera1", new Vector3(-14, 20, 0), scene);
    // This targets the camera to scene origin
    camera.setTarget(new Vector3(0, 0, 0));
    camera.mode = Camera.PERSPECTIVE_CAMERA;
    camera.speed = 0.5;
    camera.fov = 1.0;
    camera.metadata = {
        // mouse & keyboard properties
        // Set by camera inputs. Defines, which input moves the camera (mouse or keys)
        movedBy: null,
        // target position, the camera should be moved to
        targetPosition: camera.position.clone(),
        // radius, that is used to rotate camera
        // initial value dependent from camera position and camera target
        radius: new Vector3(camera.position.x, 0, camera.position.z).subtract(new Vector3(camera.target.x, 0, camera.target.z)).length(),
        // helper variable, to rotate camera
        rotation: Tools.ToRadians(180) + camera.rotation.y,
        // speed for rotation
        rotationSpeed: 0.04,
        // boundaries for x and z
        minX: -30,
        maxX: 30,
        minZ: -30,
        maxZ: 30,
        // mousewheel properties
        // similar to targetPosition, targetZoom contains the target value for the zoom
        targetZoom: camera.fov,
        // zoom boundaries
        maxZoom: 1.4,
        minZoom: 0.5,
        // speed for zoom
        zoom: 0.005,
        // zoom distance per mouse wheel interaction
        zoomSteps: 0.2,
    }
    // camera.inputs.clear();
    camera.attachControl(canvas, true);

    // camera.inputs.add(new RTSCameraKeyboardController());
    // camera.inputs.add(new RTSCameraMouseController());
    // camera.inputs.add(new RTSCameraWheelController());





    let randomNumber = function (min: number, max: number) {
        if (min == max) {
            return (min);
        }
        let random = Math.random();
        return ((random * (max - min)) + min);
    };

    let box = MeshBuilder.CreateBox("crate", { size: 2 }, scene);
    box.material = new StandardMaterial("Mat", scene);
    box.checkCollisions = true;

    let boxNb = 6;
    let theta = 0;
    let radius = 6;
    box.position = new Vector3((radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.cos(theta + randomNumber(-0.1 * theta, 0.1 * theta)), 1, (radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.sin(theta + randomNumber(-0.1 * theta, 0.1 * theta)));

    let boxes = [box];
    for (let i = 1; i < boxNb; i++) {
        theta += 2 * Math.PI / boxNb;
        let newBox = box.clone("box" + i);
        boxes.push(newBox);
        newBox.position = new Vector3((radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.cos(theta + randomNumber(-0.1 * theta, 0.1 * theta)), 1, (radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.sin(theta + randomNumber(-0.1 * theta, 0.1 * theta)));
    }



    // SceneLoader.ImportMeshAsync('', '/src/assets/ex_tutorial/', 'myroom_ex.glb').then((res) => {
    // SceneLoader.ImportMesh('', '/src/assets/ex_tutorial/', 'myroom_ex.glb', scene, (meshes, particle, skeletons, animation) => {
    //     console.log('TEST mesh ', meshes)
    //     console.log('TEST skeleton ', skeletons)
    //     console.log('TEST animation ', animation)
    //     // const dude = res.meshes[0];
    //     // dude.scaling = new Vector3(0.25, 0.25, 0.25);
    //     const girl = meshes[0]
    //     girl.scaling = new Vector3(6, 6, 6);
    //     // girl.rotation.y = 1;

    //     var skeleton = skeletons[0];
    //     var mesh = meshes[0];
    //     // skeleton.bones[3].translate(new Vector3(122, 2323, 0));


    //     scene.beforeRender = function () {
    //         skeleton.bones[7].translate(new Vector3(1, 0.1, 0));


    //     }

    //     mesh.rotate(new Vector3(0, Math.PI, 0), Math.PI / 2);

    //     // scene.beginAnimation(girl, 0, 200, true);
    // });

    SceneLoader.ImportMesh("", "/src/assets/ex_tutorial/", "Dude.babylon", scene, function (newMeshes, particleSystems, skeletons) {
        var mesh = newMeshes[0];
        var skeleton = skeletons[0];
        mesh.scaling = new Vector3(0.1, 0.1, 0.1);

        console.log('TEST mesh ', mesh)
        console.log('TEST skeleton ', skeletons)
        mesh.rotate(new Vector3(0, Math.PI, 0), Math.PI / 2);
        scene.beforeRender = function () {

            skeleton.bones[7].translate(new Vector3(0.05, 0.05, 0));

        }

    });

    // SceneLoader.ImportMesh('', '/src/assets/ex_tutorial/', 'WhipperNude.glb', scene, (meshes, particle, skeleton, animation) => {

    //     console.log('TEST mesh ', meshes)
    //     console.log('TEST skeleton ', skeleton)
    //     console.log('TEST animation ', animation)
    //     // let ani = scene.getAnimationGroupByName('WH_CombatRun');
    //     // ani?.start(true);

    //     let ske = scene.getSkeletonByName('WhipperNude_Skeleton');
    //     let rootske = ske!.bones[0];
    //     rootske.translate(Axis.Y, 1, Space.WORLD)

    //     // const dude = res.meshes[0];
    //     // dude.scaling = new Vector3(0.25, 0.25, 0.25);
    //     // const girl = res.meshes[0]
    //     // girl.scaling = new Vector3(6, 6, 6);
    //     // scene.beginAnimation(girl, 0, 200, true);
    // })

    const basicGround = MeshBuilder.CreateGround('basicGround', { width: 200, height: 200 });
    basicGround.rotation.y = Math.PI / 4;
    basicGround.material = new GridMaterial("basicGroundMat", scene);

    basicGround.checkCollisions = true;


    /** 키보드 입력 시 canvas 에 포커싱하여 불필요한 브라우져 액션 차단 */
    window.addEventListener("keydown", function (event) {
        canvas!.focus();
    })

};

// scene.registerBeforeRender(function () {
//   cylinder.position.x = Math.sin(alpha) * 10
//   alpha += 0.01;
// })



const onRender = () => {
    logger.log('t')
}

const AssetTestScene = () => {

    React.useEffect(() => {
        return () => {
            messageClient.removeListener('clear_inspector');
        }
    }, [])

    return (
        <SceneComponent
            antialias
            onSceneReady={onSceneReady}
            // onRender={onRender}
            id="my-canvas"
        />
    );
};

export default AssetTestScene;