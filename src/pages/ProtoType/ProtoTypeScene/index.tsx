import SceneComponent from 'babylonjs-hook';
import {
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ActionManager,
  Scene,
  SceneLoader,
  ExecuteCodeAction,
} from '@babylonjs/core';
import { messageClient } from '@/clients/events';

let box: any;

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

  // This creates and positions a free camera (non-mesh)
  const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);

  SceneLoader.ImportMesh('', '/src/assets/_sample/BarramundiFish/glTF/BarramundiFish.gltf', '', scene, function (meshes) {
    // Callback function executed when the model is loaded
    console.log('GLTF file loaded successfully ', meshes);
    meshes[0].position = new Vector3(0, 0, 2);
    camera.target = meshes[0].position;
  }, undefined, undefined, '.gltf');

  // SceneLoader.LoadAssetContainerAsync("", '/src/assets/_sample/BarramundiFish/glTF/BarramundiFish.gltf', scene, function (meshes) {
  //   camera.target = meshes[0].position;
  // }, ".gltf")



  // This targets the camera to scene origin
  // camera.setTarget(Vector3.Zero());


  const canvas = scene.getEngine().getRenderingCanvas();
  canvas!.height = 450;
  canvas!.width = 600;

  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // // Our built-in 'box' shape.
  // box = MeshBuilder.CreateBox('box', { size: 0 }, scene);

  // // Move the box upward 1/2 its height
  // box.position.y = 1;

  // // event handler
  // box.actionManager = new ActionManager(scene);
  // box.actionManager.registerAction(
  //   new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
  //     messageClient.postMessage('alert', { text: 'hi' });
  //   }),
  // );

  // messageClient.addListener('box', () => {
  //   box.position.y = 5;
  // });

  // Our built-in 'ground' shape.
  MeshBuilder.CreateGround('ground', { width: 7, height: 7 }, scene);

};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene) => {
  if (box !== undefined) {
    const deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

const ProtoTypeScene = () => {
  return (
    <SceneComponent
      antialias
      onSceneReady={onSceneReady}
      onRender={onRender}
      id="my-canvas"
    />
  );
};

export default ProtoTypeScene;
