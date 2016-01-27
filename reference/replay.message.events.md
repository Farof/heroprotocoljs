replay.message.events is an array containing events whose types are specified in the `protocol#####.js` files under the `message_event_types` variable.

# 1. NNet.Game.SChatMessage

# 2. NNet.Game.SPingMessage

# 3. NNet.Game.SLoadingProgressMessage

# 4. NNet.Game.SServerPingMessage

# 5. NNet.Game.SReconnectNotifyMessage
replay.message.events is an array containing events whose types are specified in the `protocol#####.js` files under the `message_event_types` variable.

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

# NNet.Game.SChatMessage

Event describing a chat message.

## 6. m_recipient (number)

Maybe a chat type, like the game chat, whisper, others.

- 1 = game chat?

## 7. m_string (string)

The chat message sent by the player.

# NNet.Game.SPingMessage

## 6. m_point (object)

Event describing a ping.

Is used for player pings. Are the map pings, like objective spawn, using this or other events?

### 6.1. x (number)

Ping x coordinate. Parsed value can be a big negative, maybe an integer overflow?

Should find how to translate it to actual usable coordinate.

### 6.2. y (number)

Ping y coordinate. Parsed value can be a big negative, maybe an integer overflow?

Should find how to translate it to actual usable coordinate.

## 7. m_recipient (number)

Maybe a chat type, like the game chat, whisper, others.

- 1 = game chat?

# NNet.Game.SLoadingProgressMessage

Probably describes each player progress in the loading screen.

## 6. m_progress (number)

Parsed value can be a big negative, maybe an integer overflow?

Should find how to translate it to an actual progress value.

# NNet.Game.SServerPingMessage

Not present in the file for analysis. The protocol source describes it as an empty structure.

# NNet.Game.SReconnectNotifyMessage

## 6. m_status (number)
