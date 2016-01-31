replay.game.events is an array containing events whose types are specified in the `lib/protocol#####.js` files under the `game_event_types` variable.

---

Convert `m_unitTagIndex` and `m_unitTagRecycle` into a unit tag `m_tag` with `protocol.unitTag(m_unitTagIndex, m_unitTagRecycle)`.

`m_tag` is useful to determine what unit was targeted by a skill, for example in this `NNet.Game.SCmdEvent`:

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

We see that the unit with tag `45350913` was the target of the ability id `147` casted by player `5`.

Convert `m_tag` into a unit tag index `m_unitTagIndex` and unit tag recycle `m_unitTagRecycle` with `protocol.unitTagIndex(m_tag)` and `protocol.unitTagRecycle(m_tag)`.

---

Events contain generic properties and type specific properties.

# Generic

## 1. _bits (number)

## 2. _event (string)

Event type.

## 3. _eventid (number)

Not a unique identifier.

## 4. _gameloop (null?)

## 5. _userid (object)

### 5.1. m_userId (number)

Index of the player associated with the event in arrays referencing players.

# NNet.Game.SUserFinishedLoadingSyncEvent

No specific properties. Use `_userid.m_userId`.

# NNet.Game.SUserOptionsEvent

Some configuration options of each player.

## 6. m_baseBuildNum (number)

Base build of the game client that was used to write the replay. Version of the protocol to use to decode the replay.

## 7. m_buildNum (number)

## 8. m_cameraFollow (boolean)

Specifies if the camera is set to follow the player automatically.

## 9. m_debugPauseEnabled (boolean)

## 10. m_developmentCheatsEnabled (boolean)

## 11. m_gameFullyDownloaded (boolean)

## 12. m_hotkeyProfile (string)

Name of the hokey profile used.

## 13.m_isMapToMapTransition (boolean)

## 14. m_multiplayerCheatsEnabled (boolean)

## 15. m_platformMac (boolean)

Specifies if the player is playing on Mac OS X.

## 16. m_syncChecksummingEnabled (boolean)

## 17. m_testCheatsEnabled (boolean)

## 18. m_useGalaxyAsserts (boolean)

## 19. m_versionFlags (number)

# NNet.Game.SBankFileEvent

## 6. m_name (string)

Known values:

- PlayerSettings - only value?

# NNet.Game.SBankSectionEvent

## 6. m_name (string)

Known values:

- DeathTipDisplayCounts
- MapPlayCounts
- NewUserTrainingMode
- Settings
- TotalPlayCount

# NNet.Game.SBankKeyEvent

## 6. m_data (string)

String representation of a number.

## 7. m_name (string)

Known values:

- BattlefieldOfEternity
- BlackheartsBay
- ControlPoints
- Crypts
- CursedHollow
- DeathActionCam
- DragonShire
- EnemyFountainDeath
- FollowMinions
- Gangups
- HauntedMines
- HauntedWoods
- MinimapCommandsEnabled
- MinionsvsTowns
- Moonwell
- Mount
- NEWUSER_ONOFF
- NEWUSER_ReferenceCardTimes
- NEWUSER_TIP_0
- NEWUSER_TIP_1
- NEWUSER_TIP_10
- NEWUSER_TIP_11
- NEWUSER_TIP_12
- NEWUSER_TIP_13
- NEWUSER_TIP_14
- NEWUSER_TIP_15
- NEWUSER_TIP_16
- NEWUSER_TIP_17
- NEWUSER_TIP_18
- NEWUSER_TIP_19
- NEWUSER_TIP_2
- NEWUSER_TIP_3
- NEWUSER_TIP_4
- NEWUSER_TIP_5
- NEWUSER_TIP_6
- NEWUSER_TIP_7
- NEWUSER_TIP_8
- NEWUSER_TIP_9
- NEWUSER_TalentTeaching
- Retreat
- Shrines
- TotalPlayCount
- TowersOfDoom
- TrainTalents
- UseYourAbilities

## 8. m_type (number)

Either `1` or `2`.

# NNet.Game.SBankValueEvent

A replay can have none.

# NNet.Game.SBankSignatureEvent

## 6. m_signature (array)

