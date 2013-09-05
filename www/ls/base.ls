new Tooltip!watchElements!
window.datapoints = []
window.lines = []
window.parties_to_ids =
    "ČSSD" : \cssd
    "VV" : \vv
    "SPOZ" : \spoz
    "ODS" : \ods
    "TOP09" : \top
    "SZ" : \sz
    "KSČM" : \kscm
    "KDU-ČSL" : \kdu
window.agencies_to_ids =
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
    generateStories!
    width = $ window .width!
    height = $ window .height!
    window.graph = new Graph '#wrap' lines, {width, height}
    selectFromHash!
    graph.draw!

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
