import React from 'react';
import { logger } from '@/common/utils/logger';
import SceneComponent from 'babylonjs-hook';
import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ActionManager,
  Scene,
  ExecuteCodeAction,
} from '@babylonjs/core';
import { messageClient } from '@/clients/events';
import style from "../style.module.scss";

let box: any;

const onSceneReady = (scene: Scene) => {
  logger.log('onSceneReady')
  // This creates and positions a free camera (non-mesh)
  const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());

  const canvas = scene.getEngine().getRenderingCanvas();

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox('box', { size: 2 }, scene);

  // Move the box upward 1/2 its height
  box.position.y = 1;

  box.actionManager = new ActionManager(scene);

  // event handler
  box.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
      messageClient.postMessage('alert', { text: 'hi' });
    }),
  );

  messageClient.addListener('box', () => {
    box.position.y = 5;
  });

  // Our built-in 'ground' shape.
  MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);


};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene) => {
  if (box !== undefined) {
    const deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

const HomeScene = () => {
  React.useEffect(() => {
    logger.log('scene component rendered', [])
    /** todo: 상위 요소에서 size 변경 시 useEffect 는 작동하지만, onSceneReady는 다시 실행되지 않는 듯함 정확한 확인필요 */
  })
  return (
    <SceneComponent
      antialias
      onSceneReady={onSceneReady}
      onRender={onRender}
      id="my-canvas"
      className={style.canvasElement}
    />
  );
};

export default HomeScene;
