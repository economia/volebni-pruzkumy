(function(){
  window.verticalGuide = {
    registerVerticalGuide: function(){
      var scale, margin, x$, guide, attachGuide;
      scale = this.scale_x;
      margin = this.margin;
      x$ = guide = this.verticalGuideGroup.append('line');
      x$.attr('y1', this.margin[0]);
      x$.attr('y2', this.margin[0] + this.height);
      return attachGuide = function(){
        var x$;
        x$ = this;
        x$.on('mouseover', function(datapoint){
          var x, x$;
          guide.attr('opacity', 1);
          x = margin[3] + scale(datapoint.date);
          x$ = guide;
          x$.attr('x1', x);
          x$.attr('x2', x);
          return x$;
        });
        x$.on('mouseout', function(){
          return guide.attr('opacity', 0);
        });
        return x$;
      };
    }
  };
}).call(this);
