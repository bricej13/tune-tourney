
onRecordCreateRequest((e) => {
    console.log("creating league", JSON.stringify(e.record, null, 2))
    e.record.set("owner", e.auth.id)
    e.next()
}, "league")

onRecordsListRequest((e) => {
    console.log("records list", e.records.length)
    e.next()
})