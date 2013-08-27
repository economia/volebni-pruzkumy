window.Graph = class Graph
    (@parentSelector, @lines) ->
        @width = 500_px
        @height = 500_px
        @margin_top = 20_px
        @margin_left = 20_px
        @svg = d3.select parentSelector .append \svg
            ..attr \height @height
            ..attr \width  @width
        @drawing = @svg.append \g
            ..attr \transform "translate(#{@margin_left}, #{@margin_top})"

        @min_date = Math.min ...@lines.map ->
             it.datapoints[0].date.getTime!
        @max_date = Math.max ...@lines.map ->
             it.datapoints[it.datapoints.length - 1].date.getTime!
        @scale_x = d3.scale.linear!
            ..domain [@min_date, @max_date]
            ..range [0 @width]
        @scale_y = d3.scale.linear!
            ..domain [0 100]
            ..range [@height, 0]

