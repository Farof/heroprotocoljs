"use strict";

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

const archive = heroprotocol.open(args._[0]);

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
  const parts = args.q.split('.');
  let value;

  try {
    value = parts.reduce((obj, key) => obj[key], data);
  } catch (err) {
    
  }

  if (value) {
    console.log(args.q, '=', value);
  } else {
    console.log('Unknown query path: ', args.q);
  }
}
