# heroprotocoljs

heroprotocoljs is a Javascript port of [heroprotocol](https://github.com/Blizzard/heroprotocol), a reference Python library and standalone tool to decode Heroes of the Storm replay files into Python data structures.

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
      --players              print players name                                   [boolean]

To print the replay header:

    node heroprotocol.js replay.StormReplay --header --print

To extract the replay messages:

    node heroprotocol.js replay.StormReplay -m -x

To print players name:

    node heroprotocol.js replay.StormReplay --players

## Supported Versions

heroprotocoljs currently supports patch 15.6 (latest at the time of writing) and 15.5 of Heroes of the Storm. The current plan is to port all previous protocols from the original python library, which support all replay files written with retail versions of the game, and to port future publicly released protocol.

## Port status

This is a direct port with nothing fancy and little Javascript adjustments or optimizations.

While this port has been successfully used to perform the operations provided and analyze replay files of Heroes of the Storm, not all codepaths have been tested and bugs may arise.

Specifically, data structures of type '__parent' are not used in supported protocols and currently throw an error if encountered.

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