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
import style from "../style.module.scss";

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

  // box = MeshBuilder.CreateBox('box', { size: 2 }, scene);  // Our built-in 'box' shape.
  // box.position.y = 1;  // Move the box upward 1/2 its height
  // box.actionManager = new ActionManager(scene);
  // box.actionManager.registerAction(
  //   new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
  //     messageClient.postMessage('alert', { text: 'hi' });
  //   }),
  // );

  messageClient.addListener('box', () => {
    box.position.y = 5;
  });

  let ground = MeshBuilder.CreateGround('combatGround', { width: 10, height: 10 }, scene);

  let unitDisc = MeshBuilder.CreateDisc('unit', { radius: 0.25, sideOrientation: Mesh.DOUBLESIDE }, scene);
  let discMat = new StandardMaterial('discMat', scene);
  discMat.diffuseColor = new Color3(1, 0, 0);
  unitDisc.material = discMat;
  unitDisc.rotation.x = Math.PI / 2;
  unitDisc.position.y = 0.1;
  unitDisc.position.x = 1;

  let unitDisc2 = MeshBuilder.CreateDisc('unit2', { radius: 0.25, sideOrientation: Mesh.DOUBLESIDE }, scene);
  let discMat2 = new StandardMaterial('discMat2', scene);
  discMat2.diffuseColor = new Color3(1, 0, 0);
  unitDisc2.material = discMat2;
  unitDisc2.rotation.x = Math.PI / 2;
  unitDisc2.position.y = 0.1;
  unitDisc2.position.x = -1;

  // let disc = MeshBuilder.CreateDisc("disc", { radius: 2, sideOrientation: Mesh.DOUBLESIDE }, scene);
  // disc.rotation.x = Math.PI / 2;

  let advancedTexture = AdvancedDynamicTexture.CreateForMesh(unitDisc2);
  // let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
  let label = new TextBlock();
  label.text = "5";
  label.color = "black";
  label.fontSize = "48px";
  label.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

  advancedTexture.addControl(label);


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

class Combatant {
  id: string;
  health: number;
  attack: number;

  constructor(id: string, health: number, attack: number) {
    this.id = id;
    this.health = health;
    this.attack = attack;
  }

  attackEnemy(enemy: Combatant) {
    enemy.health -= this.attack;
  }

  isAlive() {
    return this.health > 0;
  }
}

const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const simulateCombat = async (tick: number, combatant: object[]) => {
  logger.log('combatant ', combatant);
  // if (tick === 0) return;
  while (0 < tick) {
    logger.log('tick ', tick);
    tick--;
    await delay(200);
  }
};

/** generator 예시 */
// function* combatGenerator(tick) {
//   while (tick > 0) {
//     const additionalTicks = yield tick;
//     if (additionalTicks) {
//       // tick += additionalTicks;
//     }
//     tick--;
//   }
// }

// const tickGenerator = combatGenerator(10);

// const timer = setInterval(() => {
//   const next = tickGenerator.next();

//   if (next.done) {
//     clearInterval(timer);
//   } else {
//     console.log('tick', next.value);

//     // On tick 5, add 3 additional ticks
//     if (next.value === 5) {
//       tickGenerator.next(3);
//     }
//   }
// }, 200);


/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = (scene: Scene) => {
  // if (box !== undefined) {
  //   const deltaTimeInMillis = scene.getEngine().getDeltaTime();

  //   const rpm = 10;
  //   box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  // }
};


const PlaceModeScene = () => {


  let soldierA = new Combatant('A', 10, 1);
  let soldierB = new Combatant('B', 10, 1);
  logger.log('b4 ', soldierA)
  logger.log('b4 ', soldierB)
  soldierA.attackEnemy(soldierB);
  logger.log('af ', soldierA)
  logger.log('af ', soldierB)
  simulateCombat(60);

  useEffect(() => {
    console.log('scene')
    // return () => window.removeEventListener('resize',)
  }, [])

  return (
    <>

      <SceneComponent
        antialias
        onSceneReady={onSceneReady}
        onRender={onRender}
        id="my-canvas"
        className={style.canvasElement}
      />
    </>
  );
};

export default PlaceModeScene;