Always empty?

## 7. m_toonHandle (string)

Unique identifier for a player. See `replay.details` reference, section `12.10.`.

# NNet.Game.SCameraSaveEvent

A replay can have none.

# NNet.Game.SSaveGameEvent

A replay can have none.

# NNet.Game.SSaveGameDoneEvent

A replay can have none.

# NNet.Game.SLoadGameDoneEvent

A replay can have none.

# NNet.Game.SCommandManagerResetEvent

# 6. m_sequence (number)

Always 1?

# NNet.Game.SGameCheatEvent

A replay can have none.

Probably used for development purpose.

# NNet.Game.SCmdEvent

Describes a player ability usage.

## 6. m_abil (object)

### 6.1. m_abilCmdData (null | number)

### 6.2. m_abilCmdIndex (number)

### 6.3. m_abilLink (number)

Ability used by player identified with `_userid.m_userId`.

Known values:

- 36
- 45
- 58
- 120
- 168
- 169
- 173
- 174
- 175
- 176
- 177
- 181
- 251
- 273
- 280
- 291
- 292
- 294
- 312
- 353
- 354
- 371
- 377
- 378
- 379
- 380
- 381
- 396
- 524
- 543
- 545
- 546
- 548
- 552
- 554
- 556
- 557
- 562
- 563
- 564
- 565
- 569
- 571
- 572
- 573
- 575
- 578
- 582
- 584
- 662
- 665
- 666
- 667
- 668

Need to match ablity ids with names.

## 7. m_cmdFlags (number)

## 8. m_data (object)

Additional data relative to the ability used. The object has one of these property containing the data:

### None (null)

The ability is non-targeted.

Always `null`.

### TargetPoint (object)

The ability is a skillshot, targeted at a point on the map.

#### 8.1. x (number)

#### 8.2. y (number)

#### 8.3. z (number)

### TargetUnit (object)

The ability targets a unit.

#### 8.1. m_snapshotControlPlayerId (number)

Id of the targeted player.

#### 8.2. m_snapshotPoint (object)

The position of the targeted unit.

##### 8.2.1. x (number)

##### 8.2.2. y (number)

##### 8.2.3. z (number)

#### 8.3. m_snapshotUnitLink (number)

#### 8.4. m_snapshotUpkeepPlayerId (5)

Id of the targeted player.

#### 8.5. m_tag (number)

See note concerning unit tags at the top of this document.

#### 8.6. m_targetUnitFlags (number)

#### 8.7. m_timer (number)

## 9. m_otherUnit (null | number)

## 10. m_sequence (number)

## 11. m_unitGroup (null | number)

# NNet.Game.SSelectionDeltaEvent

## 6. m_controlGroupId (number)

## 7. m_delta (object)

### 7.1. m_addSubgroups (array(object))

The following entries describe the objects contained in the `m_addSubgroups` array.

#### 7.1.1. m_count (number)

#### 7.1.2. m_intraSubgroupPriority (number)

#### 7.1.3. m_subgroupPriority (number)

#### 7.1.4. m_unitLink (number)

### 7.2. m_addUnitTags(array(number))

### 7.3. m_removeMask (object)

The object has one of these property containing the data:

#### None (null)

#### Mask (array)

Byte array.

### 7.4. m_subgroupIndex (number)

# NNet.Game.SControlGroupUpdateEvent

A replay can have none.

# NNet.Game.SSelectionSyncCheckEvent

A replay can have none.

# NNet.Game.SResourceTradeEvent

A replay can have none.

# NNet.Game.STriggerChatMessageEvent

## 6. m_chatMessage (string)

Chat message sent by player `_userid.m_userId`.

# NNet.Game.SAICommunicateEvent

A replay can have none.

# NNet.Game.SSetAbsoluteGameSpeedEvent

A replay can have none.

# NNet.Game.SAddAbsoluteGameSpeedEvent

A replay can have none.

# NNet.Game.STriggerPingEvent

## 6. m_option (number)

## 7. m_pingedMinimap (boolean)

Specifies if the ping was done thought the minimap.

## 8. m_point (object)

Ping coordinate.

### 8.1. x (number)

### 8.2. y (number)

