# 1. m_syncLobbyState (object)

## 1.1. m_gameDescription (object)

### 1.1.1. m_cacheHandles (array)

The array contains semi recognizable strings. Don't know if it's normal or because the Buffer is not parsed correctly.

### 1.1.2. m_defaultAIBuild (number)

### 1.1.3. m_defaultDifficulty (number)

### 1.1.4. m_gameCacheName (string)

### 1.1.5. m_gameOptions (object)

#### 1.1.5.1. m_advancedSharedControl (boolean)

#### 1.1.5.2. m_amm (boolean)

#### 1.1.5.3. m_battleNet (boolean)

#### 1.1.5.4. m_clientDebugFlags (number)

#### 1.1.5.5. m_competitive (boolean)

Does not indicate if playing in Hero League or Team League. true for a QuickMatch game. Maybe false vs A.I.?

#### 1.1.5.6. m_cooperative (boolean)

If the player is in a group?

#### 1.1.5.7. m_fog (number)

#### 1.1.5.8. m_heroDuplicatesAllowed (boolean)

#### 1.1.5.9. m_lockTeams (boolean)

#### 1.1.5.10. m_noVictoryOrDefeat (boolean)

#### 1.1.5.11. m_observers (number)

#### 1.1.5.12. m_practice (boolean)

Specifies if in try mode?

#### 1.1.5.13. m_randomRaces (boolean)

#### 1.1.5.14. m_teamsTogether (boolean)

#### 1.1.5.15. m_userDifficulty (number)

### 1.1.6. m_gameSpeed (number)

### 1.1.7. m_gameType (number)

### 1.1.8. m_hasExtensionMod (boolean)

### 1.1.9. m_isBlizzardMap (boolean)

Specifies if the map played is an official Blizzard map or a custom map?

Similar to `replayDecoder.details.m_isBlizzardMap`?

### 1.1.10. m_isCoopMode (boolean)

### 1.1.11. m_isPremadeFFA (boolean)

### 1.1.12. m_mapAuthorName (string)

### 1.1.13. m_mapFileName (string)

### 1.1.14. m_mapFileSyncChecksum (number)

### 1.1.15. m_mapSizeX (number)

Map width? Don't know what the unit represents.

### 1.1.16. m_mapSizeY (number)

Map height? Don't know what the unit represents.

### 1.1.17. m_maxColors (number)

### 1.1.18. m_maxControls (number)

### 1.1.19. m_maxObservers (number)

Always 6? As far as I know, the Starcraft 2 engine allows a maximum of 16 slots per game: 10 for the players, 2 for the observers, 2 for each base and 2 for something else I don't remember.

### 1.1.20. m_maxPlayers (number)

Always 10? Represents the maximum number of players per match?

### 1.1.21. m_maxRaces (number)

### 1.1.22. m_maxTeams (number)

Always 10? Import from the Starcraft 2 engine?

### 1.1.23. m_maxUsers (number)

### 1.1.24. m_modFileSyncChecksum (number)

### 1.1.25. m_randomValue (number)

### 1.1.26. m_slotDescriptions (array(object))

The following entries describe the objects contained in the `m_slotDescriptions` array.

#### 1.1.26.1. m_allowedAIBuilds (array(number, number))

#### 1.1.26.2. m_allowedColors (array(number, number))

#### 1.1.26.3. m_allowedControls (array(number, number))

#### 1.1.26.4. m_allowedDifficulty (array(number, number))

#### 1.1.26.5. m_allowedObserveTypes (array(number, number))

#### 1.1.26.6. m_allowedRaces (array, array))

## 1.2. m_lobbyState (object)

### 1.2.1. m_defaultAIBuild (number)

### 1.2.2. m_defaultDifficulty (number)

### 1.2.3. m_gameDuration (number)

### 1.2.4. m_hostUserId (null?)

### 1.2.5. m_isSinglePlayer (boolean)

### 1.2.6. m_maxObservers (number)

See 1.1.19.

### 1.2.7. m_maxUsers (number)

See 1.1.20.

### 1.2.8. m_phase (number)

### 1.2.9. m_pickedMapTag (number)

