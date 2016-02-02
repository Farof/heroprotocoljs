"use strict";

const fs = require('fs');
const diff = require('diff');

const _data = require('../lib/data');

try {
  fs.mkdirSync('./dist/protocols');
} catch (err) {
  if (err.code !== 'EEXIST') throw err;
}

const dir = '../heroprotocol';
const regex = /protocol(\d+)\.py$/;
const files = fs.readdirSync(dir).filter(file => {
  return file.match(regex);
});

const types = {
  tuple: function (str) {
    return str.match(/(-?\w+)/g);
  },
  tuples: function (str) {
    return str.match(/(\(.*?\))/g);
  },
  _int: {
    decode: function (str) {
      const ret = { };
      const res = types.tuple(str);
      ret.bounds = [res[0], res[1]];
      return ret;
    },
    encode: function (infos) {
      return `[${infos.bounds[0]}, ${infos.bounds[1]}]`;
    }
  },
  _choice: {
    decode: function (str) {
      const ret = { bounds: [], choices: [] };
      let res = types.tuples(str);

      Object.assign(ret, types._int.decode(res[0]));
      for (let i = 1; i < res.length; i += 1) {
        const tuple = types.tuple(res[i]);
        ret.choices.push({
          label: tuple[0],
          typeIndex: tuple[1]
        });
      }
      return ret;
    },
    encode: function (infos) {
      return `[${infos.bounds[0]}, ${infos.bounds[1]}], { ${infos.choices.map((choice, index, ar) => {
        return `${index}: ['${choice.label}', ${choice.typeIndex}]${(index === ar.length - 1) ? '' : ', '}`;
      }).join('')}}`;
    }
  },
  _struct: {
    decode: function (str) {
      const ret = { items: [] };
      const tuples = types.tuples(str);
      if (tuples) {
        tuples.forEach(tuple => {
          tuple = types.tuple(tuple);
          ret.items.push({
            label: tuple[0],
            typeIndex: tuple[1],
            tag: tuple[2]
          });
        });
      }
      return ret;
    },
    encode: function (infos) {
      return `[${infos.items.map((item, index, ar) => {
        return `['${item.label}', ${item.typeIndex}, ${item.tag}]${(index === ar.length - 1) ? '' : ', '}`;
      }).join('')}]`;
    }
  },
  _blob: {
    decode: function (str) {
      return types._int.decode(str);
    },
    encode: function (infos) {
      return types._int.encode(infos);
    }
  },
  _bool: {
    decode: function (str) {
      return {};
    },
    encode: function (infos) {
      return '';
    }
  },
  _array: {
    decode: function (str) {
      return Object.assign(
        { typeIndex: str.match(/\d+$/)[0] },
        types._int.decode(str)
      );
    },
    encode: function (infos) {
      return `[${infos.bounds[0]}, ${infos.bounds[1]}], ${infos.typeIndex}`;
    }
  },
  _optional: {
    decode: function (str) {
      return { typeIndex: Number(str) };
    },
    encode: function (infos) {
      return `${infos.typeIndex}`;
    }
  },
  _fourcc: {
    decode: function (str) {
      return {};
    },
    encode: function (infos) {
      return '';
    }
  },
  _bitarray: {
    decode: function (str) {
      return types._int.decode(str);
    },
    encode: function (infos) {
      return types._int.encode(infos);
    }
  },
  _null: {
    decode: function (str) {
      return {};
    },
    encode: function (infos) {
      return '';
    }
  }
};

const tokens = {
  newline: '\r\n',
  indent: '  ',
  typeinfosStart: 'typeinfos = [',
  typeinfosEnd: ']',
  gameeventsStart: 'game_event_types = {',
  gameeventsEnd: '}',
  messageeventsStart: 'message_event_types = {',
  messageeventsEnd: '}',
  trackereventsStart: 'tracker_event_types = {',
  trackereventsEnd: '}',
  gameeventsTypeid: 'game_eventid_typeid =',
  messageeventsTypeid: 'message_eventid_typeid =',
  trackereventsTypeid: 'tracker_eventid_typeid =',
  headerTypeid: 'replay_header_typeid =',
  detailsTypeid: 'game_details_typeid =',
  initdataTypeid: 'replay_initdata_typeid ='
};

