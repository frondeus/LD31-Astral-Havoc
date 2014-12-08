LD31.Player = function(args)
{
	Utils.extend(this,
	{
		a: 0,
		height: 0,
		team: 0,
		hp: 100,

		radius: 24,

		input_shoot: false,

		cooldown: 0,
		maxCooldown: 0.2,
		projectile: {},

		boost: {},

		randomSprite: Utils.randomZ(0,1),
		anim:{
			speed: 1,
			frame: 0,
			to: 0,
		}
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
			parent: this,
		};

		Utils.extend(args,this.boost.projectile,this.projectile);

		if(args.laser)
		{
			app.game.shakeCamera(Utils.randomR(3,5));
			app.playSound("player_laser");
		}
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
		app.game.shakeCamera(Utils.randomR(0.5,2));
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
		if(this.anim.to > this.anim.frame)
			this.anim.frame = Math.min(this.anim.to,this.anim.frame + (delta * this.anim.speed));
		else
			this.anim.frame = Math.max(this.anim.to,this.anim.frame - (delta * this.anim.speed));

		

		var x = app.width/2 + Math.cos(this.a) * ((32 * 4));
		var y = app.height/2 +  Math.sin(this.a) * ((32 * 4));
		app.layer.save()
			.translate(x, y)
			.rotate(this.a + Math.PI/2)
			.drawRegion(app.images.player,[this.randomSprite * 64,0,64,64], -32,-32);



		if(this.boost.invincible || this.invincible)
			app.layer.drawRegion(app.images.powerup,[Math.round(this.anim.frame) * 64, 0, 64,64],-32,-32);
		
		app.layer.restore();
	}




};