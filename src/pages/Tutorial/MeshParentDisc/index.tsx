import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Scene,
  ArcRotateCamera,
  StandardMaterial,
  Color4,
  Texture,
  Axis,
  Space,
} from '@babylonjs/core';
import { handleSceneSwitch } from '@/pages/Tutorial/subscribeMsgEvt';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';


const onSceneReady = (scene: Scene) => {
  logger.log('MeshParent')
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
    // scene.debugLayer.hide();
  });

  const canvas = scene.getEngine().getRenderingCanvas();
  canvas!.height = 800;
  canvas!.width = 1000;

  const camera = new ArcRotateCamera("camera", -Math.PI / 2.2, Math.PI / 2.5, 15, new Vector3(0, 0, 0));
  camera.attachControl(canvas, true);
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  light.intensity = 0.8;

  const faceColors = [];
  faceColors[0] = new Color4(0, 1, 1, 1);
  faceColors[1] = new Color4(1, 0, 1, 1);
  faceColors[2] = new Color4(1, 1, 0, 1);
  faceColors[3] = new Color4(0.5, 0.5, 1, 1);
  faceColors[4] = new Color4(1, 0.5, 0.5, 0.5);
  faceColors[5] = new Color4(0.5, 1, 0.5, 0);

  let disc = MeshBuilder.CreateCylinder('disc', { diameter: 20, height: 0.25 }, scene);
  const discMat = new StandardMaterial('grass', scene);
  discMat.diffuseTexture = new Texture('/src/assets/grass.jpg', scene);
  disc.material = discMat;

  let box = [];
  for (let i = 0; i < 50; i++) {
    box[i] = MeshBuilder.CreateBox('Box' + 1, { faceColors: faceColors }, scene);
    let scale = 1 + Math.random() * 2;
    let radius = Math.random() * 9;
    let theta = Math.random() * 2 * Math.PI;
    let phi = Math.random() * 2 * Math.PI;
    box[i].scaling.y = scale;
    box[i].rotation.y = phi;
    box[i].position = new Vector3(radius * Math.cos(theta), scale / 2, radius * Math.sin(theta));
    box[i].parent = disc;
  }

  let phi = 0;
  scene.registerAfterRender(() => {
    let matrix = disc.getWorldMatrix();
    disc.rotate(Axis.Y, Math.PI / 150, Space.LOCAL);
    disc.rotate(Axis.Z, Math.PI / 200, Space.LOCAL);
    disc.position = new Vector3(15 * Math.cos(phi), 16 * Math.sin(phi), 5);
    phi += 0.01;
  })



  /** scene 전환 시, inspector 종료작업 */
  handleSceneSwitch(scene, { enableScopeInfo: true });

  return scene;
}


const MeshParentDisc = () => {
  React.useEffect(() => {
    return () => {
      logger.log('cleanup tuto scene')
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

export default MeshParentDisc;