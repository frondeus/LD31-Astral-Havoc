
LD31.GameObject = function(args)
{
	Utils.extend(this,
	{
		a: 0,
		height: 0,

		isGround: false,
		isPlayer: false,
		isEnemy: false,
		isBullet: false,
		isParticle: false,
		isBoost: false,

		team: 0,
		hp: 100,

		//Phx
		speed: 0,
		ang_speed : 0,
		radius: 20,

		//Fire
		input_shoot: false,
		cooldown: 0,
		maxCooldown: 0.2,
		projectile: {
			isLaser: false,
		},

		weapon_boost: 0,
		boost_cooldown: 0

		
	},args);
	if(this.isPlayer)
		this.radius -= 10;

};

LD31.GameObject.prototype = 
{
	particles: function(count)
	{
		for(var i = 0; i < count; i++)
		{
			app.game.addEntity({
				isParticle: true,
				a: this.a + Utils.randomR(-Math.PI / 16, Math.PI/16),
				height: this.height + Utils.randomR(-10,10),
				speed: -200 + Utils.randomR(0,100),
				cooldown: 16,
			});
		}
	},
	fire: function()
	{
		var args = {
			isBullet: true,
			zIndex: -10,
			team: this.team,
			height: this.height,
			
			a: this.a,
			speed: 300,
			cooldown: 4,
			radius: 4,
		};

		if(this.isEnemy)
		{
			args.speed *= -0.5;
			args.cooldown *= 2;
			args.radius *= 0.5;
		}
		Utils.extend(args,this.projectile);

		if(args.isLaser && this.isEnemy)
			app.playSound("enemy_laser");
		switch(this.weapon_boost)
		{
			case 1:
				args.a += Math.PI / 64;
				app.game.addEntity(args);
				args.a -= Math.PI / 32;
				app.game.addEntity(args);
				if(this.isPlayer)
					app.playSound("player_shoot");
				else
					app.playSound("enemy_shoot");
			break;
			case 2:
				this.maxCooldown = 3;
				args.isLaser = true;
				args.cooldown = 1;
				args.ang_speed = this.ang_speed;
				args.height += 400;
				args.speed = 0;
				app.game.addEntity(args);
				if(this.isPlayer)
					app.playSound("player_laser");
			break;
			default:
				if(this.isPlayer) 
				{
					app.playSound("player_shoot");
					this.maxCooldown = 0.2;
				}
				else app.playSound("enemy_shoot");
				app.game.addEntity(args);

			break;
		}

		
		
	},

	onCollision: function(other)
	{
		if(this.isPlayer && other.isParticle)
		{
			this.hp += 2;
			app.game.entities.remove(other);
			app.playSound("hp_taken");
		}
		if(this.team == other.team && other.isBoost && this.isBullet)
		{
			app.playSound("boost");
			app.game.onBoost();
			app.game.entities.remove(other);
		}
		if(other.team != this.team && this.isBullet && !other.isParticle)
		{
			if(other.isBullet && !other.isLaser)
				app.game.entities.remove(other);
			else if(!other.isGround)
			{
				other.hp -= (this.isLaser?1:10);

				if(other.hp <= 0)
				{
					this.particles(Utils.randomZ(1,4));
					if(other.isEnemy)
						app.game.onEnemyDestroyed();
					
					if(other.isPlayer)
						app.game.onPlayerDestroyed();

					
					
					app.game.entities.remove(other);
				}
			}
			if(!this.isLaser)
				app.game.entities.remove(this);
		}
	},

	step: function(delta)
	{
		if((this.cooldown -= delta) <= 0)
		{
			if(this.isBullet || this.isParticle)
				app.game.entities.remove(this);
			if(this.isEnemy)
			{
				this.fire();
				this.cooldown = this.maxCooldown;
			}
			if(this.isPlayer && this.input_shoot)
			{
				this.fire();	
				this.cooldown = this.maxCooldown;
			}
		}

		if(this.isPlayer && (this.boost_cooldown -= delta) <= 0)
			this.weapon_boost = 0;
		
		this.height =  Math.max(-1,this.height + (this.speed * delta));
		if(this.height < 0 && this.isBullet)
		{
			app.game.entities.remove(this);
		}
		
		this.a += this.ang_speed * delta;

		if(this.a < 0) this.a += (Math.PI * 2);
		if(this.a > Math.PI * 2) this.a -= (Math.PI * 2);
	},

	render: function(delta)
	{
		var sprite = [];
		if(this.isGround)
		{
			app.layer.save()
				.translate(app.width/2,app.height/2)
				.scale(4,4)
				.drawRegion(app.images.spritesheet,[0,0,64,64], -32,-32)
			.restore();
		}
		else if(this.isPlayer)
			sprite = [2,0];
		else if(this.isEnemy)
			sprite = [3 ,0];
		else if(this.isBullet)	// 5,6, 7,8
			sprite = [5  + this.team ,0];
		else if(this.isParticle)
			sprite = [4,0];
		else if(this.isBoost)
			sprite = [9,0];
		
		if(this.isLaser)
		{
			var x = app.width/2 + Math.cos(this.a) * ((32 * 4) + this.height);
			var y = app.height/2 + Math.sin(this.a) * ((32 * 4) + this.height);
			var x2 = app.width/2 + Math.cos(this.a) * (32 * 4);
			var y2 = app.height/2 + Math.sin(this.a) * (32 * 4);
			app.layer.imageLine(app.images.spritesheet,[(7 + this.team) * 64,0,64,64],x,y,x2,y2,1);
		}
		if(!this.isGround && !this.isLaser)
		{

			var x = app.width/2 + Math.cos(this.a) * ((32 * 4) + this.height);
			var y = app.height/2 +  Math.sin(this.a) * ((32 * 4) + this.height);
			app.layer.save()
				.translate(x, y)
				.rotate(this.a)
				.drawRegion(app.images.spritesheet,[sprite[0] * 64,sprite[1] * 64,64,64], -32,-32)
			.restore();
			
			if(this.isEnemy)
				app.game.centerText(this.hp,x,y,"32px");
		}
	}
};