## 9. m_unit (number)

If the ping targets a unit, like a player or objective? Unit tag?

# NNet.Game.SBroadcastCheatEvent

A replay can have none.

# NNet.Game.SAllianceEvent

A replay can have none.

# NNet.Game.SUnitClickEvent

## 6. m_unitTag (number)

See note concerning unit tags at the top of this document.

# NNet.Game.SUnitHighlightEvent

A replay can have none.

# NNet.Game.STriggerReplySelectedEvent

A replay can have none.

# NNet.Game.SHijackReplayGameEvent

A replay can have none.

# NNet.Game.STriggerSkippedEvent

A replay can have none.

# NNet.Game.STriggerSoundLengthQueryEvent

A replay can have none.

# NNet.Game.STriggerSoundOffsetEvent

## 6. m_sound (number)

# NNet.Game.STriggerTransmissionOffsetEvent

## 6. m_thread (number)

## 7. m_transmissionId (number)

# NNet.Game.STriggerTransmissionCompleteEvent

## 6. m_transmissionId (number)

# NNet.Game.SCameraUpdateEvent

## 6. m_distance (null | number)

## 7. m_follow (boolean)

## 8. m_pitch (boolean)

## 9. m_reason (boolean)

## 10. m_target (object)

### 10.1. x (number)

### 10.2. y (number)

## 11. m_yaw (null | number)

# NNet.Game.STriggerAbortMissionEvent

A replay can have none.

# NNet.Game.STriggerPurchaseMadeEvent

A replay can have none.

# NNet.Game.STriggerPurchaseExitEvent

A replay can have none.

# NNet.Game.STriggerPlanetMissionLaunchedEvent

A replay can have none.

# NNet.Game.STriggerPlanetPanelCanceledEvent

A replay can have none.

# NNet.Game.STriggerDialogControlEvent

## 6. m_controlId (number)

## 7. m_eventData (object)

The object has one of these property containing the data:

### None (null)

### Checked (boolean)

### ValueChanged (number)

### SelectionChanged (number)

### TextChanged (string)

### MouseButton (number)

## 8. m_eventType (number)

# NNet.Game.STriggerSoundLengthSyncEvent

## 6. m_syncInfo (object)

### 6.1. m_length (array(number))

### 6.2. m_soundHash (array(number))

# NNet.Game.STriggerConversationSkippedEvent

A replay can have none.

# NNet.Game.STriggerMouseClickedEvent

A replay can have none.

# NNet.Game.STriggerMouseMovedEvent

A replay can have none.

# NNet.Game.SAchievementAwardedEvent

A replay can have none.

# NNet.Game.STriggerHotkeyPressedEvent

A replay can have none.

# NNet.Game.STriggerTargetModeUpdateEvent

A replay can have none.

# NNet.Game.STriggerPlanetPanelReplayEvent

A replay can have none.

# NNet.Game.STriggerSoundtrackDoneEvent

## 6. m_soundtrack (number)

# NNet.Game.STriggerPlanetMissionSelectedEvent

A replay can have none.

# NNet.Game.STriggerKeyPressedEvent

A replay can have none.

# NNet.Game.STriggerMovieFunctionEvent

A replay can have none.

# NNet.Game.STriggerPlanetPanelBirthCompleteEvent

A replay can have none.

# NNet.Game.STriggerPlanetPanelDeathCompleteEvent

A replay can have none.

# NNet.Game.SResourceRequestEvent

A replay can have none.

# NNet.Game.SResourceRequestFulfillEvent

A replay can have none.

# NNet.Game.SResourceRequestCancelEvent

A replay can have none.

# NNet.Game.STriggerResearchPanelExitEvent

A replay can have none.

# NNet.Game.STriggerResearchPanelPurchaseEvent

A replay can have none.

# NNet.Game.STriggerResearchPanelSelectionChangedEvent

A replay can have none.

# NNet.Game.STriggerCommandErrorEvent

A replay can have none.

# NNet.Game.STriggerMercenaryPanelExitEvent

A replay can have none.

# NNet.Game.STriggerMercenaryPanelPurchaseEvent

A replay can have none.

# NNet.Game.STriggerMercenaryPanelSelectionChangedEvent

