/*
  Filnavn: js/app.js
  Formål: Interaktiv logikk for Sannsynlighetslab – modulvalg, simuleringer og beregninger.
  Versjon: 0.1.0
*/

"use strict";

const appState = {
  currentBag: [],
  lastDrawnBall: null,
};

document.addEventListener("DOMContentLoaded", () => {
  setupModuleNavigation();
  setupCoinDemo();
  setupDiceDemo();
  setupDrawingDemo();
  setupOutfitDemo();
  setupCodeDemo();
  setupOrderDemo();

  calculateOutfits();
  calculateCodes();
  calculateOrder();
  resetBag();
});

function setupModuleNavigation() {
  const moduleButtons = document.querySelectorAll(".module-button");
  const modulePanels = document.querySelectorAll(".module-panel");

  moduleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedModule = button.dataset.module;

      moduleButtons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      modulePanels.forEach((panel) => {
        panel.classList.toggle(
          "is-visible",
          panel.id === `module-${selectedModule}`,
        );
      });
    });
  });
}

function setupCoinDemo() {
  const runButton = document.querySelector("#run-coin-demo");

  runButton.addEventListener("click", () => {
    const numberOfFlips = getNumberValue("#coin-count", 1, 10000);
    const result = simulateCoinFlips(numberOfFlips);

    document.querySelector("#coin-heads-result").textContent = formatNumber(
      result.heads,
    );
    document.querySelector("#coin-tails-result").textContent = formatNumber(
      result.tails,
    );
  });
}

function simulateCoinFlips(numberOfFlips) {
  let heads = 0;
  let tails = 0;

  for (let index = 0; index < numberOfFlips; index += 1) {
    if (Math.random() < 0.5) {
      heads += 1;
    } else {
      tails += 1;
    }
  }

  return { heads, tails };
}

function setupDiceDemo() {
  const runButton = document.querySelector("#run-dice-demo");

  runButton.addEventListener("click", () => {
    const diceCount = getNumberValue("#dice-count", 1, 2);
    const rollCount = getNumberValue("#dice-rolls", 1, 10000);

    const result = simulateDiceRolls(diceCount, rollCount);

    renderDiceDisplay(result.lastRoll);
    renderDiceChart(result.frequencies);
  });
}

function simulateDiceRolls(diceCount, rollCount) {
  const frequencies = {};
  let lastRoll = [];

  const minimumSum = diceCount;
  const maximumSum = diceCount * 6;

  for (let sum = minimumSum; sum <= maximumSum; sum += 1) {
    frequencies[sum] = 0;
  }

  for (let rollIndex = 0; rollIndex < rollCount; rollIndex += 1) {
    const roll = [];
    let sum = 0;

    for (let diceIndex = 0; diceIndex < diceCount; diceIndex += 1) {
      const value = randomInteger(1, 6);
      roll.push(value);
      sum += value;
    }

    frequencies[sum] += 1;
    lastRoll = roll;
  }

  return { frequencies, lastRoll };
}

function renderDiceDisplay(lastRoll) {
  const diceDisplay = document.querySelector("#dice-display");
  diceDisplay.innerHTML = "";

  lastRoll.forEach((value) => {
    const die = document.createElement("span");
    die.className = "die";
    die.textContent = value;
    diceDisplay.appendChild(die);
  });
}

function renderDiceChart(frequencies) {
  const chart = document.querySelector("#dice-chart");
  const entries = Object.entries(frequencies);
  const highestFrequency = Math.max(...entries.map((entry) => entry[1]));

  chart.innerHTML = "";

  entries.forEach(([sum, frequency]) => {
    const percentage =
      highestFrequency === 0 ? 0 : Math.round((frequency / highestFrequency) * 100);

    const row = document.createElement("div");
    row.className = "chart-row";

    row.innerHTML = `
      <strong>${sum}</strong>
      <div class="chart-bar-track" aria-label="Sum ${sum}: ${frequency} treff">
        <div class="chart-bar-fill" style="width: ${percentage}%"></div>
      </div>
      <span>${formatNumber(frequency)}</span>
    `;

    chart.appendChild(row);
  });
}

