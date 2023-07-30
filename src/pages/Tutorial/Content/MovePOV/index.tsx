import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Scene,
  ArcRotateCamera,
  Axis,
  Space
} from '@babylonjs/core';
import { LoadInspectorControl } from '@/clients/util/LoadInspectorControl';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';

const onSceneReady = (scene: Scene) => {
  // debug 용
  const canvas = scene.getEngine().getRenderingCanvas();
  canvas!.height = 800;
  canvas!.width = 1000;

  /** inspector 활성화 및 전환 시 통신이벤트 */
  LoadInspectorControl(scene, canvas);

  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 2, 0), scene);
  camera.attachControl(canvas, true)

  const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

  const sphere = MeshBuilder.CreateSphere('sphere', { diameter: 0.25 });
  sphere.position = new Vector3(2, 0, 2);

  const points = [];
  points.push(new Vector3(2, 0, 2));
  points.push(new Vector3(2, 0, -2));
  points.push(new Vector3(-2, 0, -2));
  points.push(points[0]);

  MeshBuilder.CreateLines("triangle", { points: points })

  const track: any = [];
  track.push({ turn: Math.PI / 2, dist: 4 });
  track.push({ turn: 3 * Math.PI / 4, dist: 8 });
  track.push({ turn: 3 * Math.PI / 4, dist: 8 + 4 * Math.sqrt(2) });

  let distance = 0;
  let step = 0.05;
  let p = 0;

  scene.onBeforeRenderObservable.add(() => {
    sphere.movePOV(0, 0, step);
    distance += step;

    if (distance > track[p].dist) {
      sphere.rotate(Axis.Y, track[p].turn, Space.LOCAL);
      p += 1;
      p %= track.length;
      if (p === 0) {
        distance = 0;
        sphere.position = new Vector3(2, 0, 2);
        sphere.rotation = Vector3.Zero();
      }
    }

  })


};


const MovePovScene = () => {

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

export default MovePovScene;
