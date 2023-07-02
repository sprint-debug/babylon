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
    Texture,
    Color3
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import { handleSceneSwitch } from '@/pages/Tutorial/subscribeMsgEvt';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';
import { CustomInputController } from '@/clients/util/CustomInputController';
import { InputTypeEnum } from '@/clients/util/CustomInputControllerType';

//https://playground.babylonjs.com/#CTCSWQ


const onSceneReady = (scene: Scene) => {
    // debug 용
    void Promise.all([
        import("@babylonjs/core/Debug/debugLayer"),
        import("@babylonjs/inspector"),
    ]).then((_values) => {
        scene.debugLayer.show({
            handleResize: true,
            overlay: false,
            // overlay: true, // inspector 대비 비율 화면
            globalRoot: document.getElementById("#root") || undefined,
        })
    })

    const canvas = scene.getEngine().getRenderingCanvas();
    canvas!.height = 800;
    canvas!.width = 1000;

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
    // camera.angularSpeed = 0.05;
    // camera.angle = Math.PI/2;
    // camera.direction = new Vector3(Math.cos(camera.angle), 0, Math.sin(camera.angle));

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

    var randomNumber = function (min: number, max: number) {
        if (min == max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    };

    var box = MeshBuilder.CreateBox("crate", { size: 2 }, scene);
    box.material = new StandardMaterial("Mat", scene);
    box.checkCollisions = true;

    var boxNb = 6;
    var theta = 0;
    var radius = 6;
    box.position = new Vector3((radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.cos(theta + randomNumber(-0.1 * theta, 0.1 * theta)), 1, (radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.sin(theta + randomNumber(-0.1 * theta, 0.1 * theta)));

    var boxes = [box];
    for (var i = 1; i < boxNb; i++) {
        theta += 2 * Math.PI / boxNb;
        var newBox = box.clone("box" + i);
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
    var a = 0.5;
    var b = 1;
    var points = [];
    for (var theta = -Math.PI / 2; theta < Math.PI / 2; theta += Math.PI / 36) {
        points.push(new Vector3(0, b * Math.sin(theta), a * Math.cos(theta)));
    }

    var ellipse = [];
    ellipse[0] = MeshBuilder.CreateLines("e", { points: points }, scene);
    ellipse[0].color = Color3.Red();
    ellipse[0].parent = camera;
    ellipse[0].rotation.y = 5 * Math.PI / 16;
    for (var i = 1; i < 23; i++) {
        ellipse[i] = ellipse[0].clone("el" + i);
        ellipse[i].parent = camera;
        ellipse[i].rotation.y = 5 * Math.PI / 16 + i * Math.PI / 16;
    }

    /** scene 전환 시, inspector 종료작업 */
    handleSceneSwitch(scene, { enableScopeInfo: true });
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