function setupDrawingDemo() {
  const runButton = document.querySelector("#run-drawing-demo");
  const resetButton = document.querySelector("#reset-drawing-demo");
  const inputs = [
    "#red-balls",
    "#blue-balls",
    "#green-balls",
    "#draw-mode",
  ];

  runButton.addEventListener("click", drawBall);
  resetButton.addEventListener("click", resetBag);

  inputs.forEach((selector) => {
    document.querySelector(selector).addEventListener("change", resetBag);
  });
}

function resetBag() {
  const redCount = getNumberValue("#red-balls", 0, 20);
  const blueCount = getNumberValue("#blue-balls", 0, 20);
  const greenCount = getNumberValue("#green-balls", 0, 20);

  appState.currentBag = [
    ...createBalls("red", redCount),
    ...createBalls("blue", blueCount),
    ...createBalls("green", greenCount),
  ];

  appState.lastDrawnBall = null;

  renderBag();
  renderDrawingProbability();
}

function createBalls(color, count) {
  return Array.from({ length: count }, () => color);
}

function drawBall() {
  if (appState.currentBag.length === 0) {
    appState.lastDrawnBall = null;
    renderDrawingProbability("Posen er tom. Nullstill posen for å trekke igjen.");
    return;
  }

  const drawMode = document.querySelector("#draw-mode").value;
  const selectedIndex = randomInteger(0, appState.currentBag.length - 1);
  const selectedBall = appState.currentBag[selectedIndex];

  appState.lastDrawnBall = selectedBall;

  if (drawMode === "without-replacement") {
    appState.currentBag.splice(selectedIndex, 1);
  }

  renderBag();
  renderDrawingProbability();
}

function renderBag() {
  const bagDisplay = document.querySelector("#bag-display");
  bagDisplay.innerHTML = "";

  if (appState.currentBag.length === 0) {
    bagDisplay.innerHTML = `<p class="placeholder-text">Posen er tom.</p>`;
    return;
  }

  appState.currentBag.forEach((color) => {
    const ball = document.createElement("span");
    ball.className = `ball ball--${color}`;
    ball.textContent = getBallLabel(color);
    bagDisplay.appendChild(ball);
  });
}

function renderDrawingProbability(message = "") {
  const display = document.querySelector("#drawing-probability");
  const counts = countBalls(appState.currentBag);
  const total = appState.currentBag.length;
  const lastDrawnText = appState.lastDrawnBall
    ? `<p class="formula">Sist trukket: ${getBallName(appState.lastDrawnBall)}</p>`
    : "";

  if (message) {
    display.innerHTML = `
      ${lastDrawnText}
      <p class="probability-line">${message}</p>
    `;
    return;
  }

  if (total === 0) {
    display.innerHTML = `
      ${lastDrawnText}
      <p class="probability-line">Ingen kuler igjen i posen.</p>
    `;
    return;
  }

  display.innerHTML = `
    ${lastDrawnText}
    ${createProbabilityLine("rød", counts.red, total)}
    ${createProbabilityLine("blå", counts.blue, total)}
    ${createProbabilityLine("grønn", counts.green, total)}
  `;
}

function createProbabilityLine(label, count, total) {
  const percent = Math.round((count / total) * 100);

  return `
    <p class="probability-line">
      P(${label}) = ${count}/${total} = ${percent} %
    </p>
  `;
}

function countBalls(balls) {
  return balls.reduce(
    (counts, color) => {
      counts[color] += 1;
      return counts;
    },
    { red: 0, blue: 0, green: 0 },
  );
}

function getBallLabel(color) {
  const labels = {
    red: "R",
    blue: "B",
    green: "G",
  };

  return labels[color] ?? "?";
}

