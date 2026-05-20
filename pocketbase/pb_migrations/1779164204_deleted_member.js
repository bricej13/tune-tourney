/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2566894071");

  return app.delete(collection);
}, (app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
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
        "id": "_clone_mbnR",
        "max": 255,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "help": "",
        "hidden": false,
        "id": "_clone_N8jO",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [
          "image/jpeg",
          "image/png",
          "image/svg+xml",
          "image/gif",
          "image/webp"
        ],
        "name": "avatar",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": null,
        "type": "file"
      }
    ],
    "id": "pbc_2566894071",
    "indexes": [],
    "listRule": null,
    "name": "member",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT id, name, avatar from users;",
    "viewRule": "@request.auth.id != \"\""
  });

  return app.save(collection);
})
