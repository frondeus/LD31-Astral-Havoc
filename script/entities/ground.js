LD31.Ground = function()
{

	this.zIndex = -1;
};

LD31.Ground.prototype = 
{
	render: function(delta)
	{
		app.layer.save()
			.translate(app.width/2,app.height/2)
			.scale(4,4)
			.drawRegion(app.images.static,[0,0,64,64], -32,-32)
		.restore();
	}
};