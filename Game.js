
function Game()
{
	this.actors = [];
	this.view;
}

Game.prototype.tick = function()
{
	for (var i in this.actors)
	{
		this.actors[i].act();
	}
	this.view.set();
}

Game.prototype.start = function()
{
	this.map = new Map(mapWidth, mapHeight);
	for (var i = 0 ; i < numberOfActors ; i++)
	{
		//Find suitable x/y
		var attempts = 0;
		while (attempts < 100)
		{
			var x = Math.floor( Math.random() * mapWidth );
			var y = Math.floor( Math.random() * mapHeight );
			if (!this.map.getTile(x, y).blocksMovement())
			{
				this.actors.push(new Actor(this.map.getTile(x, y)));
				break;
			}
			attempts++;
		}
	}
	this.view = new View();
	setInterval(function(){game.tick();}, interval);
}








