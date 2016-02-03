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
};

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
          data.push(parseStrings(event));
        }
      }
    }
  }

  return data;
};

/**
 * parses a basic MPQ header
 * @function
 * @param {buffer} buffer - Header content from MPQ archive
 * @returns {object} Header information from file
 */
exports.parseHeader = function (buffer) {
  return parseStrings(protocol29406.decodeReplayHeader(buffer));
};

/**
 * parses a buffer based on a given build
 * @function
 * @param {buffer} buffer - Binary file contents from MPQ archive
 * @param {string} build - Build in which to parse the contents
 * @param {string} filename - Name of the file to assist in parsing
 * @returns {object} File contents
 */
exports.parseFile = function (buffer, build, filename) {
  var data;
  try {
    var protocol = require(`./lib/protocol${build}`);
  } catch (err) {
    return undefined;
  }
  if ([DETAILS, INITDATA, ATTRIBUTES_EVENTS].indexOf(filename) > -1) {
    data = parseStrings(protocol[decoderMap[filename]](buffer));
  } else if ([GAME_EVENTS, MESSAGE_EVENTS, TRACKER_EVENTS].indexOf(filename) > -1) {
    data = [];
    for (let event of protocol[decoderMap[filename]](buffer)) {
      data.push(parseStrings(event));
    }
  }
  return data;
};
