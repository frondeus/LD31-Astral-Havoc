Utils = {
  extend: function()
  {
    for(var i = 1; i < arguments.length; i++)
    {
      for(var j in arguments[i])
      {
        arguments[0][j] = arguments[i][j];
      }
    }
  },

    randomR: function(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    randomZ: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },


    cross: function(A, B)
    {
        return A.x * B.y - A.y * B.x;
    }
};

Vec2 = function(x, y)
{
    this.x = x || 0;
    this.y = y || 0;
};

Vec2.prototype = {

    l: function()
    {
        return Math.sqrt(this.l2());
    },

    l2: function()
    {
        return (this.x * this.x) + (this.y * this.y);
    },

    toString: function()
    {
        return  " (" +this.x + "x" + this.y + ") ";
    },

    normalize: function()
    {
        var length = this.l();
        this.x /= length;
        this.y /= length;
    },

    plus: function(B)
    {
        var C = new Vec2(this.x,this.y);
        C.x += B.x;
        C.y += B.y;
        return C;
      
    },

    minus: function(B)
    {
        return this.plus({x: -B.x, y: -B.y});
    },

    mul: function(s)
    {
        var C = new Vec2(this.x,this.y);
        C.x *= s;
        C.y *= s;
        return C;
    },

    div: function(s)
    {
        return this.mul(1.0/s);
    }
};
