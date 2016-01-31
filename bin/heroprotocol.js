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

const heroprotocol = require('../');

class EventLogger {
  constructor() {
    this.eventStats = {};
  }

  log(event) {
    function sort(obj) {
      const ret = {};
      Object.keys(obj).sort().forEach(key => {
        const value = obj[key];
        if (!value) {
          ret[key] = value;
        } else if (Array.isArray(value)) {
          ret[key] = value.map(item => {
            if (item && !Array.isArray(item) && typeof item === 'object')
              return sort(item);
            else
              return item;
          });
        } else if (typeof value === 'object') {
          ret[key] = sort(value);
        } else {
          ret[key] = value;
        }
      });
      return ret;
    }

    let stat;

    if (event && event._event && event._bits) {
      stat = this.eventStats[event._event] || [0, 0];
      stat[0] += 1;
      stat[1] += event._bits;
      this.eventStats[event._event] = stat;
    }

    event = sort(event);
    console.log(args.json ? JSON.stringify(event, undefined, '  ') : event);
  }

  logStats() {
    // order events by bits parsed and output them from most to least
    Object.keys(this.eventStats).sort((b, a) => {
      return this.eventStats[b][1] > this.eventStats[a][1];
    }).forEach(name => {
      const stat = this.eventStats[name];
      console.log(`${name}, ${stat[0]}, ${stat[1]}`);
    });
  }
}

const yargs = require('yargs')
                .usage('usage: heroprotocol.js replayFile [--help] [--header] [--details] [--initdata] [--gameevents] [--messageevents] [--trackerevents] [--attributeevents] [--stats]')
                .demand(1)
                .option('h', { alias: 'help', type: 'boolean', desc: 'show this help' })
                .option('H', { alias: 'header', type: 'boolean', desc: 'print protocol header' })
                .option('d', { alias: 'details', type: 'boolean', desc: 'print protocol details' })
                .option('i', { alias: 'initdata', type: 'boolean', desc: 'print protocol initdata' })
                .option('g', { alias: 'gameevents', type: 'boolean', desc: 'print game events' })
                .option('m', { alias: 'messageevents', type: 'boolean', desc: 'print message events' })
                .option('t', { alias: 'trackerevents', type: 'boolean', desc: 'print tracker events' })
                .option('a', { alias: 'attributeevents', type: 'boolean', desc: 'print attribute events' })
                .option('s', { alias: 'stats', type: 'boolean', desc: 'print stats' })
                .option('json', { type: 'boolean', desc: 'prints in JSON format' });
const args = yargs.argv;

if (args.help) {
  yargs.showHelp();
  process.exit();
}

const archive = heroprotocol.open(args._[0]);

if (archive instanceof Error) {
  console.log(archive.error);
  process.exit(1);
}

const logger = new EventLogger();

if (args.header) {
  logger.log(archive.data[heroprotocol.HEADER]);
}

if (!archive.protocol) {
  console.log('Unsupported base build:', archive.baseBuild);
  process.exit(1);
}

if (args.details) {
  logger.log(archive.get(heroprotocol.DETAILS));
}

if (args.initdata) {
  const data = archive.get(heroprotocol.INITDATA);
  logger.log(data.m_syncLobbyState.m_gameDescription.m_cacheHandles);
  logger.log(data);
}

if (args.gameevents) {
  logger.log(archive.get(heroprotocol.GAME_EVENTS));
}

if (args.messageevents) {
  logger.log(archive.get(heroprotocol.MESSAGE_EVENTS));
}

if (args.trackerevents) {
  logger.log(archive.get(heroprotocol.TRACKER_EVENTS));
}

if (args.attributeevents) {
  logger.log(archive.get(heroprotocol.ATTRIBUTES_EVENTS));
}

if (args.stats) {
  logger.logStats();
}
