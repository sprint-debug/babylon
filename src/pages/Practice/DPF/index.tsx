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
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import { handleSceneSwitch } from '@/pages/Tutorial/subscribeMsgEvt';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';
import { CustomInputController } from '@/clients/util/CustomInputController';
import { IsometricCamera } from '@/clients/util/IsometricCamera';
import { InputTypeEnum } from '@/clients/util/CustomInputControllerType';

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


  let camera = new UniversalCamera("MyCamera", new Vector3(0, 1, 0), scene);
  camera.minZ = 0.0001;
  camera.attachControl(canvas, true);
  camera.speed = 0.02;

  // camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
  // camera.inputs.removeByType("FreeCameraMouseInput");
  // camera.inputs.add(new IsometricCamera({ inputType: InputTypeEnum.WASD, enablePreventDefault: false }));

  // Add viewCamera that gives first person shooter view
  let viewCamera = new UniversalCamera("viewCamera", new Vector3(0, 3, -3), scene);
  viewCamera.attachControl(canvas, true);
  viewCamera.minZ = 0.0001;
  viewCamera.speed = 0.02;
  viewCamera.parent = cone;
  viewCamera.setTarget(new Vector3(0, -0.0001, 1));

  scene.activeCameras!.push(viewCamera);
  // scene.activeCameras!.push(camera);

  viewCamera.inputs.removeByType("FreeCameraKeyboardMoveInput");
  viewCamera.inputs.removeByType("FreeCameraMouseInput");
  viewCamera.inputs.add(new IsometricCamera({ inputType: InputTypeEnum.WASD, enablePreventDefault: false }));

  //First remove the default management.

  // camera.inputs.add(new CustomInputController({ inputType: InputTypeEnum.WASD, enablePreventDefault: false }));



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

  // scene.gravity = new Vector3(0, -0.9, 0);
  scene.collisionsEnabled = true;

  camera.checkCollisions = true;
  // camera.applyGravity = true;
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

  const basicGround = MeshBuilder.CreateGround('basicGround', { width: 200, height: 200 });
  basicGround.rotation.y = Math.PI / 4;
  basicGround.material = new GridMaterial("basicGroundMat", scene);

  basicGround.checkCollisions = true;


  /** 키보드 입력 시 canvas 에 포커싱하여 불필요한 브라우져 액션 차단 */
  window.addEventListener("keydown", function (event) {
    canvas!.focus();
  })

  /** scene 전환 시, inspector 종료작업 */
  handleSceneSwitch(scene, { enableScopeInfo: true });
};

// scene.registerBeforeRender(function () {
//   cylinder.position.x = Math.sin(alpha) * 10
//   alpha += 0.01;
// })

const onRender = () => {
  logger.log('t')
}

const LampScene = () => {

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

export default LampScene;
