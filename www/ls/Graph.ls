monthsHuman = <[led únr břz dub kvt čvn čvc srp zář říj lst prs]>
window.Graph = class Graph
    (@parentSelector, @lines, {width=970_px, height=600_px}={}) ->
        @currentLines = @lines
        @display_agencies = <[median stem factum cvvm]>
        @display_parties  = <[cssd vv spoz ods top sz kscm kdu]>
        @margin = [80 10 50 34] # trbl
        @width = width - @margin.1 - @margin.3
        @height = height - @margin.0 - @margin.2
        @svg = d3.select parentSelector .append \svg
            ..attr \height @height + @margin.0 + @margin.2
            ..attr \width  @width + @margin.1 + @margin.3
        @drawing = @svg.append \g
            ..attr \transform "translate(#{@margin.3}, #{@margin.0})"
            ..attr \class \drawing
        @datapaths = @drawing.append \g
            ..attr \class \datapaths

        @xAxisGroup = @drawing.append \g
            ..attr \class "x axis"
        @yAxisGroup = @drawing.append \g
            ..attr \class "y axis"

        min_date = Math.min ...@lines.map ->
             it.datapoints[0].date
        max_date = Math.max ...@lines.map ->
             it.datapoints[it.datapoints.length - 1].date
        @scale_x = d3.time.scale!
            ..domain [min_date, max_date]
            ..range [0 @width]
        @scale_y = d3.scale.linear!
            ..domain [0 100]
            ..range [@height, 0]
        @line = d3.svg.line!
            ..interpolate \monotone
            ..x ~> @scale_x it.date.getTime!
            ..y ~> @scale_y it.percent
        @datapointSymbol = d3.svg.symbol!
        @recomputeScales!
        @drawGhost!
        @drawContentLines!
        @drawDatapointSymbols!
        @drawAxes!

    drawGhost: ->
        @ghostLines = @datapaths.selectAll "path.ghost"
            .data @lines
            .enter!
            .append \path
                ..attr \class \ghost
                ..attr \d (line) ~> @line line.datapoints

    redraw: ->
        @currentLines = @lines.filter @~lineFilter
        lastMaxValue = @scale_y.domain!.1
        @recomputeScales!
        currentMaxValue = @scale_y.domain!.1
        scaleIsExpanding = lastMaxValue and lastMaxValue < currentMaxValue
        @drawContentLines scaleIsExpanding
        @drawDatapointSymbols scaleIsExpanding

    drawContentLines: (scaleIsExpanding)->
        selection = @datapaths.selectAll \path.line.notHiding
            .data @currentLines, (.id)
        @selectionUpdate selection, scaleIsExpanding
        @selectionExit selection.exit!
        @selectionEnter selection.enter!, scaleIsExpanding
        @rescaleOtherElements scaleIsExpanding

    drawDatapointSymbols: ->
        selection = @datapaths.selectAll \g.symbol.notHiding
            .data @currentLines, (.id)
        selection.enter!.append \g
            .attr \class "symbol notHiding"
            .attr \opacity 1
            .selectAll 'path'
            .data (.datapoints)
            .enter!append \path
                ..attr \d @datapointSymbol
                ..attr \transform (pt) ~> "translate(#{@scale_x pt.date}, #{@scale_y pt.percent})"
        selection.exit!
            ..transition!
                ..attr \opacity 0
                ..duration 800
                ..remove!

    rescaleOtherElements: (scaleIsExpanding)->
        @rescaleAxes scaleIsExpanding
        @rescaleGhosts scaleIsExpanding

    recomputeScales: ->
        maxValue = Math.max ...@currentLines.map (.maxValue)
        @scale_y.domain [0 maxValue]

    selectionEnter: (selection, scaleIsExpanding) ->
        maxLen = 0
        path = selection.append \path
            ..attr \class (line) -> "#{line.partyId} #{line.agencyId} active line notHiding"
            ..attr \d (line) ~>
                @line line.datapoints
            ..attr \data-tooltip (line) ->
                line.id
            ..attr \pathLength \10
            ..attr \stroke-dasharray ->
                len = @getTotalLength!
                if len > maxLen then maxLen := len
                "0, #len"
        transition = path.transition!
            ..duration 800
            ..attr \stroke-dasharray ->
                len = @getTotalLength!
                "#len, 0"
        if scaleIsExpanding
            transition.delay 400

    selectionUpdate: (selection, scaleIsExpanding) ->
        transition = selection.transition!
            ..duration 500
            ..attr \d (line) ~>
                @line line.datapoints
        if !scaleIsExpanding
            transition.delay 500

    selectionExit: (selection) ->
        selection
            ..attr \opacity 1
            ..classed \notHiding no
            ..transition!
                ..duration 800
                ..attr \opacity 0
                ..remove!

    lineFilter: (line) ->
        line.agencyId in @display_agencies and line.partyId in @display_parties

    drawAxes: ->
        @drawYAxis!
        @drawXAxis!

    drawXAxis: ->
        xAxis = d3.svg.axis!
            ..scale @scale_x
            ..ticks d3.time.years
            ..tickSize 3
            ..outerTickSize 0
            ..orient \bottom
        @xAxisGroup
            ..attr \transform "translate(0, #{@height})"
            ..call xAxis
            ..selectAll \text
                ..attr \dy 9

    drawYAxis: ->
        yAxis = d3.svg.axis!
            ..scale @scale_y
            ..tickSize @width
            ..outerTickSize 0
            ..tickFormat -> if it and 0 == it % 10 then "#it%" else ""
            ..orient \right
        @yAxisGroup
            ..call yAxis
            ..selectAll "text"
                ..attr \x -30
                ..attr \dy 5
            ..selectAll "line"
                ..filter( -> it % 10)
                    ..classed \minor yes
    rescaleGhosts: (scaleIsExpanding) ->
        transition = @ghostLines.transition!
            ..duration 500
            ..attr \d (line) ~> @line line.datapoints
        if !scaleIsExpanding
            transition.delay 500


    rescaleAxes: (scaleIsExpanding) ->
        tickTransition = @yAxisGroup.selectAll ".tick" .transition!
            ..duration 500
            ..attr \transform ~>"translate(0, #{@scale_y it})"
        if not scaleIsExpanding
            tickTransition.delay 400
    setupZoom: ->
        @zoom = d3.behavior.zoom!
            ..x @scale_x
            ..y @scale_y
            ..scaleExtent [1 2]
            ..on \zoom @~onZoom
        @svg
            ..call @zoom

    onZoom: ->
        @drawing
            ..attr \transform "translate(#{d3.event.translate}) scale(#{d3.event.scale})"
