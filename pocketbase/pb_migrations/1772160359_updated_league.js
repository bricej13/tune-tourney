/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_161988182")

  // update collection data
  unmarshal({
    "listRule": "private = 0 || members.id ?= @request.auth.id",
    "viewRule": "private = 0 || members.id ?= @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_161988182")

  // update collection data
  unmarshal({
    "listRule": "private = false || members.id ?= @request.auth.id",
    "viewRule": ""
  }, collection)

  return app.save(collection)
})
