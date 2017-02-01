
function Actor(tile)
{
	this.tile = tile;
	this.viewDistance = actorViewDistance;
	this.timeUntilNextAction = Math.floor( Math.random() * actorMoveTime + 1);
}

Actor.prototype.act = function()
{
	this.timeUntilNextAction--;
	if (this.timeUntilNextAction > 0)
	{
		return;
	}
	var visibleActor = false;

	/*
	var tiles = shuffle(this.getVisibleTiles());
	for (var i = 0 ; i < tiles.length ; i++)
	{
		if (a = tiles.actor)
		{
			visibleActor = a;
			break;
		}
	}
	*/
	//Scan pixels within view distance
	
	var range = 2 * this.viewDistance + 1;
	var xOffsetStart = Math.floor( Math.random() * (range + 1) );
	for (var xOffset =  xOffsetStart ; xOffset < xOffsetStart + range ; xOffset++)
	{
		var x = (xOffset % range) + this.tile.x - this.viewDistance;
		var yOffsetStart = Math.floor( Math.random() * (range + 1) );
		for (var yOffset =  yOffsetStart ; yOffset < yOffsetStart + range ; yOffset++)
		{
			var y = (yOffset % range) + this.tile.y - this.viewDistance;
			if (getDistance(x, y, this.tile.x, this.tile.y) > this.viewDistance)
			{
				continue;
			}
			var t = game.map.getTile(x, y);
			if (t && t.actor && t.actor !== this)
			{
				visibleActor = t.actor;
			}
		}
		if (visibleActor)
		{
			break;
		}
	}
	
	if (visibleActor)
	{
		var dir = this.getBestDirectionTowards(visibleActor);
		if (this.canMoveTowards(dir))
		{
			this.move(dir);
		}
	}
	else
	{
		this.moveRandomly();
	}
}

Actor.prototype.moveRandomly = function()
{
	var start = Math.floor( Math.random() * 4 );
	for (var i = start ; i < start + 4 ; i++)
	{
		var dir = start % 4;
		if (this.canMoveTowards(dir))
		{
			this.move(dir);
			return;
		}
	}
}

Actor.prototype.getBestDirectionTowards = function(a)
{
	var angle = Math.atan2(a.tile.x - this.tile.x, a.tile.y - this.tile.y) / Math.PI;
	if (angle >= 0 && angle < .25)
	{
		return 2;
	}
	else if (angle >= .25 && angle < .75)
	{
		return 1;
	}
	else if (angle >= .75 || angle < -.75)
	{
		return 0;
	}
	else
	{
		return 3;
	}
}

Actor.prototype.canMoveTowards = function(dir)
{
	if (sib = this.tile.sibs[dir])
	{
		return !sib.blocksMovement();
	}
	return false;
}

Actor.prototype.move = function(directionIndex) //0, 1, 2, 3
{
	var newTile = this.tile.sibs[directionIndex];
	this.tile.removeActor();
	newTile.setActor(this);
	this.tile = newTile;
	this.timeUntilNextAction = actorMoveTime;
}

Actor.prototype.getVisibleTiles = function()
{
	var tiles = [];
	for (var x = this.tile.x - this.viewDistance ; x <= this.tile.x + this.viewDistance ; x++)
	{
		for (var y = this.tile.y - this.viewDistance ; y <= this.tile.y + this.viewDistance ; y++)
		{
			if (t = game.map.getTile(x, y))
			{
				tiles.push(t);
			}
		}
	}
	return tiles;
}

/*
//Make the actor look for other actors. If it can see one, move towards it
Actor.prototype.act = function()
{
	if (this.timeUntilNextAction > 0)
	{
		this.timeUntilNextAction--;
		return;
	}
	var visibleActors = [];
	//Scan pixels within view distance
	var range = 2 * this.viewDistance + 1;
	var xOffsetStart = Math.floor( Math.random() * (range + 1) );
	for (var xOffset =  xOffsetStart ; xOffset < xOffsetStart + range ; xOffset++)
	{
		var x = (xOffset % range) + this.x - this.viewDistance;
		var yOffsetStart = Math.floor( Math.random() * (range + 1) );
		for (var yOffset =  yOffsetStart ; yOffset < yOffsetStart + range ; yOffset++)
		{
			var y = (yOffset % range) + this.y - this.viewDistance;
			if (getDistance(x, y, this.x, this.y) > this.viewDistance)
			{
				continue;
			}
			var a = game.pixelOccupiedBy(x, y);
			if (a && visibleActors.indexOf(a) === -1 && a !== this)
			{
				visibleActors.push(a);
			}
			if (visibleActors.length >= 1)
			{
				break;
			}
		}
		if (visibleActors.length >= 1)
		{
			break;
		}
	}
	if (visibleActors.length === 0)
	{
		return;
	}
	//If we see an actor, pick one at random.
	var actor = visibleActors[0];
	//Get direction towards actor
	var dir = this.getBestDirectionTowards(actor);
	if (this.canMoveTo(dir))
	{
		this.move(dir);
	}
}



Actor.prototype.canMoveTo = function(direction)
{
	var x = this.x;
	var y = this.y;
	switch (direction)
	{
		case 0:
			y--;
			break;
		case 1:
			x++;
			break;
		case 2:
			y++;
			break;
		case 3:
			x--;
			break;
		default:
			throw new Error("Bad direction index: " + direction);
	}
	for (var i in game.actors)
	{
		var a = game.actors[i];
		if (a === this){continue;}
		if (a.collidesWith(x, y, this.width, this.height))
		{
			return false;
		}
	}
	return true;
}

Actor.prototype.collidesWith = function(x, y, width, height)
{
	if (x < this.x + this.width &&
		   x + width > this.x &&
		   y < this.y + this.height &&
		   height + y > this.y) 
	{
		return true;
	}
	return false;
}

Actor.prototype.occupiesPixel = function(x, y)
{
	if (x >= this.x && 
		x < this.x + this.width &&
		y >= this.y &&
		y < this.y + this.height)
	{
		return true;
	}
	return false;
}

Actor.prototype.move = function(directionIndex) //0, 1, 2, 3
{
	switch (directionIndex)
	{
		case 0:
			this.y--;
			break;
		case 1:
			this.x++;
			break;
		case 2:
			this.y++;
			break;
		case 3:
			this.x--;
			break;
		default:
			throw new Error("Bad direction index: " + direction);
	}
	this.timeUntilNextAction = actorMoveTime;
}
*/