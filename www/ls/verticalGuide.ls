window.verticalGuide =
    registerVerticalGuide: ->
        scale = @scale_x
        margin = @margin
        guide = @verticalGuideGroup.append \line
            ..attr \y1 @margin.0
            ..attr \y2 @margin.0 + @height

        attachGuide = ->
            @
                ..on \mouseover (datapoint) ->
                    guide.attr \opacity 1
                    x = margin.3 + scale datapoint.date
                    guide
                        ..attr \x1 x
                        ..attr \x2 x
                ..on \mouseout ->
                    guide.attr \opacity 0
