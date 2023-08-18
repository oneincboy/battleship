const readline = require("readline");

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function createGameGrid() {
  const grid = [];
  for (let i = 0; i < 10; i++) {
    grid.push(Array(10).fill(" "));
  }
  return grid;
}

function placeShips(grid) {
  const ships = [
    { name: "Battleship", size: 5 },
    { name: "Destroyer", size: 4 },
    { name: "Destroyer", size: 4 },
  ];

  for (const ship of ships) {
    let placed = false;
    while (!placed) {
      const direction = getRandomNumber(0, 1) === 0 ? "horizontal" : "vertical";
      const row = getRandomNumber(0, 9);
      const col = getRandomNumber(0, 9);

      if (direction === "horizontal" && col + ship.size <= 10) {
        let collision = false;
        for (let i = 0; i < ship.size; i++) {
          if (grid[row][col + i] !== " ") {
            collision = true;
            break;
          }
        }
        if (!collision) {
          for (let i = 0; i < ship.size; i++) {
            grid[row][col + i] = ship.name.charAt(0);
          }
          placed = true;
        }
      } else if (direction === "vertical" && row + ship.size <= 10) {
        let collision = false;
        for (let i = 0; i < ship.size; i++) {
          if (grid[row + i][col] !== " ") {
            collision = true;
            break;
          }
        }
        if (!collision) {
          for (let i = 0; i < ship.size; i++) {
            grid[row + i][col] = ship.name.charAt(0);
          }
          placed = true;
        }
      }
    }
  }
}

function displayGrid(grid) {
  console.log("   A B C D E F G H I J");
  for (let i = 0; i < 10; i++) {
    let rowStr = `${i} |`;
    for (let j = 0; j < 10; j++) {
      rowStr += ` ${grid[i][j]}`;
    }
    console.log(rowStr);
  }
}

function allShipsSunk(grid) {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (grid[i][j] !== " " && grid[i][j] !== "X") {
        return false;
      }
    }
  }
  return true;
}

function playGame() {
  const grid = createGameGrid();
  placeShips(grid);
  let shots = 0;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Welcome to Battleships!");
  displayGrid(grid);

  rl.on("line", (input) => {
    const coordinates = input.trim().toUpperCase();

    if (coordinates === "EXIT") {
      rl.close();
      return;
    }

    const row = parseInt(coordinates.charAt(1));
    const col = coordinates.charCodeAt(0) - "A".charCodeAt(0);

    if (isNaN(row) || row < 0 || row > 9 || col < 0 || col > 9) {
      console.log("Invalid coordinates. Please try again.");
    } else {
      if (grid[row][col] === " ") {
        console.log("Miss!");
        grid[row][col] = "O";
      } else if (grid[row][col] === "X") {
        console.log("You already hit that square. Please try again.");
      } else {
        console.log("Hit!");
        grid[row][col] = "X";
        if (allShipsSunk(grid)) {
          console.log("Congratulations!");
          console.log(`Total shots: ${shots}`);
          rl.close();
          return;
        }
      }
      shots++;
    }

    displayGrid(grid);
  });
}

playGame();
