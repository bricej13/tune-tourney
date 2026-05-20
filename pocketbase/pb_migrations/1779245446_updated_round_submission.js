/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_305033613")

  // update field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "select2744374011",
    "maxSelect": 1,
    "name": "state",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "unsubmitted",
      "submitted"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_305033613")

  // update field
  collection.fields.addAt(3, new Field({
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
  }))

  return app.save(collection)
})
