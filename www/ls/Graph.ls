window.Graph = class Graph
    (@parentSelector, @lines) ->
        @width = 500_px
        @height = 500_px
        @svg = d3.select parentSelector .append \svg
            ..attr \height @height
            ..attr \width  @width
        console.log @lines
