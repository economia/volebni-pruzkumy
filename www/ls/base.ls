window.datapoints = []
window.lines = []
window.init = (data) ->
    lines_assoc = {}
    datapoints = data.pruzkumy.map ([party, date, percent, agency]:datum) ->
        datapoint = new Datapoint datum
        line = lines_assoc[datapoint.lineId]
        if not line
            line = new Line datapoint.lineId, party, agency
            lines_assoc[datapoint.lineId] = line
            lines.push line
        line.datapoints.push datapoint
        datapoint

class Datapoint
    ([@party, date, percent, @agency])->
        @lineId = "#{@party}-#{@agency}"

class Line
    (@id, @party, @agency) ->
        @datapoints = []
