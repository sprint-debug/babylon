import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  Vector3,
  HemisphericLight,
  Scene,
  ArcRotateCamera,
  SceneLoader
} from '@babylonjs/core';
import earcut from 'earcut';
import { handleSceneSwitch } from '@/pages/Tutorial/subscribeMsgEvt';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';


const onSceneReady = (scene: Scene) => {
  console.log('MeshParent')
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

  const camera = new ArcRotateCamera("camera", -Math.PI / 2.2, Math.PI / 2.5, 2, new Vector3(0, 0, 0));
  camera.attachControl(canvas, true);
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  light.intensity = 0.8;


  SceneLoader.ImportMeshAsync('', '/src/assets/ex_tutorial/', 'car.babylon').then(() => {
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

  // buildCar(scene);


  /** scene 전환 시, inspector 종료작업 */
  handleSceneSwitch(scene, { enableScopeInfo: true });

  return scene;
}

/** car.babylon 파일에서 수행하는 내용 */
// const buildCar = (scene: Scene) => {
//   //base
//   const outline = [
//     new Vector3(-0.3, 0, -0.1),
//     new Vector3(0.2, 0, -0.1)
//   ]
//   // curved front
//   for (let i = 0; i < 20; i++) {
//     outline.push(new Vector3(0.2 * Math.cos(i * Math.PI / 40), 0, 0.2 * Math.sin(i * Math.PI / 40) - 0.1));
//   }

//   // top
//   outline.push(new Vector3(0, 0, 0.1));
//   outline.push(new Vector3(-0.3, 0, 0.1));

//   const faceUV = [];
//   faceUV[0] = new Vector4(0, 0.5, 0.38, 1);
//   faceUV[1] = new Vector4(0, 0, 1, 0.5);
//   faceUV[2] = new Vector4(0.38, 1, 0, 0.5);
//   const carMat = new StandardMaterial('carMat');
//   carMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/car.png');

//   //back formed automatically
//   const car = MeshBuilder.ExtrudePolygon('car', { shape: outline, depth: 0.2, faceUV: faceUV, wrap: true }, scene, earcut);
//   car.material = carMat;

//   const wheelUV = [];
//   wheelUV[0] = new Vector4(0, 0, 1, 1);
//   wheelUV[1] = new Vector4(0, 0.5, 0, 0.5);
//   wheelUV[2] = new Vector4(0, 0, 1, 1);

//   const wheelMat = new StandardMaterial('wheelMat');
//   wheelMat.diffuseTexture = new Texture('https://assets.babylonjs.com/environments/wheel.png');

//   const wheelRB = MeshBuilder.CreateCylinder('wheelRB', { diameter: 0.125, height: 0.05, faceUV: wheelUV });
//   wheelRB.material = wheelMat;
//   wheelRB.parent = car;
//   wheelRB.position = new Vector3(-0.2, 0.035, -0.1);

//   const wheelRF = wheelRB.clone('wheelRF');
//   wheelRF.position.x = 0.1;
//   const wheelLB = wheelRB.clone('wheelLB');
//   wheelLB.position.y = -0.2 - 0.035;
//   // const wheelLF = wheelRB.clone('wheelLF');
//   // wheelLF.position.x = 0.1;
//   // wheelLF.position.y = -0.2 - 0.035;
//   const wheelLF = wheelRF.clone('wheelLF');
//   wheelLF.position.y = -0.2 - 0.035;

//   // Animate wheels
//   const animWheel = new Animation('wheelAnimation', 'rotation.y', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

//   const wheelKeys = [];

//   // At the animation key 0, the value of roation.y is 0
//   wheelKeys.push({
//     frame: 0,
//     value: 0
//   });

//   // At the animation key 30, (after 1 sec since animation fps = 30) the value of rotation.y is 2PI for a complete rotation
//   wheelKeys.push({
//     frame: 30,
//     value: 2 * Math.PI
//   })

//   // Set the keys
//   animWheel.setKeys(wheelKeys);

//   // Link this animation th a wheel
//   wheelRB.animations = [];
//   wheelRB.animations.push(animWheel);
//   wheelRF.animations.push(animWheel);
//   wheelLB.animations.push(animWheel);
//   wheelLF.animations.push(animWheel);

//   scene.beginAnimation(wheelRB, 0, 30, true);
//   scene.beginAnimation(wheelRF, 0, 30, true);
//   scene.beginAnimation(wheelLB, 0, 30, true);
//   scene.beginAnimation(wheelLF, 0, 30, true);

// }


const Car = () => {
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

export default Car;