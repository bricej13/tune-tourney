/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_245912799")

  // update collection data
  unmarshal({
    "listRule": "",
    "viewRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_245912799")

  // update collection data
  unmarshal({
    "listRule": "league.private = 0 || league.members ?= @request.auth.id",
    "viewRule": "league.private = 0 || league.members ?= @request.auth.id"
  }, collection)

  return app.save(collection)
})
