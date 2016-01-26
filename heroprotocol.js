/*
# Copyright (c) 2015 Blizzard Entertainment
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
*/

const path = require('path');
const fs = require('fs');

const mpq = require('../mpyqjs/mpyq');
const MPQArchive = mpq.MPQArchive;
const protocol29406 = require('./protocol29406');


function prepare(obj) {
  var ret = {}, keys = Object.keys(obj), key, value;
  
  for (key of keys.sort()) {
    value = obj[key];
    
    if (value instanceof Buffer) value = value.toString();
    if (value && typeof value === 'object') value = prepare(value);
    
    ret[key] = value;
  }
  
  return ret;
}


function EventLogger() {
  this._eventStats = {};
}

EventLogger.prototype.log = function(event) {
  // update stats
  if ('_event' in event && '_bits' in event) {
    var stat = this._eventStats[event._event] || [0, 0];
    stats[0] += 1; // count of events
    stats[1] += event._bits; // count of bits
    this._eventStats[event._event] = stat;
  }
  
  event = prepare(event);
  console.log(event);
};

EventLogger.prototype.logStats = function() {
  throw 'handle';
  Object.keys(this._eventStats).sort().forEach(key => {
    
  });
};


function Extractor(replay) {
  this.replay = replay;
  this.extension = path.extname(replay);
  this.archiveName = path.basename(replay, this.extension);
  this.dirName = path.join(process.cwd(), this.archiveName);
}

Extractor.prototype.init = function() {
  try {
    fs.statSync(this.dirName);
  } catch (err) {
    fs.mkdirSync(this.dirName);
  }
};

Extractor.prototype.getPath = function(file) {
  return path.join(this.dirName, ['replay', file, 'json'].join('.'));
};

Extractor.prototype.extract = function(file, data) {
  this.init();
  try {
    fs.writeFileSync(this.getPath(file), JSON.stringify(prepare(data), null, '  '));
  } catch (err) {
    console.trace(err);
  }
};

if (require.main === module) {
  (function () {
    const yargs = require('yargs')
                    .usage('usage: heroprotocol.js replayFile [--help] [--gameevents] [--messageevents] [--trackerevents] [--attributeevents] [--header] [--details] [--initdata] [--stats] [--print] [--extract]')
                    .demand(1)
                    .option('h', { alias: 'help', type: 'boolean', desc: 'show this help' })
                    .option('p', { alias: 'print', type: 'boolean', desc: 'print parsed information' })
                    .option('x', { alias: 'extract', type: 'boolean', desc: 'extract parsed information to disk in JSON format' })
                    .option('H', { alias: 'header', type: 'boolean', desc: 'parse protocol header' })
                    .option('d', { alias: 'details', type: 'boolean', desc: 'parse protocol details' })
                    .option('i', { alias: 'initdata', type: 'boolean', desc: 'parse protocol initdata' })
                    .option('g', { alias: 'gameevents', type: 'boolean', desc: 'parse protocol gameevents' })
                    .option('m', { alias: 'messageevents', type: 'boolean', desc: 'parse protocol messageevents' })
                    .option('t', { alias: 'trackerevents', type: 'boolean', desc: 'parse protocol trackerevents' })
                    .option('a', { alias: 'attributeevents', type: 'boolean', desc: 'parse protocol attributeevents' })
                    //.option('s', { alias: 'stats', type: 'boolean', desc: 'print stat' })
                    .option('players', { type: 'boolean', desc: 'print players name' });
    const args = yargs.argv;
    
    if (args.help) {
      yargs.showHelp();
      process.exit();
    }
    
    if (!args.print && !args.extract && !args.players) {
      console.log('At leas one command must be specified: -p --print, -x --extract, --players');
      process.exit(1);
    }
    
    if (args.players) args.details = args.d = true;
    
    const filename = process.cwd() + path.sep + args._[0];
    try {
      var archive = new MPQArchive(filename);
    } catch (err) {
      console.log('Error opening replay: ', filename);
      console.log(err);
      process.exit(1);
    }
    const logger = new EventLogger();
    const extractor = new Extractor(args._[0]);
    
    // Read the protocol header, this can be read with any protocol
    var contents = archive.header.userDataHeader.content;
    const header = protocol29406.decodeReplayHeader(contents);
    if (args.header) {
      if (args.print) logger.log(header);
      if (args.extract) extractor.extract('header', header);
    }
    
    // The header's baseBuild determines which protocol to use
    var baseBuild = header.m_version.m_baseBuild;
    try {
      var protocol = require('./protocol' + baseBuild);
    } catch (err) {
      console.log('Unsupported base build: ' + baseBuild);
      throw err;
      process.exit(1);
    }
    
    // Handle protocol details
    if (args.details) {
      contents = archive.readFile('replay.details');
      var details = protocol.decodeReplayDetails(contents);
      if (args.print) logger.log(details);
      if (args.extract) extractor.extract('details', details);
    }
    
    // Handle protocol init data
    if (args.initdata) {
      contents = archive.readFile('replay.initData');
      var initdata = protocol.decodeReplayInitdata(contents);
      if (args.print) {
        logger.log(initdata.m_syncLobbyState.m_gameDescription.m_cacheHandles);
        logger.log(initdata);
      }
      if (args.extract) {
        extractor.extract('initdata', initdata);
      }
    }
    
    // Handle game events and/or game events stats
    if (args.gameevents) {
      contents = archive.readFile('replay.game.events');
      var gameevents = [];
      for (event of protocol.decodeReplayGameEvents(contents)) {
        if (args.print) logger.log(event);
        gameevents.push(event);
      }
      
      if (args.extract) extractor.extract('game.events', gameevents);
    }
    
    // Handle message events
    if (args.messageevents) {
      contents = archive.readFile('replay.message.events');
      var messageevents = [];
      for (event of protocol.decodeReplayMessageEvents(contents)) {
        if (args.print) logger.log(event);
        messageevents.push(event);
      }
      
      if (args.extract) extractor.extract('message.events', messageevents);
    }
    
    // Handle tracker events
    if (args.trackerevents) {
      contents = archive.readFile('replay.tracker.events');
      var trackerevents = [];
      for (event of protocol.decodeReplayTrackerEvents(contents)) {
        if (args.print) logger.log(event);
        trackerevents.push(event);
      }
      
      if (args.extract) extractor.extract('tracker.events', trackerevents);
    }
    
    // Handle attributes events
    if (args.attributeevents) {
      contents = archive.readFile('replay.attributes.events');
      var attributes = protocol.decodeReplayAttributesEvents(contents);
      if (args.print) logger.log(attributes);
      if (args.extract) extractor.extract('attributes.events', attributes);
    }
    
    // Print stats
    if (args.stats) {
      logger.logStats();
    }
    
    // Print players name
    if (args.players) {
      var players = details.m_playerList.map(player => player.m_name.toString());
      console.log('Players: ', players.sort());
    }
    
  })();
}