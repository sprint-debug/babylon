import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  Scene,
  SceneLoader,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  MeshBuilder,
  FollowCamera,
  ArcFollowCamera,
  FreeCamera,
  ActionManager,
  ExecuteCodeAction,
  Tools,
  UniversalCamera,
  Camera,
  Viewport,
  StandardMaterial,
  Color3,
  Mesh,
} from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import { LoadInspectorControl } from '@/clients/util/LoadInspectorControl';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';
import { CustomInputController } from '@/clients/util/CustomInputController';
import { IsometricCamera } from '@/clients/util/IsometricCamera';
import { InputTypeEnum } from '@/clients/util/CustomInputControllerType';
import { RTSCameraKeyboardController } from '@/clients/util/RTSCameraKeyboardController';
import { RTSCameraMouseController } from '@/clients/util/RTSCameraMouseController';
import { RTSCameraWheelController } from '@/clients/util/RTSCameraWheelController';



// import * as test from "recast-detour";
import Recast from 'recast-detour'
// import Recast from "@/clients/externals/recast";
import { RecastJSPlugin } from '@babylonjs/core/Navigation/Plugins/recastJSPlugin';


const onSceneReady = (scene: Scene) => {

  // const navPlugin = new RecastJSPlugin(Recast)
  // const loadRecast = async () => {
  //   const recast = await Recast();
  //   return recast;
  // }
  // const recast = loadRecast();


  async function buildNav() {
    console.log('buildNav');
    const recast = await Recast();
    const navigationPlugin: RecastJSPlugin = new RecastJSPlugin(recast);
    console.log('recast loaded');
    // const navPlugin = new RecastJSPlugin();
    console.log('nav plugin loaded ');
    return navPlugin;
  }
  const navPlugin = buildNav();
  logger.log('nav ')


  // debug 용
  const canvas = scene.getEngine().getRenderingCanvas();
  canvas!.height = 800;
  canvas!.width = 1000;

  /** inspector 활성화 및 전환 시 통신이벤트 */
  LoadInspectorControl(scene, canvas);

  const light = new HemisphericLight("light", new Vector3(0, 50, 0), scene);
  light.intensity = 0.6;


  // This creates and positions a free camera (non-mesh)
  let camera = new UniversalCamera("camera1", new Vector3(-14, 20, 0), scene);
  // This targets the camera to scene origin
  camera.setTarget(new Vector3(0, 0, 0));
  camera.mode = Camera.PERSPECTIVE_CAMERA;
  camera.speed = 0.5;
  camera.fov = 1.0;
  camera.metadata = {
    // mouse & keyboard properties
    // Set by camera inputs. Defines, which input moves the camera (mouse or keys)
    movedBy: null,
    // target position, the camera should be moved to
    targetPosition: camera.position.clone(),
    // radius, that is used to rotate camera
    // initial value dependent from camera position and camera target
    radius: new Vector3(camera.position.x, 0, camera.position.z).subtract(new Vector3(camera.target.x, 0, camera.target.z)).length(),
    // helper variable, to rotate camera
    rotation: Tools.ToRadians(180) + camera.rotation.y,
    // speed for rotation
    rotationSpeed: 0.04,
    // boundaries for x and z
    minX: -30,
    maxX: 30,
    minZ: -30,
    maxZ: 30,
    // mousewheel properties
    // similar to targetPosition, targetZoom contains the target value for the zoom
    targetZoom: camera.fov,
    // zoom boundaries
    maxZoom: 1.4,
    minZoom: 0.5,
    // speed for zoom
    zoom: 0.005,
    // zoom distance per mouse wheel interaction
    zoomSteps: 0.2,
  }
  camera.inputs.clear();
  camera.attachControl(canvas, true);

  camera.inputs.add(new RTSCameraKeyboardController());
  camera.inputs.add(new RTSCameraMouseController());
  // camera.inputs.add(new RTSCameraWheelController());





  let randomNumber = function (min: number, max: number) {
    if (min == max) {
      return (min);
    }
    let random = Math.random();
    return ((random * (max - min)) + min);
  };

  let box = MeshBuilder.CreateBox("crate", { size: 2 }, scene);
  box.material = new StandardMaterial("Mat", scene);
  box.checkCollisions = true;

  let boxNb = 6;
  let theta = 0;
  let radius = 6;
  box.position = new Vector3((radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.cos(theta + randomNumber(-0.1 * theta, 0.1 * theta)), 1, (radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.sin(theta + randomNumber(-0.1 * theta, 0.1 * theta)));

  let boxes = [box];
  for (let i = 1; i < boxNb; i++) {
    theta += 2 * Math.PI / boxNb;
    let newBox = box.clone("box" + i);
    boxes.push(newBox);
    newBox.position = new Vector3((radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.cos(theta + randomNumber(-0.1 * theta, 0.1 * theta)), 1, (radius + randomNumber(-0.5 * radius, 0.5 * radius)) * Math.sin(theta + randomNumber(-0.1 * theta, 0.1 * theta)));
  }

  /** NavMesh Test */
  // const recast = loadRecast();

  // console.log('RECAST ', recast);
  // const navPlugin = new RecastJSPlugin(Recast)


  // navPlugin.setWorkerURL('workers/navMeshWorker.js');


  // const createStaticMesh = (scene: Scene) => {

  //   // Materials
  //   let mat1 = new StandardMaterial('mat1', scene);
  //   mat1.diffuseColor = new Color3(1, 1, 1);

  //   let sphere = MeshBuilder.CreateSphere("sphere1", { diameter: 2, segments: 16 }, scene);
  //   sphere.material = mat1;
  //   sphere.position.y = 1;

  //   let cube = MeshBuilder.CreateBox("cube", { size: 1, height: 3 }, scene);
  //   cube.position = new Vector3(1, 1.5, 0);
  //   //cube.material = mat2;

  //   let mesh = Mesh.MergeMeshes([sphere, cube]);
  //   return mesh;
  // }

  // let staticMesh = createStaticMesh(scene);
  // let navmeshParameters = {
  //   cs: 0.2,
  //   ch: 0.2,
  //   walkableSlopeAngle: 90,
  //   walkableHeight: 1.0,
  //   walkableClimb: 1,
  //   walkableRadius: 1,
  //   maxEdgeLen: 12.,
  //   maxSimplificationError: 1.3,
  //   minRegionArea: 8,
  //   mergeRegionArea: 20,
  //   maxVertsPerPoly: 6,
  //   detailSampleDist: 6,
  //   detailSampleMaxError: 1,
  // };



  // scene.collisionsEnabled = true;
  // camera.checkCollisions = true;
  // camera.ellipsoid = new Vector3(0.5, 1, 0.5);
  // camera.ellipsoidOffset = new Vector3(0, 1, 0);

  // //Create Visible Ellipsoid around camera
  // let a = 0.5;
  // let b = 1;
  // let points = [];
  // for (let theta = -Math.PI / 2; theta < Math.PI / 2; theta += Math.PI / 36) {
  //   points.push(new Vector3(0, b * Math.sin(theta), a * Math.cos(theta)));
  // }

  // let ellipse = [];
  // ellipse[0] = MeshBuilder.CreateLines("e", { points: points }, scene);
  // ellipse[0].color = Color3.Red();
  // ellipse[0].parent = camera;
  // ellipse[0].rotation.y = 5 * Math.PI / 16;
  // for (let i = 1; i < 23; i++) {
  //   ellipse[i] = ellipse[0].clone("el" + i);
  //   ellipse[i].parent = camera;
  //   ellipse[i].rotation.y = 5 * Math.PI / 16 + i * Math.PI / 16;
  // }

  const basicGround = MeshBuilder.CreateGround('basicGround', { width: 200, height: 200 });
  basicGround.rotation.y = Math.PI / 4;
  basicGround.material = new GridMaterial("basicGroundMat", scene);

  basicGround.checkCollisions = true;


  /** 키보드 입력 시 canvas 에 포커싱하여 불필요한 브라우져 액션 차단 */
  window.addEventListener("keydown", function (event) {
    canvas!.focus();
  })

};

// scene.registerBeforeRender(function () {
//   cylinder.position.x = Math.sin(alpha) * 10
//   alpha += 0.01;
// })



const onRender = () => {
  logger.log('t')
}

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
