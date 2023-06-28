import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  SceneLoader,
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

  const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new Vector3(0, 2, 0), scene);
  camera.attachControl(canvas, true)

  const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

  SceneLoader.ImportMeshAsync("", "/src/assets/ex_tutorial/", "village.glb");
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
    dude.position = new Vector3(-6, 0, 0);
    dude.rotate(Axis.Y, Tools.ToRadians(-95), Space.LOCAL);

    const startRotation = dude.rotationQuaternion.clone();
    scene.beginAnimation(res.skeletons[0], 0, 100, true, 1.0);



    const track: any = [];
    track.push({ turn: 86, dist: 7 });
    track.push({ turn: -85, dist: 14.8 });
    track.push({ turn: -93, dist: 16.5 });
    track.push({ turn: 48, dist: 25.5 });
    track.push({ turn: -112, dist: 30.5 });
    track.push({ turn: -72, dist: 33.2 });
    track.push({ turn: 42, dist: 37.5 });
    track.push({ turn: -98, dist: 45.2 });
    track.push({ turn: 0, dist: 47 });

    let distance = 0;
    let step = 0.015;
    let p = 0;

    scene.onBeforeRenderObservable.add(() => {
      dude.movePOV(0, 0, step);
      distance += step;
      if (distance > track[p].dist) {
        dude.rotate(Axis.Y, Tools.ToRadians(track[p].turn), Space.LOCAL);
        p += 1;
        p &= track.length;
        if (p === 0) {
          distance = 0;
          dude.position = new Vector3(-6, 0, 0);
          dude.rotationQuaternion = startRotation.clone();
        }
      }
    });


  });

  /** scene 전환 시, inspector 종료작업 */
  handleSceneSwitch(scene, { enableScopeInfo: true });

};


const MoveCharScene = () => {

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

export default MoveCharScene;
