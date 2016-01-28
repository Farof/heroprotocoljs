/*

  $ node extract.js file|dir ... [outdir] [-r] [-v]

  Extracts the replays found at the given paths to the current working directory.
  Paths can be individual replays or a directory that will be scanned for replays.
  When providing a directory, use the -r option to explore recursively.
  Only scans for .StormReplay files in directories.
  If several paths are provided and the last is a directory, all extracted replays will be placed here.

  Notifies if a needed replay protocol is not yet implemented.

  Examples:

    Extract replay1.StormReplay and replay2.StormReplay to the current directory:
      $ node extract.js replay1.StormReplay replay2.StormReplay

    Extract replay the replays in the replayDir/ directory to the current directory:
      $ node extract.js replayDir/

    Extract replay1.StormReplay, replay2.StormReplay and replays in the replayDir/ directory to the current directory:
      $ node extract.js replay1.StormReplay replayDir/ replay2.StormReplay

    Extract replay.StormReplay and replays in the replayDir/ directory to the extractDir/ directory:
      $ node extract.js replay.StormReplay replayDir/ extractDir/

   Todo:
     - estimate and display the remaining extraction time
     - add option to keep directory structure when extracting recursively
     - add option to skip extraction if files already exists
     - options to only extract certain files

*/
"use strict";

const startTime = Date.now();

const fs = require('fs');
const _path = require('path');
const yargs = require('yargs').argv;
const ReplayDecoder = require('../heroprotocol').ReplayDecoder;


const paths = yargs._;
const invalidPaths = [];
const protocols = []; // required protocols not yet implemented
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

// resolve check paths
function getAllPaths(paths, top) {
  // return a Promise that resolves when all paths have been resolved
  return Promise.all(paths.map((path, index, ar) => {
    return new Promise((resolve, reject) => {
      // if last of several arguments to extract.js is not a replay file
      // it's the extraction directory and we need to create it
      if (top && ar.length > 1 && index === (ar.length - 1) && !path.endsWith('.StormReplay')) {
        return fs.mkdir(path, err => {
          if (err && err.code !== 'EEXIST') {
            console.log('Failed to create extraction directory:', path);
            return resolve(null);
          }
          extractDir = path;
          resolve(null);
        });
      }

      // otherwise get file info
      fs.stat(path, (err, stats) => {
        if (err) {
          // return null if failed to access path
          invalidPaths.push(path);
          return resolve(null);
        }

        if (stats.isDirectory()) {
          // if -r option was given, resolve paths in the directory recursively
          if (yargs.r || top) {
            return fs.readdir(path, (err, files) => {
              if (err) {
                console.log('Failed to read directory:', path);
                return resolve(null);
              }
              getAllPaths(files.map(file => _path.join(path, file))).then(resolve);
            });
          }
        }

        // only extract files with the .StormReplay extension
        if (_path.extname(path) === '.StormReplay') return resolve(path);
        else resolve(null);
      });
    });
    // flatten the paths array
  })).then(paths => paths.reduce((a, b) => b ? a.concat(b) : a, []));
}

function extract(path) {
  return new Promise((resolve, reject) => {
    const t = Date.now();
    const replayDecoder = new ReplayDecoder(_path.join(process.cwd(), path));

    if (!replayDecoder.protocol) {
      extractionFailed += 1;
      // save the missing protocol if possible
      if (replayDecoder &&
          !replayDecoder.protocol &&
          replayDecoder.baseBuild &&
          protocols.indexOf(replayDecoder.baseBuild) === -1) {
        protocols.push(replayDecoder.baseBuild);
      }
      if (yargs.v) console.log('Extraction failed:', path);
      resolve(false);
      return;
    }

    const prev = process.cwd();
    process.chdir(extractDir);
    replayDecoder.extractSync('header');

    replayDecoder.parse('details');
    replayDecoder.extractSync('details');

    replayDecoder.parse('initdata');
    replayDecoder.extractSync('initdata');

    replayDecoder.parse('gameevents');
    replayDecoder.extractSync('gameevents');

    replayDecoder.parse('messageevents');
    replayDecoder.extractSync('messageevents');

    replayDecoder.parse('trackerevents');
    replayDecoder.extractSync('trackerevents');

    replayDecoder.parse('attributesevents');
    replayDecoder.extractSync('attributesevents');
    process.chdir(prev);

    if (yargs.v) console.log(path, 'extracted in', ((Date.now() - t) / 1000) + 's');
    extractionDone += 1;
    resolve(true);
  });
}

if (!yargs._[0]) {
  usage();
  return process.exit(0);
}

getAllPaths(paths, true).then((paths) => {
  if (paths.length === 0) {
    usage();
    process.exit(1);
  }
  return Promise.all(paths.map(extract));
}).then(() => {
  if (yargs.v) {
    const endTime = Date.now();
    const extracTime = endTime - startTime;

    console.log();
    console.log('extraction completed in ', (extracTime / 1000) + 's');
    console.log('--------------------');
    console.log('extracted:', extractionDone);
    console.log('failed:', extractionFailed);
    if (protocols.length > 0) {
      console.log();
      console.log('missing protocols:', protocols.join(', '));
    }
  }
});
