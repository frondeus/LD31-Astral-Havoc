LD31.Player = function(args)
{
	Utils.extend(this,
	{
		a: 0,
		height: 0,
		team: 0,
		hp: 100,

		radius: 10,

		input_shoot: false,

		cooldown: 0,
		maxCooldown: 0.2,
		projectile: {},

		boost: {},
		// boost:
		// {
		//  cooldown: 0,
		// 	invincible: false,
		// 	maxCooldown: 0.1,
		// 	moreFire: 0,
		//  projectile: {},
		// }
	},args);	
};

LD31.Player.prototype = 
{
	class: LD31.Player,

	fire: function()
	{
		var args = {
			team: this.team,
			height: this.height,
			a: this.a,
		};

		Utils.extend(args,this.boost.projectile,this.projectile);

		if(args.laser)
			app.playSound("player_laser");
		else
			app.playSound("player_shoot");
		 
		if(this.boost.moreFire > 0)
		{
			var b = Math.PI/64;
			args.a = args.a - b;
			for(var i = 0; i < this.boost.moreFire; i++)
			{
				app.game.addEntity(LD31.Projectile,args);
				args.a += (2 * b) / this.boost.moreFire; 
			}
		}
		app.game.addEntity(LD31.Projectile,args);	
		
	},

	onHit: function(damage)
	{
		this.hp -= damage;
		if(this.hp <= 0)
		{
			app.game.onPlayerDestroyed();
			app.game.entities.remove(this);
		}
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
		if((this.cooldown -= delta) <= 0 && this.input_shoot)
		{
			this.fire();
			this.cooldown = this.boost.maxCooldown || this.maxCooldown;
		}
		if((this.boost.cooldown -= delta) <=0)
			this.boost = {};
	},

	render: function(delta)
	{
		// console.log("Player: "+ this.a );

		var x = app.width/2 + Math.cos(this.a) * ((32 * 4));
		var y = app.height/2 +  Math.sin(this.a) * ((32 * 4));
		app.layer.save()
			.translate(x, y)
			.rotate(this.a);

		app.layer.drawRegion(app.images.spritesheet,[2 * 64,0,64,64], -32,-32);
		if(this.invincible)
			app.layer.drawRegion(app.images.spritesheet,[640, 0, 64,64],-32,-32);
		
		app.layer.restore();
	}




};