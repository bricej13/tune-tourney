/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "round.league.members ?= @request.auth.id",
    "deleteRule": "@request.auth.id = user.id",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "help": "",
        "hidden": false,
        "id": "relation2375276105",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "user",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_245912799",
        "help": "",
        "hidden": false,
        "id": "relation3320769076",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "round",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "help": "",
        "hidden": false,
        "id": "select2744374011",
        "maxSelect": 1,
        "name": "state",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "unsubmitted",
          "submitted"
        ]
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_305033613",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_42JM021PgB` ON `user_submission` (\n  `user`,\n  `round`\n)"
    ],
    "listRule": "round.league.members ?= @request.auth.id",
    "name": "user_submission",
    "system": false,
    "type": "base",
    "updateRule": "@request.auth.id = user.id",
    "viewRule": "round.league.members ?= @request.auth.id"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_305033613");

  return app.delete(collection);
})
