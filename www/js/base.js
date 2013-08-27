(function(){
  var parties_to_ids, agencies_to_ids, Datapoint, Line;
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
    var lines_assoc, datapoints;
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
      return it.sortDatapoints();
    });
    return window.graph = new Graph('#wrap', lines);
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
    prototype.sortDatapoints = function(){
      return this.datapoints.sort(function(a, b){
        return a.date.getTime() - b.date.getTime();
      });
    };
    return Line;
  }());
}).call(this);
