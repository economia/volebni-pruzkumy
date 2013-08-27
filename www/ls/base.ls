new Tooltip!watchElements!
window.datapoints = []
window.lines = []
parties_to_ids =
    "ČSSD" : \cssd
    "VV" : \vv
    "SPOZ" : \spoz
    "ODS" : \ods
    "TOP09" : \top
    "SZ" : \sz
    "KSČM" : \kscm
    "KDU-ČSL" : \kdu
agencies_to_ids =
    "Median": \median
    "STEM": \stem
    "Factum": \factum
    "CVVM": \cvvm
window.init = (data) ->
    lines_assoc = {}
    data.pruzkumy .= filter ([party, date, percent, agency]) ->
        percent.length > 1
    datapoints = data.pruzkumy.map ([party, date, percent, agency]:datum) ->
        datapoint = new Datapoint datum
        line = lines_assoc[datapoint.lineId]
        if not line
            line = new Line datapoint.lineId, party, agency
            lines_assoc[datapoint.lineId] = line
            lines.push line
        line.datapoints.push datapoint
        datapoint
    lines.forEach -> it.processDatapoints!
    generateSelectors!

    window.graph = new Graph '#wrap' lines

generateSelectors = ->
    $selectors = $ "<div class='selectors'></div>"
        ..appendTo $ '#wrap'
    $partySelectors = $ "<div class='parties'></div>"
        ..appendTo $selectors
    $agencySelectors = $ "<div class='agencies'></div>"
        ..appendTo $selectors
    for agency, agencyId of agencies_to_ids
        $pair = $ "<div class='pair'></div>"
            ..appendTo $agencySelectors
        $ "<input type='checkbox' value='#agencyId' id='chc-#agencyId' checked='checked'/>"
            ..appendTo $pair
        $ "<label for='chc-#agencyId'>#agency</label>"
            ..appendTo $pair

    for party, partyId of parties_to_ids
        $pair = $ "<div class='pair'></div>"
            ..appendTo $partySelectors
        $ "<input type='checkbox' value='#partyId' id='chc-#partyId' checked='checked'/>"
            ..appendTo $pair
        $ "<label for='chc-#partyId' class='#partyId'>#party</label>"
            ..appendTo $pair
    $ \body .on \change \input ->
        agencies = graph.display_agencies
            ..length = 0

        inputs = $agencySelectors .find "input:checked"
        inputs.each -> agencies.push @value

        parties = graph.display_parties
            ..length = 0
        inputs = $partySelectors .find "input:checked"
        inputs.each -> parties.push @value
        graph.draw!

class Datapoint
    ([@party, date, percent, @agency])->
        @lineId = "#{@party}-#{@agency}"
        @date = new Date date
        @percent = parseFloat percent

class Line
    (@id, @party, @agency) ->
        @datapoints = []
        @partyId = parties_to_ids[@party]
        @agencyId = agencies_to_ids[@agency]

    processDatapoints: ->
        @sortDatapoints!
        @maxValue = Math.max ...@datapoints.map (.percent)

    sortDatapoints: ->
        @datapoints.sort (a, b) ->
            a.date.getTime! - b.date.getTime!
