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

  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 50, new Vector3(0, 2, 0), scene);
  camera.attachControl(canvas, true)

  const light = new HemisphericLight("light", new Vector3(2, 1, 0), scene);

  /** largeGround Layer */
  const largeGroundMat = new StandardMaterial('largeGroundMat');
  largeGroundMat.diffuseTexture = new Texture('/src/assets/ex_tutorial/valleygrass.png');
  const largeGround = MeshBuilder.CreateGroundFromHeightMap(
    'largeGround',
    '/src/assets/ex_tutorial/villageheightmap.png',
    { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 }
  );
  largeGround.material = largeGroundMat;

  /** villageGround Layer */
  const groundMat = new StandardMaterial('groundMat');
  groundMat.diffuseTexture = new Texture('/src/assets/ex_tutorial/villagegreen.png');
  groundMat.diffuseTexture.hasAlpha = true;
  const ground = MeshBuilder.CreateGround('ground', { width: 24, height: 24 });
  ground.material = groundMat;
  largeGround.position.y = -0.01;

  SceneLoader.ImportMeshAsync("", "/src/assets/ex_tutorial/", "village.glb").then(() => {
    const ground = scene.getMeshByName('villageGround');
    ground!.material = largeGroundMat;
    ground!.position.y = -0.01;
  });

  SceneLoader.ImportMeshAsync('', '/src/assets/ex_tutorial/', 'car.babylon').then(() => {
    const car = scene.getMeshByName('car');
    car!.rotation = new Vector3(-Math.PI / 2, 0, Math.PI / 2);
    car!.position = new Vector3(3, 0.16, 8);
    const animCar = new Animation('carAnimation', 'position.z', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const carKeys = [];
    carKeys.push({ frame: 0, value: 10 });
    carKeys.push({ frame: 200, value: -15 });
    animCar.setKeys(carKeys);
    car!.animations = []
    car!.animations.push(animCar);

    scene.beginAnimation(car, 0, 200, true);

    const wheelRF = scene.getMeshByName('wheelRF');
    const wheelRB = scene.getMeshByName('wheelRB');
    const wheelLF = scene.getMeshByName('wheelLF');
    const wheelLB = scene.getMeshByName('wheelLB');
    console.log(wheelRB?.animations);
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
  });


};


const HeightMapScene = () => {

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

export default HeightMapScene;
