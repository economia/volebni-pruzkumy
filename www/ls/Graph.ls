window.Graph = class Graph
    (@parentSelector, @lines) ->
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
        @draw!

    draw: ->
        @datapaths.selectAll \path
            .data @lines
            .enter!
                ..append \path
                    ..attr \d (line) ~>
                        @line line.datapoints
                    ..attr \data-tooltip (line) ->
                        line.id
