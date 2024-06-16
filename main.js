const inputs = document.querySelectorAll(".input");
const newGame = document.getElementById("newGame");
const checksSolution = document.getElementById("checkSolution");
const RANDOM = 15;
const SIZE = 9;

const inputs2D = [];
let count = 0;
for (let i = 0; i < SIZE; i++) {
  let row = [];
  for (let j = 0; j < SIZE; j++) {
    row.push(inputs[count++]);
  }
  inputs2D.push(row);
}

const values = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

// Function to check if a number can be placed in a specific position
function canPlaceNumber(values, row, col, num) {
  for (let j = 0; j < SIZE; j++) {
    if (values[row][j] === num) return false;
  }

  for (let i = 0; i < SIZE; i++) {
    if (values[i][col] === num) return false;
  }

  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (values[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
}

// Function to initialize the Sudoku grid
function initializeGrid() {
  inputs.forEach((input) => {
    input.value = "";
    input.disabled = false;
  });

  values.forEach((row) => row.fill(0));

  let filledCount = 0;
  let iterationCount = 0;
  const maxIterations = 1000;

  while (filledCount < RANDOM && iterationCount < maxIterations) {
    let current = Math.floor(Math.random() * 9) + 1;
    let row = Math.floor(Math.random() * SIZE);
    let col = Math.floor(Math.random() * SIZE);

    if (values[row][col] === 0 && canPlaceNumber(values, row, col, current)) {
      values[row][col] = current;
      inputs2D[row][col].value = current;
      inputs2D[row][col].disabled = true;
      filledCount++;
    }
    iterationCount++;
  }

  if (filledCount < RANDOM) {
    console.log(
      "Unable to fill the grid with the desired number of random values.",
    );
  }

  console.log(values);
}

// Function to change the value of an input element
const change = (value, empty) => {
  inputs2D[empty[0]][empty[1]].value = value;
};

// Function to create a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to find an empty space in the Sudoku grid
const findEmptySpace = () => {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (values[i][j] == 0) {
        return [i, j];
      }
    }
  }
  return null;
};

// Solver function for the Sudoku puzzle
const solver = async () => {
  const empty = findEmptySpace();
  if (empty === null) {
    return true;
  }

  for (let i = 1; i <= 9; i++) {
    if (canPlaceNumber(values, empty[0], empty[1], i)) {
      values[empty[0]][empty[1]] = i;
      values[empty[0]][empty[1]].value = i;

      await delay(100);

      change(values[empty[0]][empty[1]], empty);

      inputs2D[empty[0]][empty[1]].classList.add("greenFlash");

      setTimeout(() => {
        inputs2D[empty[0]][empty[1]].classList.remove("greenFlash");
      }, 100);

      if (await solver()) {
        return true;
      }

      inputs2D[empty[0]][empty[1]].classList.add("redFlash");

      setTimeout(() => {
        inputs2D[empty[0]][empty[1]].classList.remove("redFlash");
      }, 100);

      await delay(100);

      values[empty[0]][empty[1]] = 0;
      inputs2D[empty[0]][empty[1]].value = "";
    }
  }
  return false;
};

for (let i = 0; i < SIZE; i++) {
  for (let j = 0; j < SIZE; j++) {
    inputs2D[i][j].addEventListener("input", function () {
      if (this.value.length > 1) {
        this.value = this.value.slice(-1);
        if (canPlaceNumber(values, i, j, parseInt(this.value.slice(-1)))) {
          values[i][j] = parseInt(this.value);
        } else {
          inputs2D[i][j].classList.add("redFlash");
          this.value = 0;
          setTimeout(() => {
            inputs2D[i][j].classList.remove("redFlash");
          }, 100);
        }
      }
      if (!canPlaceNumber(values, i, j, parseInt(this.value))) {
        inputs2D[i][j].classList.add("redFlash");

        setTimeout(() => {
          inputs2D[i][j].classList.remove("redFlash");
        }, 100);

        this.value = "";
      }
      if (this.value == 0) {
        this.value = "";
        values[i][j] = 0;
      }
      // Validate input
      if (!/^[1-9]$/.test(this.value)) {
        this.value = "";
        values[i][j] = 0;
      }

      values[i][j] = parseInt(this.value);
    });
  }
}

// Event listener for the "solve" button
document.getElementById("solve").addEventListener("click", async () => {
  disableInputs();
  newGame.disabled = true;
  checksSolution.disabled = true;
  const solved = await solver();
  if (!solved) {
    console.log("Sudoku could not be solved.");
  } else {
    newGame.disabled = false;
    checksSolution.disabled = true;
    console.log("Sudoku solved!");
  }
});

// Function to disable all input elements
const disableInputs = () => {
  inputs2D.forEach((row) => {
    row.forEach((input) => {
      input.disabled = true;
    });
  });
};

// Function to clear the input elements on the screen
const clearScreen = () => {
  inputs2D.forEach((row) => {
    row.forEach((input) => {
      input.value = "";
    });
  });
};

// Function to enable all input elements
const enableInputs = () => {
  inputs.forEach((input) => {
    if (!input.value) {
      input.disabled = false;
    }
  });
};

// Function to clear all input values in the grid
const clearInputs = () => {
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      values[i][j] = 0;
    }
  }
};

// Function to reset the game and start a new one
const gameEnded = () => {
  clearScreen();
  clearInputs();
  enableInputs();
  initializeGrid();
};

initializeGrid();

console.log(values);

// Event listener for the "new game" button
newGame.addEventListener("click", () => {
  if (!newGame.disabled) {
    gameEnded();
  }
});

// Function to check the solution of the Sudoku puzzle
const checkSolution = (values, row, col, num) => {
  if (num == 0) return false;

  for (let j = 0; j < SIZE; j++) {
    if (values[row][j] === num && j !== col) return false;
  }

  for (let i = 0; i < SIZE; i++) {
    if (values[i][col] === num && i !== row) return false;
  }

  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (
        values[startRow + i][startCol + j] === num &&
        (startCol + j != col || startRow + i != row)
      )
        return false;
    }
  }
  return true;
};

// Event listener for the "check solution" button
checksSolution.addEventListener("click", () => {
  if (!checksSolution.disabled) isSolved();
});

// Function to verify if the Sudoku puzzle is solved correctly
const isSolved = () => {
  let isSolved = true;
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      if (isSolved) {
        isSolved = checkSolution(values, i, j, values[i][j]);
      }
    }
  }
  if (isSolved) {
    alert("Congratulations! Sudoku solved correctly!");
  } else {
    alert("There are mistakes in your solution. Please check again.");
  }
};
