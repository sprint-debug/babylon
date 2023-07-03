import React from 'react';
import SceneComponent from 'babylonjs-hook';
import {
  Vector3,
  HemisphericLight,
  Scene,
  ArcRotateCamera,
  StandardMaterial,
  Texture,
  SceneLoader
} from '@babylonjs/core';
import earcut from 'earcut';
import { LoadInspectorControl } from '@/clients/util/LoadInspectorControl'
import { messageClient } from '@/clients/events';
import { logger } from '@/common/utils/logger';


const onSceneReady = (scene: Scene) => {
  logger.log('MeshParent')
  const canvas = scene.getEngine().getRenderingCanvas();
  canvas!.height = 800;
  canvas!.width = 1000;

  /** inspector 활성화 및 전환 시 통신이벤트 */
  LoadInspectorControl(scene, canvas);

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