
function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function getDistance(x1, y1, x2, y2)
{
	return Math.sqrt(Math.pow((y2 - y1), 2) + Math.pow((x2 - x1), 2));
}