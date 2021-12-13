# Their Land database API

`{username?: string}` bedeutet, dass `username` optional ist (wegen dem `?`), und dass es ein String sein muss falls es gesetzt ist.

`data: Player` bedeutet, dass `data` ein Player-Objekt ist (siehe Enums).

`data: [Player]` bedeutet, dass `data` ein Array bestehend aus Player-Objekten ist.

`kills+` bedeutet, dass die Anzahl der Kills zur aktuellen Anzahl hinzugefügt wird (oder gesetzt wird falls noch leer). `maxWave` wird überschrieben und nicht addiret. `gamesPlayed` braucht nicht extra mitgeschickt werden, es wird standardmäßig `+1` angenommen.

Alle `/api/save` Methoden legen den Player neu an in der Datenbank falls dieser noch nicht existiert. Standardmäßig wird `username` auf 'No Name' gesetzt und `gameCompleted` auf `false`.

## Server routes

| Request | Route                           | Body                                                                                      | Result                                                 |
| ------- | ------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| POST    | /api/save                       | `{steamId: String, username?: String, storyCompleted?: boolean}`                          | `{success: boolean, data: Player}`                     |
| POST    | /api/save/speedrun              | `{steamId: String, username?: String, level: Level, time: Number}`                        | `{success: boolean, data: Player, newBest: boolean}`   |
| POST    | /api/save/coop                  | `{steamId: String, username?: String, kills+, headshots+, maxWave, score+, gamesPlayed?}` | `{success: boolean, data: Player}`                     |
| GET     | /api/save/:steamId              | -                                                                                         | `{success: boolean, data: Player}`                     |
| GET     | /api/speedrun/level/:levelName  | -                                                                                         | `{success: boolean, data: [SRLevelData]}` in ASC order |
| GET     | /api/speedrun/player/:steamId   | -                                                                                         | `{success: boolean, data: SRPlayerData}`               |
| GET     | /api/coop/stats/global          | -                                                                                         | `{success: boolean, data: [CoopData]}`                 |
| GET     | /api/coop/stats/player/:steamId | -                                                                                         | `{success: boolean, data: CoopData}`                   |

## Enums

| Name                | Value                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `Player`            | `{steamId: String, username: String, storyCompleted: boolean, speedruns: Speedruns, coop: Coop }`                             |
| `Speedruns`         | `{TheCrossing, Surrounded, NewAcquaintance, Prisoned, DarkForest}` all `Number`, default: `0`                                 |
| `Coop`              | `{kills, headshots, maxWave, score, gamesPlayed}` all `Number`, default: `0`                                                  |
| `SRLevelData`       | `{steamId: String, username: String, time: Number}`                                                                           |
| `SRPlayerData`      | `{steamId: String, username: String, TheCrossing, Surrounded, NewAcquaintance, Prisoned, DarkForest}` all `SRPlayerLevelData` |
| `SRPlayerLevelData` | `{time: Number, rank: Number}` values will be `0` if no speedrun was completed                                                |
| `CoopData`          | `{steamId: String, username: String, kills, headshots, maxWave, score, gamesPlayed}` all `Number`                             |
