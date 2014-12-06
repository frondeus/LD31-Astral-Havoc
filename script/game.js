//Client Game:

app.game = {
	init: function()
	{
		this.entities = new LD31.Entities();
		this.collisions = new LD31.Collisions(this.entities);

		this.addEntity({
			isGround: true
		});

		this.state = 0;
		this.msg = "Start";
		this.introSong = app.playSound("intro",true);
		this.introSong.volume = 0.25;
		this.starsPattern = this.createPattern(app.images.spritesheet, [64,0,64,64]);
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
		this.addEntity({
			isGround: true
		});

		this.player = this.addEntity({
			isPlayer: true
		});

		this.msg = "It's comming!";
	},
	
	addEntity: function(args)
	{
		return this.entities.add(LD31.GameObject, args);
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

	isBossWave: function()
	{
		return ((this.wave % 5 ) === 0);
	},

	onPlayerDestroyed: function()
	{
		this.msg = "Try\nAgain";
		delete this.player;
		this.state = 2;
		app.stopSound(this.casualSong);
	},

	onEnemyDestroyed: function()
	{
		this.enemyCount--;
		this.destroyedEnemy++;
		if(this.destroyedEnemy >= this.maxEnemy)
		{
			if(!this.isBossWave())
			{
				this.maxEnemy *= 3;
				this.player.hp += 10;
				this.destroyedEnemy = 0;
				this.wave++;
			}
			else
				this.createBoss();
		}

	},

	onBoost: function()
	{
		this.player.weapon_boost = Utils.randomZ(1,2);
		this.player.boost_cooldown = Utils.randomZ(10,30);
	},

	//Creation

	createBoost: function()
	{
		this.boost_cooldown = Utils.randomR(10,60);
		this.addEntity({
			isBoost: true,
			a: Utils.randomR(0,Math.PI * 2),
			height: Utils.randomR(190,240),
			ang_speed: Utils.randomR(-Math.PI / 16, Math.PI/16),
			cooldown: Utils.randomR(1,10)
		});
	},

	createBoss: function()
	{
		var bossLevel = this.wave % 5;
		switch(bossLevel)
		{
			default:

			break;
		}
	},

	createCasualEnemy: function()
	{
		this.addEntity({
			isEnemy: true, team: 1,
			a: Utils.randomR(0,Math.PI*2),
			height: Utils.randomR(200,240),
			ang_speed: Utils.randomR(-Math.PI / 16,Math.PI/16),
			cooldown: 0,
			maxCooldown: Utils.randomR(0.4, 2.0)
		});
	},

	createLaserEnemy: function()
	{
		var ang_speed = Utils.randomR(-Math.PI / 32, Math.PI / 32);
		var cd = Utils.randomR(3,30);
		this.addEntity({
			isEnemy: true, team: 1,
			a: Utils.randomR(0,Math.PI * 2),
			height: Utils.randomR(200,240),
			ang_speed: ang_speed,
			cooldown: 0,
			maxCooldown: cd,
			hp: 150,
			projectile: {
				isLaser: true,
				speed: 0,
				cooldown: cd /3,
				ang_speed: ang_speed
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
						this.createCasualEnemy();
				}
				this.enemyCount++;
			}
		}
		this.entities.step(delta);
		this.collisions.step(delta);
	},	

	// Render 
	render: function(delta)
	{	
		app.layer.clear(this.starsPattern);

		this.entities.render(delta);

		this.centerText(this.wave || "Click", app.width/2, app.height/2 - 32, "120px");

		if(!this.msg && this.player)
			this.centerText("Hp: " + this.player.hp,app.width/2,app.height/2 + 32, "48px");
		else
			this.centerText(this.msg,app.width/2,app.height/2 + 32, "48px");
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