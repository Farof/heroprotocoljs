/*

  Todo:
    - take local into account

*/

"use strict";

const ReplayDecoder = require('./heroprotocol').ReplayDecoder;
const data = require('./data');

// Main replay object
const Replay = exports.Replay = class {
  constructor(file) {
    this.decoder = new ReplayDecoder(file);
    if (!this.decoder) return null;

    this.decoder.parse('details');
    this.decoder.parse('initdata');

    // map
    this.map = new Map(this.decoder.details);

    // players
    this.players = this.decoder.details.m_playerList.map((data, index) => {
      return new Player(
        data, {
          m_lobbyState: this.decoder.initdata.m_syncLobbyState.m_lobbyState.m_slots[index],
          m_userInitialData: this.decoder.initdata.m_syncLobbyState.m_userInitialData[index]
        });
    });

    this.teams = {
      blue: this.players.filter(player => player.blue).map(player => player.name),
      red:  this.players.filter(player => player.red).map(player => player.name)
    };
  }

  print() {
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
  }

  serialize() {
    return {
      map: this.map,
      players: this.players.map(player => player.serialize()),
      teams: this.teams
    };
  }
};

// Map
const Map = class {
  constructor(details) {
    this.name = details.m_title;
  }

  print() {
    console.log('Map');
    console.log('===');
    console.log('name:', this.name);
  }

  serialize() {
    return {
      name: this.name
    };
  }
};

// Player
const Player = class {
  constructor(details, initdata) {
    this.index = details.m_workingSetSlotId; // index from 0 to 9 in the replay players arrays

    this.uid = details.m_toon.m_id; // unique id
    this.realm = details.m_toon.m_realm;
    this.region = details.m_toon.m_region;
    this.toonHandle = initdata.m_lobbyState.m_toonHandle;
    this.internalName = initdata.m_lobbyState.m_hero;
    this.name = details.m_name;

    this.hero = details.m_hero;
    this.skin = initdata.m_lobbyState.m_skin;
    this.mount = initdata.m_lobbyState.m_mount;

    // put color in data.js?
    this.color = details.m_color.m_r === 255 ? 'red' : 'blue';
    this.blue = this.color === 'blue';
    this.red = this.color === 'red';
    this.teamId = details.m_teamId;

    this.silenced = initdata.m_lobbyState.m_hasSilencePenalty;
  }

  print() {
    console.log();
    console.log('Name:', this.name);
    console.log('------');
    console.log('Toon handle:', this.toonHandle);
    console.log('Region:', data.regions[this.region]);
    console.log('Realm:', data.realms[this.realm]);
    console.log('Hero:', this.hero);
    console.log('Team:', this.color);
    console.log('Skin:', this.skin);
    console.log('Mount:', this.mount);
  }

  serialize() {
    return {
      name: this.name,
      toonHandle: this.toonHandle,
      region: this.region,
      realm: this.realm,
      hero: this.hero,
      color: this.color
    };
  }
};
