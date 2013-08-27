(function(){
  var Graph;
  window.Graph = Graph = (function(){
    Graph.displayName = 'Graph';
    var prototype = Graph.prototype, constructor = Graph;
    function Graph(parentSelector, lines){
      var x$, y$, z$, z1$, z2$, z3$, this$ = this;
      this.parentSelector = parentSelector;
      this.lines = lines;
      this.display_agencies = ['median', 'stem', 'factum', 'cvvm'];
      this.display_parties = ['cssd', 'vv', 'spoz', 'ods', 'top', 'sz', 'kscm', 'kdu'];
      this.width = 630;
      this.height = 600;
      this.margin = [20, 0, 0, 20];
      x$ = this.svg = d3.select(parentSelector).append('svg');
      x$.attr('height', this.height + this.margin[0] + this.margin[2]);
      x$.attr('width', this.width + this.margin[1] + this.margin[3]);
      y$ = this.drawing = this.svg.append('g');
      y$.attr('transform', "translate(" + this.margin[3] + ", " + this.margin[0] + ")");
      y$.attr('class', 'drawing');
      z$ = this.datapaths = this.drawing.append('g');
      z$.attr('class', 'datapaths');
      this.min_date = Math.min.apply(Math, this.lines.map(function(it){
        return it.datapoints[0].date.getTime();
      }));
      this.max_date = Math.max.apply(Math, this.lines.map(function(it){
        return it.datapoints[it.datapoints.length - 1].date.getTime();
      }));
      z1$ = this.scale_x = d3.scale.linear();
      z1$.domain([this.min_date, this.max_date]);
      z1$.range([0, this.width]);
      z2$ = this.scale_y = d3.scale.linear();
      z2$.domain([0, 50]);
      z2$.range([this.height, 0]);
      z3$ = this.line = d3.svg.line();
      z3$.x(function(it){
        return this$.scale_x(it.date.getTime());
      });
      z3$.y(function(it){
        return this$.scale_y(it.percent);
      });
      this.draw();
    }
    prototype.draw = function(){
      var lines, x$, y$, this$ = this;
      lines = this.lines.filter(bind$(this, 'lineFilter'));
      x$ = this.datapaths.selectAll('path').data(lines, function(it){
        return it.id;
      }).enter();
      y$ = x$.append('path');
      y$.attr('class', function(line){
        return line.partyId + " " + line.agencyId;
      });
      y$.attr('d', function(line){
        return this$.line(line.datapoints);
      });
      y$.attr('data-tooltip', function(line){
        return line.id;
      });
      return x$;
    };
    prototype.lineFilter = function(line){
      return in$(line.agencyId, this.display_agencies) && in$(line.partyId, this.display_parties);
    };
    return Graph;
  }());
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
  function in$(x, arr){
    var i = -1, l = arr.length >>> 0;
    while (++i < l) if (x === arr[i] && i in arr) return true;
    return false;
  }
}).call(this);
