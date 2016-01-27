const ReplayDecoder = require('./heroprotocol').ReplayDecoder;

// Main replay object
const Replay = exports.Replay = function (file) {
  this.decoder = new ReplayDecoder(file);
  if (!this.decoder) return null;
  
  this.decoder.parse('details');
  
  this.map = new Map(this.decoder);
};

Replay.prototype.print = function() {
  this.map.print();
};

function Map(decoder) {
  this.name = decoder.details.m_title;
}

Map.prototype.print = function() {
  console.log('Map');
  console.log('===');
  console.log('name:', this.name);
};

Map.prototype.toJson = function() {
  return {
    name: this.name
  };
};
