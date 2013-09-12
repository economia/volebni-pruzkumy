window.verticalGuide =
    registerVerticalGuide: ->
        @guide = @verticalGuideGroup.append \line
            ..attr \y1 @margin.0
            ..attr \y2 @margin.0 + @height
            ..attr \opacity 0

        attachGuide = (selection) ~>
            selection
                ..on \mouseover @~showGuide
                ..on \mouseout @~hideGuide
    showGuide: (datapoint) ->
        @guide.attr \opacity 1
        x = @margin.3 + @scale_x datapoint.date
        @guide
            ..attr \x1 x
            ..attr \x2 x

    hideGuide: ->
        @guide.attr \opacity 0
