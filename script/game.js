//Client Game:

app.game = {
	init: function()
	{
		this.entities = new LD31.Entities();
		this.collisions = new LD31.Collisions(this.entities);

		this.state = 0;
		this.msg = "Start";
		this.introSong = app.playSound("intro",true);
		this.introSong.volume = 0.25;
		this.starsPattern = this.createPattern(app.images.sky, [0,0,128,128]);

		this.addEntity(LD31.Ground,{});
		this.time = 0;
		this.camera =
		{
			x: 0,
			y: 0,
			amplitude: 0,
		};
	},

	startGame: function()
	{
		app.stopSound(this.introSong);
		this.casualSong = app.playSound("casual",true);
		this.casualSong.volume = 0.75;

		this.cooldown = 2;
		this.enemyCount = 0;
		this.maxEnemy = 1;
		this.destroyedEnemy = 0;
		this.state = 1;
		this.wave = 1;
		this.boost_cooldown = 20;

		this.entities = new LD31.Entities();
		this.collisions = new LD31.Collisions(this.entities);
		this.addEntity(LD31.Ground,{});
		this.player = this.addEntity(LD31.Player,{});
		

		this.msg = "It's comming!";
	},
	
	addEntity: function(type, args)
	{
		return this.entities.add(type, args);
	},

	createPattern: function(source, sprite)
	{
		var pattern_canvas = document.createElement('canvas');
		pattern_canvas.width = sprite[2];
		pattern_canvas.height = sprite[3];
		var pattern_context = pattern_canvas.getContext('2d');
		pattern_context.drawImage(source,sprite[0],sprite[1],sprite[2],sprite[3], 0,0, sprite[2],sprite[3]);
		return app.layer.context.createPattern(pattern_canvas,"repeat");
	},


	// Logic
	onPlayerDestroyed: function()
	{
		this.msg = "Try\nAgain";
		delete this.player;
		this.state = 2;
		app.stopSound(this.casualSong);
	},

	onEnemyDestroyed: function()
	{
		this.shakeCamera(Utils.randomR(1,4));
		this.enemyCount--;
		this.destroyedEnemy++;
		if(this.enemyCount <= 0)
		{
			this.maxEnemy *= 2;
			this.player.hp += 10;
			this.destroyedEnemy = 0;
			this.enemyCount = 0;
			this.wave++;
		}
	},

	onBoost: function()
	{
		var r = Utils.randomZ(1,6);
		this.player.boost.cooldown = Utils.randomR(10,30);
		switch(r)
		{
			case 1:
				this.player.boost.invincible = true;
				this.player.anim = {
					frame: 3,
					to: 0,
					speed: 5,
				};
			break;
			case 3:
				this.player.boost.moreFire = 2;
			break;
			case 4:
				this.player.boost.maxCooldown = Utils.randomR(1,3);
				this.player.boost.projectile = {
					laser: true,
					invincible: true,
					speed: 0,
					damage: 15,
					height: 1024,
					radius: 32,
					cooldown: this.player.boost.maxCooldown /3,
				};
			break;
			case 5:
				this.addEntity(LD31.Ally,{});
			break;

			case 6:
				this.player.boost.projectile = {
					invincible: true,
					damage: 15,
					radius: 8,
				};
			break;

			default:
				this.player.boost.moreFire = 1;
			break;
		}
	},

	//Creation

	createBoost: function()
	{
		this.boost_cooldown = Utils.randomR(10,60);
		this.addEntity(LD31.Boost,{});
	},
	
	createCasualEnemy: function()
	{
		this.addEntity(LD31.Enemy,{});
	},

	createLaserEnemy: function()
	{
		var ang_speed = Utils.randomR(-Math.PI / 32, Math.PI / 32);
		var cd = Utils.randomR(3,30);
	
		this.addEntity(LD31.Enemy,{
			ang_speed: ang_speed,
			cooldown: cd,
			maxCooldown: cd,
			hp: 150,
			projectile: {
				laser: true,
				invincible: true,
				speed: 0,
				cooldown: cd /3,
				damage: 15
			}
		});
	},

	step: function(delta)
	{
		if(this.state >= 1)
		{
			if((this.boost_cooldown -= delta) <= 0)
				this.createBoost();
			
			if((this.cooldown -= delta) <= 0 && (this.enemyCount + this.destroyedEnemy) < this.maxEnemy)
			{
				delete this.msg;
				this.cooldown = Utils.randomZ(0.5, 2);
				var type = Utils.randomZ(0,10);
				switch(type)
				{
					case 1:
						this.createLaserEnemy();
						break;
					default:
						// this.createLaserEnemy();
						this.createCasualEnemy();
						break;
				}
				this.enemyCount++;
			}
		}
		this.time += delta ;
		TWEEN.update(this.time* 1000);
		this.entities.step(delta);
		this.collisions.step(delta);
	},	

	shakeCamera: function(max)
	{
		this.camera.amplitude=  max;
	},

	// Render 
	render: function(delta)
	{	
		app.layer.clear(this.starsPattern);

		this.camera.x = Utils.randomR(-1,1) * this.camera.amplitude;
		this.camera.y = Utils.randomR(-1,1) * this.camera.amplitude;
		this.camera.amplitude = Math.max(0,this.camera.amplitude - 0.1);

		app.layer
			.save()
			.translate(this.camera.x,this.camera.y);
		
		
		this.entities.render(delta);

		this.centerText(this.wave || "Click", app.width/2, app.height/2 - 32, "120px");

		if(!this.msg && this.player)
			this.centerText("Hp: " + this.player.hp,app.width/2,app.height/2 + 32, "48px");
		else
			this.centerText(this.msg,app.width/2,app.height/2 + 32, "48px");

		app.layer.restore();
	},	

	centerText: function(text, x, y, size)
	{
		size = size || "48px";
		x = x || 0;
		y = y || 0;
		app.layer
			.font("" +size + " Pixel")
			.fillStyle("#ffffff");
		var bound = app.layer.textBoundaries(""+text);
		app.layer.fillText(""+text, x - bound.width/2, y + bound.height/4);
	},


	// Input


	mousemove: function(event)
	{
		if(this.player)
		{
			var dx = app.width/2 - app.mouse.x;
			var dy = app.height/2 - app.mouse.y;
			var a = Math.atan2(-dy,-dx);
			a= Utils.wrapAngle(a);
			this.player.a = a;	

		}
	},	

	mousedown: function(event)
	{
		switch(this.state)
		{
			case 1:
				if(event.button == "left")
				this.player.input_shoot = true;
			break;
			default:
				if(event.button == "left")
					this.startGame();
			break;
		}
	},	

	mouseup: function(event)
	{
		if(this.state == 1)
		{
			if(event.button == "left")
				this.player.input_shoot = false;
		}
	}
};