function getBallName(color) {
  const names = {
    red: "rød kule",
    blue: "blå kule",
    green: "grønn kule",
  };

  return names[color] ?? "ukjent kule";
}

function setupOutfitDemo() {
  const button = document.querySelector("#calculate-outfits");
  button.addEventListener("click", calculateOutfits);
}

function calculateOutfits() {
  const counts = [
    getNumberValue("#hat-count", 0, 20),
    getNumberValue("#shirt-count", 0, 20),
    getNumberValue("#pants-count", 0, 20),
    getNumberValue("#shoe-count", 0, 20),
  ];

  const total = counts.reduce((product, value) => product * value, 1);
  const formula = `${counts.join(" × ")} = ${formatNumber(total)}`;

  document.querySelector("#outfit-formula").textContent = formula;
  document.querySelector("#outfit-total").textContent = formatNumber(total);
}

function setupCodeDemo() {
  const button = document.querySelector("#calculate-codes");
  button.addEventListener("click", calculateCodes);
}

function calculateCodes() {
  const codeLength = getNumberValue("#code-length", 1, 12);
  const symbolCount = getNumberValue("#symbol-count", 2, 100);
  const total = BigInt(symbolCount) ** BigInt(codeLength);
  const factors = Array.from({ length: codeLength }, () => symbolCount);

  document.querySelector("#code-formula").textContent =
    `${factors.join(" × ")} = ${formatBigNumber(total)}`;
  document.querySelector("#code-total").textContent = formatBigNumber(total);
}

function setupOrderDemo() {
  const button = document.querySelector("#calculate-order");
  button.addEventListener("click", calculateOrder);
}

function calculateOrder() {
  const peopleCount = getNumberValue("#people-count", 1, 20);
  const chosenCount = getNumberValue("#chosen-count", 1, 20);
  const mode = document.querySelector("#order-mode").value;

  const formulaElement = document.querySelector("#order-formula");
  const totalElement = document.querySelector("#order-total");
  const explanationElement = document.querySelector("#order-explanation");

  if (chosenCount > peopleCount) {
    formulaElement.textContent =
      "Antall som velges kan ikke være større enn antall personer.";
    totalElement.textContent = "0";
    explanationElement.textContent = "Endre tallene og prøv igjen.";
    return;
  }

  if (mode === "permutation") {
    const total = calculatePermutation(peopleCount, chosenCount);

    formulaElement.textContent =
      `${peopleCount}P${chosenCount} = ${formatBigNumber(total)}`;
    totalElement.textContent = formatBigNumber(total);
    explanationElement.textContent =
      "Rekkefølgen betyr noe. ABC og BAC regnes som to ulike utfall.";
    return;
  }

  const total = calculateCombination(peopleCount, chosenCount);

  formulaElement.textContent =
    `${peopleCount}C${chosenCount} = ${formatBigNumber(total)}`;
  totalElement.textContent = formatBigNumber(total);
  explanationElement.textContent =
    "Rekkefølgen betyr ikke noe. ABC og BAC regnes som samme gruppe.";
}

function calculatePermutation(n, r) {
  return factorial(n) / factorial(n - r);
}

function calculateCombination(n, r) {
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function factorial(value) {
  let result = 1n;

  for (let number = 2n; number <= BigInt(value); number += 1n) {
    result *= number;
  }

  return result;
}

function getNumberValue(selector, minimum, maximum) {
  const input = document.querySelector(selector);
  const value = Number.parseInt(input.value, 10);

  if (Number.isNaN(value)) {
    input.value = minimum;
    return minimum;
  }

  const clampedValue = Math.min(Math.max(value, minimum), maximum);
  input.value = clampedValue;

  return clampedValue;
}

function randomInteger(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function formatNumber(value) {
  return new Intl.NumberFormat("nb-NO").format(value);
}

function formatBigNumber(value) {
  return new Intl.NumberFormat("nb-NO").format(value);
}

/*
  Slutt på fil: js/app.js
  Versjon: 0.1.0
*/
