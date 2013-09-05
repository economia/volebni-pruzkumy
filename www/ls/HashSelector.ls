window.selectFromHash = ->
    hash = window.location.hash.substr 1
    return unless hash.length
    selections = hash.split ','
    partyIds = for party, id of window.parties_to_ids
        id
    agencyIds = for agency, {id} of window.agencies_to_ids
        id
    parties = selections.filter -> it in window.graph.display_parties
    agencies = selections.filter -> it in window.graph.display_agencies
    setInputChecked = ->
        @checked = switch
            | @value in selections => 'checked'
            | otherwise            => ''
    if parties.length
        $ ".selectors .parties input" .each setInputChecked
        window.graph.display_parties  = parties

    if agencies.length
        $ ".selectors .agencies input" .each setInputChecked
        window.graph.display_agencies = agencies
