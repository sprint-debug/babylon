import { Scene } from "@babylonjs/core/scene";
import { messageClient } from "@/clients/events";
import { getCurrentScopeInfo } from "@/common/utils/getScopeInfo";
import { logger } from "@/common/utils/logger";

interface IOptionSceneSwitch {
  enableScopeInfo: boolean;
}
export const handleSceneSwitch = (scene: Scene, option?: IOptionSceneSwitch) => {
  messageClient.addListener('clear_inspector', (payload: any) => {
    if (option && option!.enableScopeInfo === true) {
      const scopeInfo = getCurrentScopeInfo();
      logger.log(`handleSceneSwitch, filename: ${scopeInfo.fileName}`);
    }
    else logger.log('handleSceneSwitch, getScope disabled');

    scene.debugLayer.hide();
  });
};