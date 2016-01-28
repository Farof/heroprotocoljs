"use strict";

// intentional order for data mapping from replay information
exports.realms = [
  undefined,      // either undefined if realm notation starts at 1 or maybe the PTR, should confirm with ptr replay
  'live'
];

// intentional order for data mapping from replay information
exports.regions = [
  undefined,
  undefined,
  'Europe'
];

// ordered alphabetically
exports.heroes = [
  {
    name: 'Abathur'
  },
  {
    name: 'Jaina'
  },
  {
    name: 'Johanna',
    altNames: ['Crusader']
  },
  {
    name: "Kael'thas",
    altNames: ['Kaelthas']
  },
  {
    name: 'Kerrigan'
  },
  {
    name: 'Leoric'
  },
  {
    name: 'Muradin'
  },
  {
    name: 'Sylvanas'
  },
  {
    name: 'Valla ',
    altNames: ['DemonHunter']
  }
];

exports.mounts = [];

exports.maps = [];
