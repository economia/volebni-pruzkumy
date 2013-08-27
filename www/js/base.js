(function(){
  var Datapoint, Line;
  window.datapoints = [];
  window.lines = [];
  window.init = function(data){
    var lines_assoc, datapoints;
    lines_assoc = {};
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
    }
    prototype.sortDatapoints = function(){
      return this.datapoints.sort(function(a, b){
        return a.date.getTime() - b.date.getTime();
      });
    };
    return Line;
  }());
}).call(this);
