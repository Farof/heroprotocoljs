/*

  $ node extract.js file|dir ... outdir [-h] [-p] [-r] [-v]

*/
"use strict";

const startTime = Date.now();

const fs = require('fs');
const _path = require('path');
const yargs = require('yargs');
const heroprotocol = require('../');

const args = yargs.usage('usage: extract.js file|dir ... outdir [-h] [-p] [-r] [-v]')
                  .option('h', { alias: 'help', type: 'boolean', desc: 'show this help' })
                  .option('p', { alias: 'pretty', type: 'boolean', desc: 'prettifies the json' })
                  .option('r', { alias: 'recursive', type: 'boolean', desc: 'scans input folders for replays recursively' })
                  .option('s', { alias: 'skip-existing', type: 'boolean', desc: 'skips extraction of already existing files' })
                  .option('v', { alias: 'verbose', type: 'boolean', desc: 'prints additional info' })
                  .argv;
const spacing = args.pretty ? '  ' : undefined;
const files = [heroprotocol.HEADER, heroprotocol.DETAILS, heroprotocol.INITDATA,
  heroprotocol.GAME_EVENTS, heroprotocol.MESSAGE_EVENTS,
  heroprotocol.TRACKER_EVENTS, heroprotocol.ATTRIBUTES_EVENTS];

const protocols = new Set(); // required protocols not yet implemented
let paths = args._;
var extractDir = process.cwd(); // defaults the extraction directory to the current execution directory
var extractionDone = 0, extractionFailed = 0;
var i = 0;

function usage() {
  console.log('usage: extract.js file|dir ... [outdir] [-r]');
  console.log();
  console.log('\tfile|dir\tone or several .StormReplay files or directories containing them');
  console.log('\toutdir\t\tdirectory in which to extract the replays');
  console.log('\t-r\t\tsearch the directories for replay files recursively');
}

function getPaths(paths, top) {
  return new Promise((resolve, reject) => {
    // if last element of several is not a replay, it's the output directory
    const cwd = process.cwd();
    const last = paths[paths.length - 1];
    if (top && paths.length > 1 && !last.endsWith('.StormReplay')) {
      extractDir = _path.isAbsolute(last) ? last : _path.join(cwd, last);
      paths.pop();
    }

    // resolve all paths
    Promise.all(paths.map(path => {
      return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
          if (err) return resolve(null);

          if (stats.isDirectory()) {
            fs.readdir(path, (err, files) => {
              if (err) return reject(null);

              if (args.r || top) {
                getPaths(files.map(file => _path.join(path, file))).then(resolve);
              } else {
                resolve(null);
              }
            });
          } else {
            // only extract files with the .StormReplay extension
            if (_path.extname(path) === '.StormReplay') return resolve(_path.join(cwd, path));
            else resolve(null);
          }
        });
      });
    })).then(paths => resolve(paths.reduce((a, b) => b ? a.concat(b) : a, [])));
  });
}

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

function writeFile(archive, file, dir) {
  return new Promise((resolve, reject) => {
    const path = `${_path.join(dir, file)}.json`;
    fs.stat(path, (err, stats) => {
      if (args.s && !err) {
        return resolve(true);
      }

      const data = archive.get(file);
      fs.writeFile(path, JSON.stringify(args.pretty ? sort(data) : data, undefined, spacing), (err) => {
        if (err) console.log(err);
        resolve(err ? false : true);
      });
    });
  });
}

function extractReplay(path) {
  return new Promise((resolve, reject) => {
    const archive = heroprotocol.open(path);
    const basename = _path.basename(path, _path.extname(path));
    const dir = _path.join(extractDir, basename);

    if (archive instanceof Error || !archive.protocol) {
      if (args.v) console.log('Extraction failed:', path);
      if (archive.baseBuild) protocols.add(archive.baseBuild);
      extractionFailed += 1;
      return resolve(false);
    }

    fs.mkdir(dir, err => {
      if (err && err.code !== 'EEXIST') {
        if (args.v) console.log('Failed to create extraction directory:', dir);
        extractionFailed += 1;
        return resolve(false);
      }

      Promise.all(files.map(file => writeFile(archive, file, dir))).then(() => {
        extractionDone += 1;
        resolve(true);
      });
    });
  });
}

if (args.h) {
  yargs.showHelp();
  return process.exit(0);
}

if (!args._[0]) {
  yargs.showHelp();
  return process.exit(1);
}

getPaths(paths, true)
  .then(paths => {
    if (paths.length === 0) {
      yargs.showHelp();
      process.exit(1);
    }

    return Promise.all(paths.map(extractReplay));
  })
  .then(() => {
    if (args.v) {
      const endTime = Date.now();
      const extracTime = endTime - startTime;

      console.log();
      console.log('extraction completed in ', (extracTime / 1000) + 's');
      console.log('--------------------');
      console.log('extracted:', extractionDone);
      console.log('failed:', extractionFailed);
      if (protocols.size > 0) {
        console.log();
        console.log('missing protocols:', Array.from(protocols).join(', '));
      }
    }
  })
  .catch(err => {
  console.log(err.stack);
});
