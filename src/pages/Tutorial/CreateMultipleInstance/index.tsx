import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  Vector3,
  HemisphericLight,
  Scene,
  ArcRotateCamera,
  SceneLoader
} from '@babylonjs/core';
// required glb imports
import "@babylonjs/loaders/glTF";
import { handleSceneSwitch } from '@/pages/Tutorial/subscribeMsgEvt';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';

const onSceneReady = (scene: Scene) => {
  logger.log('CreateMultipleInstance');
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
    // scene.debugLayer.hide();
  })

  const canvas = scene.getEngine().getRenderingCanvas();
  canvas!.height = 800;
  canvas!.width = 1000;

  /** Set Camera and Light  */
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0));
  camera.attachControl(canvas, true);

  const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

  /** 아래에서 불러오는 파일이 주석처리 된 파일내용을 export 한 것 */
  SceneLoader.ImportMeshAsync("", "/src/assets/ex_tutorial/", "town.glb");


  /** scene 전환 시, inspector 종료작업 */
  handleSceneSwitch(scene, { enableScopeInfo: true });

  return scene;
};
// const onSceneReady = (scene: Scene) => {
//   logger.log('CreateMultipleInstance')
//   // debug 용
//   void Promise.all([
//     import("@babylonjs/core/Debug/debugLayer"),
//     import("@babylonjs/inspector"),
//   ]).then((_values) => {
//     scene.debugLayer.show({
//       handleResize: true,
//       overlay: false,
//       // overlay: true, // inspector 대비 비율 화면
//       globalRoot: document.getElementById("#root") || undefined,
//     })
//   })

//   const canvas = scene.getEngine().getRenderingCanvas();
//   canvas!.height = 800;
//   canvas!.width = 1000;

//   /** Set Camera and Light  */
//   const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0));
//   camera.attachControl(canvas, true);

//   const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

//   buildTown();

//   return scene;
// };

// /** Build Functions */
// const buildTown = () => {
//   const ground = buildGround();

//   const detached_house = buildHouse(1);
//   detached_house!.rotation.y = -Math.PI / 16;
//   detached_house!.position.x = -6.8;
//   detached_house!.position.z = 2.5;


//   const semi_house = buildHouse(2);
//   semi_house!.rotation.y = -Math.PI / 16
//   semi_house!.position.x = -4.5
//   semi_house!.position.z = 3

//   const places = [];
//   places.push([1, -Math.PI / 16, -6, 8, 2.5]);
//   places.push([2, -Math.PI / 16, -4.5, 3 ]);
//   places.push([2, -Math.PI / 16, -1.5, 4 ]);
//   places.push([2, -Math.PI / 3, 1.5, 6 ]);
//   places.push([2, 15 * Math.PI / 16, -6.4, -1.5 ]);
//   places.push([1, 15 * Math.PI / 16, -4.1, -1 ]);
//   places.push([2, 15 * Math.PI / 16, -2.1, -0.5 ]);
//   places.push([1, 5 * Math.PI / 4, 0, -1 ]);
//   places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3 ]);
//   places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5 ]);
//   places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7 ]);
//   places.push([2, Math.PI / 1.9, 4.75, -1 ]);
//   places.push([1, Math.PI / 1.95, 4.5, -3 ]);
//   places.push([2, Math.PI / 1.9, 4.75, -5 ]);
//   places.push([1, Math.PI / 1.9, 4.75, -7 ]);
//   places.push([2, -Math.PI / 3, 5.25, 2 ]);
//   places.push([1, -Math.PI / 3, 6, 4 ]);

//   const houses = [];
//   for (let i=0; i < places.length; i++) {
//     if(places[i][0] === 1) houses[i] = detached_house?.createInstance("house" + i);
//     else {houses[i] = semi_house?.createInstance("house" + i)}
//     houses[i]!.rotation.y = places[i][1];
//     houses[i]!.position.x = places[i][2];
//     houses[i]!.position.z = places[i][3];
//   }

// }

// const buildGround = () => {
//   const groundMat = new StandardMaterial("groundMat");
//   groundMat.diffuseColor = new Color3(0, 1, 0);
//   const ground = MeshBuilder.CreateGround("ground", { width: 20, height: 20 });
//   ground.material = groundMat;
// }

// const buildHouse = (width: number) => {
//   const box = buildBox(width);
//   const roof = buildRoof(width);

//   return Mesh.MergeMeshes([box, roof], true, false, undefined, false, true);
// }

// const buildBox = (width: number) => {
//   const boxMat = new StandardMaterial("boxMat");
//   if (width === 2) {
//     boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/semihouse.png");
//   } else {
//     boxMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/cubehouse.png");
//   }

//   const faceUV = [];
//   if (width === 2) {
//     faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0);
//     faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
//     faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
//     faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
//   } else {
//     faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
//     faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
//     faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
//     faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
//   }

//   const box = MeshBuilder.CreateBox("box", { width: width, faceUV: faceUV, wrap: true });
//   box.material = boxMat;
//   box.position.y = 0.5;

//   return box;
// }

// const buildRoof = (width: number) => {
//   const roofMat = new StandardMaterial("roofMat");
//   roofMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/roof.jpg");
//   const roof = MeshBuilder.CreateCylinder("roof", { diameter: 1.3, height: 1.2, tessellation: 3 });
//   roof.material = roofMat;
//   roof.scaling.x = 0.75;
//   roof.scaling.y = width;
//   roof.rotation.z = Math.PI / 2;
//   roof.position.y = 1.22;

//   return roof;
// }


const CreateMultiInstanceScene = () => {
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

export default CreateMultiInstanceScene;
