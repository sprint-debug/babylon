import { Nullable, Scene } from '@babylonjs/core';
import { handleSceneSwitch } from '@/pages/Tutorial/Content/subscribeMsgEvt';
import { AdvancedDynamicTexture, Button, Control } from '@babylonjs/gui/2D';

export const LoadInspectorControl = (scene: Scene, canvas: Nullable<HTMLCanvasElement>) => {
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
  });

  const adt = AdvancedDynamicTexture.CreateFullscreenUI('UI');
  adt.scaleTo(canvas!.width, canvas!.height); // btn 스케일을 다른 파일에서 설정 시 감지가 안되서 받아서 스케일 보정해야함
  const btn = Button.CreateSimpleButton("btn", "Inspector");
  adt.addControl(btn)
  btn.color = 'black';
  btn.background = 'grey'
  btn.width = '10%';
  btn.height = '10%';
  // btn.fontSize = '8px'
  // btn.paddingBottom = '5px';
  // btn.paddingLeft = '5px';
  // btn.backg
  btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
  btn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
  btn.onPointerUpObservable.add(function () {
    const inspectorExists = scene.debugLayer.isVisible();
    if (inspectorExists) scene.debugLayer.hide();
    else scene.debugLayer.show();
  });


  /** scene 전환 시, inspector 종료작업 */
  handleSceneSwitch(scene, { enableScopeInfo: true });
}