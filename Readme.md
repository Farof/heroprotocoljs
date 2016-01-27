# heroprotocoljs

heroprotocoljs is a Javascript port of [heroprotocol](https://github.com/Blizzard/heroprotocol). It is a library and standalone tool to decode Heroes of the Storm replay files into Javascript data structures.

Currently heroprotocoljs can decode these structures and events:

- replay header
- game details
- replay init data
- game events
- message events
- tracker events

heroprotocoljs can be used as a base-build-specific library to decode binary blobs, or it can be run as a standalone tool to pretty print information from supported replay files.

Note that heroprotocoljs does not expose game balance information or provide any kind of high level analysis of replays; it's meant
to be just the first tool in the chain for your data mining application.

## Installation

    npm install -S heroprotocoljs

## Usage

### As a library

    const heroprotocol = require('heroprotocoljs');
    var replayDecoder = new heroprotocol.ReplayDecoder('file.StormReplay');

    replayDecoder.parse('details');
    
    // display the players name alphabetically
    var players = replayDecoder.details.m_playerList.map(player => player.m_name);
    console.log('Players:', players.sort());
    
    // display the map name
    console.log(replayDecoder.details.m_title);

#### Example

An usage example is provided in the "example" folder. It displays the map name and players name.

    const ReplayDecoder = require('../heroprotocol').ReplayDecoder;
    
    var decoder = new ReplayDecoder(process.argv[2]);
    
    var details = decoder.parse('details');
    var players = details.m_playerList.map(player => player.m_name.toString());
    
    console.log('Map:', details.m_title);
    console.log('Players:', players.sort());

Output:

    Map: Battlefield of Eternity
    Players: […]
    
### As a command line tool

    usage: heroprotocol.js replayFile [--help] [--gameevents] [--messageevents]
    [--trackerevents] [--attributeevents] [--header] [--details] [--initdata]
    [--stats] [--print] [--extract]

    Options:
      -h, --help             show this help                                       [boolean]
      -p, --print            print parsed information                             [boolean]
      -x, --extract          extract parsed information to disk with JSON format  [boolean]
      -H, --header           parse protocol header                                [boolean]
      -d, --details          parse protocol details                               [boolean]
      -i, --initdata         parse protocol initdata                              [boolean]
      -g, --gameevents       parse protocol gameevents                            [boolean]
      -m, --messageevents    parse protocol messageevents                         [boolean]
      -t, --trackerevents    parse protocol trackerevents                         [boolean]
      -a, --attributeevents  parse protocol attributeevents                       [boolean]

To print the replay header:

    node heroprotocol.js replay.StormReplay --header --print

To extract the replay messages:

    node heroprotocol.js replay.StormReplay -m -x

To extrac everything:

    node heroprotocol.js replay.StormReplay -H -d -i -g -m -t -a --extract
    
Or you can use the extraction tool provided:

    usage: node bin/extract.js file|dir ... [outdir] [-r] [-v]

The `-r` option scans directories recursively and the `-v` option prints information like extraction time and number of succes and failures.

## Data reference

The following files are in the archive and supported by the library:

- replay.details (see `reference/replay.details.md` for details)
- replay.initdata (see `reference/replay.initdata.md` for details)
- replay.game.events
- replay.message.events
- replay.tracker.events
- replay.attributes.events

Also accessible is the replay header (see `reference/header.md` for details).

The following files are in the archive but not supported by this port nor the original library yet:

- replay.load.info
- replay.resumable.events
- replay.server.battlelobby
- replay.smartcam.events
- replay.sync.events
- replay.sync.history
    
## Supported Versions

heroprotocoljs currently supports patch 15.6 (latest at the time of writing) and 15.5 of Heroes of the Storm. The current plan is to port all previous protocols from the original python library, which support all replay files written with retail versions of the game, and to port future publicly released protocol.

## Port status

This is a direct port with nothing fancy and little Javascript adjustments or optimizations.

While this port has been successfully used to perform the operations provided and analyze replay files of Heroes of the Storm, not all codepaths have been tested and bugs may arise.

Specifically, data structures of type '__parent' are not used in supported protocols and currently throw an error if encountered. The '--stats' option for the command line tool is also currently not supported.

The port currently uses synchronous file system access and the plan is to provide both sychonous and asynchronous functions.

### How it works

Heroes of the Storm replay files are MPQ archives. heroprotocol uses the mpyq library to read and extract the binary content out of the archive. It then parses the binary content into data structures containing the replay information.

The three main files are:

- decoders.js: Contains the binary structures decoders. They are the same for all versions of the game.
- protocol#####.js: Contains the data structures description of a specific public release of the game.
- heroprotocol.js: Entry point. Exports the ReplayDecoder and provides the CLI.

heroprotocol.js starts by loading the earliest protocol available, protocol29406.js and uses it to parse the replay header. It then reads the replay build version in the header and loads the associated protocol#####.js containing the correct data structures to parse the full replay.

## Plans

What I always wanted for personal use is a bulk analyzer that takes all your replays and give you stats, so that's my end goal for now. If it goes well I'd like to provide a website for anyone to see their stats whithout having to install this tool. Along the way I hope I can provide tools to read individual or multiple replays and all information associated in a friendlier way than Blizzard's data structures. I would also like to build a reference for those data structure. Finally I would like to explore the possibility of using this library directory in the browser, as while hard it's certainly feasible and would help third-party tool creation greatly.

Any small or big contribution appreciated whether in code, documentation, feedback or feature request.

## Tracker Events

Some notes on tracker events:

- Convert unit tag index, recycle pairs into unit tags (as seen in game events) with protocol.unitTag(index, recycle)
- Interpret the NNet.Replay.Tracker.SUnitPositionsEvent events like this:

        var unitIndex = event.m_firstUnitIndex;
        for (var i = 0, ln = event.m_items.length; i < ln; i += 3) {
          unitIndex += event.m_items[i + 0];
          var x = event.m_items[i + 1] * 4;
          var y = event.m_items[i + 2] * 4;
          // unit identified by unitIndex at the current event._gameloop time is at approximate position (x, y)
        }

- Only units that have inflicted or taken damage are mentioned in unit position events, and they occur periodically with a limit of 256 units mentioned per event.
- NNet.Replay.Tracker.SUnitInitEvent events appear for units under construction. When complete you'll see a NNet.Replay.Tracker.SUnitDoneEvent with the same unit tag.
- NNet.Replay.Tracker.SUnitBornEvent events appear for units that are created fully constructed.
- You may receive a NNet.Replay.Tracker.SUnitDiedEvent after either a UnitInit or UnitBorn event for the corresponding unit tag.
- In NNet.Replay.Tracker.SPlayerStatsEvent, m_scoreValueFoodUsed and m_scoreValueFoodMade are in fixed point (divide by 4096 for integer values). All other values are in integers.
- There's a known issue where revived units are not tracked, and placeholder units track death but not birth.

## Acknowledgements

Blizzard Entertainment for making the awesome Heroes of the Storm game and releasing the original [heroprotocol](https://github.com/Blizzard/heroprotocol) tool.

The standalone tool uses a javascript port of [mpyq](https://github.com/arkx/mpyq/) to read mopaq files.

## License

Copyright (c) 2016, Mathieu Merdy

---

Copyright (c) 2015 Blizzard Entertainment

---

Open sourced under the ISC license and MIT license. See the included LICENSE file for more information.
