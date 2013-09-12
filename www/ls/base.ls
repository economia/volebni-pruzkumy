if not Modernizr.svg
    window.init = ->
    $ "p.fallback" .after '<img src="./fallback.png" alt="" class="fallback">'
    return
$ '.fallback' .remove!

new Tooltip!watchElements!
window.datapoints = []
window.lines = []
window.parties_to_ids =
    "ČSSD" : \cssd
    "ODS" : \ods
    "TOP09" : \top
    "KSČM" : \kscm
    "VV" : \vv
    "KDU-ČSL" : \kdu
    "Zelení" : \sz
    "ANO" : \ano
    "Zemanovci" : \spoz
    "LIDEM" : \lidem
    "LEV 21" : \lev
    "Svobodní" : \svobodni
    "Piráti" : \pirati
    "Suverenita" : \suv
    "DSSS" : \ds
window.agencies_to_ids =
    "Median":
        id: \median
        text: "Volební model, 1000+ respondentů, osobní dotazování, stratifikovaný náhodný adresní výběr. Klikněte pro podrobnosti."
        link: 'http://www.median.cz/?lang=cs&page=4&sub=5#n31'
    "STEM":
        id: \stem
        text: "Stranické preference (podíly preferencí pro jednotlivé strany jsou nižší, než by odpovídalo volebnímu výsledku, protože se do celku počítají i nerozhodnutí), 1000+ respondentů, osobní dotazování, kvótní výběr. Klikněte pro podrobnosti."
        link: "http://stem.cz/clanek/2768"
    "Factum":
        id: \factum
        text: "Volební model, 900+ respondentů, osobní dotazování, kvótní výběr. Klikněte pro podrobnosti."
        link: "http://www.factum.cz/534_podpora-ods-na-historickem-minimu"
    "CVVM":
        id: \cvvm
        text: "Volební model, 1000+ respondentů, osobní dotazování, kvótní výběr. Klikněte pro podrobnosti."
        link: "http://cvvm.soc.cas.cz/media/com_form2content/documents/c1/a7037/f3/pv130621.pdf"
    "Volby":
        id: \volby
window.init = (data) ->
    lines_assoc = {}
    data.pruzkumy .= filter ([date, party, percent, agency]) ->
        percent.length > 0
    datapoints = data.pruzkumy.map ([date, party, percent, agency]:datum) ->
        datapoint = new Datapoint datum
        line = lines_assoc[datapoint.lineId]
        if not line
            line = new Line datapoint.lineId, party, agency
            lines_assoc[datapoint.lineId] = line
            lines.push line
        line.datapoints.push datapoint
        datapoint
    lines.forEach -> it.processDatapoints!
    generateSelectors!
    # generateStories!
    width = $ window .width!
    height = $ window .height!
    window.graph = new Graph '#wrap' lines, {width, height}
    selectFromHash!
    graph.draw!

class Datapoint
    ([date, @party, percent, @agency])->
        @lineId = "#{@party}-#{@agency}"
        @partyId = parties_to_ids[@party]
        @agencyId = agencies_to_ids[@agency].id
        @date = new Date date
        @percent = parseFloat percent

class Line
    (@id, @party, @agency) ->
        @datapoints = []
        @partyId = parties_to_ids[@party]
        @agencyId = agencies_to_ids[@agency].id

    processDatapoints: ->
        @sortDatapoints!
        @maxValue = Math.max ...@datapoints.map (.percent)

    sortDatapoints: ->
        @datapoints.sort (a, b) ->
            a.date.getTime! - b.date.getTime!
