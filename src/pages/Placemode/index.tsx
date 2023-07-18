//import React from 'react';
import PlaceModeScene from '@/pages/Placemode/PlaceModeScene';
import usePlaceMode from './usePlaceMode';
import FixedView from '../_shared/Layouts/FixedView';
import DynamicSheet from '../_shared/Layouts/DynamicSheet';
import Header from './Header';
import Search from './Search';
import Sort from './Sort';
import Cate from './Category';
import Item from './Item';
import style from "./style.module.scss";
import { logger } from '@/common/utils/logger';

class Combatant {
  constructor(id, health, attack) {
    this.id = id;
    this.health = health;
    this.attack = attack;
  }

  attackEnemy(enemy) {
    enemy.health -= this.attack;
  }

  isAlive() {
    return this.health > 0;
  }
}

const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const simulateCombat = async (tick: number) => {
  // if (tick === 0) return;
  while (0 < tick) {
    logger.log('tick ', tick);
    --tick;
    await delay(200);
  }
};

const PlaceMode = () => {
  const { placeMode } = usePlaceMode();

  let soldierA = new Combatant('A', 10, 1);
  let soldierB = new Combatant('B', 10, 1);
  logger.log('b4 ', soldierA)
  logger.log('b4 ', soldierB)
  soldierA.attackEnemy(soldierB);
  logger.log('af ', soldierA)
  logger.log('af ', soldierB)
  simulateCombat(60);

  return (
    <FixedView className={style.containerPlacemode}>
      <div className={style.canvasContainer}>
        <Header />
        <PlaceModeScene />
      </div>

      <DynamicSheet isOpen={placeMode} direction='RESIZE_BOT' >
        <Search className={`${style.contentSearch} ${placeMode ? style.expanded : ''}`} />
        <Cate className={style.contentCategory} />
        <Sort className={style.contentSort} />
        <Item className={style.contentItem} />
      </DynamicSheet>
      {/* <Button onClick={() => { messageClient.postMessage('box'); }}>
        <>Box</>
      </Button> */}
    </FixedView>
  );
};

export default PlaceMode;


