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
  SpotLight
} from '@babylonjs/core';
import { AdvancedDynamicTexture, Control, Slider, StackPanel, TextBlock } from '@babylonjs/gui';
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

  const light = new HemisphericLight("light", new Vector3(2, 1, 0), scene);
  light.intensity = 0.1;

  // skybox
  const skybox = MeshBuilder.CreateBox('skyBox', { size: 150 }, scene);
  const skyboxMat = new StandardMaterial('skyBoxMat', scene);
  skyboxMat.backFaceCulling = false;
  skyboxMat.reflectionTexture = new CubeTexture('/src/assets/ex_tutorial/skyboxCube/skybox', scene);
  skyboxMat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMat.diffuseColor = new Color3(0, 0, 0);
  skyboxMat.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMat;

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

  /** sprite section */
  const spriteManagerTrees = new SpriteManager('treesManager', '/src/assets/ex_tutorial/palmtree.png', 2000, { width: 512, height: 1024 }, scene);
  for (let i = 0; i < 500; i++) {
    const tree = new Sprite('tree', spriteManagerTrees);
    tree.position = new Vector3(Math.random() * (-30), 0.5, Math.random() * (20 + 8));
  }
  for (let i = 0; i < 500; i++) {
    const tree = new Sprite('tree', spriteManagerTrees);
    tree.position = new Vector3(Math.random() * (25) + 7, 0.5, Math.random() * -35 + 8);
  }

  const spriteManagerUFO = new SpriteManager('UFOManager', '/src/assets/ex_tutorial/ufo.png', 1, { width: 128, height: 76 }, scene);
  const ufo = new Sprite('ufo', spriteManagerUFO);
  ufo.playAnimation(0, 16, true, 125);
  ufo.position.y = 5;
  ufo.position.z = 0;
  ufo.width = 2;
  ufo.height = 1;

  // let switched = false;
  // const pointerDown = (mesh) => {
  //   logger.log('pointerDOWN ', mesh)
  //   // if (mesh === fountain) {
  //   //   switched = !switched;
  //   //   if (switched) particleSystem.start();
  //   //   else particleSystem.stop();
  //   }
  // }

  // scene.onPointerObservable.add((pointerInfo) => {
  //   switch (pointerInfo.type) {
  //     case PointerEventTypes.POINTERDOWN:
  //       if (pointerInfo.pickInfo.hit) {
  //         pointerDown(pointerInfo.pickInfo?.pickedMesh);
  //       }
  //       break;
  //   }
  // });

  SceneLoader.ImportMeshAsync('', '/src/assets/ex_tutorial/', 'lamp.babylon').then(() => {
    const lampLight = new SpotLight('lampLight', Vector3.Zero(), new Vector3(0, -1, 0), 0.8 * Math.PI, 2.11, scene);
    lampLight.diffuse = Color3.Yellow();
    lampLight.parent = scene.getMeshByName('bulb');
    const lamp = scene.getMeshByName('lamp');
    lamp!.position = new Vector3(2, 0, 2);
    lamp!.rotation = Vector3.Zero();
    lamp!.rotation.y = -Math.PI / 4;
    lamp!.scaling = new Vector3(0.15, 0.15, 0.15);

    const lamp3 = lamp.clone('lamp3');
    lamp3!.position.z = -8;


    const lamp1 = lamp?.clone('lamp1');
    lamp1!.position = new Vector3(-8, -Math.PI / 2, 0.8);
    lamp2 = lamp1.clone("lamp2");
    lamp2.position.x = -2.7;
    lamp2.position.z = 0.8;
    lamp2.rotation.y = -Math.PI / 2;

  });

  // GUI
  const adt = AdvancedDynamicTexture.CreateFullscreenUI('UI');
  const panel = new StackPanel();
  panel.width = '220px';
  panel.top = '-25px';
  panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
  panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  adt.addControl(panel);

  const header = new TextBlock();
  header.text = 'Night to Day';
  header.height = '30px';
  header.color = 'white';
  panel.addControl(header);
  const slider = new Slider();
  slider.minimum = 0;
  slider.maximum = 1;
  slider.borderColor = 'black';
  slider.color = 'gray';
  slider.background = 'white';
  slider.value = 1;
  slider.height = '20px';
  slider.width = '200px';
  slider.onValueChangedObservable.add((v) => {
    if (light) {
      light.intensity = v;
    }
  });
  panel.addControl(slider);


  /** scene 전환 시, inspector 종료작업 */
  handleSceneSwitch(scene, { enableScopeInfo: true });

};


const StreetLightScene = () => {

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

export default StreetLightScene;
