var app = playground({
  smoothing: false,

  create: function() {
    // this.loadImages("spritesheet", "wall", "back");

    },

  ready: function() {
    this.game.init();
    this.setState(this.game);
  },

  step: function(delta) {
  },

  render: function(delta) {
    this.layer.clear("#fff");
  },

  
  mousedown: function(event) {
  },

  mouseup: function(event) {
  },

  mousemove: function(event) {
  },

  keydown: function(event) {
  },

  keyup: function(event) {
  }

});