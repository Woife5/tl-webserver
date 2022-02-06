# Their Land database API

`{username?: string}` bedeutet, dass `username` optional ist (wegen dem `?`), und dass es ein String sein muss falls es gesetzt ist.

`data: Player` bedeutet, dass `data` ein Player-Objekt ist (siehe Enums).

`data: [Player]` bedeutet, dass `data` ein Array bestehend aus Player-Objekten ist.

`kills+` bedeutet, dass die Anzahl der Kills zur aktuellen Anzahl hinzugefügt wird (oder gesetzt wird falls noch leer). `maxWave` wird überschrieben und nicht addiret. `gamesPlayed` braucht nicht extra mitgeschickt werden, es wird standardmäßig `+1` angenommen.

Alle `/api/save` Methoden legen den Player neu an in der Datenbank falls dieser noch nicht existiert. Standardmäßig wird `username` auf 'No Name' gesetzt und `gameCompleted` auf `false`.

## Server routes

| Request | Route                                | Body                                                                                      | Result                                                                   |
| ------- | ------------------------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| POST    | /api/save                            | `{steamId: String, username?: String, storyCompleted?: boolean}`                          | `{success: boolean, data: Player}`                                       |
| POST    | /api/save/speedrun                   | `{steamId: String, username?: String, level: Level, time: Number}`                        | `{success: boolean, data: Player, newBest: boolean}`                     |
| POST    | /api/save/coop                       | `{steamId: String, username?: String, kills+, headshots+, maxWave, score+, gamesPlayed?}` | `{success: boolean, data: Player}`                                       |
| GET     | /api/save/:steamId                   | -                                                                                         | `{success: boolean, data: Player}`                                       |
| GET     | /api/speedrun/level/:levelName       | -                                                                                         | `{success: boolean, data: [SRLevelData]}` in ASC order                   |
| GET     | /api/speedrun/player/:steamId        | -                                                                                         | `{success: boolean, data: SRPlayerData}`                                 |
| GET     | /api/coop/stats/global               | -                                                                                         | `{success: boolean, data: [CoopData]}` in DESC order (on maxWave)        |
| GET     | /api/coop/stats/global/sort/:orderBy | -                                                                                         | `{success: boolean, data: [CoopData]}` in DESC order (on provided field) |
| GET     | /api/coop/stats/player/:steamId      | -                                                                                         | `{success: boolean, data: CoopData}`                                     |

## Temp routes

These will be removed at some point in the future.

| Request | Route          | Body                              | Result                             |
| ------- | -------------- | --------------------------------- | ---------------------------------- |
| POST    | /api/save/skin | `{steamId: String, skin: String}` | `{success: boolean, data: Player}` |

## Enums

| Name                | Value                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `Player`            | `{steamId: String, username: String, storyCompleted: boolean, speedruns: Speedruns, coop: Coop, skins: [Skin] }`              |
| `Skin`              | `gold \| color`                                                                                                               |
| `Speedruns`         | `{TheCrossing, Surrounded, NewAcquaintance, Prisoned, DarkForest}` all `Number`, default: `0`                                 |
| `Coop`              | `{kills, headshots, maxWave, score, gamesPlayed}` all `Number`, default: `0`                                                  |
| `SRLevelData`       | `{steamId: String, username: String, time: Number}`                                                                           |
| `SRPlayerData`      | `{steamId: String, username: String, TheCrossing, Surrounded, NewAcquaintance, Prisoned, DarkForest}` all `SRPlayerLevelData` |
| `SRPlayerLevelData` | `{time: Number, rank: Number}` values will be `0` if no speedrun was completed                                                |
| `CoopData`          | `{steamId: String, username: String, kills, headshots, maxWave, score, gamesPlayed}` all `Number`                             |

## Beschreibung

### /api/save

Zum Eintragen/Ändern eines Spielernamens und/oder ändern des `storyCompleted`-Flags. Beispiele:

    `POST /api/save {steamId: 'STEAM_0:1:1234567890', username: 'Woife'}`
    `POST /api/save {steamId: 'STEAM_0:1:1234567891', username: 'Thomas', storyCompleted: true}`
    `POST /api/save {steamId: 'STEAM_0:1:1234567892', storyCompleted: true}`

### /api/save/speedrun

Zum Eintragen/Ändern eines Speedruns. `username` ist Optional, wenn einer mitgeschickt wird, wird dieser in der Datenbank aktualisiert. `level` muss ein gültiger Levelname sein (siehe Enums/Speedruns). `time` ist die benötigte Zeit in Sekunden. Ist die benötigte Zeit länger als der letzte Versuch, dann wird der neue Wert nicht abgespeichert. Der Boolsche Wert `newBest` in der Antwort wird dann `false` sein, wenn aber der geschickte Wert eingetragen wurde wird dieser `true`. Beispiele:

    `POST /api/save/speedrun {steamId: 'STEAM_0:1:1234567890', username: 'Woife', level: 'TheCrossing', time: 12345}`
    `POST /api/save/speedrun {steamId: 'STEAM_0:1:1234567891', username: 'Thomas', level: 'Surrounded', time: 67890}`
    `POST /api/save/speedrun {steamId: 'STEAM_0:1:1234567892', level: 'NewAcquaintance', time: 12345}`
    `POST /api/save/speedrun {steamId: 'STEAM_0:1:1234567893', level: 'Prisoned', time: 67890}`
    `POST /api/save/speedrun {steamId: 'STEAM_0:1:1234567894', level: 'DarkForest', time: 12345}`

### /api/save/coop

Zum Eintragen/Erhöhen der Coop-Stats. `username` ist Optional, wenn einer mitgeschickt wird, wird dieser in der Datenbank aktualisiert. `gamesPlayed` kann (und sollte) weggelassen werden, dann wird `+1` eingetragen. Alternativ kann ein Wert mitgesendet werden, dann wird dieser Wert dazuaddiert. `maxWave` ist der einzige Wert, der nicht aufsummiert wird sondern überschrieben wenn dieser größer als der bereits eingetragene Wert ist. Beispiele:

    `POST /api/save/coop {steamId: 'STEAM_0:1:1234567890', username: 'Woife', kills: 10, headshots: 5, maxWave: 3, score: 100}`
    `POST /api/save/coop {steamId: 'STEAM_0:1:1234567891', username: 'Thomas', kills: 10, headshots: 5, maxWave: 3, score: 100, gamesPlayed: 1}`
    `POST /api/save/coop {steamId: 'STEAM_0:1:1234567892', kills: 10, headshots: 5, maxWave: 3, score: 100}`
    `POST /api/save/coop {steamId: 'STEAM_0:1:1234567893', kills: 20, headshots: 2, maxWave: 5, score: 700}`
