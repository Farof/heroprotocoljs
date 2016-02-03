# 1. m_cacheHandles (array)

The strings don't contain any readable information and are identical to those exported by the original python library.

# 2. m_campaignIndex (number)

# 3. m_defaultDifficulty (number)

# 4. m_description (string)

# 5. m_difficulty (string)

# 6. m_gameSpeed (number)

# 7. m_imageFilePath (string)

# 8. m_isBlizzardMap (boolean)

Specifies if the map played is an official Blizzard map or a custom map?

Similar to `replayDecoder.initdata.m_syncLobbyState.m_gameDescription.m_isBlizzardMap`?

# 9. m_mapFileName (string)

# 10. m_miniSave (boolean)

# 11. m_modPaths (null?)

# 12. m_playerList (array)

Array of the players in the match.

The following entries describe the information of individual players.

## 12.1. m_color (object)

Either rgba(36, 92, 255, 255) for "blue" or rgba(255, 0, 0, 255) for "red".

### 12.1.1. m_a (number)

Always 255.

### 12.1.2. m_b (number)

255 for "blue" or 0 for "red".

### 12.1.3. m_g (number)

92 for "blue" or 0 for "red".

### 12.1.4. m_r (number)

30 for "blue" or 255 for "red".

## 12.2. m_control (number)

## 12.3. m_handicap (number)

## 12.4. m_hero (string)

Player's hero name.

Known heroes:

- Abathur
- Crusader (= Johanna)
- DemonHunter (= Valla)
- Jaina
- Johanna (= Crusader)
- Kael'thas (= Kaelthas)
- Kaelthas (= Kael'thas)
- Kerrigan
- Leoric
- Muradin
- Sylvanas
- Valla (= DemonHunter)

`replay.details` uses real names while `replay.initdata` uses the class name for Diablo 3 heroes and removes the separator for heroes having one in their name.

## 12.5. m_name (string)

Player's name.

## 12.6. m_observe (number)

## 12.7. m_race (string)

## 12.8. m_result (number)

Indicates if the player lost or won the game?

- 1 = won
- 2 = lost

## 12.9. m_teamId (number)

Either: 

- 0 for blue team, 1 for red team
- 0 for left team, 1 for right team
- 0 for "my" team, 1 for "their" team

## 12.10. m_toon (object)

Combine properties to create your unique identifier `m_toonHandle`. This identifiier is in the path to your profile and replays on your file system. On Windows, by default: `C:\Users\{UserName}\Documents\Heroes of the Storm\Accounts\1022983\{m_toonHandle}\`

Format: `m_toonHandle = {m_region}-{m_programId}-{m_realm}-{m_id}`

`m_toonHandle` is referenced in `replay.initdata.md` 1.2.11.19.

### 12.10.1. m_id (number)

Unique identifier for each account.

### 12.10.2. m_programId (string)

### 12.10.3. m_realm (number)

Live or PTR?

1 = live?

### 12.10.4. m_region (number)

Region number depending on if the game was played in European, American, Asian?

Need to match a value to a region.

1 = North America
2 = Europe?

## 12.11. m_workingSetSlotId (number)

Index of the player in the array and possibly arrays referencing players such as `replay.initdata.md` 1.2.11. `m_slots`.

# 13. m_restartAsTransitionMap (false)

# 14. m_thumbnail (object)

## 14.1. m_file (string)

Always "ReplaysPreviewImage.tga"?

Probably an existing image in the game files.

# 15. m_timeLocalOffset (number)

Number representation of a Date at the local timezone of the player. Should be constant for every game in the same timezone?

The date is near epoch for me, don't know if it's normal and should maybe be offset or if it's an error.

    var timeLocalOffset = new Date(m_timeLocalOffsit);

# 16. m_timeUTC (number)

Number representation of a Date at the local timezone of the player. Time the game started?

The date is near epoch for me, don't know if it's normal and should maybe be offset or if it's an error.

    var timeUTC = new Date(m_timeUTC);

# 17. m_title (string)

Name of the map being played.
