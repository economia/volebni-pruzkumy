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
    "Median": id: \median text: "Recusandae, quisquam cumque aliquid!"
    "STEM":   id: \stem   text: "Quia, soluta accusantium vero!"
    "Factum": id: \factum text: "Suscipit, unde tenetur optio!"
    "CVVM":   id: \cvvm   text: "Ea, corrupti pariatur animi."
    "Volby":   id: \volby   text: "Volby do Poslanecké sněmovny 2010"
window.init = (data) ->
    lines_assoc = {}
    data.pruzkumy .= filter ([date, party, percent, agency]) ->
        percent.length > 1
    datapoints = data.pruzkumy.map ([date, party, percent, agency]:datum) ->
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
    width = $ window .width!
    height = $ window .height!
    window.graph = new Graph '#wrap' lines, {width, height}

generateSelectors = ->
    $selectors = $ "<div class='selectors'></div>"
        ..appendTo $ '#wrap'
    $partySelectors = $ "<div class='parties'></div>"
        ..appendTo $selectors
    $agencySelectors = $ "<div class='agencies'></div>"
        ..appendTo $selectors
    for agency, {id, text} of agencies_to_ids
        $pair = $ "<div class='pair'></div>"
            ..appendTo $agencySelectors
        $ "<input type='checkbox' class='agency' value='#id' id='chc-#id' checked='checked'/>"
            ..appendTo $pair
        $ "<label for='chc-#id'>#agency</label>"
            ..appendTo $pair
        $ "<span class='description'>#text</span>"
            ..appendTo $pair

    for party, partyId of parties_to_ids
        $pair = $ "<div class='pair'></div>"
            ..appendTo $partySelectors
        $ "<input type='checkbox' class='party' value='#partyId' id='chc-#partyId' checked='checked'/>"
            ..appendTo $pair
        $ "<label for='chc-#partyId' class='#partyId'>#party</label>"
            ..appendTo $pair
    partySelected = agencySelected = no
    $ \body .on \change \input (evt) ->
        $ele = $ @
        agencies = graph.display_agencies
            ..length = 0
        $inputs = $agencySelectors .find "input:checked"
        if $ele.hasClass \agency and not agencySelected
            agencySelected := yes
            $inputs.attr \checked no
            @checked = yes # jQ doesn't work here for some reason
            agencies.push @value
        else
            if $inputs.length == 0
                $inputs = $agencySelectors .find "input"
                $inputs.each -> @checked=yes
                agencySelected := no
            $inputs.each -> agencies.push @value

        parties = graph.display_parties
            ..length = 0
        $inputs = $partySelectors .find "input:checked"
        if $ele.hasClass \party and not partySelected
            partySelected := yes
            $inputs.attr \checked no
            @checked = yes
            parties.push @value
        else
            if $inputs.length == 0
                $inputs = $partySelectors .find "input"
                $inputs.each -> @checked=yes
                partySelected := no
            $inputs.each -> parties.push @value
        graph.redraw!
    $ \body .on \mouseover \label (evt) ->
        $ele = $ @
        $input = $ '#' + $ele.attr \for
        graph.datapaths.selectAll "g.symbol.#{$input.val!} path"
            ..classed \active yes
    $ \body .on \mouseout \label (evt) ->
        $ele = $ @
        $input = $ '#' + $ele.attr \for
        graph.datapaths.selectAll "g.symbol.#{$input.val!} path"
            ..classed \active no

class Datapoint
    ([date, @party, percent, @agency])->
        @lineId = "#{@party}-#{@agency}"
        @partyId = parties_to_ids[@party]
        @agencyId = agencies_to_ids[@agency].id
        @date = new Date date
        @percent = parseFloat percent

class Line
    (@id, @party, @agency) ->
        @datapoints = []
        @partyId = parties_to_ids[@party]
        @agencyId = agencies_to_ids[@agency].id

    processDatapoints: ->
        @sortDatapoints!
        @maxValue = Math.max ...@datapoints.map (.percent)

    sortDatapoints: ->
        @datapoints.sort (a, b) ->
            a.date.getTime! - b.date.getTime!
