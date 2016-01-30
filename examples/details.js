const heroprotocol = require('../heroprotocol');

const file = process.argv[2];

const details = heroprotocol.get(heroprotocol.DETAILS, file);

if (details) {
  const players = details.m_playerList.map(player => player.m_name.toString());

  console.log('Map:', details.m_title);
  console.log('Players:', players.sort());
}
