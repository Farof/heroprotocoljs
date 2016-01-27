const Replay = require('../replay').Replay;

var replay = new Replay(process.argv[2]);
if (replay) {
  replay.print();
}

