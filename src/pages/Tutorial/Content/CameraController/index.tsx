import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
    Scene,
    HemisphericLight,
    Vector3,
    MeshBuilder,
    UniversalCamera,
    Viewport,
    StandardMaterial,
    Color3
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';
import { CustomInputController } from '@/clients/util/CustomInputController';
import { InputTypeEnum } from '@/clients/util/CustomInputControllerType';
import { LoadInspectorControl } from '@/clients/util/LoadInspectorControl';

//https://playground.babylonjs.com/#CTCSWQ


const onSceneReady = (scene: Scene) => {
    const canvas = scene.getEngine().getRenderingCanvas();
    canvas!.height = 800;
    canvas!.width = 1000;

    /** inspector 활성화 및 전환 시 통신이벤트 */
    LoadInspectorControl(scene, canvas);

    const light = new HemisphericLight("light", new Vector3(0, 50, 0), scene);
    light.intensity = 0.6;


    const basicGround = MeshBuilder.CreateGround('basicGround', { width: 200, height: 200 });
    // ground.checkCollisions = true;
    basicGround.rotation.y = Math.PI / 4;
    basicGround.material = new GridMaterial("basicGroundMat", scene);

    let camera = new UniversalCamera("MyCamera", new Vector3(0, 1, 0), scene);
    camera.minZ = 0.0001;
    camera.attachControl(canvas, true);
    camera.speed = 0.02;

    // Add viewCamera that gives first person shooter view
    let viewCamera = new UniversalCamera("viewCamera", new Vector3(0, 3, -3), scene);
    viewCamera.parent = camera;
    viewCamera.setTarget(new Vector3(0, -0.0001, 1));

    scene.activeCameras!.push(viewCamera);
    scene.activeCameras!.push(camera);

    //First remove the default management.
    camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
    camera.inputs.removeByType("FreeCameraMouseInput");
    camera.inputs.add(new CustomInputController({ inputType: InputTypeEnum.WASD, enablePreventDefault: false }));

    //Add two viewports
    camera.viewport = new Viewport(0, 0.5, 1.0, 0.5);
    viewCamera.viewport = new Viewport(0, 0, 1.0, 0.5);

    let cone = MeshBuilder.CreateCylinder("dummyCamera", { diameterTop: 0.01, diameterBottom: 0.2, height: 0.2 }, scene);
    cone.parent = camera;
    cone.rotation.x = Math.PI / 2;

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

    scene.gravity = new Vector3(0, -0.9, 0);
    scene.collisionsEnabled = true;

    camera.checkCollisions = true;
    camera.applyGravity = true;

    basicGround.checkCollisions = true;

    camera.ellipsoid = new Vector3(0.5, 1, 0.5);
    camera.ellipsoidOffset = new Vector3(0, 1, 0);

    //Create Visible Ellipsoid around camera
    let a = 0.5;
    let b = 1;
    let points = [];
    for (let theta = -Math.PI / 2; theta < Math.PI / 2; theta += Math.PI / 36) {
        points.push(new Vector3(0, b * Math.sin(theta), a * Math.cos(theta)));
    }

    let ellipse = [];
    ellipse[0] = MeshBuilder.CreateLines("e", { points: points }, scene);
    ellipse[0].color = Color3.Red();
    ellipse[0].parent = camera;
    ellipse[0].rotation.y = 5 * Math.PI / 16;
    for (let i = 1; i < 23; i++) {
        ellipse[i] = ellipse[0].clone("el" + i);
        ellipse[i].parent = camera;
        ellipse[i].rotation.y = 5 * Math.PI / 16 + i * Math.PI / 16;
    }

    /** 키보드 입력 시 canvas 에 포커싱하여 불필요한 브라우져 액션 차단 */
    window.addEventListener("keydown", function (event) {
        canvas!.focus();
    })
};


const CameraControllerScene = () => {

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

export default CameraControllerScene;
