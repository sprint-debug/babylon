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
  Vector2
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import { handleSceneSwitch } from '@/pages/Tutorial/subscribeMsgEvt';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';
import { FreeCameraKeyboardWalkInput } from '@/clients/util/CustomInputController';
import { FreeCameraKeyboardWalkInput2 } from '@/clients/util/CustomInputController2';

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

  // let camPos = new Vector3();
  // const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 50, new Vector3(0, 2, 0), scene);
  // camera.upperBetaLimit = Math.PI / 2.5;
  // camera.attachControl(canvas, true)

  /** 기본이동 시 축이 어긋남, 맞추려면 해당 보정도 같이해주거나, ground 자체를 회전시켜야함 */
  const freeCam = new FreeCamera("freeCam", new Vector3(0, 30, 0), scene);
  freeCam.attachControl(canvas, true);
  freeCam.inputs.removeMouse();

  // freeCam.mode = Camera.ORTHOGRAPHIC_CAMERA;
  // freeCam.orthoTop = 100; // Set the top orthographic value
  // freeCam.orthoBottom = -100; // Set the bottom orthographic value
  // freeCam.orthoLeft = -100; // Set the left orthographic value
  // freeCam.orthoRight = 100; // Set the right orthographic value


  scene.activeCamera = freeCam;
  freeCam.inputs.removeByType("FreeCameraKeyboardMoveInput");
  freeCam.inputs.add(new FreeCameraKeyboardWalkInput());


  // freeCam.cameraRotation = new Vector2(0.1, 0);
  // freeCam.setTarget(new Vector3(0, -0.0001, 1));

  //65 l 68 r 83 b 87 f
  const cameraPointer = MeshBuilder.CreateBox('cameraPointer', { size: 1 }, scene);
  cameraPointer.position = new Vector3(0, -0.0001, 1);
  // freeCam.lockedTarget = cameraPointer;

  // window.addEventListener("keydown", function (event) {
  //   canvas!.focus();
  // })
  // scene.onKeyboardObservable.add((kbEvt) => {
  //   console.log(kbEvt.type, kbEvt.event)
  //   if (kbEvt.type > 1) return;
  //   switch (kbEvt.event.key) {
  //     case 'w':
  //       logger.log('w')
  //       // freeCam.m
  //       cameraPointer.movePOV(0.1, 0, 0);
  //       break;
  //     case 'a':
  //       logger.log('a')
  //       break;
  //     case 's':
  //       logger.log('s')
  //       break;
  //     case 'd':
  //       logger.log('d')
  //       break;

  //     default:
  //       break;
  //   }
  // })

  const basicGround = MeshBuilder.CreateGround('basicGround', { width: 200, height: 200 });
  // ground.checkCollisions = true;
  basicGround.rotation.y = Math.PI / 4;
  basicGround.material = new GridMaterial("basicGroundMat", scene);




  // const FreeCamKbInput = () => {
  //   // let _keys = [];
  //   keyLeft = [65];
  //   keyRight = [68];
  //   keyFront = [83];
  //   keyBack = [87];
  //   sensibility = 0.01;
  // }
  // FreeCamKbInput.prototype.attachControl = (noPreventDefault: boolean) => {
  //   let engine = freeCam.getEngine();
  //   let element = engine.getInputElement();
  //   const _onKeyDown = (evt) => {
  //     if (keyLeft.indexOf(evt.keyCode) !== -1 ||
  //       keyRight.indexOf(evt.keyCode) !== -1) {
  //       var index = _keys.indexOf(evt.keyCode);
  //       if (index === -1) {
  //         _this._keys.push(evt.keyCode);
  //       }
  //       if (!noPreventDefault) {
  //         evt.preventDefault();
  //       }
  //     }
  //   };
  //   const _onKeyUp = function (evt) {
  //     if (_this.keysLeft.indexOf(evt.keyCode) !== -1 ||
  //       _this.keysRight.indexOf(evt.keyCode) !== -1) {
  //       var index = _this._keys.indexOf(evt.keyCode);
  //       if (index >= 0) {
  //         _this._keys.splice(index, 1);
  //       }
  //       if (!noPreventDefault) {
  //         evt.preventDefault();
  //       }
  //     }
  //   };

  // }



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
