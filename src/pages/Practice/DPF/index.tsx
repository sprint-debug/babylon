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
  ExecuteCodeAction
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import { handleSceneSwitch } from '@/pages/Tutorial/subscribeMsgEvt';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';

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
  // const freeCam = new FreeCamera("freeCam", new Vector3(0, 25, 0), scene);
  // freeCam.attachControl(canvas, true);
  // freeCam.inputs.removeMouse();
  // freeCam.rotation.x = 0.6;
  // scene.activeCamera = freeCam;
  const cameraPointer = MeshBuilder.CreateBox('cameraPointer', { size: 1 }, scene);
  cameraPointer.position = Vector3.Zero();
  // followCam.lockedTarget = cameraPointer;

  const followCam = new ArcFollowCamera('followCam', -Math.PI / 2, Math.PI / 2.5, 50, cameraPointer, scene);
  followCam.radius = 30;
  // followCam.heightOffset = 10;
  // followCam.rotationOffset = 0;
  // followCam.cameraAcceleration = 0.005;
  // followCam.maxCameraSpeed = 10;
  // followCam.attachControl(canvas, true);




  const basicGround = MeshBuilder.CreateGround('basicGround', { width: 200, height: 200 });
  // ground.checkCollisions = true;
  basicGround.rotation.y = Math.PI / 4;
  basicGround.material = new GridMaterial("basicGroundMat", scene);

  // scene.actionManager = new ActionManager(scene);
  // scene.actionManager.registerAction(
  //   new ExecuteCodeAction(
  //     {
  //       trigger: ActionManager.OnKeyDownTrigger,
  //       parameter: 'a'
  //     },
  //     () => {
  //       logger.log('a pressed')
  //       // camera.position.x += 1
  //     }
  //   )
  // );


  scene.registerBeforeRender(() => {
  })

  /** scene 전환 시, inspector 종료작업 */
  handleSceneSwitch(scene, { enableScopeInfo: true });
};


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
