import React from 'react';
import SceneComponent from 'babylonjs-hook';
// import SceneComponent from '@/clients/sceneComponentTemplate';
import {
  Vector3,
  Vector4,
  HemisphericLight,
  MeshBuilder,
  Scene,
  ArcRotateCamera,
  Sound,
  StandardMaterial,
  Color3,
  Texture,
} from '@babylonjs/core';
import { messageClient } from '@/clients/events';

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

  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 2, 0), scene);
  camera.attachControl(canvas, true)

  const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 });
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);


  // TODO: sound 에셋 적용
  // Load the sound, give it time to load and play it every 3 seconds
  const bounce = new Sound("bounce", "sounds/bounce.wav", scene);
  setInterval(() => bounce.play(), 3000);

  const roof = MeshBuilder.CreateCylinder("roof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.scaling.x = 0.75;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;

  const roof1 = MeshBuilder.CreateCylinder("roof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof1.scaling.x = 0.75;
  roof1.scaling.y = 2;
  roof1.rotation.z = Math.PI / 2;
  roof1.position.y = 1.22;
  roof1.position.x = 2;

  const groundMat = new StandardMaterial("groundMat");
  groundMat.diffuseColor = new Color3(0, 0.5, 0);
  ground.material = groundMat;

  const roofMat = new StandardMaterial("roofMat");
  roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
  const boxMat = new StandardMaterial("boxMat");
  boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png");
  // boxMat.diffuseTexture = new Texture("https://www.babylonjs-playground.com/textures/floor.png");
  const boxMat1 = new StandardMaterial("boxMat1");
  boxMat1.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/semihouse.png");




  //options parameter to set different images on eah side
  const faceUVBox = [];
  faceUVBox[0] = new Vector4(0.5, 0, 0.75, 1.0);
  faceUVBox[1] = new Vector4(0, 0, 0.25, 1.0);
  faceUVBox[2] = new Vector4(0.25, 0, 0.5, 1.0);
  faceUVBox[3] = new Vector4(0.75, 0, 1.0, 1.0);


  const faceUVBox1 = [];
  faceUVBox1[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
  faceUVBox1[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
  faceUVBox1[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
  faceUVBox1[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side

  const box = MeshBuilder.CreateBox("box", { faceUV: faceUVBox, wrap: true }, scene);
  box.position.y = 0.5;

  const box1 = MeshBuilder.CreateBox("box", { width: 2, faceUV: faceUVBox1, wrap: true });
  box1.position = new Vector3(2, 0.5, 0);

  // const box1 = MeshBuilder.CreateBox("box", { width: 2, height: 1.5, depth: 3 }, scene);
  // box1.scaling = new Vector3(2, 1.5, 3);
  // box1.position = new Vector3(-2, 4.2, 0.1);
  // // box1.rotation.y = Math.PI / 5;
  // box.rotation.y = Tools.ToRadians(-90);

  roof.material = roofMat;
  roof1.material = roofMat;
  box.material = boxMat;
  box1.material = boxMat1;


  /** Will run on every frame render.  We are spinning the box on y-axis.*/
  // const onRender = (scene: Scene) => {
  //   if (box !== undefined) {
  //     const deltaTimeInMillis = scene.getEngine().getDeltaTime();

  //     const rpm = 10;
  //     box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  //   }
  // };
  messageClient.addListener('exitInspector', (payload: any) => {
    // alert(payload);
    console.log('msg Client tuto ', document.getElementById('scene-explorer-host'));
    scene.debugLayer.hide();
  });

};


const PlayScene = () => {

  React.useEffect(() => {

    return () => {
      // todo 이벤트 리스너 제거필요
      console.log('cleanup tuto scene')
      messageClient.removeListener('exitInspector');
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

export default PlayScene;
