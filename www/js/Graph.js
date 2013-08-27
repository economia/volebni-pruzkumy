(function(){
  var Graph;
  window.Graph = Graph = (function(){
    Graph.displayName = 'Graph';
    var prototype = Graph.prototype, constructor = Graph;
    function Graph(parentSelector, lines){
      var x$, y$, z$, z1$, z2$, z3$, this$ = this;
      this.parentSelector = parentSelector;
      this.lines = lines;
      this.width = 500;
      this.height = 500;
      this.margin_top = 20;
      this.margin_left = 20;
      x$ = this.svg = d3.select(parentSelector).append('svg');
      x$.attr('height', this.height);
      x$.attr('width', this.width);
      y$ = this.drawing = this.svg.append('g');
      y$.attr('transform', "translate(" + this.margin_left + ", " + this.margin_top + ")");
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
      z2$.domain([0, 100]);
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
      var x$, y$, this$ = this;
      x$ = this.datapaths.selectAll('path').data(this.lines).enter();
      y$ = x$.append('path');
      y$.attr('d', function(line){
        return this$.line(line.datapoints);
      });
      y$.attr('data-tooltip', function(line){
        return line.id;
      });
      return x$;
    };
    return Graph;
  }());
}).call(this);
