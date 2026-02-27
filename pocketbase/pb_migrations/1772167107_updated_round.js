/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_245912799")

  // update collection data
  unmarshal({
    "createRule": "league.members.id ?= @request.auth.id",
    "listRule": "league.private = 0 || league.members.id ?= @request.auth.id",
    "viewRule": "league.private = 0 || league.members.id ?= @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_245912799")

  // update collection data
  unmarshal({
    "createRule": "league.members ?= @request.auth.id",
    "listRule": "",
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
