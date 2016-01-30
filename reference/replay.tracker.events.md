replay.tracker.events is an array containing events whose types are specified in the `protocol#####.js` files under the `tracker_event_types` variable.

---

**Convert unit tag index, recycle pairs into unit tags (as seen in `game.events`) with `protocol.unitTag(index, recycle)`**
In order to calculate the unique identifier for the unit, known as `m_tag`, you need to do the following calculation:
``` is m_unitTagIndex << 18 + m_unitTagRecycle```

Where  << is the bitwise shift operator

`m_tag` is useful to determine what unit was targeted by a skill, for example in this `NNet.Game.SCmdEvent` present in the `replay.game.events` file:

```
{
    "_eventid": 27,
    "m_unitGroup": null,
    "_event": "NNet.Game.SCmdEvent",
    "m_abil": {
        "m_abilLink": 147,
        "m_abilCmdIndex": 0,
        "m_abilCmdData": null
    },
    "_gameloop": 2365,
    "_bits": 264,
    "m_data": {
        "TargetUnit": {
            "m_snapshotControlPlayerId": 6,
            "m_snapshotPoint": {
                "y": 235853,
                "x": 579289,
                "z": 32441
            },
            "m_snapshotUpkeepPlayerId": 6,
            "m_timer": 0,
            "m_targetUnitFlags": 111,
            "m_snapshotUnitLink": 281,
            "m_tag": 45350913
        }
    },
    "_userid": {
        "m_userId": 5
    },
    "m_cmdFlags": 2097408,
    "m_sequence": 451,
    "m_otherUnit": null
}
```
we see that the unit with tag 45350913 was the target of the ability id 147 casted by player 5.

It is also possible retrieve `m_unitTagIndex` and `m_unitTagRecycle` from `m_tag`, by using the following formula:
```
m_unitTagIndex = (m_tag >> 18) & 0x00003fff
m_unitTagRecycle = (m_tag) & 0x0003ffff
```

There's a known issue where revived units are not tracked, and placeholder units track death but not birth.

The first 10 events are `NNet.Replay.Tracker.SPlayerSetupEvent` events, one for each player. Should check if there are also 10 if playing with or versus A.I.

---

Events contain generic properties and type specific properties.

# Generic

## 1. _bits (number)

## 2. _event (string)

Event type.

## 3. _eventid (number)

Not a unique identifier.

## 4. _gameloop (null?)

# NNet.Replay.Tracker.SPlayerStatsEvent

In `NNet.Replay.Tracker.SPlayerStatsEvent`, `m_scoreValueFoodUsed` and `m_scoreValueFoodMade` are in fixed point (divide by 4096 for integer values). All other values are in integers.

## 5. m_playerId (number)

Index of the player in arrays referencing players elsewhere?

## 6. m_stats (object)

All these stats field seem to be from the Starcraft 2 engine. Don't know if any is actually useful for Heroes of the Storm.

## 6.1. m_scoreValueFoodMade (number)

## 6.2. m_scoreValueFoodUsed (number)

## 6.3. m_scoreValueMineralsCollectionRate (number)

## 6.4. m_scoreValueMineralsCurrent (number)

## 6.5. m_scoreValueMineralsFriendlyFireArmy (number)

## 6.6. m_scoreValueMineralsFriendlyFireEconomy (number)

## 6.7. m_scoreValueMineralsFriendlyFireTechnology (number)

## 6.8. m_scoreValueMineralsKilledArmy (number)

## 6.9. m_scoreValueMineralsKilledEconomy (number)

## 6.10. m_scoreValueMineralsKilledTechnology (number)

## 6.11. m_scoreValueMineralsLostArmy (number)

## 6.12. m_scoreValueMineralsLostEconomy (number)

## 6.13. m_scoreValueMineralsLostTechnology (number)

## 6.14. m_scoreValueMineralsUsedActiveForces (number)

## 6.15. m_scoreValueMineralsUsedCurrentArmy (number)

## 6.16. m_scoreValueMineralsUsedCurrentEconomy (number)

