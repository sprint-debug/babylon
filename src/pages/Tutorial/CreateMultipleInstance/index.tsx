import SceneComponent, { useScene } from 'babylonjs-hook';
import {
  Mesh,
  Vector3,
  Vector4,
  HemisphericLight,
  MeshBuilder,
  Scene,
  ArcRotateCamera,
  StandardMaterial,
  Color3,
  Texture,
} from '@babylonjs/core';

const onSceneReady = (scene: Scene) => {
  console.log('CreateMultipleInstance')
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

  /** Set Camera and Light  */
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0));
  camera.attachControl(canvas, true);

  const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

  /** Set Building and Ground  */
  const ground = buildGround();
  const house = buildHouse(2);

  const detached_house = buildHouse(1);
  detached_house!.rotation.y = -Math.PI / 16;
  detached_house!.position.x = -6.8;
  detached_house!.position.z = 2.5;


  const semi_house = buildHouse(2);
  semi_house!.rotation.y = -Math.PI / 16
  semi_house!.position.x = -4.5
  semi_house!.position.z = 3

  const places = [];
  places.push([1, -Math.PI / 16, -6, 8, 2.5]);


  /** Will run on every frame render.  We are spinning the box on y-axis.*/
  // const onRender = (scene: Scene) => {
  //   if (box !== undefined) {
  //     const deltaTimeInMillis = scene.getEngine().getDeltaTime();

  //     const rpm = 10;
  //     box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  //   }
  // };
  return scene;
};

/** Build Functions */
const buildGround = () => {
  const groundMat = new StandardMaterial("groundMat");
  groundMat.diffuseColor = new Color3(0, 1, 0);
  const ground = MeshBuilder.CreateGround("ground", { width: 10, height: 10 });
  ground.material = groundMat;
}

const buildHouse = (width: number) => {
  const box = buildBox(width);
  const roof = buildRoof(width);

  return Mesh.MergeMeshes([box, roof], true, false, undefined, false, true);
}

const buildBox = (width: number) => {
  const boxMat = new StandardMaterial("boxMat");
  if (width === 2) {
    boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/semihouse.png");
  } else {
    boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png");
  }

  const faceUV = [];
  if (width === 2) {
    faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0);
    faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
  } else {
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
  }

  const box = MeshBuilder.CreateBox("box", { width: width, faceUV: faceUV, wrap: true });
  box.material = boxMat;
  box.position.y = 0.5;

  return box;
}

const buildRoof = (width: number) => {
  const roofMat = new StandardMaterial("roofMat");
  roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg");
  const roof = MeshBuilder.CreateCylinder("roof", { diameter: 1.3, height: 1.2, tessellation: 3 });
  roof.material = roofMat;
  roof.scaling.x = 0.75;
  roof.scaling.y = width;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;

  return roof;
}


const CreateMultiInstanceScene = () => {
  return (
    <SceneComponent
      antialias
      onSceneReady={onSceneReady}
      // onRender={onRender}
      id="my-canvas"
    />
  );
};

export default CreateMultiInstanceScene;
