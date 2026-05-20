/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_305033613")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_42JM021PgB` ON `round_submission` (\n  `user`,\n  `round`\n)"
    ],
    "name": "round_submission"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_305033613")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_42JM021PgB` ON `user_submission` (\n  `user`,\n  `round`\n)"
    ],
    "name": "user_submission"
  }, collection)

  return app.save(collection)
})