## 6.17. m_scoreValueMineralsUsedCurrentTechnology (number)

## 6.18. m_scoreValueMineralsUsedInProgressArmy (number)

## 6.19. m_scoreValueMineralsUsedInProgressEconomy (number)

## 6.20. m_scoreValueMineralsUsedInProgressTechnology (number)

## 6.21. m_scoreValueVespeneCollectionRate (number)

## 6.22. m_scoreValueVespeneCurrent (number)

## 6.23. m_scoreValueVespeneFriendlyFireArmy (number)

## 6.24. m_scoreValueVespeneFriendlyFireEconomy (number)

## 6.25. m_scoreValueVespeneFriendlyFireTechnology (number)

## 6.26. m_scoreValueVespeneKilledArmy (number)

## 6.27. m_scoreValueVespeneKilledEconomy (number)

## 6.28. m_scoreValueVespeneKilledTechnology (number)

## 6.29. m_scoreValueVespeneLostArmy (number)

## 6.30. m_scoreValueVespeneLostEconomy (number)

## 6.31. m_scoreValueVespeneLostTechnology (number)

## 6.32. m_scoreValueVespeneUsedActiveForces (number)

## 6.32. m_scoreValueVespeneUsedCurrentArmy (number)

## 6.33. m_scoreValueVespeneUsedCurrentEconomy (number)

## 6.34. m_scoreValueVespeneUsedCurrentTechnology (number)

## 6.35. m_scoreValueVespeneUsedInProgressArmy (number)

## 6.36. m_scoreValueVespeneUsedInProgressEconomy (number)

## 6.37. m_scoreValueVespeneUsedInProgressTechnology (number)

## 6.38. m_scoreValueWorkersActiveCount (number)

# NNet.Replay.Tracker.SUnitBornEvent

`NNet.Replay.Tracker.SUnitBornEvent` events appear for units that are created fully constructed.

You may receive a `NNet.Replay.Tracker.SUnitDiedEvent` after either a UnitInit or UnitBorn event for the corresponding unit tag.

## 5. m_controlPlayerId (number)

Player generating the event. Index ranging from 0 to 15?

Known values:
- 0 - (when `m_unitTypeName` equals `DiabloShrine`, should check if it's because diablo was in the game's slot 0)
- 11 -  one of the teams
- 12 - the other team

Always identical to `m_upkeepPlayerId`?

## 6. m_unitTagIndex (number)

m_unitTagIndex and m_unitTagRecycle are used to determine the unique identifier of a unit within the game. Please refer to protocol.unitTag()

## 7. m_unitTagRecycle (number)

Used to determine the unique identifier of a unit withing the replay. See m_unitTagIndex.

## 8. m_unitTypeName (number)

Name for different units. Several with the same name can be born.

Known values:

