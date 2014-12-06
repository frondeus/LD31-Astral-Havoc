LD31.Entities = function() {

  this.children = [];

  this.index = 0;

};

LD31.Entities.prototype = {

  add: function(object, args) {

    /* create new object */

    if (typeof object === "function") {

      args = args || { };
      args.index = args.index || ++this.index;
      var entity = new object(args);
    } 

    /* adopt existing object */

    else {
      var entity = object;
      entity.index = entity.index || __this.index;
    }


    this.children.push(entity);

    this.dirty = true;

    return entity;

  },

  get: function(index)
  {
    for(var e in this.children)
    {
      var entity = this.children[e];
      if(index == this.children[e].index)
        return entity;
    }
  },

  cleanup: function() {

    for (var i = 0, len = this.children.length; i < len; i++) {
      var entity = this.children[i];
      if (entity._remove) {
        this.children.splice(i--, 1);
        len--;
      }
    }

    this.sort();

    this.dirty = false;

  },

  sort: function() {

    this.children.sort(function(a, b) {

      if (a.zIndex === b.zIndex) {
        return (a.index > b.index) ? 1 : (a.index < b.index ? -1 : 0);
      }

      return (a.zIndex | 0) - (b.zIndex | 0);
    });

  },

  remove: function(entity) {

    entity._remove = true;
    this.dirty = true;

  },

  step: function(delta) {

    if (this.dirty) this.cleanup();

    for (var i in this.children)
      if (this.children[i].step) this.children[i].step(delta);

  },

  render: function(delta) {

    for (var i in this.children)
      if (this.children[i].render) this.children[i].render(delta);

  }

};