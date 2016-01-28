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
"use strict";

const path = require('path');
const fs = require('fs');

const mpq = require('mpyqjs/mpyq');
const MPQArchive = exports.MPQArchive = mpq.MPQArchive;
const protocol29406 = require('./lib/protocol29406');

// sort object and read buffer strings, recursively
function prepare(obj) {
  if (!obj) {
     return obj;
  } else if (obj instanceof Buffer) {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    for (var i = 0, ln = obj.length; i < ln; i += 1) {
      obj[i] = prepare(obj[i]);
    }
    return obj;
  } else if (typeof obj === 'object') {
    var ret = {};
    Object.keys(obj).sort().forEach(key => ret[key] = prepare(obj[key]));
    return ret;
  }
  return obj;
}

// EventLogger
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

  console.log(event);
};

EventLogger.prototype.logStats = function() {
  throw 'not yet ported';
  Object.keys(this._eventStats).sort().forEach(key => {

  });
};


// ReplayDecoder
const ReplayDecoder = exports.ReplayDecoder = function(file) {
  if (typeof file === 'string') {
    try {
      if (!path.isAbsolute(file))
        file = path.join(process.cwd(), file);
      this.archive = new MPQArchive(file);
      this.filename = file;
    } catch (err) {
      console.log('Error opening replay: ', file);
      console.log(err);
    }
  } else if (file instanceof MPQArchive) {
    archive = file;
    if (archive.filename) this.filename = archive.filename;
  } else {
    console.log('Unsupported setup parameter: ', file);
  }

  if (!this.archive) return null;

  this.logger = new EventLogger();

  // Read the protocol header, this can be read with any protocol
  var contents = this.archive.header.userDataHeader.content;
  this.header = prepare(protocol29406.decodeReplayHeader(contents));


  // The header's baseBuild determines which protocol to use
  this.baseBuild = this.header.m_version.m_baseBuild;
  try {
    this.protocol = require('./lib/protocol' + this.baseBuild);
  } catch (err) {
    // TODO - should return error instead of console.log to not pollute output
    console.log('Unsupported base build: ' + this.baseBuild);
  }
};

ReplayDecoder.prototype.parse = function(name) {
  if (name === 'details') {
    return this.details = prepare(this.protocol.decodeReplayDetails(this.archive.readFile('replay.details')));
  } else if (name === 'initdata') {
    return this.initdata = prepare(this.protocol.decodeReplayInitdata(this.archive.readFile('replay.initData')));
  } else if (name === 'gameevents') {
    this.gameevents = [];
    for (event of this.protocol.decodeReplayGameEvents(this.archive.readFile('replay.game.events'))) {
      this.gameevents.push(prepare(event));
    }
    return this.gameevents;
  } else if (name === 'messageevents') {
    this.messageevents = [];
    for (event of this.protocol.decodeReplayMessageEvents(this.archive.readFile('replay.message.events'))) {
      this.messageevents.push(prepare(event));
    }
    return this.messageevents;
  } else if (name === 'trackerevents') {
    this.trackerevents = [];
    for (event of this.protocol.decodeReplayTrackerEvents(this.archive.readFile('replay.tracker.events'))) {
      this.trackerevents.push(prepare(event));
    }
    return this.trackerevents;
  } else if (name === 'attributesevents') {
    return this.attributesevents = prepare(this.protocol.decodeReplayAttributesEvents(this.archive.readFile('replay.attributes.events')));
  } else {
    console.log('Unsupported file:', name);
  }
};

ReplayDecoder.prototype.log = function(name) {
  if (this[name]) {
    if (name.indexOf('events') > -1) {
      var events = this[name], event;
      for (event of events) this.log(event);
    } else {
      if (name === 'initdata') {
        this.logger.log(this.initdata.m_syncLobbyState.m_gameDescription.m_cacheHandles);
      }
      this.logger.log(this[name]);
    }
  }
};

ReplayDecoder.prototype.logStats = function () {
  this.logger.logStats();
};

ReplayDecoder.prototype.extractSync = function(name) {
  var attr = name.split('.').join('');
  if (this[attr]) {
    var dirname = path.join(process.cwd(), path.basename(this.filename, path.extname(this.filename)));

    try {
      fs.statSync(dirname);
    } catch (err) {
      fs.mkdirSync(dirname);
    }

    try {
      fs.writeFileSync(
        path.join(dirname, ['replay', name, 'json'].join('.')),
        JSON.stringify(this[attr], null, '  ')
      );
    } catch(err) {
      console.trace(err);
    }
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

    var replayDecoder = new ReplayDecoder(process.cwd() + path.sep + args._[0]);

    if (args.header) {
      if (args.print) replayDecoder.log('header');
      if (args.extract) replayDecoder.extractSync('header');
    }

    if(!replayDecoder.protocol) process.exit(1);

    // Handle protocol details
    if (args.details) {
      replayDecoder.parse('details');
      if (args.print) replayDecoder.log('details');
      if (args.extract) replayDecoder.extractSync('details');
    }

    // Handle protocol init data
    if (args.initdata) {
      replayDecoder.parse('initdata');
      if (args.print) replayDecoder.log('initdata');
      if (args.extract) replayDecoder.extractSync('initdata');
    }

    // Handle game events and/or game events stats
    if (args.gameevents) {
      replayDecoder.parse('gameevents');
      if (args.print) replayDecoder.log('gameevents');
      if (args.extract) replayDecoder.extractSync('game.events');
    }

    // Handle message events
    if (args.messageevents) {
      replayDecoder.parse('messageevents');
      if (args.print) replayDecoder.log('messageevents');
      if (args.extract) replayDecoder.extractSync('message.events');
    }

    // Handle tracker events
    if (args.trackerevents) {
      replayDecoder.parse('trackerevents');
      if (args.print) replayDecoder.log('trackerevents');
      if (args.extract) replayDecoder.extractSync('tracker.events');
    }

    // Handle attributes events
    if (args.attributeevents) {
      replayDecoder.parse('attributesevents');
      if (args.print) replayDecoder.log('attributesevents');
      if (args.extract) replayDecoder.extractSync('attributes.events');
    }

    // Print stats
    if (args.stats) {
      replayDecoder.logStats();
    }

  })();
}
