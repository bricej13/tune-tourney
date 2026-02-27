
onRecordCreateRequest((e) => {
    console.log("creating league", JSON.stringify(e.record, null, 2))
    e.record.set("owner", e.auth.id)
    return e.next()
}, "league")

onRecordCreateRequest((e) => {
    const leagueId = e.record.get("league")
    
    // Set createdBy
    e.record.set("createdBy", e.auth.id)
    
    // Calculate next order
    try {
        const highestOrderRecord = $app.findFirstRecordByFilter(
            "round",
            "league = {:leagueId}",
            { "leagueId": leagueId },
            { sort: "-order" }
        )
        const maxOrder = highestOrderRecord.get("order") || 0
        e.record.set("order", maxOrder + 1)
    } catch (err) {
        // If no record found, start with order 1
        e.record.set("order", 1)
    }
    
    return e.next()
}, "round")
