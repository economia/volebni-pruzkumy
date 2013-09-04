# Disclaimer: Tenhle file muze slouzit jako ukazka, jak se nema psat tightly-coupled kod
stories =
    *   parties: <[cssd]>
        text: "Jak vsichni precenili CSSD"
    *   agencies: <[stem volby]>
        text: "Jak se darilo STEMu"
    *   agencies: <[cvvm volby]>
        parties: <[top sz kdu]>
        text: "Jak CVVM odhadlo maly procenta"
window.generateStories = ->
    $container = $ "<ul></ul>"
        ..addClass \stories
        ..appendTo \#wrap
    $stories = stories.map (story) ->
        $ "<li>#{story.text}</li>"
            ..on \click ->
                displayStory story.parties, story.agencies
            ..appendTo $container

displayStory = (parties, agencies) ->
    {display_agencies, display_parties} = window.graph
    display_parties.length = 0
    display_agencies.length = 0
    setParties parties, display_parties
    setAgencies agencies, display_agencies
    window.graph.redraw!

setParties = (parties, selected) ->
    $ ".selectors .parties input" .each ->
        @checked = if not parties or @value in parties
            selected.push @value
            'checked'
        else
            ''


setAgencies = (agencies, selected) ->
    $ ".selectors .agencies input" .each ->
        @checked = if not agencies or @value in agencies
            selected.push @value
            'checked'
        else
            ''
