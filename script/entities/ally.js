LD31.Ally = function(args)
{
	Utils.extend(this,
	{
		a: Utils.randomR(0,Math.PI *2),
		height: 0,
		team: 0,
		hp: Utils.randomZ(30,100),

		ang_speed: Utils.randomR(-Math.PI/16,Math.PI/16),

		radius: 10,

		cooldown: 1,
		maxCooldown: Utils.randomR(0.1,0.5),
		projectile: {},
	},
	args);	
};

LD31.Ally.prototype = 
{
	class: LD31.Ally,

	fire: function()
	{
		var args=  {
			team: this.team,
			height: this.height,
			a: this.a,
			parent: this,
		};
		Utils.extend(args,this.projectile);
		app.playSound("player_shoot");

		app.game.addEntity(LD31.Projectile,args);
	},

	onHit: function(damage)
	{
		app.game.shakeCamera(Utils.randomR(0.1,0.5));
		this.hp -= damage;
		if(this.hp <= 0)
			app.game.entities.remove(this);
	},

	onCollision: function(other)
	{
		if(other.class == LD31.Hp)
		{
			this.hp += 2;
			app.game.entities.remove(other);
			app.playSound("hp_taken");
		}
	},

	step: function(delta)
	{
		if((this.cooldown -= delta) <= 0)
		{
			this.fire();
			this.cooldown = this.maxCooldown;
		}

		this.a += this.ang_speed * delta;
	},
	
	render: function(delta)
	{
		var x = app.width/2 + Math.cos(this.a) * ((32 * 4));
		var y = app.height/2 +  Math.sin(this.a) * ((32 * 4));
		app.layer.save()
			.translate(x, y)
			.rotate(this.a + Math.PI/2)
			.drawRegion(app.images.powerup,[4 * 64,0,64,64], -32,-32);
		app.layer.restore();
	}
};