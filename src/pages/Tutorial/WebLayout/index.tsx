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
  SceneLoader
} from '@babylonjs/core';
import './style.scss';

// required glb imports
import "@babylonjs/loaders/glTF";

const onSceneReady = (scene: Scene) => {
  console.log('WebAppLayout')
  // debug 용
  // void Promise.all([
  //   import("@babylonjs/core/Debug/debugLayer"),
  //   import("@babylonjs/inspector"),
  // ]).then((_values) => {
  //   scene.debugLayer.show({
  //     handleResize: true,
  //     overlay: false,
  //     // overlay: true, // inspector 대비 비율 화면
  //     globalRoot: document.getElementById("#root") || undefined,
  //   })
  // })

  const canvas = scene.getEngine().getRenderingCanvas();
  canvas!.height = 800;
  canvas!.width = 1000;

  /** Set Camera and Light  */
  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 0, 0));
  camera.attachControl(canvas, true);

  const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);


  return scene;
};

const WebLayout = () => {
  return (
    <>
    <SceneComponent
      antialias
      onSceneReady={onSceneReady}
      // onRender={onRender}
      id="my-canvas"
      className="game-view"
      />
      <div className="ui-panel">
        test panel area
      </div>
      </>
  );
};

export default WebLayout;
