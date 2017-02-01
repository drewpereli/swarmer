
function View()
{
	this.canvas = $("#canvas")[0];
	this.ctx = this.canvas.getContext('2d');
	this.canvasWidth = mapWidth * tileLength;
	this.canvasHeight = mapHeight * tileLength;
	$(this.canvas).attr("width", this.canvasWidth).attr("height", this.canvasHeight);
}

View.prototype.set = function()
{
	this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
	for (var i in game.actors)
	{
		var a = game.actors[i];
		this.ctx.fillStyle = a.team === 0 ? "red" : "blue";
		this.ctx.fillRect(a.tile.x * tileLength, a.tile.y * tileLength, tileLength, tileLength);
	}
}