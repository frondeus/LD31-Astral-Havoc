LD31.Collisions = function(entities)
{
	this.entities = entities.children;
};

LD31.Collisions.prototype = 
{
	step: function(delta)
	{
		for(var i = 0; i < this.entities.length; i++)
		{
			var a = this.entities[i];
			for(var j = i + 1; j < this.entities.length; j++)
			{
				var b = this.entities[j];
				if(this.isCollide(a,b))
				{
					if(a.onCollision)
						a.onCollision(b);
					if(b.onCollision)
						b.onCollision(a);
					if(this.callback)
						this.callback(a,b);
				}
			}
		}
	},

	isCollide: function(A,B)
	{
		A.a = Utils.wrapAngle(A.a);
		B.a = Utils.wrapAngle(B.a);

		var hDiff = Math.abs(A.height - B.height);

		var aD = Math.abs(A.a - B.a);
		var aDiff = (A.height + 32*4) * aD;

		var rSum = A.radius + B.radius;


		if(hDiff <= rSum || A.laser || B.laser)
		{
			return (aDiff <= rSum) ;
		}
		return false;
	}
};