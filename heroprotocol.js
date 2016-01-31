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

const fs = require('fs');
const path = require('path');
const MPQArchive = exports.MPQArchive = require('mpyqjs/mpyq').MPQArchive;
const protocol29406 = exports.protocol =  require('./lib/protocol29406');

const version = exports.version = require('./package.json').version;

// parsable parts
const HEADER            = exports.HEADER            = 'header';
const DETAILS           = exports.DETAILS           = 'replay.details';
const INITDATA          = exports.INITDATA          = 'replay.initdata';
const GAME_EVENTS       = exports.GAME_EVENTS       = 'replay.game.events';
const MESSAGE_EVENTS    = exports.MESSAGE_EVENTS    = 'replay.message.events';
const TRACKER_EVENTS    = exports.TRACKER_EVENTS    = 'replay.tracker.events';
const ATTRIBUTES_EVENTS = exports.ATTRIBUTES_EVENTS = 'replay.attributes.events';

const decoderMap = {
  [HEADER]:             'decodeReplayHeader',
  [DETAILS]:            'decodeReplayDetails',
  [INITDATA]:           'decodeReplayInitdata',
  [GAME_EVENTS]:        'decodeReplayGameEvents',
  [MESSAGE_EVENTS]:     'decodeReplayMessageEvents',
  [TRACKER_EVENTS]:     'decodeReplayTrackerEvents',
  [ATTRIBUTES_EVENTS]:  'decodeReplayAttributesEvents'
};

const parseStrings = function parseStrings(data) {
  if (!data) return data;
  else if (data instanceof Buffer) return data.toString();
  else if (Array.isArray(data)) return data.map(item => parseStrings(item));
  else if (typeof data === 'object') {
    for (let key in data) {
      data[key] = parseStrings(data[key]);
    }
  }
  return data;
}

let lastUsed;

exports.open = function (file) {
  let archive, header;

  // TODO - should we check if the user is trying to open the lastUsed file
  // and return the cache or assume they know what they're doing? Need usecase.

  if (typeof file === 'string') {
    try {
      if (!path.isAbsolute(file)) {
        file = path.join(process.cwd(), file);
      }
      archive = new MPQArchive(file);
      archive.filename = file;
    } catch (err) {
      archive = err;
    }
  } else if (file instanceof MPQArchive) {
    // TODO - need to check what happens when instanciating an MPQArchive with
    // invalid path and setup an error accordingly
    archive = file;
  } else {
    archive = new Error('Unsupported parameter: ${file}');
  }

  if (archive instanceof Error) return archive;
  lastUsed = archive;

  // parse header
  archive.data = {};
  header = archive.data[HEADER] = parseStrings(protocol29406.decodeReplayHeader(archive.header.userDataHeader.content));
  // The header's baseBuild determines which protocol to use
  archive.baseBuild = header.m_version.m_baseBuild;

  try {
    archive.protocol = require(`./lib/protocol${archive.baseBuild}`);
  } catch (err) {
    archive.error = err;
  }

  archive.get = function (file) {
    return exports.get(file, archive);
  };


  return archive;
};

// returns the content of a file in a replay archive
exports.get = function (archiveFile, archive) {
  let data;
  if (!lastUsed || !(archive instanceof MPQArchive) || archive !== lastUsed.filename) {
    archive = exports.open(archive);
  } else {
    lastUsed = archive;
  }

  if (archive instanceof Error) {
    return data;
  }

  if (archive.data[archiveFile]) {
    data = archive.data[archiveFile];
  } else {
    if (archive.protocol) {
      if ([DETAILS, INITDATA, ATTRIBUTES_EVENTS].indexOf(archiveFile) > -1) {
        data = archive.data[archiveFile] =
          parseStrings(archive.protocol[decoderMap[archiveFile]](
            archive.readFile(archiveFile)
          ));
      } else if ([GAME_EVENTS, MESSAGE_EVENTS, TRACKER_EVENTS].indexOf(archiveFile) > -1) {
        // protocol function to call is a generator
        data = archive.data[archiveFile] = [];
        for (let event of archive.protocol[decoderMap[archiveFile]](archive.readFile(archiveFile))) {
          data.push(event);
        }
      }
    }
  }

  return data;
};

if (require.main === module) {
  (function () {

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
          const stat = this.eventStats[name]
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

    const archive = exports.open(args._[0]);

    if (archive instanceof Error) {
      console.log(archive.error);
      process.exit(1);
    }

    const logger = new EventLogger();

    if (args.header) {
      logger.log(archive.data[HEADER]);
    }

    if (!archive.protocol) {
      console.log('Unsupported base build:', archive.baseBuild);
      process.exit(1);
    }

    if (args.details) {
      logger.log(archive.get(DETAILS));
    }

    if (args.initdata) {
      const data = archive.get(INITDATA);
      logger.log(data.m_syncLobbyState.m_gameDescription.m_cacheHandles);
      logger.log(data);
    }

    if (args.gameevents) {
      logger.log(archive.get(GAME_EVENTS));
    }

    if (args.messageevents) {
      logger.log(archive.get(MESSAGE_EVENTS));
    }

    if (args.trackerevents) {
      logger.log(archive.get(TRACKER_EVENTS));
    }

    if (args.attributeevents) {
      logger.log(archive.get(ATTRIBUTES_EVENTS));
    }

    if (args.stats) {
      logger.logStats();
    }

  })();
}