const Protocol = exports.Protocol = class {
  constructor(file) {
    this.file = file;
    this.parse();
  }

  parse() {
    const lines = fs.readFileSync(this.file, 'utf8').split(tokens.newline);
    let line = 0, str;

    this.version = Number(this.file.match(regex)[1]);
    this.typeinfos = [];
    this.gameeventsTypes = [];
    this.messageeventsTypes = [];
    this.trackereventstypes = [];

    while (line < lines.length) {
      str = lines[line].trim();

      if (str === tokens.typeinfosStart) {
        line += 1;
        str = lines[line].trim();
        do {
          this.typeinfos.push(this.parseTypeinfos(str));
          line += 1;
          str = lines[line].trim();
        } while (str !== tokens.typeinfosEnd);
      } else if (tokens.gameeventsStart === str) {
        line += 1;
        str = lines[line].trim();
        do {
          this.gameeventsTypes.push(this.parseEvent(str));
          line += 1;
          str = lines[line].trim();
        } while (tokens.gameeventsEnd !== str);
      } else if (tokens.messageeventsStart === str) {
        line += 1;
        str = lines[line].trim();
        do {
          this.messageeventsTypes.push(this.parseEvent(str));
          line += 1;
          str = lines[line].trim();
        } while (tokens.messageeventsEnd !== str);
      } else if (tokens.trackereventsStart === str) {
        line += 1;
        str = lines[line].trim();
        do {
          this.trackereventstypes.push(this.parseEvent(str));
          line += 1;
          str = lines[line].trim();
        } while (tokens.trackereventsEnd !== str);
      } else if (str.startsWith(tokens.gameeventsTypeid)) {
        this.gameeventsTypeid = str.match(/\d+/)[0];
      } else if (str.startsWith(tokens.messageeventsTypeid)) {
        this.messageeventsTypeid = str.match(/\d+/)[0];
      } else if (str.startsWith(tokens.trackereventsTypeid)) {
        this.trackereventsTypeid = str.match(/\d+/)[0];
      } else if (str.startsWith(tokens.headerTypeid)) {
        this.headerTypeid = str.match(/\d+/)[0];
      } else if (str.startsWith(tokens.detailsTypeid)) {
        this.detailsTypeid = str.match(/\d+/)[0];
      } else if (str.startsWith(tokens.initdataTypeid)) {
        this.initdataTypeid = str.match(/\d+/)[0];
      }

      line += 1;
    }
  }

  parseTypeinfos(str) {
    const typeRegex = /^\('(.*?)',\[(.*)\]\),\s*#(\d+)$/;
    const infos = { str: str };
    const res = typeRegex.exec(str);

    infos.type = res[1];
    Object.assign(infos, types[infos.type].decode(res[2]));
    infos.index = res[3];

    return infos;
  }

  parseEvent(str) {
    const res = str.match(/^(\d+):\s\((\d+),\s\'(.*)\'/);
    return {
      key: res[1],
      typeIndex: res[2],
      name: res[3]
    };
  }

  write() {
    const file = `protocol${this.version}.js`;
    const buildInfos = _data.builds[this.version];

    let out = fs.readFileSync('./src/protocol.js.template', 'utf8');

    out = out.replace('${version}', this.version);

    if (buildInfos) {
      const patch = buildInfos.live ? buildInfos.live.patch : buildInfos.ptr.patch;
      out = out.replace('${patch}', `exports.patch = \'${patch}\';${tokens.newline}`);
    } else {
      out = out.replace('${patch}', '');
    }

    out = out.replace('${typeinfos}', this.typeinfos.map((infos, index, ar) => {
      let str = tokens.indent;

      str += `['${infos.type}', [`;
      str += types[infos.type].encode(infos);
      str += `]]${index === (ar.length - 1) ? '' : ','}`;
      str += `  //${infos.index}`;

      return str;
    }).join(tokens.newline));

    out = out.replace('${gameeventsTypes}', this.gameeventsTypes.map((event, index, ar) => {
      let str = tokens.indent;

      str += `${event.key}: [${event.typeIndex}, \'${event.name}\']`;
      str += index === ar.length - 1 ? '' : ',';

      return str;
    }).join(tokens.newline));

    out = out.replace('${messageeventsTypes}', this.messageeventsTypes.map((event, index, ar) => {
      let str = tokens.indent;

      str += `${event.key}: [${event.typeIndex}, \'${event.name}\']`;
      str += index === ar.length - 1 ? '' : ',';

      return str;
    }).join(tokens.newline));

    out = out.replace('${trackereventstypes}', this.trackereventstypes.map((event, index, ar) => {
      let str = tokens.indent + tokens.indent;

      str += `${event.key}: [${event.typeIndex}, \'${event.name}\']`;
      str += index === ar.length - 1 ? '' : ',';

      return str;
    }).join(tokens.newline));

    out = out.replace('${gameeventsTypeid}', this.gameeventsTypeid);
    out = out.replace('${messageeventsTypeid}', this.messageeventsTypeid);
    out = out.replace('${trackereventsTypeid}', this.trackereventsTypeid);
    out = out.replace('${headerTypeid}', this.headerTypeid);
    out = out.replace('${detailsTypeid}', this.detailsTypeid);
    out = out.replace('${initdataTypeid}', this.initdataTypeid);

    fs.writeFileSync(`./dist/protocols/${file}`, out);
  }
};


files.forEach(file => {
  const proto = new Protocol(`${dir}/${file}`);
  proto.write();
});
