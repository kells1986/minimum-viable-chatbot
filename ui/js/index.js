//ES6 syntax

let counter = 0;
const counterElement = document.getElementById("counter");
const plusButton = document.getElementById("plus");
const minusButton = document.getElementById("minus");
const resetButton = document.getElementById("reset");

function plus() {
  counter++;
  counterElement.innerHTML = counter;
}

function minus() {
  counter--;
  counterElement.innerHTML = counter;
}

function reset() {
  counter = 0;
  counterElement.innerHTML = counter;
}

// Attach event listeners
plusButton.addEventListener("click", plus);
minusButton.addEventListener("click", minus);
resetButton.addEventListener("click", reset);

export { plus, minus, reset };
