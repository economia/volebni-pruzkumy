(function(){
  var parties_to_ids, agencies_to_ids, generateSelectors, Datapoint, Line;
  new Tooltip().watchElements();
  window.datapoints = [];
  window.lines = [];
  parties_to_ids = {
    "ČSSD": 'cssd',
    "VV": 'vv',
    "SPOZ": 'spoz',
    "ODS": 'ods',
    "TOP09": 'top',
    "SZ": 'sz',
    "KSČM": 'kscm',
    "KDU-ČSL": 'kdu'
  };
  agencies_to_ids = {
    "Median": 'median',
    "STEM": 'stem',
    "Factum": 'factum',
    "CVVM": 'cvvm'
  };
  window.init = function(data){
    var lines_assoc, datapoints, width, height;
    lines_assoc = {};
    data.pruzkumy = data.pruzkumy.filter(function(arg$){
      var party, date, percent, agency;
      party = arg$[0], date = arg$[1], percent = arg$[2], agency = arg$[3];
      return percent.length > 1;
    });
    datapoints = data.pruzkumy.map(function(datum){
      var party, date, percent, agency, datapoint, line;
      party = datum[0], date = datum[1], percent = datum[2], agency = datum[3];
      datapoint = new Datapoint(datum);
      line = lines_assoc[datapoint.lineId];
      if (!line) {
        line = new Line(datapoint.lineId, party, agency);
        lines_assoc[datapoint.lineId] = line;
        lines.push(line);
      }
      line.datapoints.push(datapoint);
      return datapoint;
    });
    lines.forEach(function(it){
      return it.processDatapoints();
    });
    generateSelectors();
    width = $(window).width();
    height = $(window).height();
    return window.graph = new Graph('#wrap', lines, {
      width: width,
      height: height
    });
  };
  generateSelectors = function(){
    var x$, $selectors, y$, $partySelectors, z$, $agencySelectors, agency, ref$, agencyId, z1$, $pair, z2$, z3$, party, partyId, z4$, z5$, z6$;
    x$ = $selectors = $("<div class='selectors'></div>");
    x$.appendTo($('#wrap'));
    y$ = $partySelectors = $("<div class='parties'></div>");
    y$.appendTo($selectors);
    z$ = $agencySelectors = $("<div class='agencies'></div>");
    z$.appendTo($selectors);
    for (agency in ref$ = agencies_to_ids) {
      agencyId = ref$[agency];
      z1$ = $pair = $("<div class='pair'></div>");
      z1$.appendTo($agencySelectors);
      z2$ = $("<input type='checkbox' value='" + agencyId + "' id='chc-" + agencyId + "' checked='checked'/>");
      z2$.appendTo($pair);
      z3$ = $("<label for='chc-" + agencyId + "'>" + agency + "</label>");
      z3$.appendTo($pair);
    }
    for (party in ref$ = parties_to_ids) {
      partyId = ref$[party];
      z4$ = $pair = $("<div class='pair'></div>");
      z4$.appendTo($partySelectors);
      z5$ = $("<input type='checkbox' value='" + partyId + "' id='chc-" + partyId + "' checked='checked'/>");
      z5$.appendTo($pair);
      z6$ = $("<label for='chc-" + partyId + "' class='" + partyId + "'>" + party + "</label>");
      z6$.appendTo($pair);
    }
    return $('body').on('change', 'input', function(){
      var x$, agencies, inputs, y$, parties;
      x$ = agencies = graph.display_agencies;
      x$.length = 0;
      inputs = $agencySelectors.find("input:checked");
      inputs.each(function(){
        return agencies.push(this.value);
      });
      y$ = parties = graph.display_parties;
      y$.length = 0;
      inputs = $partySelectors.find("input:checked");
      inputs.each(function(){
        return parties.push(this.value);
      });
      return graph.redraw();
    });
  };
  Datapoint = (function(){
    Datapoint.displayName = 'Datapoint';
    var prototype = Datapoint.prototype, constructor = Datapoint;
    function Datapoint(arg$){
      var date, percent;
      this.party = arg$[0], date = arg$[1], percent = arg$[2], this.agency = arg$[3];
      this.lineId = this.party + "-" + this.agency;
      this.date = new Date(date);
      this.percent = parseFloat(percent);
    }
    return Datapoint;
  }());
  Line = (function(){
    Line.displayName = 'Line';
    var prototype = Line.prototype, constructor = Line;
    function Line(id, party, agency){
      this.id = id;
      this.party = party;
      this.agency = agency;
      this.datapoints = [];
      this.partyId = parties_to_ids[this.party];
      this.agencyId = agencies_to_ids[this.agency];
    }
    prototype.processDatapoints = function(){
      this.sortDatapoints();
      return this.maxValue = Math.max.apply(Math, this.datapoints.map(function(it){
        return it.percent;
      }));
    };
    prototype.sortDatapoints = function(){
      return this.datapoints.sort(function(a, b){
        return a.date.getTime() - b.date.getTime();
      });
    };
    return Line;
  }());
}).call(this);
