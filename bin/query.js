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
    next = query.slice(query.indexOf('.') + 1)
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

if (data) {
  const value = find(data, args.q, args.f.includes('events'));

  if (value) {
    console.log(args.q, '=', Array.from(new Set(value)).sort());
  } else {
    console.log('Unknown query path: ', args.q);
  }
}
