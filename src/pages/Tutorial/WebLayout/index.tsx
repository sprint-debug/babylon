import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  Vector3,
  HemisphericLight,
  Scene,
  ArcRotateCamera,
} from '@babylonjs/core';
import { LoadInspectorControl } from '@/clients/util/LoadInspectorControl';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';
import './style.scss';

// required glb imports
import "@babylonjs/loaders/glTF";

const onSceneReady = (scene: Scene) => {
  console.log('WebAppLayout')
  const canvas = scene.getEngine().getRenderingCanvas();
  canvas!.height = 800;
  canvas!.width = 1000;

  /** inspector 활성화 및 전환 시 통신이벤트 */
  LoadInspectorControl(scene, canvas);

  /** Set Camera and Light  */
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0));
  camera.attachControl(canvas, true);

  const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

  return scene;
};

const WebLayout = () => {

  React.useEffect(() => {
    return () => {
      logger.log('cleanup tuto scene')
      messageClient.removeListener('clear_inspector');
    }
  }, [])

  return (
    <>
      <SceneComponent
        antialias
        onSceneReady={onSceneReady}
        // onRender={onRender}
        id="my-canvas"
        className="game-view"
      />
      <div className="ui-panel">
        test panel area
      </div>
    </>
  );
};

export default WebLayout;
