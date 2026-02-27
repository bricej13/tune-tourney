/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_245912799")

  // update collection data
  unmarshal({
    "deleteRule": "status = 'not_started' && (@request.auth.id = createdBy.id || @request.auth.id = league.owner.id)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_245912799")

  // update collection data
  unmarshal({
    "deleteRule": "status = 'not_started' && @request.auth.id = createdBy.id"
  }, collection)

  return app.save(collection)
})
