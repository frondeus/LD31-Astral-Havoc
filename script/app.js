var app = playground({
  smoothing: false,
  // width: 640,
  // height: 480,

  create: function() {
    this.loadImages("spritesheet");
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