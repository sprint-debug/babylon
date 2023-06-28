import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  Vector3,
  Vector4,
  HemisphericLight,
  MeshBuilder,
  Scene,
  ArcRotateCamera,
  StandardMaterial,
  Texture,
  Animation,
  SceneLoader
} from '@babylonjs/core';
import earcut from 'earcut';
import { handleSceneSwitch } from '@/pages/Tutorial/subscribeMsgEvt';
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';


const onSceneReady = (scene: Scene) => {
  console.log('MeshParent')
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
  });

  const canvas = scene.getEngine().getRenderingCanvas();
  canvas!.height = 800;
  canvas!.width = 1000;

  const camera = new ArcRotateCamera("camera", -Math.PI / 2.2, Math.PI / 2.5, 50, new Vector3(0, 0, 0));
  camera.attachControl(canvas, true);
  const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  light.intensity = 0.8;


  SceneLoader.ImportMeshAsync('', '/src/assets/ex_tutorial/', 'dude.babylon').then((res) => {
    console.log('TEST mesh ', res.meshes)
    const dude = res.meshes[0];
    dude.scaling = new Vector3(0.25, 0.25, 0.25);


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

    scene.beginAnimation(res.skeletons[0], 0, 100, true, 1.0);
  });



  /** scene 전환 시, inspector 종료작업 */
  handleSceneSwitch(scene, { enableScopeInfo: true });

  return scene;
}


const Dude = () => {
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

export default Dude;