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
    SkeletonViewer,
    Texture,
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import "@babylonjs/loaders/OBJ";
import { LoadInspectorControl } from '@/clients/util/LoadInspectorControl';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';
import { CustomInputController } from '@/clients/util/CustomInputController';
import { IsometricCamera } from '@/clients/util/IsometricCamera';
import { InputTypeEnum } from '@/clients/util/CustomInputControllerType';
import { RTSCameraKeyboardController } from '@/clients/util/RTSCameraKeyboardController';
import { RTSCameraMouseController } from '@/clients/util/RTSCameraMouseController';
import { RTSCameraWheelController } from '@/clients/util/RTSCameraWheelController';

import { GUI } from 'dat.gui';



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
    camera.attachControl(canvas, true);
    // This targets the camera to scene origin
    camera.setTarget(new Vector3(0, 0, 0));






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


    /*
    https://forum.babylonjs.com/t/bone-position-not-working-in-imported-glb-file/16043
    glb, gltf 의 경우 다르게 처리해야함 
    
    https://www.babylonjs-playground.com/#VSURBJ
    ik control
    */

    // SceneLoader.ImportMeshAsync('', '/src/assets/ex_tutorial/', 'myroom_ex.glb').then((res) => {
    // SceneLoader.ImportMesh('', '/src/assets/ex_tutorial/', 'test.glb', scene, (meshes, particle, skeletons, animation) => {
    //     const bone = scene.getTransformNodeByName("Bone.001");
    //     bone!.position = new Vector3(5, 5, 5);
    // })
    // SceneLoader.ImportMesh('', '/src/assets/ex_tutorial/', 'myroom_ex.glb', scene, (meshes, particle, skeletons, animation) => {
    //     console.log('TEST mesh ', meshes)
    //     console.log('TEST skeleton ', skeletons)
    //     console.log('TEST animation ', animation)
    //     // const dude = res.meshes[0];
    //     // dude.scaling = new Vector3(0.25, 0.25, 0.25);
    //     const girl = meshes[0]
    //     girl.scaling = new Vector3(3, 3, 3);
    //     // girl.rotation.y = 1;




    // SceneLoader.ImportMesh('', '/src/assets/ex_tutorial/female_test/', 'F2A.obj', scene, (meshes, particle, skeletons, animation) => {
    //     const female5 = meshes[5];
    //     const female4 = meshes[4];
    //     const female3 = meshes[3];
    //     const female2 = meshes[2];
    //     const female1 = meshes[1];

    //     meshes.map(mesh => mesh.scaling = new Vector3(0.1, 0.1, 0.1))

    //     const bodyMat = new StandardMaterial('body', scene);
    //     bodyMat.diffuseTexture = new Texture('/src/assets/ex_tutorial/female_test/Female2a.bmp');
    //     const faceMat = new StandardMaterial('face', scene);
    //     faceMat.diffuseTexture = new Texture('/src/assets/ex_tutorial/female_test/face_w1.bmp');
    //     const hairMat = new StandardMaterial('hair', scene);
    //     hairMat.diffuseTexture = new Texture('/src/assets/ex_tutorial/female_test/hair.bmp')
    //     const eyeMat = new StandardMaterial('eye', scene);
    //     eyeMat.diffuseTexture = new Texture('/src/assets/ex_tutorial/female_test/eye.bmp')

    //     female5.material = hairMat;
    //     female4.material = faceMat;
    //     female3.material = bodyMat;
    //     female2.material = eyeMat;
    //     female1.material = bodyMat;
    // })

    // SceneLoader.ImportMesh('', '/src/assets/ex_tutorial/', 'myroom_ex.glb', scene, (meshes, particle, skeletons, animation) => {
    //     const girl = meshes[0]
    //     girl.scaling = new Vector3(1, 1, 1);
    //     var mesh = meshes[0];
    //     const bone = scene.getTransformNodeByName("Bip001 Pelvis");
    //     logger.log('bone ', bone)
    //     bone!.position = new Vector3(2, 0, 0);
    //     girl.material = new StandardMaterial("Mat", scene);

    //     mesh.rotate(new Vector3(0, Math.PI, 0), Math.PI / 2);
    //     // scene.beginAnimation(girl, 0, 200, true);
    //     scene.animationsEnabled = false;
    // });

    //     var skeleton = skeletons[0];
    //     var mesh = meshes[0];

    //     const bone = scene.getTransformNodeByName("Bip001 Pelvis");
    //     logger.log('bone ', bone)
    //     bone!.position = new Vector3(2, 0, 0);
    //     const bone1 = scene.getTransformNodeByName("Bip001 L Thigh");
    //     bone1!.position.z = 3;

    //     // scene.beforeRender = function () {
    //     //     skeleton.bones[7].translate(new Vector3(1, 0.1, 0));

    //     // }

    //     mesh.rotate(new Vector3(0, Math.PI, 0), Math.PI / 2);
    //     // scene.beginAnimation(girl, 0, 200, true);
    //     scene.animationsEnabled = false;
    // });


    var oldgui = document.querySelector("#datGUI");
    if (oldgui != null) {
        oldgui.remove();
    }
    //https://github.com/dataarts/dat.gui/blob/master/API.md
    var gui = new GUI();
    gui.domElement.style.marginTop = "100px";
    gui.domElement.id = "datGUI";

    var config = {
        headScale: 1,
        bicepScale: 1,
        foreArmScale: 1,
        foreArmRotation: 0,
        leiThigh: 1,
    }

    gui.add(config, 'headScale', .5, 2);
    gui.add(config, 'bicepScale', .5, 2);
    gui.add(config, 'foreArmScale', .5, 2);
    gui.add(config, 'foreArmRotation', 0, 2);

    gui.addFolder('lei');
    gui.add(config, 'leiThigh', .2, 2);


    SceneLoader.ImportMesh("", "/src/assets/ex_tutorial/", "Dude.babylon", scene, function (newMeshes, particleSystems, skeletons) {
        let mesh = newMeshes[0];
        let skeleton = skeletons[0];
        mesh.scaling = new Vector3(0.1, 0.1, 0.1);
        mesh.position = new Vector3(0, 0, 6);
        mesh.rotation = new Vector3(0, -Math.PI / 2, 0)

        // Create a skeleton viewer for the mesh
        let skeletonViewer = new SkeletonViewer(skeleton, mesh, scene);
        skeletonViewer.isEnabled = true; // Enable it
        skeletonViewer.color = Color3.Red(); // Change default color from white to red

        console.log('TEST mesh ', mesh)
        console.log('TEST skeleton ', skeletons)
        // scene.beginAnimation(skeletons[0], 0, 100, true, 1.0);

        let head = skeleton.bones[7];
        let rightBicep = skeleton.bones[13];
        let rightForeArm = skeleton.bones[14];

        scene.registerBeforeRender(function () {
            // head.scale(config.headScale, config.headScale, config.headScale, true);
            // rightBicep.scale(1, config.bicepScale, config.bicepScale, true);
            // rightForeArm.scale(1, config.foreArmScale, config.foreArmScale, true);

            head.setScale(new Vector3(config.headScale, config.headScale, config.headScale));
            rightBicep.setScale(new Vector3(1, config.bicepScale, config.bicepScale));
            rightForeArm.setScale(new Vector3(1, config.foreArmScale, config.foreArmScale));

            // rightForeArm.setRotation(new Vector3(0, config.foreArmRotation, 0), Space.LOCAL)
            let rotAxix = new Vector3(1, -0.2, 0); // cyinldrical rotation
            // let rotAxix = new Vector3(0, 1, 0); // rotate like propeller
            // let rotAxix = new Vector3(0, 0, 1);
            // rightForeArm.rotate(rotAxix, config.foreArmRotation, Space.WORLD)
            rightForeArm.setRotation(new Vector3(config.foreArmRotation, config.foreArmRotation, config.foreArmRotation), Space.LOCAL)
            // rightForeArm.rotate(rotAxix, config.foreArmRotation, Space.LOCAL)
            // head.rotate(rotAxix, config.foreArmRotation, Space.LOCAL)

        });
    });

    SceneLoader.ImportMesh('', '/src/assets/ex_tutorial/mso/', 'MsoLei.glb', scene, (meshes, particle, skeletons, animation) => {
        // meshes.map(mesh => mesh.scaling = new Vector3(0.1, 0.1, 0.1))
        console.log('meshes ', meshes)
        console.log('particle ', particle)
        console.log('skeletons ', skeletons)

        let skeleton = skeletons[0]

        let skeletonViewer = new SkeletonViewer(skeleton, meshes[0], scene);
        skeletonViewer.isEnabled = true; // Enable it
        skeletonViewer.color = Color3.Red(); // Change default color from white to red


        const bidx = skeleton.getBoneIndexByName('Genesis9')
        const test = skeleton.bones[bidx]
        // test.getTransformNode()?.rotate(Axis.X, Math.PI / 4, Space.LOCAL);
        // test.rotate(Axis.X, Math.PI / 4, Space.LOCAL);
        // test.position = new Vector3(1, 5, 1);


        console.log('animation ', animation)

        const lei = meshes[0];
        lei.position = new Vector3(0, 0, 0);
        lei.rotation = new Vector3(0, -Math.PI / 2, 0);
        lei.scaling = new Vector3(5, 5, 5);


        const lidx = skeleton.getBoneIndexByName('r_upperarm')
        console.log('tt ', lidx)
        const leiThigh = skeleton.bones[lidx]
        console.log('tt ', leiThigh)

        const bone = scene.getTransformNodeByName("l_thigh");

        scene.registerBeforeRender(() => {
            bone!.scaling = new Vector3(config.leiThigh, config.leiThigh, config.leiThigh);
            // leiThigh.setScale(new Vector3(config.leiThigh, config.leiThigh, config.leiThigh));
            // leiThigh.scaling = new Vector3(config.leiThigh, config.leiThigh, config.leiThigh);
        });

    })

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