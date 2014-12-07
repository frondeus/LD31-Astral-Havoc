LD31.Enemy = function(args)
{
	Utils.extend(this,
	{
		a: Utils.randomR(0,Math.PI * 2),
		height: Utils.randomR(200,240),
		ang_speed: Utils.randomR(-Math.PI / 16,Math.PI/ 16),
		radius: 20,
		speed: 0,
		
		team: 1,
		hp: 100,

		cooldown: Utils.randomR(0.4,2.0),
		maxCooldown: Utils.randomR(0.4,2.0),
		projectile: {}
	},args);

	var a = this.height;
	this.height = 600;
	var tween = new TWEEN.Tween(this)
		.to({height: a}, 1500)
		.easing(TWEEN.Easing.Linear.None)
		.start();
	
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
			radius: 2
		};

		Utils.extend(args,this.projectile);
		if(args.laser)
			app.playSound("enemy_laser");
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
		this.height = Math.max(-1, this.height + (this.speed * delta));
		this.a += this.ang_speed * delta;

	},

	render: function(delta)
	{
		var x = app.width/2 + Math.cos(this.a) * ((32 * 4) + this.height);
		var y = app.height/2 +  Math.sin(this.a) * ((32 * 4) + this.height);
		app.layer.save()
			.translate(x, y)
			.rotate(this.a)
			.drawRegion(app.images.spritesheet,[3 * 64,0,64,64], -32,-32)
		.restore();
		//app.game.centerText(this.hp,x,y,"32px");
	}

};