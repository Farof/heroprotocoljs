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

// see to complete http://us.battle.net/heroes/en/search?k=Patch%20Notes&f=article
exports.builds = {
  39951: {
    live: {
      link: 'http://us.battle.net/heroes/en/blog/19993879/heroes-of-the-storm-patch-notes-january-12-2016-1-12-2016',
      patch: '15.5',
      from: '2016-01-12',
      to: '2016-01-27'
    }
  },
  40087: {
    live: {
      link: 'http://us.battle.net/heroes/en/blog/19996517/heroes-of-the-storm-balance-update-notes-january-20-2016-1-20-2016',
      patch: '15.6',
      from: '2016-01-20',
      to: '2016-01-27'
    }
  },
  40322: {
    live: {
      link: 'http://us.battle.net/heroes/en/blog/20021838',
      patch: '15.7',
      from: '2016-01-27'
    }
  },
  40336: {
    ptr: {
      link: 'http://us.battle.net/heroes/en/blog/19998381',
      patch: '16.0',
      from: '2016-01-26'
    }
  }
};
