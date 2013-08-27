(function(){
  var Graph;
  window.Graph = Graph = (function(){
    Graph.displayName = 'Graph';
    var prototype = Graph.prototype, constructor = Graph;
    function Graph(parentSelector, lines){
      var x$, y$, z$;
      this.parentSelector = parentSelector;
      this.lines = lines;
      this.width = 500;
      this.height = 500;
      x$ = this.svg = d3.select(parentSelector).append('svg');
      x$.attr('height', this.height);
      x$.attr('width', this.width);
      this.min_date = Math.min.apply(Math, this.lines.map(function(it){
        return it.datapoints[0].date.getTime();
      }));
      this.max_date = Math.max.apply(Math, this.lines.map(function(it){
        return it.datapoints[it.datapoints.length - 1].date.getTime();
      }));
      y$ = this.scale_x = d3.scale.linear();
      y$.domain([this.min_date, this.max_date]);
      y$.range([0, this.width]);
      z$ = this.scale_y = d3.scale.linear();
      z$.domain([0, 100]);
      z$.range([this.height, 0]);
    }
    return Graph;
  }());
}).call(this);
