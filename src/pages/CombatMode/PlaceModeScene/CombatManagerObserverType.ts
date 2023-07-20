export class CombatantObserver {
  name: string;
  health: number;
  attackPower: number;
  observers: never[];
  constructor(name: string, health: number, attackPower: number) {
    this.name = name;
    this.health = health;
    this.attackPower = attackPower;
    this.observers = [];
  }

  /** 
   * observer 패턴 - 좀더 상세한 객체간 통신/상태 표현
   * 필요에 따라 observer 종류가 추가될 수도 있을듯함
   */

  addObserver(observer: CombatLogObserver) {
    this.observers.push(observer);
  }

  removeObserver(observer: any) {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex > -1) {
      this.observers.splice(observerIndex, 1);
    }
  }

  notifyObservers(event: string) {
    for (let observer of this.observers) {
      observer.update(event, this);
    }
  }

  takeDamage(damage: number) {
    this.health -= damage;
    this.notifyObservers('damageTaken');
    if (this.health <= 0) {
      this.notifyObservers('death');
    }
  }

  attack(target: CombatantObserver) {
    target.takeDamage(this.attackPower);
  }
}

export class CombatLogObserver {
  update(event: string, combatant: { name: any; health: any; }) {
    console.log(`CombatLogObserver update ${event} `, combatant);
    if (event === 'damageTaken') {
      console.log(`${combatant.name} has taken damage and has ${combatant.health} health left.`);
    } else if (event === 'death') {
      console.log(`${combatant.name} has died.`);
    }
  }
}

// Example Observer Use
// const alice = new Combatant('Alice', 100, 25);
// const bob = new Combatant('Bob', 120, 20);

// const combatLog = new CombatLogObserver();
// alice.addObserver(combatLog);
// bob.addObserver(combatLog);

// alice.attack(bob);
// bob.attack(alice);