function Map(width, height)
{
	this.width = width;
	this.height = height;
	this.tiles = [];
	for (var y = 0 ; y < height ; y++)
	{
		this.tiles.push([]);
		for (var x = 0 ; x < width ; x++)
		{
			this.tiles[y].push(new Tile(x, y));
		}
	}
	//Go through the tiles and set the sibs
	for (var y = 0 ; y < height ; y++)
	{
		for (var x = 0 ; x < width ; x++)
		{
			var t = this.getTile(x, y);
			if (y > 0){t.sibs[0] = this.getTile(x, y - 1);}
			if (x < this.width - 1){t.sibs[1] = this.getTile(x + 1, y);}
			if (y < this.height - 1){t.sibs[2] = this.getTile(x, y + 1);}
			if (x > 0){t.sibs[3] = this.getTile(x - 1, y);}
		}
	}
}

Map.prototype.getTile = function(x, y)
{
	if (x >= 0 && x < this.width &&
		y >= 0 && y < this.height)
	{
		return this.tiles[y][x];
	}
	return false;
}

