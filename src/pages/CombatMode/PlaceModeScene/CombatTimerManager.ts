import { logger } from '@/common/utils/logger';

// const delay = (ms: number) => {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// const simulateCombat = async (tick: number, combatant: Combatant[]) => {
//   // logger.log('combatant ', combatant);


//   logger.log('combatant ', combatant[0]);
//   logger.log('combatant ', combatant[1]);

//   let unitInstances = combatant.map((unit) => {
//     // return new ();
//   })

//   // if (tick === 0) return;
//   while (0 < tick) {
//     combatant[0].attackEnemy(combatant[1]);
//     combatant[1].attackEnemy(combatant[0]);
//     logger.log('tick ', combatant[0]);
//     logger.log('tick ', combatant[1]);
//     tick--;
//     await delay(200);
//   }
// };



/** generator */
function* combatGenerator(tick: number) {
  while (tick > 0) {
    const additionalTicks = yield tick;
    console.log('additionalTicks ', additionalTicks)
    if (additionalTicks) {
      tick += additionalTicks;
    }
    tick--;
  }
}
const tickGenerator = combatGenerator(10);

/** Todo:
 * 1:1 , 1: n 타겟팅
 */
const timer = setInterval(() => {
  const next = tickGenerator.next();

  // Math.random()
  if (next.done) {
    clearInterval(timer);
  } else {
    // console.log('tick', next);
    console.log('target ', Math.floor(Math.random() * 3));
    // const t = Math.floor(Math.random() * 3)

    // On tick 5, add 3 additional ticks
    if (next.value === 5) {
      const test = tickGenerator.next(1);
    }
  }
}, 200);