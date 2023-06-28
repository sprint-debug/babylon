import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Scene,
  ArcRotateCamera,
  StandardMaterial,
  Color3,
  Color4,
  Axis,
  Space,
  DynamicTexture,
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




  const box = MeshBuilder.CreateBox('box', { faceColors: faceColors }, scene);
  const small = MeshBuilder.CreateBox('small', { width: 0.25, depth: 0.25, height: 0.75, faceColors: faceColors }, scene);
  small.parent = box;

  let localOrigin = localAxes(2);
  localOrigin.parent = box;

  let matrix;
  let local_pos;
  let y = 0;
  scene.registerAfterRender(() => {
    box.rotate(Axis.Y, Math.PI / 150, Space.LOCAL);
    box.rotate(Axis.X, Math.PI / 200, Space.LOCAL);
    box.translate(new Vector3(-1, -1, -1).normalize(), 0.001, Space.WORLD);
    y += 0.001;
    small.translate(Axis.Y, 0.001, Space.LOCAL);
  });


  /** scene 전환 시, inspector 종료작업 */
  handleSceneSwitch(scene, { enableScopeInfo: true });

  return scene;
}

/** Create/Draw Axes */
const showAxis = (size: number, scene: Scene) => {
  const makeTextPlane = (text: string, color: string, size: number) => {
    const dynamicTexture = new DynamicTexture('DynamicTexture', 50, scene, true);
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true);
    const plane = MeshBuilder.CreatePlane('TextPlane', { size });
    plane.material = new StandardMaterial('TextPlaneMaterial', scene);
    // plane.material.diffuseTexture = dynamicTexture;

    return plane;
  }

  const axisX = MeshBuilder.CreateLines('axisX', {
    points: [
      Vector3.Zero(),
      new Vector3(size, 0, 0),
      new Vector3(size * 0.95, 0.05 * size, 0),
      new Vector3(size * 0.95, -0.05 * size, 0)
    ]
  });
  axisX.color = new Color3(1, 0, 0);
  const xChar = makeTextPlane('X', 'red', size / 10);
  xChar.position = new Vector3(0.9 * size, -0.05 * size, 0);

  const axisY = MeshBuilder.CreateLines('axisY', {
    points: [
      Vector3.Zero(),
      new Vector3(0, size, 0),
      new Vector3(-0.05 * size, size * 0.95, 0),
      new Vector3(0, size, 0),
      new Vector3(0.05 * size, size * 0.95, 0)
    ]
  });
  axisY.color = new Color3(0, 1, 0);
  const yChar = makeTextPlane('Y', 'green', size / 10);
  yChar.position = new Vector3(0, 0.9 * size, -0.05 * size);

  const axisZ = MeshBuilder.CreateLines('axisZ', {
    points: [
      Vector3.Zero(),
      new Vector3(0, 0, size),
      new Vector3(0, -0.05 * size, size * 0.95),
      new Vector3(0, 0, size),
      new Vector3(0, 0.05 * size, size * 0.95)
    ]
  });
  axisZ.color = new Color3(0, 0, 1);
  const zChar = makeTextPlane('Z', 'blue', size / 10);
  zChar.position = new Vector3(0, 0.05 * size, 0.9 * size);
}

/** Local Axes */
const localAxes = (size: number) => {

  const local_axisX = MeshBuilder.CreateLines("local_axisX", {
    points: [
      Vector3.Zero(),
      new Vector3(size, 0, 0),
      new Vector3(size * 0.95, 0.05 * size, 0),
      new Vector3(size, 0, 0),
      new Vector3(size * 0.95, -0.05 * size, 0)
    ]
  });
  local_axisX.color = new Color3(1, 0, 0);


  const local_axisY = MeshBuilder.CreateLines("local_axisY", {
    points: [
      Vector3.Zero(),
      new Vector3(0, size, 0),
      new Vector3(-0.05 * size, size * 0.95, 0),
      new Vector3(0, size, 0),
      new Vector3(0.05 * size, size * 0.95, 0)
    ]
  });
  local_axisY.color = new Color3(0, 1, 0);


  const local_axisZ = MeshBuilder.CreateLines("local_axisZ", {
    points: [
      Vector3.Zero(),
      new Vector3(0, 0, size),
      new Vector3(0, -0.05 * size, size * 0.95),
      new Vector3(0, 0, size),
      new Vector3(0, 0.05 * size, size * 0.95)
    ]
  });
  local_axisZ.color = new Color3(0, 0, 1);

  const local_origin = MeshBuilder.CreateBox('local_origin', { size: 1 });
  local_origin.isVisible = false;

  local_axisX.parent = local_origin;
  local_axisY.parent = local_origin;
  local_axisZ.parent = local_origin;

  return local_origin;

}


const MeshParentBox = () => {
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

export default MeshParentBox;