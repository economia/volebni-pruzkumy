window.Graph = class Graph
    (@parentSelector, @lines) ->
        @display_agencies = <[median stem factum cvvm]>
        @display_parties  = <[cssd vv spoz ods top sz kscm kdu]>
        @width = 630_px
        @height = 600_px
        @margin = [20 0 0 20] # trbl
        @svg = d3.select parentSelector .append \svg
            ..attr \height @height + @margin.0 + @margin.2
            ..attr \width  @width + @margin.1 + @margin.3
        @drawing = @svg.append \g
            ..attr \transform "translate(#{@margin.3}, #{@margin.0})"
            ..attr \class \drawing
        @datapaths = @drawing.append \g
            ..attr \class \datapaths

        @min_date = Math.min ...@lines.map ->
             it.datapoints[0].date.getTime!
        @max_date = Math.max ...@lines.map ->
             it.datapoints[it.datapoints.length - 1].date.getTime!
        @scale_x = d3.scale.linear!
            ..domain [@min_date, @max_date]
            ..range [0 @width]
        @scale_y = d3.scale.linear!
            ..domain [0 50]
            ..range [@height, 0]
        @line = d3.svg.line!
            ..x ~> @scale_x it.date.getTime!
            ..y ~> @scale_y it.percent
        # @display_parties = <[ cssd ]>
        @draw!
        @setupZoom!
        # <~ setTimeout _, 1200
        # @display_parties  = <[cssd vv spoz ods top sz kscm kdu]>
        # @draw!
        # <~ setTimeout _, 1200
        # @display_parties  = <[ods]>
        # @draw!

    draw: ->
        lines = @lines.filter @~lineFilter
        selection = @datapaths.selectAll \path
            .data lines, (.id)
        @selectionEnter selection.enter!
        @selectionExit selection.exit!


    selectionEnter: (selection) ->
        maxLen = 0
        path = selection.append \path
            ..attr \class (line) -> "#{line.partyId} #{line.agencyId}"
            ..attr \d (line) ~>
                @line line.datapoints
            ..attr \data-tooltip (line) ->
                line.id
            ..attr \pathLength \10
            ..attr \stroke-dasharray ->
                len = @getTotalLength!
                if len > maxLen then maxLen := len
                "0, #len"
        path
            ..transition!
                ..duration 800
                ..attr \stroke-dasharray ->
                    len = @getTotalLength!
                    "#len, 0"

    selectionUpdate: (selection) ->
    selectionExit: (selection) ->
        selection
            ..attr \opacity 1
            ..transition!
                ..duration 800
                ..attr \opacity 0
                ..remove!

    lineFilter: (line) ->
        line.agencyId in @display_agencies and line.partyId in @display_parties

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
