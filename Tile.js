function Tile(x, y)
{
	this.x = x;
	this.y = y;
	this.actor = false;
	this.sibs = [false, false, false, false];
}

Tile.prototype.setActor = function(actor)
{
	this.actor = actor;
}

Tile.prototype.removeActor = function()
{
	this.actor = false;
}

Tile.prototype.blocksMovement = function()
{
	return !!this.actor;
}