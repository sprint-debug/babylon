import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  SceneLoader,
  Vector3,
  Scene,
  ArcRotateCamera,
  Mesh,
  DirectionalLight,
  ShadowGenerator
} from '@babylonjs/core';
import { LoadInspectorControl } from '@/clients/util/LoadInspectorControl';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';

const onSceneReady = (scene: Scene) => {
  const canvas = scene.getEngine().getRenderingCanvas();
  canvas!.height = 800;
  canvas!.width = 1000;

  /** inspector 활성화 및 전환 시 통신이벤트 */
  LoadInspectorControl(scene, canvas);

  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 20, new Vector3(0, 2, 0), scene);
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.attachControl(canvas, true)

  const light = new DirectionalLight("dir01", new Vector3(0, -1, 1), scene);
  light.position = new Vector3(0, 50, -100);

  var ground = Mesh.CreateGround("ground", 100, 100, 1, scene, false);
  ground.receiveShadows = true;

  // Shadow generator
  const shadowGenerator = new ShadowGenerator(1024, light);

  SceneLoader.ImportMesh("", "/src/assets/ex_tutorial/", "dude.babylon", scene, function (newMeshes2, particleSystems2, skeletons2) {
    var dude = newMeshes2[0];
    dude.scaling = new Vector3(0.2, 0.2, 0.2);

    //add dude, true means add children as well
    shadowGenerator.addShadowCaster(dude, true);

    scene.beginAnimation(skeletons2[0], 0, 100, true);
  });

};


const ShadowScene = () => {

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

export default ShadowScene;
