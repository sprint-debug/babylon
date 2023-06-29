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
  ParticleSystem,
  Color4,
  PointerEventTypes,
  SpotLight
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

  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 50, new Vector3(0, 2, 0), scene);
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.attachControl(canvas, true)

  const light = new HemisphericLight("light", new Vector3(0, 50, 0), scene);
  light.intensity = 0.4;

  const lampLight = new SpotLight('lampLight', Vector3.Zero(), new Vector3(0, -1, 0), Math.PI, 1, scene);
  lampLight.diffuse = Color3.Yellow();

  const lampShape = [];
  for (let i = 0; i < 20; i++) {
    lampShape.push(new Vector3(Math.cos(i * Math.PI / 10), Math.sin(i * Math.PI / 10), 0));
  }
  lampShape.push(lampShape[0]) //close shape

  //extrustion path
  const lampPath = [];
  lampPath.push(new Vector3(0, 0, 0));
  lampPath.push(new Vector3(0, 10, 0));
  for (let i = 0; i < 20; i++) {
    lampPath.push(new Vector3(1 + Math.cos(Math.PI - i * Math.PI / 40), 10 + Math.sin(Math.PI - i * Math.PI / 40), 0))
  }
  lampPath.push(new Vector3(3, 11, 0));

  const yellowMat = new StandardMaterial('yellowMat');
  yellowMat.emissiveColor = Color3.Yellow();

  const lamp = MeshBuilder.ExtrudeShape('lamp', { cap: Mesh.CAP_END, shape: lampShape, path: lampPath, scale: 0.5 });
  const bulb = MeshBuilder.CreateSphere('bulb', { diameterX: 1.5, diameterZ: 0.8 });

  bulb.material = yellowMat;
  bulb.parent = lamp;
  bulb.position = new Vector3(2, 10.5, 0);
  lampLight.parent = bulb;

  const ground = MeshBuilder.CreateGround('ground', { width: 50, height: 50 });




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
