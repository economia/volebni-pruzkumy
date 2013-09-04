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
    console.log parties, agencies

setParties = (parties) ->

setAgencies = (agencies) ->
