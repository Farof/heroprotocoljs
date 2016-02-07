/*
  Get the names of all players that are not bots:

      $ node bin/query.js replays/ -f details -q "m_playerList[m_toon.m_id != 0].m_name"

  Get the internal name of every unit that is born:

      $  node bin/query.js replays/ -f tracker.events -q "[_event = NNet.Replay.Tracker.SUnitBornEvent].m_unitTypeName"
*/

"use strict";

const fs = require('fs');
const heroprotocol = require('../');

const yargs =
  require('yargs')
  .usage('usage: query.js file.StormReplay -f archiveFile').demand(1)
  .option('file', { alias: 'f', desc: 'archive file on which to permorm the query', choices: [
    'header', 'details', 'initdata', 'game.events',
    'message.events', 'tracker.events', 'attributes.events'
  ], demand: true })
  .option('query', { alias: 'q', desc: 'path in the file to query', demand: true });

const args = yargs.argv;

if (!args._[0]) {
  yargs.showHelp();
  process.exit(1);
}

function getFiles(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) return reject(err);

      if (stats.isDirectory()) {
        fs.readdir(path, (err, files) => {
          resolve(files.filter(file => file.endsWith('.StormReplay')).map(file => `${path}/${file}`));
        });
      } else if (!path.endsWith('.StormReplay')) {
        reject(new Error('File must be a .StormReplay'));
      } else {
        resolve([path]);
      }
    });
  });
}

const opquery = /(.*?)(=|!=)(.*)/;
function filter(ar, filter) {
  const match = filter.match(opquery);
  if (!match) {
    console.log('Unsupported filter:', filter);
    process.exit(1);
  }

  const left = match[1].trim(), operand = match[2].trim(), right = match[3].trim();

  return ar.filter(item => {
    const value = find(item, left);
    if (operand === '=') {
      return value == right;
    } else if (operand === '!=') {
      return value != right;
    }
  });
}

const subquery = /(?:\[(.*?)\])/;
function find(obj, query, map) {
  const match = query.match(subquery);
  let value = obj, part, sub, next;

  if (match) {
    part = query.slice(0, match.index);
    sub = match[1];
    next = query.slice(match.index + sub.length + 3);
  } else if(query.indexOf('.') > -1) {
    part = query.slice(0, query.indexOf('.'));
    next = query.slice(query.indexOf('.') + 1);
  } else {
    part = query;
  }

  value = map ? value : value[part];
  if (sub) {
    value = filter(value, sub);
  }

  if (next) {
    if (sub) value = value.map(item => {
      return find(item, next);
    });
    else value = find(value, next);
  }

  return value;
}

getFiles(args._[0]).then(paths => {
  Promise.all(paths.map(path => {
    return new Promise((resolve, reject) => {
      const archive = heroprotocol.open(path);

      if (archive instanceof Error) {
        console.log(archive);
        process.exit(1);
      }

      let data;
      if (args.f === 'header') {
        data = archive.get('header');
      } else {
        data = archive.get(`replay.${args.f}`);
      }

      if (data) {
        resolve(find(data, args.q, args.f.includes('events')));
      } else {
        resolve([]);
      }
    });
  })).then(values => {
    values = values.reduce((a, b) => a.concat(b), []);
    console.log(JSON.stringify(Array.from(new Set(values)).sort(), undefined, '  '));
  }, err => {
    console.log(err);
  });
}, err => {
  console.log(err);
});