### 1.2.10. m_randomSeed (number)

### 1.2.11. m_slots (array(object))

The following entries describe the objects contained in the `m_slots` array.

They represent the 16 slots available in a game. The first 10 represent players, 2 represent observers, and as far as I know 2 of the remaining represent each base, red and blue.

#### 1.2.11.1. m_aiBuild (number)

#### 1.2.11.2. m_artifacts (array(string, string, string))

#### 1.2.11.3. m_colorPref (object)

##### 1.2.11.3.1. m_color (number)

#### 1.2.11.4. m_commander (string)

#### 1.2.11.5. m_commanderLevel (number)

#### 1.2.11.6. m_control (number)

#### 1.2.11.7. m_difficulty (number)

#### 1.2.11.8. m_handicap (number)

#### 1.2.11.8. m_hasSilencePenalty (boolean)

Specifies if the player is currently suffering from the silence penalty.

#### 1.2.11.9. m_hero (string)

Player's hero name.

See `replay.details.md` 12.4. for known heroes.

#### 1.2.11.10. m_licenses (array)

#### 1.2.11.11. m_logoIndex (number)

#### 1.2.11.12 m_mount (string)

Name of the mount used by the player.

Known mounts:

- ArmoredHorsePurple
- BillieGoat
- Cloud9Nexagon
- Direwolf
- DirewolfBrown
- HearthstoneCardRed
- HorseBlack
- HorseCommon
- MalthaelsHerohorse

#### 1.2.11.13. m_observe (number)

#### 1.2.11.14. m_racePref (object)

##### 1.2.11.14.1. m_race (null?)

#### 1.2.11.15. m_rewards (array(number, number, ..., number))

Full of numbers for actual players but empty for other slots.

#### 1.2.11.16. m_skin (string)

Name of the hero skin used by the player.

Known skins:

- AbathurBone
- CrusaderRed
- JainaBlue
- KaelthasUltimateWhite
- MuradinMagniDarkIron

#### 1.2.11.17. m_tandemLeaderUserId (null?)

#### 1.2.11.18. m_teamId (number)

Either: 

- 0 for blue team, 1 for red team
- 0 for left team, 1 for right team
- 0 for "my" team, 1 for "their" team

#### 1.2.11.19. m_toonHandle (string)

Unique identifier for each player.

Format: `{region}-Hero-{realm}-{(id)}`

See `replay.details.md` 12.10. for details.

#### 1.2.11.20. m_userId (number)

#### 1.2.11.21. m_workingSetSlotId (number)

Index in `m_slots` and probably other arrays referencing players such as `replay.details.md` 12. `m_playerList`.

## 1.3. m_userInitialData (array(object))

The following entries describe the objects in the `m_userInitialData` array.

They represent the 16 slots available in a game. The first 10 represent players, 2 represent observers, and as far as I know 2 of the remaining represent each base, red and blue.

### 1.3.1. m_clanLogo (null?)

### 1.3.2. m_clanTag (string)

### 1.3.3. m_combinedRaceLevels (number)

### 1.3.4. m_customInterface (boolean)

### 1.3.5. m_examine (boolean)

### 1.3.6. m_hero (string)

While this represents a player, it's hero is not set and this contains an empty string. Hero can be identified using `m_name`.

### 1.3.7. m_highestLeague (number)

### 1.3.8. m_mount (string)

### 1.3.9. m_name (string)

Player name.

### 1.3.10. m_observe (number)

### 1.3.11. m_racePreference (object)

#### 1.3.11.1. m_race (null?)

### 1.3.12. m_randomSeed (number)

### 1.3.13. m_skin (string)

While this represents a player, it's skin is not set and this contains an empty string. Hero can be identified using `m_name`.

### 1.3.14. m_teamPreference (object)

#### 1.3.14.1. m_team (null?)

### 1.3.15. m_testAuto (boolean)

### 1.3.16. m_testMap (boolean)

### 1.3.17. m_testType (number)

### 1.3.18. m_toonHandle (string)

While this represents a player, it's toonHandle is not set and this contains an empty string. Hero can be identified using `m_name`.
