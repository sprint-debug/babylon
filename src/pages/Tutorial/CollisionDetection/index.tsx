import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  SceneLoader,
  Animation,
  StandardMaterial,
  Texture,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Scene,
  ArcRotateCamera,
  Axis,
  Space,
  Tools
} from '@babylonjs/core';
import { handleSceneSwitch } from '@/pages/Tutorial/subscribeMsgEvt';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';

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

  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 2, 0), scene);
  camera.attachControl(canvas, true)

  const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);


  const wireMat = new StandardMaterial('wireMat');
  wireMat.wireframe = true;
  const hitBox = MeshBuilder.CreateBox('carbox', { width: 0.5, height: 0.6, depth: 4.5 });
  hitBox.material = wireMat;
  hitBox.position = new Vector3(3.1, 0.3, -5);

  SceneLoader.ImportMeshAsync("", "/src/assets/ex_tutorial/", "town.glb");

  let carReady = false;
  SceneLoader.ImportMeshAsync('', '/src/assets/ex_tutorial/', 'car.babylon').then(() => {

    const car = scene.getMeshByName('car');
    carReady = true;
    car!.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
    car!.position = new Vector3(3.1, 0.16, 8);

    const animCar = new Animation('carAnimation', 'position.z', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const carKeys = [];
    carKeys.push({ frame: 0, value: 8 });
    carKeys.push({ frame: 150, value: -7 });
    carKeys.push({ frame: 200, value: -7 });

    animCar.setKeys(carKeys);

    car!.animations = [];
    car!.animations.push(animCar);

    scene.beginAnimation(car, 0, 200, true);

    const wheelRF = scene.getMeshByName('wheelRF');
    const wheelRB = scene.getMeshByName('wheelRB');
    const wheelLF = scene.getMeshByName('wheelLF');
    const wheelLB = scene.getMeshByName('wheelLB');
    scene.beginAnimation(wheelRF, 0, 30, true);
    scene.beginAnimation(wheelRB, 0, 30, true);
    scene.beginAnimation(wheelLF, 0, 30, true);
    scene.beginAnimation(wheelLB, 0, 30, true);
  });

  SceneLoader.ImportMeshAsync('', '/src/assets/ex_tutorial/', 'dude.babylon', scene).then((res) => {
    const dude = res.meshes[0];
    /** babylon 파일에서 texture 가 정상적으로 로딩안되어 아래와 같이 일단처리 */
    const dudeFace = res.meshes[1];
    const dudeFaceMat = new StandardMaterial('dudeFaceMat');
    dudeFaceMat.diffuseTexture = new Texture('/src/assets/ex_tutorial/texture/dude_face.jpg', scene);
    dudeFace.material = dudeFaceMat;

    const dudeUpper = res.meshes[2];
    const dudeUpperMat = new StandardMaterial('dudeUpperMat');
    dudeUpperMat.diffuseTexture = new Texture('/src/assets/ex_tutorial/texture/dude_upper.jpg', scene);
    dudeUpper.material = dudeUpperMat;

    const dudeLower = res.meshes[3];
    const dudeLowerMat = new StandardMaterial('dudeUpperMat');
    dudeLowerMat.diffuseTexture = new Texture('/src/assets/ex_tutorial/texture/dude_upper.jpg', scene);
    dudeLower.material = dudeUpperMat;

    const dudeArm = res.meshes[4];
    const dudeArmMat = new StandardMaterial('dudeArmMat');
    dudeArmMat.diffuseTexture = new Texture('/src/assets/ex_tutorial/texture/dude_upper.jpg', scene);
    dudeArm.material = dudeUpperMat;


    dude.scaling = new Vector3(0.008, 0.008, 0.008);
    dude.position = new Vector3(1.5, 0, -6.9);
    dude.rotate(Axis.Y, Tools.ToRadians(-90), Space.LOCAL);

    const startRotation = dude.rotationQuaternion.clone();
    scene.beginAnimation(res.skeletons[0], 0, 100, true, 1.0);


    const track: any = [];
    track.push({ turn: 180, dist: 2.5 });
    track.push({ turn: 0, dist: 5 });

    let distance = 0;
    let step = 0.015;
    let p = 0;

    scene.onBeforeRenderObservable.add(() => {
      if (carReady) {
        if (!dude.intersectsMesh(hitBox) && scene.getMeshByName('car')?.intersectsMesh(hitBox)) {
          return;
        }
      }
      dude.movePOV(0, 0, step);
      distance += step;
      if (distance > track[p].dist) {
        dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
        p += 1;
        p &= track.length;
        if (p === 0) {
          distance = 0;
          dude.position = new Vector3(1.5, 0, -6.9);
          dude.rotationQuaternion = startRotation.clone();
        }
      }
    });


  });

  /** scene 전환 시, inspector 종료작업 */
  handleSceneSwitch(scene, { enableScopeInfo: true });

};


const CollisionDetectionScene = () => {

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

export default CollisionDetectionScene;
