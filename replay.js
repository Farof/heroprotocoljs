/*

  Todo:
    - take local into account

*/

const ReplayDecoder = require('./heroprotocol').ReplayDecoder;
const data = require('./data');

// Main replay object
const Replay = exports.Replay = function (file) {
  this.decoder = new ReplayDecoder(file);
  if (!this.decoder) return null;
  
  this.decoder.parse('details');
  this.decoder.parse('initdata');
  
  // map
  this.map = new Map(this.decoder.details);
  
  // players
  this.players = this.decoder.details.m_playerList.map(data => {
    return new Player(data);
  });
  
  this.teams = {
    blue: this.players.filter(player => player.blue).map(player => player.name),
    red:  this.players.filter(player => player.red).map(player => player.name)
  };
};

Replay.prototype.print = function() {
  this.map.print();
  
  console.log();
  console.log('Teams');
  console.log('=====');
  console.log('Blue:', this.teams.blue.join(', '));
  console.log('Red:', this.teams.red.join(', '));
  console.log();
  
  console.log('Players');
  console.log('=======');
  this.players.forEach(player => player.print());
};

Replay.prototype.serialize = function() {
  return {
    map: this.map,
    players: this.players.map(player => player.serialize()),
    teams: this.teams
  };
};

// Map
function Map(details) {
  this.name = details.m_title;
}

Map.prototype.print = function() {
  console.log('Map');
  console.log('===');
  console.log('name:', this.name);
};

Map.prototype.serialize = function() {
  return {
    name: this.name
  };
};

// Player
function Player(details) {
  this.id = details.m_workingSetSlotId; // index from 0 to 9 in the replay players arrays
  
  this.uid = details.m_toon.m_id; // unique id
  this.realm = details.m_toon.m_realm;
  this.region = details.m_toon.m_region;
  this.toonHandle = `${this.region}-${details.m_programId}-${this.realm}-${this.uid}`;
  this.name = details.m_name;

  this.hero = details.m_hero;

  // put color in data.js?
  this.color = details.m_color.m_r === 255 ? 'red' : 'blue';
  this.blue = this.color === 'blue';
  this.red = this.color === 'red';
  this.teamId = details.m_teamId;
}

Player.prototype.print = function() {
  console.log();
  console.log('Name:', this.name);
  console.log('------');
  console.log('Toon handle:', this.toonHandle);
  console.log('Region:', data.regions[this.region]);
  console.log('Realm:', data.realms[this.realm]);
  console.log('Hero:', this.hero);
  console.log('Ream:', this.color);
};

Player.prototype.serialize = function() {
  return {
    name: this.name,
    toonHandle: this.toonHandle,
    region: this.region,
    realm: this.realm,
    hero: this.hero,
    color: this.color
  };
};
