(function(){
  var Graph;
  window.Graph = Graph = (function(){
    Graph.displayName = 'Graph';
    var prototype = Graph.prototype, constructor = Graph;
    function Graph(parentSelector, lines){
      var x$;
      this.parentSelector = parentSelector;
      this.lines = lines;
      this.width = 500;
      this.height = 500;
      x$ = this.svg = d3.select(parentSelector).append('svg');
      x$.attr('height', this.height);
      x$.attr('width', this.width);
      console.log(this.lines);
    }
    return Graph;
  }());
}).call(this);
