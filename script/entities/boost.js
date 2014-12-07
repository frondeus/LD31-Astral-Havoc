LD31.Boost = function(args)
{
	Utils.extend(this,
	{
		a: Utils.randomR(0,Math.PI * 2),
		height: Utils.randomR(190,240),
		radius: 10,
		cooldown: Utils.randomR(1,10),
		ang_speed: Utils.randomR(-Math.PI / 16, Math.PI/16),
		speed: 0,
	},args);
};

LD31.Boost.prototype = 
{
	class: LD31.Boost,

	step: function(delta)
	{
		if((this.cooldown -= delta) <= 0)
			app.game.entities.remove(this);

		this.height += this.speed * delta;
		this.a += this.ang_speed * delta;
	},

	render: function(delta)
	{
		var x = app.width/2 + Math.cos(this.a) * ((32 * 4) + this.height);
		var y = app.height/2 +  Math.sin(this.a) * ((32 * 4) + this.height);
		app.layer.save()
			.translate(x, y)
			.rotate(this.a)
			.drawRegion(app.images.spritesheet,[9 * 64,0,64,64], -32,-32)
		.restore();
	}
};