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
  StandardMaterial,
  Color3,
  Mesh,
} from '@babylonjs/core';
import { AdvancedDynamicTexture, Control, TextBlock } from '@babylonjs/gui';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';
import { CombatManager, Soldier, prepareCombatants } from './CombatManager';
import { CombatantObserver, CombatLogObserver } from './CombatManagerObserverType';
import style from "@/pages/Placemode/style.module.scss";

let box: any;

const onSceneReady = (scene: Scene) => {
  const canvas = scene.getEngine().getRenderingCanvas();
  // canvas!.height = window.innerHeight;
  // canvas!.width = window.innerWidth;
  const camera = new FreeCamera('camera1', new Vector3(0, 10, 0), scene);
  camera.setTarget(new Vector3(0, 0, 0));  // This targets the camera to scene origin
  // camera.setTarget(Vector3.Zero());  // This targets the camera to scene origin
  camera.attachControl(canvas, true); // This attaches the camera to the canvas 

  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene); // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  light.intensity = 0.5; // Default intensity is 1. Let's dim the light a small amount

  box = MeshBuilder.CreateBox('box', { size: 2 }, scene);  // Our built-in 'box' shape.
  box.position.y = 1;  // Move the box upward 1/2 its height
  box.actionManager = new ActionManager(scene);
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

    const unitGp1 = prepareCombatants(3, 'A', 10, 1);
    const unitGp2 = prepareCombatants(3, 'B', 11, 1);
    const test = new CombatManager(unitGp1, unitGp2);
    test.resolveCombat();


    // const alice = new CombatantObserver('Alice', 100, 25);
    // const bob = new CombatantObserver('Bob', 120, 20);
    // const combatLog = new CombatLogObserver();
    // alice.addObserver(combatLog);
    // bob.addObserver(combatLog);
    // alice.attack(bob);
    // bob.attack(alice);

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