(function(){
  var monthsHuman, Graph;
  monthsHuman = ['leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec'];
  window.Graph = Graph = (function(){
    Graph.displayName = 'Graph';
    var prototype = Graph.prototype, constructor = Graph;
    function Graph(parentSelector, lines, arg$){
      var ref$, width, ref1$, height, x$, y$, z$, z1$, z2$, min_date, max_date, z3$, z4$, z5$, z6$, this$ = this;
      this.parentSelector = parentSelector;
      this.lines = lines;
      ref$ = arg$ != null
        ? arg$
        : {}, width = (ref1$ = ref$.width) != null ? ref1$ : 970, height = (ref1$ = ref$.height) != null ? ref1$ : 600;
      this.currentLines = this.lines;
      this.display_agencies = ['median', 'stem', 'factum', 'cvvm'];
      this.display_parties = ['cssd', 'vv', 'spoz', 'ods', 'top', 'sz', 'kscm', 'kdu'];
      this.margin = [80, 10, 50, 34];
      this.width = width - this.margin[1] - this.margin[3];
      this.height = height - this.margin[0] - this.margin[2];
      x$ = this.svg = d3.select(parentSelector).append('svg');
      x$.attr('height', this.height + this.margin[0] + this.margin[2]);
      x$.attr('width', this.width + this.margin[1] + this.margin[3]);
      y$ = this.drawing = this.svg.append('g');
      y$.attr('transform', "translate(" + this.margin[3] + ", " + this.margin[0] + ")");
      y$.attr('class', 'drawing');
      z$ = this.xAxisGroup = this.drawing.append('g');
      z$.attr('class', "x axis");
      z1$ = this.yAxisGroup = this.drawing.append('g');
      z1$.attr('class', "y axis");
      z2$ = this.datapaths = this.drawing.append('g');
      z2$.attr('class', 'datapaths');
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
      z6$ = this.datapointSymbol = d3.svg.symbol();
      z6$.size(90);
      this.recomputeScales();
      this.drawGhost();
      this.drawContentLines();
      this.drawDatapointSymbols();
      this.drawAxes();
    }
    prototype.drawGhost = function(){
      var x$, this$ = this;
      x$ = this.ghostLines = this.datapaths.selectAll("path.ghost").data(this.lines).enter().append('path');
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
      this.drawContentLines(scaleIsExpanding);
      return this.drawDatapointSymbols(scaleIsExpanding);
    };
    prototype.drawContentLines = function(scaleIsExpanding){
      var selection;
      selection = this.datapaths.selectAll('path.line.notHiding').data(this.currentLines, function(it){
        return it.id;
      });
      this.selectionUpdate(selection, scaleIsExpanding);
      this.selectionExit(selection.exit());
      this.selectionEnter(selection.enter(), scaleIsExpanding);
      return this.rescaleOtherElements(scaleIsExpanding);
    };
    prototype.drawDatapointSymbols = function(scaleIsExpanding){
      var baseDelayExit, baseDelayUpdate, selection, x$, y$, z$, z1$, z2$, z3$, z4$, this$ = this;
      baseDelayExit = scaleIsExpanding ? 400 : 0;
      baseDelayUpdate = scaleIsExpanding ? 0 : 500;
      selection = this.datapaths.selectAll('g.symbol.notHiding').data(this.currentLines, function(it){
        return it.id;
      });
      x$ = selection.exit();
      x$.classed('notHiding', false);
      y$ = x$.transition();
      y$.attr('opacity', 0);
      y$.duration(800);
      y$.remove();
      z$ = this.datapaths.selectAll('g.symbol.notHiding');
      z1$ = z$.selectAll('path');
      z2$ = z1$.transition();
      z2$.delay(baseDelayUpdate);
      z2$.duration(500);
      z2$.attr('transform', function(pt){
        return "translate(" + this$.scale_x(pt.date) + ", " + this$.scale_y(pt.percent) + ")";
      });
      z3$ = selection.enter().append('g').attr('class', function(line){
        return "symbol notHiding " + line.partyId;
      }).attr('opacity', 1).selectAll('path').data(function(it){
        return it.datapoints;
      }).enter().append('path');
      z3$.attr('d', this.datapointSymbol);
      z3$.attr('transform', function(pt){
        return "translate(" + this$.scale_x(pt.date) + ", " + this$.scale_y(pt.percent) + ")";
      });
      z3$.attr('data-tooltip', function(pt){
        return escape("Průzkum agentury <strong>" + pt.agency + "</strong>,\n" + monthsHuman[pt.date.getMonth()] + " " + pt.date.getFullYear() + ":<br />\n" + pt.party + ": <strong>" + pt.percent + "%</strong>");
      });
      z3$.attr('opacity', 0);
      z4$ = z3$.transition();
      z4$.attr('opacity', 1);
      z4$.duration(400);
      z4$.delay(function(pt, index){
        return baseDelayExit + index * 20;
      });
      return z3$;
    };
    prototype.rescaleOtherElements = function(scaleIsExpanding){
      this.rescaleAxes(scaleIsExpanding);
      return this.rescaleGhosts(scaleIsExpanding);
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
        return line.partyId + " " + line.agencyId + " active line notHiding";
      });
      x$.attr('d', function(line){
        return this$.line(line.datapoints);
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
      x$.classed('notHiding', false);
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
      y$.attr('transform', "translate(0, " + this.height + ")");
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
    prototype.rescaleGhosts = function(scaleIsExpanding){
      var x$, transition, this$ = this;
      x$ = transition = this.ghostLines.transition();
      x$.duration(500);
      x$.attr('d', function(line){
        return this$.line(line.datapoints);
      });
      if (!scaleIsExpanding) {
        return transition.delay(500);
      }
    };
    prototype.rescaleAxes = function(scaleIsExpanding){
      var x$, tickTransition, this$ = this;
      x$ = tickTransition = this.yAxisGroup.selectAll(".tick").transition();
      x$.duration(500);
      x$.attr('transform', function(it){
        return "translate(0, " + this$.scale_y(it) + ")";
      });
      if (!scaleIsExpanding) {
        return tickTransition.delay(400);
      }
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
