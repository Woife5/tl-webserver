# Their Land database API

`{username?: string}` bedeutet, dass `username` optional ist (wegen dem `?`), und dass es ein String sein muss falls es gesetzt ist.

`data: Player` bedeutet, dass `data` ein Player-Objekt ist (siehe Enums).

`data: [Player]` bedeutet, dass `data` ein Array bestehend aus Player-Objekten ist.

`kills+` bedeutet, dass die Anzahl der Kills zur aktuellen Anzahl hinzugefügt wird (oder gesetzt wird falls noch leer). `maxWave` wird überschrieben und nicht addiret. `gamesPlayed` braucht nicht extra mitgeschickt werden, es wird standardmäßig `+1` angenommen.

## Server routes

| Request | Route                  | Body                                                                                      | Result                               |
| ------- | ---------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------ |
| POST    | /api/save              | `{steamId: String, username?: String, storyCompleted?: boolean}`                          | `{success: boolean, data: Player}`   |
| POST    | /api/save/speedrun     | `{steamId: String, username?: String, level: Level, time: Number}`                        | `{success: boolean, data: Player}`   |
| POST    | /api/save/coop         | `{steamId: String, username?: String, kills+, headshots+, maxWave, score+, gamesPlayed?}` | `{success: boolean, data: Player}`   |
| GET     | /api/save/:steamId     | -                                                                                         | `{success: boolean, data: Player}`   |
| GET     | /api/speedrun          | -                                                                                         | `{success: boolean, data: [Player]}` |
| GET     | /api/speedrun/:steamId | -                                                                                         | `{success: boolean, data: Player}`   |
| GET     | /api/coop              | -                                                                                         | `{success: boolean, data: [Player]}` |
| GET     | /api/coop/:steamId     | -                                                                                         | `{success: boolean, data: Player}`   |

## Enums

| Name     | Value                                                                                              |
| -------- | -------------------------------------------------------------------------------------------------- |
| Player   | `{steamId: String, username: String, storyCompleted: boolean, speedruns: [Speedrun], coop: Coop }` |
| Speedrun | `{level: Level time: String}`                                                                      |
| Level    | `TheCrossing` \| `Surrounded` \| `NewAcquaintance` \| `Prisoned` \|`DarkForest`                    |
| Coop     | `{kills, headshots, maxWave, score, gamesPlayed}` all `Number`                                     |
