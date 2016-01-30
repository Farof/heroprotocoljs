const Replay = require('../lib/Replay').Replay;

var replay = new Replay(process.argv[2]);
if (replay) {
  replay.print();
}
