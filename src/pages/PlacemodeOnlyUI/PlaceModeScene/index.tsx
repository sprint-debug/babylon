import { useEffect } from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  Scene,
  FreeCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  ActionManager,
  ExecuteCodeAction,
} from '@babylonjs/core';
import { messageClient } from '@/clients/events';
import style from "@/pages/Placemode/style.module.scss";

let box: any;

// const resizeCanvas = () => {
//   const canvas = document.querySelector('canvas') as HTMLCanvasElement;
//   // canvas!.width = window.innerWidth;
//   // canvas!.height = window.innerHeight;
// }

const onSceneReady = (scene: Scene) => {
  const canvas = scene.getEngine().getRenderingCanvas();
  // canvas!.height = window.innerHeight;
  // canvas!.width = window.innerWidth;
  // This creates and positions a free camera (non-mesh)
  const camera = new FreeCamera('camera1', new Vector3(0, 5, -10), scene);


  // This targets the camera to scene origin
  camera.setTarget(Vector3.Zero());



  // window.addEventListener('resize', resizeCanvas);
  // resizeCanvas();


  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox('box', { size: 2 }, scene);

  // Move the box upward 1/2 its height
  box.position.y = 1;

  box.actionManager = new ActionManager(scene);

  // event handler
  box.actionManager.registerAction(
    new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
      messageClient.postMessage('alert', { text: 'hi' });
    }),
  );

  messageClient.addListener('box', () => {
    box.position.y = 5;
  });

  // // Our built-in 'ground' shape.
  // MeshBuilder.CreateGround('ground', { width: 6, height: 6 }, scene);

  // var sphere = MeshBuilder.CreateSphere("sphere1", 16, 2);
  // sphere.rotation.x = Math.PI / 2
  // sphere.position.y = 1;
  // var pointerDragBehavior = new PointerDragBehavior({ dragAxis: new Vector3(1, 0, 0) });
  // // Use drag plane in world space
  // pointerDragBehavior.useObjectOrientationForDragging = false;

  // // Listen to drag events
  // pointerDragBehavior.onDragStartObservable.add((event) => {
  //   console.log("dragStart");
  //   console.log(event);
  // })
  // pointerDragBehavior.onDragObservable.add((event) => {
  //   console.log("drag");
  //   console.log(event);
  // })
  // pointerDragBehavior.onDragEndObservable.add((event) => {
  //   console.log("dragEnd");
  //   console.log(event);
  // })

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


const PlaceModeScene = () => {
  useEffect(() => {
    console.log('scene')
    // return () => window.removeEventListener('resize',)
  }, [])
  
  return (
    <SceneComponent
      antialias
      onSceneReady={onSceneReady}
      onRender={onRender}
      id="my-canvas"
      className={style.canvasElement}
    />
  );
};

export default PlaceModeScene;
