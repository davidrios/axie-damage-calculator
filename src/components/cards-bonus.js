function damageMod (perc) {
  return (attack) => attack * perc
}

export const damageGroups = {
  Plant: 1,
  Reptile: 1,
  Dusk: 1,
  Aquatic: 2,
  Bird: 2,
  Dawn: 2,
  Beast: 3,
  Bug: 3,
  Mech: 3
}

export const damageGroupModifier = {
  1: {
    1: 1,
    2: 1.15,
    3: 0.85
  },
  2: {
    1: 0.85,
    2: 1,
    3: 1.15
  },
  3: {
    1: 1.15,
    2: 0.85,
    3: 1
  }
}

export const cardsModifier = {
  'bug-tail-12': damageMod(1.3)
}