- CampOwnershipFlag
- DiabloShrine - Diablo's trait respawn point? Not unique.
- KingsCore - The core of each team
- RegenGlobe - A pickable unit that grants a small health and mana amount
- RegenGlobeNeutral - A pickable unit that grants a small health and mana amount, usually drops when fighting bosses, it's color is purple.
- StormGameStartPathingBlocker - Gate blockers at the beginning of the game?
- StormGameStartPathingBlockerDiagonal - Gate blockers at the beginning of the game?
- TownCannonTowerDead
- TownCannonTowerL2
- TownCannonTowerL2Standalone
- TownCannonTowerL3
- TownCannonTowerL3Standalone
- TownGateL215BLUR
- TownGateL215BRUL
- TownGateL2BLUR
- TownGateL315BLUR
- TownGateL315BRUL
- TownGateL3BRUL
- TownMoonwellL2
- TownMoonwellL3
- TownTownHallL2
- TownTownHallL3
- TownWallRadial14L3
- TownWallRadial15L3
- TownWallRadial16L2
- TownWallRadial17L2
- TownWallRadial17L3
- TownWallRadial18L2
- TownWallRadial18L3
- TownWallRadial19L1
- TownWallRadial19L2
- TownWallRadial19L3
- TownWallRadial20L3
- TownWallRadial21L3
- TownWallRadial2L3
- TownWallRadial3L3
- TownWallRadial4L2
- TownWallRadial4L3
- TownWallRadial5L2
- TownWallRadial5L3
- TownWallRadial6L2
- TownWallRadial6L3
- TownWallRadial7L2
- TownWallRadial7L3
- TownWallRadial8L3
- TownWallRadial9L3
- TownGateL2VerticalLeftVisionBlocked
- TownGateL2VerticalRightVisionBlocked
- TownGateL3BLURBRVisionBlocked
- TownGateL3BLURTLVisionBlocked
- TownGateL3BRULBLVisionBlocked
- TownGateL3BRULTRVisionBlocked
- TownGateL3VerticalLeftVisionBlocked
- TownGateL3VerticalRightVisionBlocked
- LuxoriaTemple - Temple you can controll in the `Sky Temple` map
- GhostShipBeacon - Ghost ship you can 'controll' by paying coins
- ItemSoulPickup - Item you can pickup in the `Tomb of the Spider` Map, awards 1 gem.
- ItemSoulPickupFive - Item you can pickup in the `Tomb of the Spider` map, awards 5 gems.
- SoulEater - Big spider summoned when a team completes the required amount of item souls.
- SoulEaterMinion - Medium spiders summoned by the big spider in the `Tomb of the Spider` map
- ItemSoulPickupTwenty - Item you can pickup in the `Tomb of the Spider` map, awards 20 gems.
- MercLanerMeleeOgre - Siege mercenaries
- MercLanerSiegeGiant - Boss mercenarie that appears on most of the maps
- MercLanerRangedOgre - Another siege mercenarie
- JunglePlantHorror
- FootmanMinion - The normal minion
- WizardMinion - Wizard minion, usually drops a health globe when it dies
- RangedMinion - Ranged minion
- CatapultMinion - The catapult
- JungleGraveGolemDefender - Boss unit summoned in `Cursed Mines` map


Should map values to known in-game elements. Check each value count to narrow down what they could be.

Does the L2 and L3 suffix reffer to each team? Each color? Orientation?

Create tool to extract values programmatically instead of by hand.

## 9. m_upkeepPlayerId (number)

Always identical to `m_controlPlayerId`? See for details

## 10. m_x (number)

Unit spawn `x` coordinate.

## 11. m_y (number)

Unit spawn `y` coordinate.

# NNet.Replay.Tracker.SUnitDiedEvent

You may receive a `NNet.Replay.Tracker.SUnitDiedEvent` after either a UnitInit or UnitBorn event for the corresponding unit tag.

## 5. m_killerPlayerId (number | null)

References who gave the fatal blow to the unit that died

## 6. m_killerUnitTagIndex (number | null)

m_unitTagIndex for the unit that killed a particular unit, useful when the killer is not a human player but a NPC

## 7. m_killerUnitTagRecycle (number | null)

m_unitTagRecycle for the unit that killed a particular unit, useful when the killer is not a human player but a NPC

## 8. m_unitTagIndex (number)

See m_unitTagIndex for NNet.Replay.Tracker.SUnitBornEvent

## 9. m_unitTagRecycle (number)

See m_unitTagRecycke for NNet.Replay.Tracker.SUnitBornEvent

## 10. m_x (number)

Unit death `x` coordinate.

## 11. m_y (number)

Unit death `y` coordinate.

# NNet.Replay.Tracker.SUnitOwnerChangeEvent

This event occurs when a unit changes ownership, for example when the Dragon Statue is controlled by a team:
```
{"m_unitTagIndex": 104, "m_unitTagRecycle": 110, "m_controlPlayerId": 11, "_eventid": 3, "_event": "NNet.Replay.Tracker.SUnitOwnerChangeEvent", "_gameloop": 16102, "_bits": 176, "m_upkeepPlayerId": 11}
```

