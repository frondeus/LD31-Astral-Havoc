LD31.Enemy = function(args)
{
	Utils.extend(this,
	{
		a: Utils.randomR(0,Math.PI * 2),
		height: Utils.randomR(200,240),
		ang_speed: Utils.randomR(-Math.PI / 16,Math.PI/ 16),
		radius: 28,
		speed: 0,
		
		team: 1,
		hp: 100,
		type: Utils.randomZ(0,25),
		randoms: [],

		cooldown: Utils.randomR(0.4,2.0),
		maxCooldown: Utils.randomR(0.4,2.0),
		projectile: {},

		anim: {
			frame: 0,
			to: 0,
			speed: 0,
		},

		randomSprite: Utils.randomZ(0,5)
	},args);

	var a = this.height;
	this.height = 1024;
	var tween = new TWEEN.Tween(this)
		.to({height: a}, 500)
		.easing(TWEEN.Easing.Linear.None)
		.start();

	for(var i = 0; i < 10; i++)
		this.randoms[i]= Utils.randomR(-1,1);
	
};

LD31.Enemy.prototype = 
{
	class: LD31.Enemy,

	fire: function()
	{
		var args = {
			team: this.team,
			height: this.height,
			a: this.a,
			speed: -150,
			cooldown: 8,
			radius: 2,
			parent: this,
		};

		Utils.extend(args,this.projectile);
		if(args.laser)
		{
			app.game.shakeCamera(Utils.randomR(1,4));
			app.playSound("enemy_laser");
		}
		else
			app.playSound("enemy_shoot");

		app.game.addEntity(LD31.Projectile,args);
	},

	spawnHp: function(count)
	{
		for(var i = 0; i < count; i++)
		{
			app.game.addEntity(LD31.Hp, {
				a: this.a + Utils.randomR(-Math.PI /16, Math.PI / 16),
				height: this.height + Utils.randomR(-10,10)
			});
		}
	},

	onHit: function(damage)
	{
		this.hp -= damage;
		if(this.hp <= 0)
		{
			if(this.boss)
				app.game.onBossDestroyed();
			else
				app.game.onEnemyDestroyed();
			app.game.entities.remove(this);
			this.spawnHp(Utils.randomZ(1,10));
		}
	},

	step: function(delta)
	{
		if((this.cooldown -= delta) <= 0)
		{
			this.fire();
			this.cooldown = this.maxCooldown;
		}

		switch(this.type)
		{
			case 2:
				this.ang_speed = Math.sin(app.game.time *this.randoms[0] * 5) * Math.PI / 2;
				break;

			case 4:
				this.ang_speed = Math.sin(app.game.time * this.randoms[0] * 5)  * Math.sin(app.game.time * this.randoms[1] * 5)* Math.PI / 2;
				break;

			case 5:
				this.ang_speed = Math.sin(app.game.time * this.randoms[0] * 5) * Math.cos(app.game.time * this.randoms[1] * 5) * Math.PI / 2;
				break;

			case 6:
				this.ang_speed = Math.sin(Math.cos(app.game.time * this.randoms[0] * 5) * this.randoms[1] * 2) * Math.PI / 4;
				break;

			case 7:
				this.ang_speed = Math.tan(app.game.time * this.randoms[0]) * Math.PI / 32;
				break;

			case 8:
				var last = this.invincible;
				this.invincible = (Math.cos(app.game.time * this.randoms[0]) > 0);
				if(this.invincible && !last)
				{
					console.log("show");
					this.anim = {
						frame: 3,
						to: 0,
						speed: 2,
					};
				}
				else if(last && !this.invincible)
				{
					console.log("hide");
					this.anim = {
						frame: 0,
						to: 3,
						speed: 2,
					};
				}
				break;
		}

		this.height = Math.max(-1, this.height + (this.speed * delta));
		this.a += this.ang_speed * delta;

	},

	render: function(delta)
	{
		if(this.anim.to > this.anim.frame)
			this.anim.frame = Math.min(this.anim.to,this.anim.frame + (delta * this.anim.speed));
		else
			this.anim.frame = Math.max(this.anim.to,this.anim.frame - (delta * this.anim.speed));

		

		var x = app.width/2 + Math.cos(this.a) * ((32 * 4) + this.height);
		var y = app.height/2 +  Math.sin(this.a) * ((32 * 4) + this.height);
		app.layer.save()
			.translate(x, y)
			.rotate(this.a + Math.PI/2)
			.drawRegion(app.images.enemy,[this.randomSprite * 64,0,64,64], -32,-32);

		if(this.invincible)
			app.layer.drawRegion(app.images.powerup,[Math.round(this.anim.frame) * 64, 0, 64,64],-32,-32);
		app.layer.restore();
		//app.game.centerText(this.hp,x,y,"32px");
	}

};