import EventEmitter from 'eventemitter3';
import { logger } from '@/common/utils/logger';
import { Scene, Color3, Mesh, MeshBuilder, StandardMaterial } from '@babylonjs/core';
import { AdvancedDynamicTexture } from '@babylonjs/gui';
import { ProgressBar, ProgressBarOptions } from './ProgressBar';

export class Soldier extends EventEmitter {
  name: any;
  health: any;
  attackPower: any;
  id: any;

  constructor(name: any, health: any, attackPower: any) {
    super();
    this.name = name;
    this.health = health;
    this.attackPower = attackPower;
  }



  takeDamage(damage: number) {
    this.health -= damage;
    this.emit('damageTaken', this);
    console.log('th', this.health)
    if (this.health <= 0) {
      this.emit('death', this);
    }
  }

  attack(target: { takeDamage: (arg0: any) => void; }) {
    target.takeDamage(this.attackPower);
  }

  isAlive() {
    return this.health >= 0 ? true : false;
  }
}

export class CombatManager {
  constructor(public group1: Soldier[], public group2: Soldier[]) {
    this.initializeListeners();
  }

  initializeListeners() {
    for (const soldier of [...this.group1, ...this.group2]) {
      // logger.log('Init ', soldier)
      soldier.on('attack', (enemy: { name: any; }) => {
        console.log(`evt=[attack] ${soldier.name} attacked ${enemy.name}`);
      });
      soldier.on('damageTaken', (damage: any) => {
        console.log(`evt=[damageTaken] ${soldier.name} took ${damage.attackPower} damage.`);
      });
      soldier.on('died', () => {
        console.log(`evt=[died] ${soldier.name} died.`);
      });
    }
  }

  /** Generator for resolving combat */
  // *combatGenerator(combatTick: number) {
  //   logger.log('combatGenerator ');
  //   for (let index = 0; index < combatTick; index++) {
  //     logger.log('GeneratorLoop ', index);
  //     yield 'ha'
  //   }
  // }


  /** sort example */
  // const allUnits = [...this.group1, ...this.group2];
  // allUnits.sort((a, b) => b.initiative - a.initiative);  


  /** Scenario: Both Party fight until one loses */
  // *combatGenerator() {
  //   let remainingGp1 = false;
  //   let remainingGp2 = false;

  //   while (true) {
  //     remainingGp1 = this.group1.some((el) => el.isAlive())
  //     remainingGp2 = this.group2.some((el) => el.isAlive())
  //     if (!remainingGp1 || !remainingGp2) break;

  //     for (const soldierA of this.group1) {
  //       for (const soldierB of this.group2) {
  //         if (soldierA.isAlive() && soldierB.isAlive()) {
  //           soldierA.attack(soldierB);
  //           yield; // Pause here, then resume on the next timer tick.
  //           soldierB.attack(soldierA);
  //           yield;
  //         }
  //       }
  //     }
  //   }
  // }

  // resolveCombat() {
  //   const combat = this.combatGenerator();
  //   const timer = window.setInterval(() => {
  //     const rx = combat.next();
  //     if (rx.done) {
  //       console.log('Gp1 ', this.group1)
  //       console.log('Gp2 ', this.group2)
  //       clearInterval(timer);
  //     }
  //   }, 100);
  // }


  /** Scenario: only fight till limited tick */
  *combatGenerator(tick: number) {
    logger.log('tick ', tick);
    let remainingGp1 = false;
    let remainingGp2 = false;
    while (tick > 0) {
      logger.log('tick ', tick);
      --tick;
      if (tick === 0) yield 'stop';

      remainingGp1 = this.group1.some((el) => el.isAlive())
      remainingGp2 = this.group2.some((el) => el.isAlive())
      if (!remainingGp1 || !remainingGp2) break;

      for (const soldierA of this.group1) {
        for (const soldierB of this.group2) {
          if (soldierA.isAlive() && soldierB.isAlive()) {
            soldierA.attack(soldierB);
            yield; // Pause here, then resume on the next timer tick.
            soldierB.attack(soldierA);
            yield;
          }
        }
      }
    }
  }

  resolveCombat() {
    const combat = this.combatGenerator(7);
    const timer = window.setInterval(() => {
      logger.log('setInterval ');
      const rx = combat.next();
      logger.log('rx ', rx);
      if (rx.value === 'stop' || rx.done) {
        console.log('Gp1 ', this.group1)
        console.log('Gp2 ', this.group2)
        clearInterval(timer);
      }
    }, 100);
  }




  // while (true) {
  //   const rx = combat.next();
  //   console.log('rx ', rx)
  //   if (rx.done) {
  //     console.log('Gp1 ', this.group1)
  //     console.log('Gp2 ', this.group2)
  //     break;
  //   };
  // }


}


export const prepareCombatants = (count: number, name: string, hp: number, atk: number, scene: Scene) => {
  const list = [];
  for (let i = 0; i < count; i++) {
    const element = new Soldier(`${name}${i}`, hp, atk);
    list.push(element);

  }
  return list;
}


/** example usage

    const unitGp1 = prepareCombatants(3, 'A', 10, 1);
    const unitGp2 = prepareCombatants(3, 'B', 11, 1);
    const test = new CombatManager(unitGp1, unitGp2);
    test.resolveCombat();

*/

// /** this can be a class method in the future */
// const prepareCombatants = (count: number) => {
//   const list = [];
//   for (let i = 0; i < count; i++) {
//     const element = new Combatant('A', 10, 1);
//     list.push(element);
//   }
//   return list;
// }

// const test = prepareCombatants(3);
// logger.log('TEST ', test);


/** vanilla 이벤트 에미터 */
// class EventEmitter {
//   private listeners: { [event: string]: Function[] } = {};

//   on(event: string, listener: Function) {
//     if (!this.listeners[event]) {
//       this.listeners[event] = [];
//     }
//     this.listeners[event].push(listener);
//   }

//   emit(event: string, ...args: any[]) {
//     if (this.listeners[event]) {
//       for (const listener of this.listeners[event]) {
//         listener(...args);
//       }
//     }
//   }
// }

/** make multiple group fight ( more than 2, ) */
// while (!combatEndConditions) {
//   for (const group of [group1, group2, group3]) {
//     for (const soldier of group) {
//       // Let soldier attack an enemy from another group.
//       // Logic for choosing which group and which soldier to attack.
//     }
//   }
// }

/** randomize which soldier attack first  */
// const activeSoldiers = [...group1, ...group2, ...group3];
// while (!combatEndConditions) {
//   const soldier = getRandomSoldier(activeSoldiers);
//   // Let soldier attack, then remove from the pool if defeated.
// }


// const prepareCombatants = (count: number) => {
//   const list = [];
//   for (let i = 0; i < count; i++) {
//     const element = new Combatant('A', 10, 1);
//     list.push(element);
//   }
//   return list;
// }
