
function Actor(tile)
{
	this.tile = tile;
	this.viewDistance = actorViewDistance;
	this.timeUntilNextAction = Math.floor( Math.random() * actorMoveTime + 1);
	this.team = Math.round(Math.random());
}


Actor.prototype.act0 = function()
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
	//var xDirection = Math.round(Math.random() * 2) - 1; //-1 or 1;
	//var yDirection = Math.round(Math.random() * 2) - 1; //-1 or 1;
	/*
	var range = 2 * this.viewDistance;
	var xIteratorStart = Math.floor( Math.random() * range );
	for (var xIterator = xIteratorStart ; xIterator < xIteratorStart + range ; xIterator++)
	{
		var xOffset = xIterator < range ? xIterator : xIterator - range;
		//var x = this.tile.x - (this.viewDistance * xDirection) + (xOffset * xDirection);
		var x = this.tile.x - (this.viewDistance) + (xOffset);
		var yIteratorStart = Math.floor( Math.random() * (range + 1) );
		for (var yIterator = yIteratorStart ; yIterator < yIteratorStart + range ; yIterator++)
		{
			var yOffset = yIterator < range ? yIterator : yIterator - range;
			//var y = this.tile.y - (this.viewDistance * yDirection) + (yOffset * yDirection);
			var y = this.tile.y - (this.viewDistance) + (yOffset);
			if (getDistance(x, y, this.tile.x, this.tile.y) > this.viewDistance)
			{
				continue;
			}
			var t = game.map.getTile(x, y);
			if (t && t.actor && t.actor !== this)
			{
				visibleActor = t.actor;
			}
			if (visibleActor)
			{
				break;
			}
		}
		if (visibleActor)
		{
			break;
		}
	}
	*/
	//Randomly scan x tiles within range until you find an actor
	var attempts = 0;
	while (attempts < actorSearchAttempts)
	{
		var xOffset = Math.floor(Math.random() * this.viewDistance) * 2 - this.viewDistance;
		var yOffset = Math.floor(Math.random() * this.viewDistance) * 2 - this.viewDistance;
		var x = this.tile.x + xOffset;
		var y = this.tile.y + yOffset;
		if (t = game.map.getTile(x, y))
		{
			if (t.actor && t.actor !== this)
			{
				visibleActor = t.actor;
				break;
			}
		}
		attempts++;
	}

	
	/*
	//Scan all actors till we find one close enough
	var actors = shuffle(game.actors);
	for (var aIndex in actors)
	{
		var a = actors[aIndex];
		var d = this.tile.getDistance(a.tile);
		if (d < this.viewDistance)
		{
			visibleActor = a;
			break;
		}
	}
	*/
	
	if (visibleActor)
	{
		var dir = visibleActor.team === this.team ? 
			this.getBestDirectionTowards(visibleActor) :
			this.getBestDirectionAwayFrom(visibleActor);
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

Actor.prototype.act1 = function()
{
	//Move randomly until you're alone
	for (var i in this.tile.sibs)
	{
		if (t = this.tile.sibs[i])
		{
			if (t.actor)
			{
				this.moveRandomly();
			}
		}
	}
}

Actor.prototype.moveRandomly = function()
{
	//console.log("m");
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

Actor.prototype.getBestDirectionAwayFrom = function(a)
{
	var antiDir = this.getBestDirectionTowards(a);
	return antiDir >= 2 ? antiDir - 2 : antiDir + 2;
}


Actor.prototype.getBestDirectionTowards = function(a)
{
	//console.log("h");
	var distances = [false, false, false, false];
	for (var i in this.tile.sibs)
	{
		if (s = this.tile.sibs[i])
		{
			distances[i] = s.getDistance(a.tile);
		}
	}
	//Get the shortest distance
	var shortest = 9999999999999999999;
	for (var i in distances)
	{
		if (d = distances[i])
		{
			if (d < shortest)
			{
				shortest = d;
			}
		}
	}
	var candidateIndeces = [];
	for (var i in distances)
	{
		if (distances[i] == shortest)
		{
			candidateIndeces.push(i);
		}
	}
	candidateIndeces = shuffle(candidateIndeces);
	return candidateIndeces[0];
}


Actor.prototype.getBestDirectionTowardsOLD1 = function(a)
{
	var xDiff = a.tile.x - this.tile.x;
	var yDiff = a.tile.y - this.tile.y;
	var angle = Math.atan2(yDiff, xDiff) + Math.PI;
	angle *= (180 / Math.PI); //Convert to degrees
	if (this === game.actors[0])
	{
		//console.log(angle);
	}
	if (angle > 225 && angle < 315)
	{
		return 0;
	}
	else if (angle > 315 || angle < 45)
	{
		return 1;
	}
	else if (angle > 45 && angle < 135)
	{
		return 2;
	}
	else if (angle > 135 && angle < 225)
	{
		return 3;
	}
	else
	{
		return Math.floor(Math.random()*4);
	}

}

Actor.prototype.getBestDirectionTowardsOLD = function(a)
{
	var angle = Math.atan2(a.tile.y - this.tile.y, a.tile.x - this.tile.x) / Math.PI;
	if (angle > -.25 && angle < .25)
	{
		return 2;
	}
	else if (angle > .25 && angle < .75)
	{
		return 1;
	}
	else if (angle > .75 || angle < -.75)
	{
		return 0;
	}
	else if (angle > -.75 && angle < -.25)
	{
		return 3;
	}
	else //angle is .25, .75, -.25, -.75
	{
		return Math.floor(Math.random()*4);
		/*
		var options = [];
		switch (angle)
		{
			case .25:
				options = [1, 2];
				break;
			case .75:
				options = [1, 0];
				break;
			case -.75:
				options = [0, 3];
				break;
			case -.25:
				options = [3, 2];
				break;
		}
		return options[Math.floor(Math.random()*options.length)];
		*/
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