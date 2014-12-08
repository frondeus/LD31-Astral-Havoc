LD31.Projectile = function(args)
{
	Utils.extend(this,
	{
		a: 0,
		height: 0,

		team: 0,
		damage: 10,

		speed: 300,
		ang_speed: 0,
		radius: 4,

		cooldown: 4,

		invincible: false,
		laser: false,

		zIndex: -10,
		anim: {
			frame: 3,
			to: 0,
			speed: 0,
		}

	},args);

	this.anim.speed = this.cooldown;
};

LD31.Projectile.prototype = 
{
	class: LD31.Projectile,

	isInvincible: function(other)
	{
		if(other.boost)
			return other.boost.invincible || other.invincible;
		else
			return other.invincible;
	},

	onCollision: function(other)
	{
		if(other._remove) return;
		if(other.team != this.team)
		{
			if(other.onHit && !this.isInvincible(other))
				other.onHit(this.damage);
		
			if(!this.invincible && other.class != LD31.Hp)
				app.game.entities.remove(this);
		}
		if(other.class == LD31.Boost && this.team === 0)
		{
			app.playSound("boost");
			app.game.onBoost();
			app.game.entities.remove(other);
		}
	},

	step: function(delta)
	{
		if((this.cooldown -= delta) <= 0)
			app.game.entities.remove(this);

		this.height += this.speed * delta;
		if(this.height < 0)
			app.game.entities.remove(this);

		if(this.parent._remove && this.laser)
			app.game.entities.remove(this);


		if(this.laser)
		{
			if(this.parent.class == LD31.Enemy)
				this.height = this.parent.height;
			this.a = this.parent.a;
		}


		this.a += this.ang_speed * delta;
	},

	render: function(delta)
	{
	
		if(this.anim.to > this.anim.frame)
			this.anim.frame = Math.min(this.anim.to,this.anim.frame + (delta * this.anim.speed));
		else
			this.anim.frame = Math.max(this.anim.to,this.anim.frame - (delta * this.anim.speed));

		if(this.laser)
		{
			var x = app.width/2 + Math.cos(this.a) * ((32 * 4) + this.height);
			var y = app.height/2 + Math.sin(this.a) * ((32 * 4) + this.height);
			var x2 = app.width/2 + Math.cos(this.a) * (32 * 4);
			var y2 = app.height/2 + Math.sin(this.a) * (32 * 4);
			app.layer.imageLine(app.images.laser,[(Math.round(this.anim.frame) + (4*this.team)) * 64,0,64,64],x,y,x2,y2,1);
		}
		else
		{
			var x = app.width/2 + Math.cos(this.a) * ((32 * 4) + this.height);
			var y = app.height/2 +  Math.sin(this.a) * ((32 * 4) + this.height);
			app.layer.save()
				.translate(x, y)
				.rotate(this.a)
				.drawRegion(app.images.static,[(1 + this.team) * 64,0,64,64], -32,-32);
			
			if(this.invincible)
				app.layer.drawRegion(app.images.powerup,[5 * 64,0,64,64],-32,-32);
			app.layer.restore();

		}
	}
};