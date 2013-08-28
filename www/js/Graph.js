(function(){
  var monthsHuman, Graph;
  monthsHuman = ['led', 'únr', 'břz', 'dub', 'kvt', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lst', 'prs'];
  window.Graph = Graph = (function(){
    Graph.displayName = 'Graph';
    var prototype = Graph.prototype, constructor = Graph;
    function Graph(parentSelector, lines){
      var x$, y$, z$, z1$, z2$, min_date, max_date, z3$, z4$, z5$, this$ = this;
      this.parentSelector = parentSelector;
      this.lines = lines;
      this.currentLines = this.lines;
      this.display_agencies = ['median', 'stem', 'factum', 'cvvm'];
      this.display_parties = ['cssd', 'vv', 'spoz', 'ods', 'top', 'sz', 'kscm', 'kdu'];
      this.margin = [0, 10, 50, 34];
      this.width = 970 - this.margin[1] - this.margin[3];
      this.height = 600 - this.margin[0] - this.margin[2];
      x$ = this.svg = d3.select(parentSelector).append('svg');
      x$.attr('height', this.height + this.margin[0] + this.margin[2]);
      x$.attr('width', this.width + this.margin[1] + this.margin[3]);
      y$ = this.drawing = this.svg.append('g');
      y$.attr('transform', "translate(" + this.margin[3] + ", " + this.margin[0] + ")");
      y$.attr('class', 'drawing');
      z$ = this.datapaths = this.drawing.append('g');
      z$.attr('class', 'datapaths');
      z1$ = this.xAxisGroup = this.drawing.append('g');
      z1$.attr('class', "x axis");
      z2$ = this.yAxisGroup = this.drawing.append('g');
      z2$.attr('class', "y axis");
      min_date = Math.min.apply(Math, this.lines.map(function(it){
        return it.datapoints[0].date;
      }));
      max_date = Math.max.apply(Math, this.lines.map(function(it){
        return it.datapoints[it.datapoints.length - 1].date;
      }));
      z3$ = this.scale_x = d3.time.scale();
      z3$.domain([min_date, max_date]);
      z3$.range([0, this.width]);
      z4$ = this.scale_y = d3.scale.linear();
      z4$.domain([0, 100]);
      z4$.range([this.height, 0]);
      z5$ = this.line = d3.svg.line();
      z5$.x(function(it){
        return this$.scale_x(it.date.getTime());
      });
      z5$.y(function(it){
        return this$.scale_y(it.percent);
      });
      this.recomputeScales();
      this.drawGhost();
      this.draw();
      this.drawAxes();
    }
    prototype.drawGhost = function(){
      var x$, this$ = this;
      x$ = this.datapaths.selectAll("path.ghost").data(this.lines).enter().append('path');
      x$.attr('class', 'ghost');
      x$.attr('d', function(line){
        return this$.line(line.datapoints);
      });
      return x$;
    };
    prototype.redraw = function(){
      var lastMaxValue, currentMaxValue, scaleIsExpanding;
      this.currentLines = this.lines.filter(bind$(this, 'lineFilter'));
      lastMaxValue = this.scale_y.domain()[1];
      this.recomputeScales();
      currentMaxValue = this.scale_y.domain()[1];
      scaleIsExpanding = lastMaxValue && lastMaxValue < currentMaxValue;
      return this.draw(scaleIsExpanding);
    };
    prototype.draw = function(scaleIsExpanding){
      var selection, x$, tickTransition, this$ = this;
      selection = this.datapaths.selectAll('path.active').data(this.currentLines, function(it){
        return it.id;
      });
      this.selectionUpdate(selection, scaleIsExpanding);
      this.selectionExit(selection.exit());
      this.selectionEnter(selection.enter(), scaleIsExpanding);
      x$ = tickTransition = this.yAxisGroup.selectAll(".tick").transition();
      x$.duration(500);
      x$.attr('transform', function(it){
        return "translate(0, " + this$.scale_y(it) + ")";
      });
      if (!scaleIsExpanding) {
        return tickTransition.delay(400);
      }
    };
    prototype.recomputeScales = function(){
      var maxValue;
      maxValue = Math.max.apply(Math, this.currentLines.map(function(it){
        return it.maxValue;
      }));
      return this.scale_y.domain([0, maxValue]);
    };
    prototype.selectionEnter = function(selection, scaleIsExpanding){
      var maxLen, x$, path, y$, transition, this$ = this;
      maxLen = 0;
      x$ = path = selection.append('path');
      x$.attr('class', function(line){
        return line.partyId + " " + line.agencyId + " active";
      });
      x$.attr('d', function(line){
        return this$.line(line.datapoints);
      });
      x$.attr('data-tooltip', function(line){
        return line.id;
      });
      x$.attr('pathLength', '10');
      x$.attr('stroke-dasharray', function(){
        var len;
        len = this.getTotalLength();
        if (len > maxLen) {
          maxLen = len;
        }
        return "0, " + len;
      });
      y$ = transition = path.transition();
      y$.duration(800);
      y$.attr('stroke-dasharray', function(){
        var len;
        len = this.getTotalLength();
        return len + ", 0";
      });
      if (scaleIsExpanding) {
        return transition.delay(400);
      }
    };
    prototype.selectionUpdate = function(selection, scaleIsExpanding){
      var x$, transition, this$ = this;
      x$ = transition = selection.transition();
      x$.duration(500);
      x$.attr('d', function(line){
        return this$.line(line.datapoints);
      });
      if (!scaleIsExpanding) {
        return transition.delay(500);
      }
    };
    prototype.selectionExit = function(selection){
      var x$, y$;
      x$ = selection;
      x$.attr('opacity', 1);
      x$.attr('class', function(line){
        return line.partyId + " " + line.agencyId;
      });
      y$ = x$.transition();
      y$.duration(800);
      y$.attr('opacity', 0);
      y$.remove();
      return x$;
    };
    prototype.lineFilter = function(line){
      return in$(line.agencyId, this.display_agencies) && in$(line.partyId, this.display_parties);
    };
    prototype.drawAxes = function(){
      this.drawYAxis();
      return this.drawXAxis();
    };
    prototype.drawXAxis = function(){
      var x$, xAxis, y$, z$;
      x$ = xAxis = d3.svg.axis();
      x$.scale(this.scale_x);
      x$.ticks(d3.time.years);
      x$.tickSize(3);
      x$.outerTickSize(0);
      x$.orient('bottom');
      y$ = this.xAxisGroup;
      y$.attr('transform', "translate(0, " + (this.height + this.margin[0]) + ")");
      y$.call(xAxis);
      z$ = y$.selectAll('text');
      z$.attr('dy', 9);
      return y$;
    };
    prototype.drawYAxis = function(){
      var x$, yAxis, y$, z$, z1$, z2$;
      x$ = yAxis = d3.svg.axis();
      x$.scale(this.scale_y);
      x$.tickSize(this.width);
      x$.outerTickSize(0);
      x$.tickFormat(function(it){
        if (it && 0 === it % 10) {
          return it + "%";
        } else {
          return "";
        }
      });
      x$.orient('right');
      y$ = this.yAxisGroup;
      y$.call(yAxis);
      z$ = y$.selectAll("text");
      z$.attr('x', -30);
      z$.attr('dy', 5);
      z1$ = y$.selectAll("line");
      z2$ = z1$.filter(function(it){
        return it % 10;
      });
      z2$.classed('minor', true);
      return y$;
    };
    prototype.setupZoom = function(){
      var x$, y$;
      x$ = this.zoom = d3.behavior.zoom();
      x$.x(this.scale_x);
      x$.y(this.scale_y);
      x$.scaleExtent([1, 2]);
      x$.on('zoom', bind$(this, 'onZoom'));
      y$ = this.svg;
      y$.call(this.zoom);
      return y$;
    };
    prototype.onZoom = function(){
      var x$;
      x$ = this.drawing;
      x$.attr('transform', "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
      return x$;
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
