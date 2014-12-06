//Client Game:

app.game = {
	init: function()
	{
		this.entities = new LD31.Entities();
	},

	step: function(delta)
	{
		this.entities.step(delta);
	},	

	render: function(delta)
	{	
		this.entities.render(delta);
	},	

	mousemove: function(event)
	{
		
	},	

	mousedown: function(event)
	{
		
	},	

	mouseup: function(event)
	{
		
	},	

	keydown: function(event)
	{
		
	},	

	keyup: function(event)
	{
		
	}
};