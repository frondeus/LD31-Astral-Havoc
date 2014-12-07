LD31.Hp = function(args)
{
	Utils.extend(this,
	{
		a: 0,
		height: 0,

		speed: -200 + Utils.randomR(0,100),

		cooldown: 16,
		radius: 10,

	},args);	
};

LD31.Hp.prototype = 
{
	class: LD31.Hp,

	step: function(delta)
	{
		if((this.cooldown -= delta) <= 0)
			app.game.entities.remove(this);

		this.height = Math.max(0, this.height + (this.speed * delta));
	},

	render: function(delta)
	{
		var x = app.width/2 + Math.cos(this.a) * ((32 * 4) + this.height);
		var y = app.height/2 +  Math.sin(this.a) * ((32 * 4) + this.height);
		app.layer.save()
			.translate(x, y)
			.rotate(this.a)
			.drawRegion(app.images.spritesheet,[4 * 64,0,64,64], -32,-32)
		.restore();
	}
};