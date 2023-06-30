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

  let camPos = new Vector3();
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 50, new Vector3(0, 2, 0), scene);
  camera.upperBetaLimit = Math.PI / 2.5;
  camera.attachControl(canvas, true)

  const updateCamPos = () => {
    camera.position.x += 1
  }

  // Camera
  // let camera = new FollowCamera("FollowCam", new Vector3(0, 10, 0), scene);

  // camera.radius = 25; // how far from the object to follow
  // camera.heightOffset = 3; // how high above the object to place the camera
  // camera.rotationOffset = 90; // the viewing angle
  // camera.cameraAcceleration = 0; // how fast to move
  // camera.maxCameraSpeed = 20; // speed limit
  // camera.attachControl(canvas, true);

  //camera.target = player;
  // camera.lockedTarget = player; // target any mesh or object with a "position" Vector3

  scene.activeCamera = camera;

  const light = new HemisphericLight("light", new Vector3(0, 50, 0), scene);
  light.intensity = 0.6;

  const basicGround = MeshBuilder.CreateGround('basicGround', { width: 200, height: 200 });
  // ground.checkCollisions = true;
  basicGround.rotation.y = Math.PI / 4;
  basicGround.material = new GridMaterial("basicGroundMat", scene);

  scene.actionManager = new ActionManager(scene);
  scene.actionManager.registerAction(
    new ExecuteCodeAction(
      {
        trigger: ActionManager.OnKeyDownTrigger,
        parameter: 'a'
      },
      () => {
        logger.log('a pressed')
        updateCamPos()
        // camera.position.x += 1
      }
    )
  );


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
