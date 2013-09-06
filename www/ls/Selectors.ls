window.generateSelectors = ->
    $selectors = $ "<div class='selectors'></div>"
        ..appendTo $ '#wrap'
    $partySelectors = $ "<div class='parties'></div>"
        ..appendTo $selectors
    $agencySelectors = $ "<div class='agencies'></div>"
        ..appendTo $selectors
    for agency, {id, text, link} of agencies_to_ids
        $pair = $ "<div class='pair'></div>"
            ..appendTo $agencySelectors
        $ "<input type='checkbox' class='agency' value='#id' id='chc-#id' checked='checked'/>"
            ..appendTo $pair
        $ "<label for='chc-#id'>#agency</label>"
            ..appendTo $pair
        $ "<a href='#link' class='description' data-tooltip='#text' target='_blank'>?</span>"
            ..appendTo $pair

    for party, partyId of parties_to_ids
        $pair = $ "<div class='pair'></div>"
            ..appendTo $partySelectors
        $ "<input type='checkbox' class='party' value='#partyId' id='chc-#partyId' checked='checked'/>"
            ..appendTo $pair
        $ "<label for='chc-#partyId' class='#partyId'>#party</label>"
            ..appendTo $pair
    partySelected = agencySelected = no
    $ \body .on \change \input (evt) ->
        $ele = $ @
        agencies = graph.display_agencies
            ..length = 0
        $inputs = $agencySelectors .find "input:checked"
        if $ele.hasClass \agency and not agencySelected
            agencySelected := yes
            $inputs.attr \checked no
            @checked = yes # jQ doesn't work here for some reason
            agencies.push @value
        else
            if $inputs.length == 0
                $inputs = $agencySelectors .find "input"
                $inputs.each -> @checked=yes
                agencySelected := no
            $inputs.each -> agencies.push @value

        parties = graph.display_parties
            ..length = 0
        $inputs = $partySelectors .find "input:checked"
        if $ele.hasClass \party and not partySelected
            partySelected := yes
            $inputs.attr \checked no
            @checked = yes
            parties.push @value
        else
            if $inputs.length == 0
                $inputs = $partySelectors .find "input"
                $inputs.each -> @checked=yes
                partySelected := no
            $inputs.each -> parties.push @value
        graph.redraw!
    $ \body .on \mouseover \label (evt) ->
        $ele = $ @
        $input = $ '#' + $ele.attr \for
        graph.datapaths.selectAll "g.symbol.#{$input.val!} path"
            ..classed \active yes
    $ \body .on \mouseout \label (evt) ->
        $ele = $ @
        $input = $ '#' + $ele.attr \for
        graph.datapaths.selectAll "g.symbol.#{$input.val!} path"
            ..classed \active no
