import React from 'react';
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
import { AdvancedDynamicTexture, Control, Ellipse, TextBlock } from '@babylonjs/gui';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';
import { CombatManager, Soldier, prepareCombatants } from './CombatManager';
import { CombatantObserver, CombatLogObserver } from './CombatManagerObserverType';
import { Html } from 'react-babylonjs'

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { ProgressBar, ProgressBarOptions, Tween } from './ProgressBar';
import style from "@/pages/CombatMode/style.module.scss";
import Icon from '@/components/Icon';



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



  messageClient.addListener('box', () => {
    box.position.y = 5;
  });


  let unitDisc = MeshBuilder.CreateDisc('unit', { radius: 0.25, sideOrientation: Mesh.DOUBLESIDE }, scene);
  let discMat = new StandardMaterial('discMat', scene);
  discMat.diffuseColor = new Color3(1, 1, 0);
  unitDisc.material = discMat;
  unitDisc.rotation.x = Math.PI / 2;
  // unitDisc.position.y = 1;
  // unitDisc.position.x = 4;

  let UI = AdvancedDynamicTexture.CreateForMesh(unitDisc);
  // let UI = AdvancedDynamicTexture.CreateFullscreenUI('UI');
  UI.background = 'green'

  let pbOptions: ProgressBarOptions = {
    width: 0.5,
    height: '10%',
    hMargin: 0.02,
    vMargin: 0.1,
    colorBackgroundBar: 'red',
    cornerRadiusBackgroundBar: 10,
    cornerRadiusProgressBar: 10
  }
  let pb = new ProgressBar('dict unlock', 50, 150, [0, '40%'], UI, pbOptions);
  let pb2 = new ProgressBar('dict unlock', 50, 150, [20, '20%'], UI, pbOptions);

  pb.progress = 50;
  Tween.createTween(scene, pb, 'progress', 0, 150, 5, true).restart();

  const unitGp1 = prepareCombatants(3, 'A', 10, 1, scene);
  const unitGp2 = prepareCombatants(3, 'B', 11, 1, scene);
  const test = new CombatManager(unitGp1, unitGp2);
  test.resolveCombat();


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

// box = MeshBuilder.CreateBox('box', { size: 2 }, scene);  // Our built-in 'box' shape.
// box.position.y = 1;  // Move the box upward 1/2 its height
// box.actionManager = new ActionManager(scene);
// box.actionManager.registerAction(
//   new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
//     messageClient.postMessage('alert', { text: 'hi' });
//   }),
// );
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
  const [colorOpt, setColorOpt] = React.useState(false);
  const [colorIdx, setColorIdx] = React.useState(0);
  const colorOptData = [
    { idx: 0, colorCode: '#8F00FF' },
    { idx: 1, colorCode: '#FF72D7' },
    { idx: 2, colorCode: '#FDFFAA' },
    { idx: 3, colorCode: '#31C1FF' },
    { idx: 4, colorCode: '#00FF29' },
    { idx: 5, colorCode: '#FF8A00' }
  ];

  const handleClick = () => {
    logger.log('handleClick');
  };
  const handleColor = () => {
    logger.log('handleColor');
    setColorOpt(!colorOpt);
  };
  const handleColorSelect = (idx: number) => () => {
    logger.log('handleColorSelect');
    setColorIdx(idx);
  };

  useEffect(() => {
    console.log('scene')

    // const unitGp1 = prepareCombatants(3, 'A', 10, 1,);
    // const unitGp2 = prepareCombatants(3, 'B', 11, 1);
    // const test = new CombatManager(unitGp1, unitGp2);
    // test.resolveCombat();


    // const alice = new CombatantObserver('Alice', 100, 25);
    // const bob = new CombatantObserver('Bob', 120, 20);
    // const combatLog = new CombatLogObserver();
    // alice.addObserver(combatLog);
    // bob.addObserver(combatLog);
    // alice.attack(bob);
    // bob.attack(alice);

  }, [])

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 50,
        left: 50,
        zIndex: 1,
        width: 50,
        height: 50
      }}>
        <CircularProgressbar value={66} />
      </div >
      <div style={{
        position: 'absolute',
        top: 50,
        left: 200,
        zIndex: 1,
        width: 50,
        height: 50
      }}>
        <CircularProgressbar value={66} />
      </div >
      <div className={`${style.colorOption} ${colorOpt ? style.expanded : ''}`}>
        <div onClick={handleColor} >
          <Icon name={`vite`} />
        </div>
        <div className={style.colorBtnList}>
          {colorOptData.map((option, idx) => (
            <div onClick={handleColorSelect(idx)} className={style.colorBtn} style={{ color: option.colorCode }} >
              <Icon name={`${colorIdx === idx ? 'color-btn-selected' : 'color-btn'}`} />
            </div>
          ))
          }

        </div>
        <div onClick={handleClick} >
          <Icon name={`vite`} />
        </div>
      </div>
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