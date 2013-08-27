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
    lines.forEach -> it.sortDatapoints!
    window.graph = new Graph '#wrap' lines

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

    sortDatapoints: ->
        @datapoints.sort (a, b) ->
            a.date.getTime! - b.date.getTime!
