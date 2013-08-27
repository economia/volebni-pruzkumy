(function(){
  var Graph;
  window.Graph = Graph = (function(){
    Graph.displayName = 'Graph';
    var prototype = Graph.prototype, constructor = Graph;
    function Graph(parentSelector, lines){
      var x$, y$, z$, z1$;
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
      this.min_date = Math.min.apply(Math, this.lines.map(function(it){
        return it.datapoints[0].date.getTime();
      }));
      this.max_date = Math.max.apply(Math, this.lines.map(function(it){
        return it.datapoints[it.datapoints.length - 1].date.getTime();
      }));
      z$ = this.scale_x = d3.scale.linear();
      z$.domain([this.min_date, this.max_date]);
      z$.range([0, this.width]);
      z1$ = this.scale_y = d3.scale.linear();
      z1$.domain([0, 100]);
      z1$.range([this.height, 0]);
    }
    return Graph;
  }());
}).call(this);
