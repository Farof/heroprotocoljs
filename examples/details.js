const ReplayDecoder = require('../heroprotocol').ReplayDecoder;

var decoder = new ReplayDecoder(process.argv[2]);

var details = decoder.parse('details');
var players = details.m_playerList.map(player => player.m_name.toString());

console.log('Map:', details.m_title);
console.log('Players:', players.sort());
