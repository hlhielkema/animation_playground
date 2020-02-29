// Conway's Game of Life
// https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life

// Options
//var colors = ['rgb(198, 228, 139)', 'rgb(123, 201, 111)', 'rgb(35, 154, 59)', 'rgb(25, 97, 39']
var colors = [ '#55007F', '#FF007F', '#305D87', '#D2A700', '#55FFFF', '#C000C0', '#247B68' ];
var cellWidth = 8;
var cellHeight = 8;
var cellMarginX = 4;
var cellMarginY = 4;

// State
var countX = -1;
var countY = -1;
var cells = null;
var cycles = 0;

function reset() {
    // Reset the cycles times
    cycles = 0;

    // Get the canvas element
    var canvas = document.getElementById("main");

    // Resize the canvas to fit the whole window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Get the total widht and height from the canvas
    var totalWidth = canvas.width;
    var totalHeight = canvas.height;

    // Calculate the number of cells that fit on the x and y axis
    countX = Math.floor((totalWidth + cellMarginX) / (cellWidth + cellMarginX));
    countY = Math.floor((totalHeight + cellMarginY) / (cellHeight + cellMarginY));
    
    // Create two 2D arrays for the cell ages.
    // The arrays are swapped when updating.
    cells = new Array(countX);
    alt = new Array(countX);
    for (var x = 0; x < countX; x++) {              
        cells[x] = new Array(countY);
        alt[x] = new Array(countY);
    }

    // Create the initial cell population
    for (var x = 0; x < countX; x++) {              
        for (var y = 0; y < countY; y++) {   
            cells[x][y] = (Math.random() < 0.2) ? 1:0;
        }
    }

    // Render the background
    render();
}

// Render the cells
function render() {  
    // Trigger a reset after 500 cycles  
    if (++cycles > 500) {
        reset();
    }

    // Get the canvas element
    var canvas = document.getElementById("main");

    // Get the render context
    var ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Loop through the cells
    for (var x = 0; x < countX; x++) {            
        for (var y = 0; y < countY; y++) {        

            // Get the age for the current cell
            var age = cells[x][y]; 

            // Only draw the cell if it's alive
            if (age > 0) {
                // Calculate the target 
                var xCoor = (x * (cellWidth + cellMarginX)) + cellMarginX;
                var yCoor = (y * (cellHeight + cellMarginY)) + cellMarginY;                                            

                // Determine the color of the cell
                if (age > colors.length) {
                    ctx.fillStyle = colors[colors.length - 1];    
                }
                else {
                    ctx.fillStyle = colors[age - 1];
                }

                // Render the cell
                ctx.beginPath();
                ctx.arc(xCoor, yCoor, cellWidth / 2, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

    }
}

// Continue to the next generation of cells
function update() {     
    // Loop though all cells
    for (var x = 0; x < countX; x++) {             
        for (var y = 0; y < countY; y++) {  
       
            // Count the number of alive cells around the cell
            var around = 0;
            for (var dx = Math.max(x - 1, 0); dx <= x + 1 && dx < countX; dx++) {
                for (var dy = Math.max(y - 1, 0); dy <= y + 1 && dy < countY; dy++) {
                    if ((dx !== x || dy !== y) && cells[dx][dy] > 0) {
                        around++;
                    }
                }
            }
            
            // Determine the new age
            var age = cells[x][y];
            if (around === 3 || (age > 0 && around === 2)) {
                alt[x][y] = age + 1;
            }
            else {                
                alt[x][y] = 0;
            }
        }       
    }

    // Swap the two arrays
    var tmp = cells;
    cells = alt;
    alt = tmp;

    // Render the cells
    render();
}

// Reset the game to its initial state
reset();

// Update the generation every 200ms
setInterval(update, 100);

// Reset when the size of the contain window changes
window.addEventListener('resize', function() {
    // Reset the game to its initial state
    reset();
}, false);