Here m_upkeepPlayerId/m_controlPlayerId is 11, meaning the control of the statue was granted to the blue team.

## 5. m_controlPlayerId (number)

References a player.

Always identical to `m_upkeepPlayerId`?

## 6. m_unitTagIndex (number)

See m_unitTagIndex for NNet.Replay.Tracker.SUnitBornEvent

## 7. m_unitTagRecycle (number)

See m_unitTagRecycle for NNet.Replay.Tracker.SUnitBornEvent

## 8. m_upkeepPlayerId (number)

References a player.

Always identical to `m_controlPlayerId`?

# NNet.Replay.Tracker.SUnitTypeChangeEvent

## 5. m_unitTagIndex (number)

## 6. m_unitTagRecycle (number)

## 7. m_unitTypeName (string)

Known values:

- TownCannonTowerDead

# NNet.Replay.Tracker.SUpgradeEvent

Limited number at the beginning of the game.
Also used to determine when a unit is upgraded, for example when a player is transformed to a Dragon in the Dragon Shire map.

```
{"m_playerId": 4, "_eventid": 5, "m_count": 16, "_event": "NNet.Replay.Tracker.SUpgradeEvent", "_gameloop": 16165, "_bits": 296, "m_upgradeTypeName": "VehicleDragonUpgrade"}
```
Here, the fifth player, which belongs to the blue team (remember m_playerId is 0 based) took the dragon and was upgraded to VehicleDragonUpgrade unit.

## 5. m_count (number)

## 6. m_playerId (number)

References one of the 16 game slot, need to find which.

Probably not always referencing a player because a possible value is `15`?

## 7. m_upgradeTypeName (string)

Known values:

- CreepColor
- GatesAreOpen
- IsPlayer11
- IsPlayer12
- MinionsAreSpawning
- VehicleDragonUpgrade

# NNet.Replay.Tracker.SUnitInitEvent

Not encountered in data dump. Structure extracted from source code.

`NNet.Replay.Tracker.SUnitInitEvent` events appear for units under construction. When complete you'll see a `NNet.Replay.Tracker.SUnitDoneEvent` with the same unit tag.

You may receive a `NNet.Replay.Tracker.SUnitDiedEvent` after either a UnitInit or UnitBorn event for the corresponding unit tag.

## 5. m_controlPlayerId (number)

## 6. m_unitTagIndex (number)

## 7. m_unitTagRecycle (number)

## 8. m_unitTypeName (string)

## 9. m_upkeepPlayerId (number)

## 10. m_x (number)

## 11. m_y (number)

# NNet.Replay.Tracker.SUnitDoneEvent

Not encountered in data dump. Structure extracted from source code.

## 5. m_unitTagIndex (number)

## 6. m_unitTagRecycle (number)

# NNet.Replay.Tracker.SUnitPositionsEvent

- Interpret the NNet.Replay.Tracker.SUnitPositionsEvent events like this:

        var unitIndex = event.m_firstUnitIndex;
        for (var i = 0, ln = event.m_items.length; i < ln; i += 3) {
          unitIndex += event.m_items[i + 0];
          var x = event.m_items[i + 1] * 4;
          var y = event.m_items[i + 2] * 4;
          // unit identified by unitIndex at the current event._gameloop time is at approximate position (x, y)
        }

- Only units that have inflicted or taken damage are mentioned in unit position events, and they occur periodically with a limit of 256 units mentioned per event.

## 5. m_firstUnitIndex (number)

## 6. m_items (array(number, number, ..., number))

# NNet.Replay.Tracker.SPlayerSetupEvent

One and only one for each player at the very beginning of the event list.

## 5. m_playerId (number)

Reference to the player, ranges from 1 to 10.

## 6. m_slotId (number)

Index for the player, ranges from 0 to 9.

Identical to `m_userId`.

## 7. m_type (number)

Depends on if the player is a real person or a bot?

- 1 = real player?

## 8. m_userId (number)

Index for the player, ranges from 0 to 9.

Identical to `m_slotId`.
