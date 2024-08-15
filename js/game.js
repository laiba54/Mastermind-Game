let guessbigpegs = document.querySelector(".guess-big-pegs");
let guesssmallpegs = document.querySelector(".guess-small-pegs");
let secretcontainer = document.querySelector(".secret-container");

// secretpegs
const colorMap = {
  red: "rgb(255, 0, 0)",
  green: "rgb(0, 128, 0)",
  black: "rgb(0, 0, 0)",
  purple: "rgb(128, 0, 128)",
  blue: "rgb(0, 0, 255)",
  white: "rgb(255, 255, 255)",
  pink: "rgb(251, 16, 145)",
  golden: "rgb(255, 187, 0)",
};

// RGB to color name mapping
const rgbToColorNameMap = Object.fromEntries(
  Object.entries(colorMap).map(([key, value]) => [value, key])
);

// secretpegs
function getRandomColor() {
  const colors = Object.keys(colorMap);
  return colors[Math.floor(Math.random() * colors.length)];
}

let randomcolors = [];
for (let i = 0; i < 4; i++) {
  let secretpegs = document.createElement("div");
  secretpegs.classList.add("secret-pegs");
  secretpegs.style.display = "none";
  secretpegs.style.border = "2px solid #D0B8A8";
  let colorName = getRandomColor();
  secretpegs.style.backgroundColor = colorMap[colorName];
  secretcontainer.appendChild(secretpegs);
  randomcolors.push(colorName);
}
console.log("secret pegs:", randomcolors);

for (let i = 0; i < 36; i++) {
  let bigpegs = document.createElement("div");
  bigpegs.classList.add("big-pegs");
  guessbigpegs.appendChild(bigpegs);

  if (i >= 32) {
    bigpegs.classList.add("active");
  }

  if ((i + 1) % 4 === 0) {
    for (let j = 0; j < 4; j++) {
      let smallpegs = document.createElement("div");
      smallpegs.classList.add("small-pegs");
      guesssmallpegs.appendChild(smallpegs);

      if (i >= 32) {
        smallpegs.classList.add("active");
      }
    }
  }
}

// game logic
// variables
let selectpegs = document.querySelectorAll(".select-pegs");
let bigpegs = document.querySelectorAll(".big-pegs");
let smallpegs = document.querySelectorAll(".small-pegs");
let submitbtn = document.querySelector(".submit-btn");
let activepegs = document.querySelectorAll(".active");
let secretpegs = document.querySelectorAll(".secret-pegs");

let selectedBackground = "";
let selectedColorName = "";
let currentrow = 32;
let pegsSelected = false;

function updateactiverow() {
  activepegs.forEach((peg) => peg.classList.remove("active"));
  for (let i = currentrow; i < currentrow + 4; i++) {
    bigpegs[i].classList.add("active");
    smallpegs[i].classList.add("active");
  }

  activepegs = document.querySelectorAll(".active");
  selectedBackground = ""; // Clear previous selection
  pegsSelected = false; // Reset selection state

  setPegEventListeners();
}

function setPegEventListeners() {
  let selectedCount = 0;

  activepegs.forEach((peg) => {
    peg.addEventListener("click", function () {
      if (selectedBackground) {
        this.style.background = selectedBackground;
        this.style.border = "2px solid #D0B8A8";
        selectedCount++;
        if (selectedCount === 4) {
          pegsSelected = true;
        }
        console.log("background applied:", selectedColorName);
      }
    });
  });
}

selectpegs.forEach(function (selectpeg) {
  selectpeg.addEventListener("click", function () {
    selectedBackground = window.getComputedStyle(this).backgroundColor;
    selectedColorName = rgbToColorNameMap[selectedBackground] || "undefined";
  });
});

setPegEventListeners();

// Check if the guess matches the secret sequence
function checkwin() {
  let guess = [];
  let feedback = Array(4).fill("white");

  // Collect guess colors
  for (let i = currentrow; i < currentrow + 4; i++) {
    let bgColor = window.getComputedStyle(bigpegs[i]).backgroundColor;
    guess.push(rgbToColorNameMap[bgColor] || "undefined");
  }

  console.log("Secret Colors:", randomcolors);
  console.log("Guess Colors:", guess);

  let correctColorCount = 0;
  let correctPositionCount = 0;

  // Check for correct position
  guess.forEach((color, index) => {
    if (color === randomcolors[index]) {
      correctPositionCount++;
      feedback[index] = "red";
    }
  });

  // Check for correct color but wrong position
  guess.forEach((color, index) => {
    if (feedback[index] !== "red" && randomcolors.includes(color)) {
      correctColorCount++;
      feedback[index] = "black";
    }
  });

  console.log("Feedback:", feedback);

  return {
    correctPositionCount,
    feedback,
  };
}

// Show feedback on small pegs
function showFeedback(feedback) {
  for (let i = 0; i < feedback.length; i++) {
    let smallPegIndex = currentrow + i;
    if (feedback[i] === "red") {
      smallpegs[smallPegIndex].style.backgroundColor = "red";
      smallpegs[smallPegIndex].style.border = "2px solid red";
    } else if (feedback[i] === "black") {
      smallpegs[smallPegIndex].style.backgroundColor = "black";
      smallpegs[smallPegIndex].style.border = "2px solid black";
    } else if (feedback[i] === "white") {
      smallpegs[smallPegIndex].style.backgroundColor = "white";
      smallpegs[smallPegIndex].style.border = "2px solid white";
    }
  }
}

// Submit button functionality
submitbtn.addEventListener("click", function () {
  if (!pegsSelected) {
    alert("Please select all 4 colors before submitting.");
    return;
  }
  console.log("Submitted");

  let result = checkwin();
  if (result.correctPositionCount === 4) {
    alert("Congratulations! Your guess is correct");
    secretpegs.forEach((peg) => (peg.style.display = "flex"));
    showFeedback(result.feedback);
    submitbtn.disabled = true;
    removeEventListenersetPegEventListeners();
  } else {
    showFeedback(result.feedback);
    console.log("Incorrect guess");
  }

  currentrow -= 4;

  if (currentrow >= 0) {
    updateactiverow();
  } else {
    alert("You Lose, Play Again");
    location.reload();
  }
});

let playagainbtn = document.querySelector(".play-again-btn");
playagainbtn.addEventListener("click", function () {
  location.reload();
});

