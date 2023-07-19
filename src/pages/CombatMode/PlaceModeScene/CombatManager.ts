import EventEmitter from 'eventemitter3';
import { logger } from '@/common/utils/logger';

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

    if (this.health <= 0) {
      this.emit('death', this);
    }
  }

  attack(target: { takeDamage: (arg0: any) => void; }) {
    target.takeDamage(this.attackPower);
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
        console.log(`${soldier.name} attacked ${enemy.name}`);
      });
      soldier.on('damageTaken', (damage: any) => {
        // console.log('damage ', damage)
        console.log(`${soldier.name} took ${damage.attackPower} damage.`);
      });
      soldier.on('died', () => {
        console.log(`${soldier.name} died.`);
      });
    }
  }

  resolveCombat() {
    // Sample combat resolution
    for (const soldierA of this.group1) {
      for (const soldierB of this.group2) {
        soldierA.attack(soldierB);
        soldierB.attack(soldierA);
      }
    }
  }
}


export const prepareCombatants = (count: number, name: string, hp: number, atk: number) => {
  const list = [];
  for (let i = 0; i < count; i++) {
    const element = new Soldier(name, hp, atk);
    list.push(element);
  }
  return list;
}

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

// class Combatant {
//   id: string;
//   health: number = 12;
//   attack: number = 1;
//   initiative: number = 1;

//   constructor(id: string, health?: number, attack?: number) {
//     this.id = id;
//   }

//   public attackEnemy(enemy: Combatant) {
//     if (this.health <= 0) return;
//     if (enemy.health <= 0) return;
//     enemy.health -= this.attack;
//   }

//   isAlive() {
//     return this.health > 0;
//   }
// }
// class Combatant2 {
//   id: string;
//   health: number = 10;
//   attack: number = 1;
//   initiative: number = 2

//   constructor(id: string, health?: number, attack?: number) {
//     this.id = id;
//   }

//   public attackEnemy(enemy: Combatant) {
//     if (this.health <= 0) return;
//     if (enemy.health <= 0) return;
//     enemy.health -= this.attack;
//   }

//   isAlive() {
//     return this.health > 0;
//   }
// }


// const prepareCombatants = (count: number) => {
//   const list = [];
//   for (let i = 0; i < count; i++) {
//     const element = new Combatant('A', 10, 1);
//     list.push(element);
//   }
//   return list;
// }
