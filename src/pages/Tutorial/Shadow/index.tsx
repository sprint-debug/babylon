import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  SceneLoader,
  Animation,
  StandardMaterial,
  Texture,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Scene,
  ArcRotateCamera,
  Axis,
  Space,
  Tools,
  CubeTexture,
  Color3,
  SpriteManager,
  Sprite,
  Mesh,
  Color4,
  DirectionalLight,
  ShadowGenerator
} from '@babylonjs/core';
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


  /** scene 전환 시, inspector 종료작업 */
  handleSceneSwitch(scene, { enableScopeInfo: true });
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
