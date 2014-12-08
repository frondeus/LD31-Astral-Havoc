var app = playground({
  smoothing: false,

  create: function() {
    this.loadImages("static", "player","enemy", "powerup", "laser", "sky");
    this.loadSounds("intro","casual",
        "boost", "enemy_laser", "enemy_shoot" ,"hp_taken","player_laser", "player_shoot");
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
    if(event.key === "f8") this.record({});
  },

  keyup: function(event) {
  }

});