A replay can have none.

# NNet.Game.STriggerVictoryPanelExitEvent

A replay can have none.

# NNet.Game.STriggerBattleReportPanelExitEvent

A replay can have none.

# NNet.Game.STriggerBattleReportPanelPlayMissionEvent

A replay can have none.

# NNet.Game.STriggerBattleReportPanelPlaySceneEvent

A replay can have none.

# NNet.Game.STriggerBattleReportPanelSelectionChangedEvent

A replay can have none.

# NNet.Game.STriggerVictoryPanelPlayMissionAgainEvent

A replay can have none.

# NNet.Game.STriggerMovieStartedEvent

A replay can have none.

# NNet.Game.STriggerMovieFinishedEvent

A replay can have none.

# NNet.Game.SDecrementGameTimeRemainingEvent

A replay can have none.

# NNet.Game.STriggerPortraitLoadedEvent

A replay can have none.

# NNet.Game.STriggerCustomDialogDismissedEvent

A replay can have none.

# NNet.Game.STriggerGameMenuItemSelectedEvent

A replay can have none.

# NNet.Game.STriggerMouseWheelEvent

A replay can have none.

# NNet.Game.STriggerPurchasePanelSelectedPurchaseItemChangedEvent

A replay can have none.

# NNet.Game.STriggerPurchasePanelSelectedPurchaseCategoryChangedEvent

A replay can have none.

# NNet.Game.STriggerButtonPressedEvent

A replay can have none.

# NNet.Game.STriggerGameCreditsFinishedEvent

A replay can have none.

# NNet.Game.STriggerCutsceneBookmarkFiredEvent

A replay can have none.

# NNet.Game.STriggerCutsceneEndSceneFiredEvent

6. m_cutsceneId (number)

# NNet.Game.STriggerCutsceneConversationLineEvent

A replay can have none.

# NNet.Game.STriggerCutsceneConversationLineMissingEvent

A replay can have none.

# NNet.Game.SGameUserLeaveEvent

When a player leaves the game.

## 6. m_leaveReason (number)

- 0: end of game
- 11: disconnected?

# NNet.Game.SGameUserJoinEvent

Emitted only for reconnection event, not at the start of the game.

## 6. m_clanLogo (null | string)

## 7. m_clanTag (string)

## 8. m_hijack (boolean)

## 9. m_hijackCloneGameUserId (null | number)

## 10. m_name (string)

Name of the player that joined.

## 11. m_observe (number)

## 12. m_toonHandle (string)

Unique identifier for a player. See `replay.details` reference, section `12.10.`.

# NNet.Game.SCommandManagerStateEvent

## 6. m_sequence (number)

## 7. m_state (number)

# NNet.Game.SCmdUpdateTargetPointEvent

## 6. m_target (object)

### 6.1. x (number)

### 6.2. y (number)

### 6.3. z (number)

# NNet.Game.SCmdUpdateTargetUnitEvent

## 6. m_target (object)

### 6.1 m_snapshotControlPlayerId (number)

### 6.2. m_snapshotPoint (object)

#### 6.2.1. x (number)

#### 6.2.2. y (number)

#### 6.2.3. z (number)

### 6.3. m_snapshotUnitLink (number)

### 6.4. m_snapshotUpkeepPlayerId (number)

### 6.5. m_tag (number)

See note concerning unit tags at the top of this document.

### 6.6. m_targetUnitFlags (number)

### 6.7. m_timer (number)

# NNet.Game.STriggerAnimLengthQueryByNameEvent

A replay can have none.

# NNet.Game.STriggerAnimLengthQueryByPropsEvent

A replay can have none.

# NNet.Game.STriggerAnimOffsetEvent

A replay can have none.

# NNet.Game.SCatalogModifyEvent

A replay can have none.

# NNet.Game.SHeroTalentTreeSelectedEvent

## 6. m_index (number)

Presumably the index of the talent for the player.

Need to match this index to a talent for each hero.

# NNet.Game.STriggerProfilerLoggingFinishedEvent

A replay can have none.

# NNet.Game.SHeroTalentTreeSelectionPanelToggledEvent

A replay can have none.
