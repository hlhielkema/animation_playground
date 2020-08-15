var totalWidth;
var totalHeight;

var food = [];
var animals = [];

function addFood() {
    food.push({
        x: Math.random() * totalWidth,
        y: Math.random() * totalHeight,
        r: 3,
    })
}

function addAnimal() {
    animals.push({
        x: Math.random() * totalWidth,
        y: Math.random() * totalHeight,
        r: 8,
        c: '#D2A700',
        f: 25
    });
}

function reset() {
    // Reset the cycles times
    cycles = 0;

    // Get the canvas element
    var canvas = document.getElementById("main");

    // Resize the canvas to fit the whole window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Get the total widht and height from the canvas
    totalWidth = canvas.width;
    totalHeight = canvas.height;
    
    food = [];
    
    update();
}

// Render the cells
function render() {  
    // Get the canvas element
    var canvas = document.getElementById("main");

    // Get the render context
    var ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FF007F';

    for (var i = 0; i < food.length; i++) {
        

        // Render the food
        ctx.beginPath();     
        ctx.arc(food[i].x, food[i].y, food[i].r, 0, 2 * Math.PI);
        ctx.fill();
    }

    //ctx.fillStyle = '#D2A700';

    for (var i = 0; i < animals.length; i++) {
        
        // Render the animal
        ctx.fillStyle = animals[i].c;
        ctx.beginPath();     
        ctx.arc(animals[i].x, animals[i].y, animals[i].r, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function update() {     
  
    while (food.length < 500) {
        addFood()
    }

    while (animals.length < 50) {
        addAnimal();
    }


    for (var i = 0; i < animals.length; i++) {
        animalAI(animals[i]);
    }

    // Render the cells
    render();
}

function animalAI(animal) {
   
    var nearestFood = null;
    var nearestFoodDistance = null;
    var nearestFoodIndex = null;
    var eat = [];
    for (var i = 0; i < food.length; i++) {
        var xDelta = Math.abs(food[i].x - animal.x);
        var yDelta = Math.abs(food[i].y - animal.y);
        var distance = Math.sqrt((xDelta * xDelta) + (yDelta * yDelta));
        if (nearestFoodDistance === null || distance < nearestFoodDistance) {
            nearestFoodDistance = distance;
            nearestFood = food[i];
            nearestFoodIndex = i;

            if (nearestFoodDistance < animal.r) {
                eat.push(nearestFoodIndex - eat.length);
            }
        }
    }

    for (var i = 0; i < eat.length; i++) {
        food.splice(eat, 1);        
        animal.f += 20;
    }

    
    if (animal.f < 0) {
        animal.c = '#ffffff';
        return;
    }
    else if (animal.f > 500) {
        animal.c = '#4CAF50';
    }
    else {
        animal.c = '#D2A700';
    }

    animal.f--;

    if (nearestFood !== null) {

        var xDelta = nearestFood.x - animal.x;
        var yDelta = nearestFood.y - animal.y;

        var speed = 8;

       
        if (animal.r > 20) {
            speed = 4;
            animal.f -= 2;
        }       

        if (xDelta > 5) {
            animal.x += speed;
        }
        else if (xDelta < -5) {
            animal.x -= speed;
        }
        if (yDelta > 5) {
            animal.y += speed;
        }
        else if (yDelta < -5) {
            animal.y -= speed;            
        }
    }

    animal.r = animal.f / 20;
    if (animal.r < 8) {
        animal.r  = 8;
    }
    else if (animal.r > 30) {
        animal.r = 30;
    }

}


// Reset the game to its initial state
reset();

// Update the generation every 200ms
setInterval(update, 20);

// Reset when the size of the contain window changes
window.addEventListener('resize', function() {
    // Reset the game to its initial state
    reset();
}, false);