/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "round_submission.user.id = @request.auth.id",
    "deleteRule": "round_submission.user.id = @request.auth.id",
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
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text2835741788",
        "max": 0,
        "min": 0,
        "name": "spotify_id",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text1579384326",
        "max": 0,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text22648455",
        "max": 0,
        "min": 0,
        "name": "artist",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text966291011",
        "max": 0,
        "min": 0,
        "name": "album",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "exceptDomains": null,
        "help": "",
        "hidden": false,
        "id": "url2620085837",
        "name": "album_art",
        "onlyDomains": null,
        "presentable": false,
        "required": true,
        "system": false,
        "type": "url"
      },
      {
        "help": "",
        "hidden": true,
        "id": "json3698608274",
        "maxSize": 0,
        "name": "spotify_payload",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_305033613",
        "help": "",
        "hidden": false,
        "id": "relation3230604423",
        "maxSelect": 0,
        "minSelect": 0,
        "name": "round_submission",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
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
    "id": "pbc_353582209",
    "indexes": [],
    "listRule": null,
    "name": "submission_track",
    "system": false,
    "type": "base",
    "updateRule": "round_submission.user.id = @request.auth.id",
    "viewRule": "round_submission.user.id = @request.auth.id || (round_submission.round.league.members ?= @request.auth.id && round_submission.round.status = 'complete')"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_353582209");

  return app.delete(collection);
})
