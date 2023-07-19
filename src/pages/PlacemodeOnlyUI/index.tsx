//import React from 'react';
import { logger } from '@/common/utils/logger';
import usePlaceMode from './usePlaceMode';
import DynamicSheet from '../_shared/Layouts/DynamicSheet';
import Header from './Header';
import Search from './Search';
import Sort from './Sort';
import Cate from './Category';
import Item from './Item';
import style from "./style.module.scss";
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
    <>
      <Header />
      <DynamicSheet isOpen={placeMode} direction='RESIZE_BOT' >
        <Search className={`${style.contentSearch} ${placeMode ? style.expanded : ''}`} />
        <Cate className={style.contentCategory} />
        <Sort className={style.contentSort} />
        <Item className={style.contentItem} />
      </DynamicSheet>
    </>
  );
};

export default PlaceMode;



class Civilian {
  id: string;
  health: number;
  attack: number;

  morale: number;
  gender: string;

  isPsychic: boolean;

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
