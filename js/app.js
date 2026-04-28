/*
  Filnavn: js/app.js
  Formål: Interaktiv logikk for Sannsynlighetslab – faktiske simuleringer, logger, historikk og eksempler.
  Versjon: 0.2.0
*/

"use strict";

const appState = {
  coin: {
    flips: [],
  },
  dice: {
    rolls: [],
  },
  drawing: {
    currentBag: [],
    history: [],
    lastDrawnBall: null,
  },
  codes: {
    history: [],
  },
};

const PERSON_NAMES = [
  "Anna",
  "Bilal",
  "Chen",
  "Dina",
  "Emil",
  "Fatima",
  "Guro",
  "Hassan",
  "Ida",
  "Jonas",
  "Kari",
  "Leo",
  "Mina",
  "Noah",
  "Oda",
  "Pia",
  "Qasim",
  "Runa",
  "Sara",
  "Tobias",
];

document.addEventListener("DOMContentLoaded", () => {
  enhanceInterface();

  setupModuleNavigation();
  setupCoinDemo();
  setupDiceDemo();
  setupDrawingDemo();
  setupOutfitDemo();
  setupCodeDemo();
  setupOrderDemo();

  resetCoinDemo();
  resetDiceDemo();
  resetBag();
  calculateOutfits();
  calculateCodes();
  calculateOrder();
});

function enhanceInterface() {
  enhanceCoinPanel();
  enhanceDicePanel();
  enhanceDrawingPanel();
  enhanceOutfitPanel();
  enhanceCodePanel();
  enhanceOrderPanel();
}

function enhanceCoinPanel() {
  const controlCard = document.querySelector("#module-coin .control-card");
  const resultCard = document.querySelector("#module-coin .result-card");

  document.querySelector("#run-coin-demo").textContent = "Kast valgt antall";

  controlCard.appendChild(
    createButton("coin-single-flip", "Kast én mynt", "secondary-button"),
  );

  controlCard.appendChild(
    createButton("coin-reset", "Nullstill myntkast", "secondary-button"),
  );

  resultCard.insertAdjacentHTML(
    "beforeend",
    `
      <div class="formula" id="coin-visual">Klar til første kast.</div>

      <div class="probability-display">
        <p class="probability-line" id="coin-percent-result">
          Kron: 0 % | Mynt: 0 %
        </p>
        <p class="probability-line" id="coin-log-summary">
          Ingen kast er gjennomført ennå.
        </p>
      </div>

      <label for="coin-log">Logg over alle myntkast</label>
      <textarea
        id="coin-log"
        rows="10"
        readonly
        aria-label="Logg over alle myntkast"
      ></textarea>
    `,
  );
}

function enhanceDicePanel() {
  const controlCard = document.querySelector("#module-dice .control-card");
  const resultCard = document.querySelector("#module-dice .result-card");

  document.querySelector("#run-dice-demo").textContent = "Kast valgt antall";

  controlCard.appendChild(
    createButton("dice-single-roll", "Kast én gang", "secondary-button"),
  );

  controlCard.appendChild(
    createButton("dice-reset", "Nullstill terningkast", "secondary-button"),
  );

  resultCard.insertAdjacentHTML(
    "beforeend",
    `
      <div class="formula" id="dice-summary">
        Ingen terningkast er gjennomført ennå.
      </div>

      <label for="dice-log">Logg over alle terningkast</label>
      <textarea
        id="dice-log"
        rows="10"
        readonly
        aria-label="Logg over alle terningkast"
      ></textarea>
    `,
  );
}

function enhanceDrawingPanel() {
  const controlCard = document.querySelector("#module-drawing .control-card");
  const resultCard = document.querySelector("#module-drawing .result-card");

  controlCard.appendChild(
    createButton("draw-five-demo", "Trekk 5 ganger", "secondary-button"),
  );

  resultCard.insertAdjacentHTML(
    "beforeend",
    `
      <label for="drawing-log">Trekkelogg</label>
      <textarea
        id="drawing-log"
        rows="10"
        readonly
        aria-label="Logg over alle trekk"
      ></textarea>
    `,
  );
}

function enhanceOutfitPanel() {
  const controlCard = document.querySelector("#module-outfits .control-card");
  const resultCard = document.querySelector("#module-outfits .result-card");

  controlCard.appendChild(
    createButton("random-outfit", "Lag tilfeldig antrekk", "secondary-button"),
  );

  controlCard.appendChild(
    createButton("show-outfits", "Vis antrekk", "secondary-button"),
  );

  resultCard.insertAdjacentHTML(
    "beforeend",
    `
      <div class="formula" id="outfit-example">
        Trykk «Lag tilfeldig antrekk» for å vise ett konkret antrekk.
      </div>

      <label for="outfit-list">Antrekksliste</label>
      <textarea
        id="outfit-list"
        rows="10"
        readonly
        aria-label="Liste over antrekk"
      ></textarea>
    `,
  );
}

function enhanceCodePanel() {
  const controlCard = document.querySelector("#module-codes .control-card");
  const resultCard = document.querySelector("#module-codes .result-card");

  controlCard.appendChild(
    createButton("generate-code", "Lag tilfeldig kode", "secondary-button"),
  );

  controlCard.appendChild(
    createButton("generate-ten-codes", "Lag 10 koder", "secondary-button"),
  );

  controlCard.appendChild(
    createButton("reset-code-log", "Nullstill kodelogg", "secondary-button"),
  );

  resultCard.insertAdjacentHTML(
    "beforeend",
    `
      <div class="formula" id="code-example">
        Trykk «Lag tilfeldig kode» for å vise et konkret eksempel.
      </div>

      <label for="code-log">Kodelogg</label>
      <textarea
        id="code-log"
        rows="10"
        readonly
        aria-label="Logg over genererte koder"
      ></textarea>
    `,
  );
}

function enhanceOrderPanel() {
  const controlCard = document.querySelector("#module-order .control-card");
  const resultCard = document.querySelector("#module-order .result-card");

  controlCard.appendChild(
    createButton("random-order-example", "Lag tilfeldig eksempel", "secondary-button"),
  );

  controlCard.appendChild(
    createButton("show-order-list", "Vis mulige valg", "secondary-button"),
  );

  resultCard.insertAdjacentHTML(
    "beforeend",
    `
      <div class="formula" id="order-example">
        Trykk «Lag tilfeldig eksempel» for å vise ett konkret valg.
      </div>

      <label for="order-list">Liste over mulige valg</label>
      <textarea
        id="order-list"
        rows="10"
        readonly
        aria-label="Liste over kombinasjoner eller permutasjoner"
      ></textarea>
    `,
  );
}

function createButton(id, text, className) {
  const button = document.createElement("button");
  button.id = id;
  button.type = "button";
  button.className = className;
  button.textContent = text;
  return button;
}

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

/* ----------------------------- Myntkast ----------------------------- */

function setupCoinDemo() {
  document.querySelector("#run-coin-demo").addEventListener("click", () => {
    const numberOfFlips = getNumberValue("#coin-count", 1, 10000);
    runCoinFlips(numberOfFlips);
  });

  document.querySelector("#coin-single-flip").addEventListener("click", () => {
    runCoinFlips(1);
  });

  document.querySelector("#coin-reset").addEventListener("click", resetCoinDemo);
}

function resetCoinDemo() {
  appState.coin.flips = [];

  document.querySelector("#coin-heads-result").textContent = "0";
  document.querySelector("#coin-tails-result").textContent = "0";
  document.querySelector("#coin-percent-result").textContent = "Kron: 0 % | Mynt: 0 %";
  document.querySelector("#coin-log-summary").textContent =
    "Ingen kast er gjennomført ennå.";
  document.querySelector("#coin-visual").textContent = "Klar til første kast.";
  document.querySelector("#coin-log").value = "";
}

function runCoinFlips(numberOfFlips) {
  for (let index = 0; index < numberOfFlips; index += 1) {
    const result = Math.random() < 0.5 ? "Kron" : "Mynt";

    appState.coin.flips.push({
      number: appState.coin.flips.length + 1,
      result,
    });
  }

  renderCoinDemo();
}

function renderCoinDemo() {
  const flips = appState.coin.flips;
  const heads = flips.filter((flip) => flip.result === "Kron").length;
  const tails = flips.length - heads;
  const lastFlip = flips.at(-1);

  const headsPercent = flips.length === 0 ? 0 : (heads / flips.length) * 100;
  const tailsPercent = flips.length === 0 ? 0 : (tails / flips.length) * 100;

  document.querySelector("#coin-heads-result").textContent = formatNumber(heads);
  document.querySelector("#coin-tails-result").textContent = formatNumber(tails);

  document.querySelector("#coin-percent-result").textContent =
    `Kron: ${formatPercent(headsPercent)} | Mynt: ${formatPercent(tailsPercent)}`;

  document.querySelector("#coin-log-summary").textContent =
    `Totalt ${formatNumber(flips.length)} kast. Teoretisk forventning er omtrent halvparten kron og halvparten mynt.`;

  document.querySelector("#coin-visual").textContent =
    lastFlip.result === "Kron"
      ? `🪙 Siste kast: Kron`
      : `🪙 Siste kast: Mynt`;

  document.querySelector("#coin-log").value = flips
    .map((flip) => `Kast ${flip.number}: ${flip.result}`)
    .join("\n");
}

/* ---------------------------- Terningkast ---------------------------- */

function setupDiceDemo() {
  document.querySelector("#run-dice-demo").addEventListener("click", () => {
    const diceCount = getNumberValue("#dice-count", 1, 2);
    const rollCount = getNumberValue("#dice-rolls", 1, 10000);

    runDiceRolls(diceCount, rollCount);
  });

  document.querySelector("#dice-single-roll").addEventListener("click", () => {
    const diceCount = getNumberValue("#dice-count", 1, 2);
    runDiceRolls(diceCount, 1);
  });

  document.querySelector("#dice-reset").addEventListener("click", resetDiceDemo);

  document.querySelector("#dice-count").addEventListener("change", resetDiceDemo);
}

function resetDiceDemo() {
  appState.dice.rolls = [];

  const diceCount = getNumberValue("#dice-count", 1, 2);

  renderDiceDisplay(Array.from({ length: diceCount }, () => "?"));

  document.querySelector("#dice-chart").innerHTML =
    `<p class="placeholder-text">Diagrammet vises etter simulering.</p>`;

  document.querySelector("#dice-summary").textContent =
    "Ingen terningkast er gjennomført ennå.";

  document.querySelector("#dice-log").value = "";
}

function runDiceRolls(diceCount, rollCount) {
  for (let rollIndex = 0; rollIndex < rollCount; rollIndex += 1) {
    const values = [];
    let sum = 0;

    for (let diceIndex = 0; diceIndex < diceCount; diceIndex += 1) {
      const value = randomInteger(1, 6);
      values.push(value);
      sum += value;
    }

    appState.dice.rolls.push({
      number: appState.dice.rolls.length + 1,
      values,
      sum,
    });
  }

  renderDiceDemo(diceCount);
}

function renderDiceDemo(diceCount) {
  const rolls = appState.dice.rolls;
  const lastRoll = rolls.at(-1);

  renderDiceDisplay(lastRoll.values);
  renderDiceChart(createDiceFrequencies(rolls, diceCount));

  document.querySelector("#dice-summary").textContent =
    `Siste kast: ${lastRoll.values.join(" + ")} = ${lastRoll.sum}. Totalt ${formatNumber(rolls.length)} kast.`;

  document.querySelector("#dice-log").value = rolls
    .map((roll) => `Kast ${roll.number}: ${roll.values.join(" + ")} = ${roll.sum}`)
    .join("\n");
}

function renderDiceDisplay(values) {
  const diceDisplay = document.querySelector("#dice-display");
  diceDisplay.innerHTML = "";

  values.forEach((value) => {
    const die = document.createElement("span");
    die.className = "die";
    die.textContent = value;
    diceDisplay.appendChild(die);
  });
}

function createDiceFrequencies(rolls, diceCount) {
  const frequencies = {};
  const minimumSum = diceCount;
  const maximumSum = diceCount * 6;

  for (let sum = minimumSum; sum <= maximumSum; sum += 1) {
    frequencies[sum] = 0;
  }

  rolls.forEach((roll) => {
    frequencies[roll.sum] += 1;
  });

  return frequencies;
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

/* ----------------------------- Trekking ----------------------------- */

function setupDrawingDemo() {
  const inputs = [
    "#red-balls",
    "#blue-balls",
    "#green-balls",
    "#draw-mode",
  ];

  document.querySelector("#run-drawing-demo").addEventListener("click", () => {
    drawBalls(1);
  });

  document.querySelector("#draw-five-demo").addEventListener("click", () => {
    drawBalls(5);
  });

  document.querySelector("#reset-drawing-demo").addEventListener("click", resetBag);

  inputs.forEach((selector) => {
    document.querySelector(selector).addEventListener("change", resetBag);
  });
}

function resetBag() {
  const redCount = getNumberValue("#red-balls", 0, 20);
  const blueCount = getNumberValue("#blue-balls", 0, 20);
  const greenCount = getNumberValue("#green-balls", 0, 20);

  appState.drawing.currentBag = [
    ...createBalls("red", redCount),
    ...createBalls("blue", blueCount),
    ...createBalls("green", greenCount),
  ];

  appState.drawing.history = [];
  appState.drawing.lastDrawnBall = null;

  renderBag();
  renderDrawingProbability();
  renderDrawingLog();
}

function createBalls(color, count) {
  return Array.from({ length: count }, () => color);
}

function drawBalls(numberOfDraws) {
  for (let index = 0; index < numberOfDraws; index += 1) {
    const didDraw = drawSingleBall();

    if (!didDraw) {
      break;
    }
  }

  renderBag();
  renderDrawingProbability();
  renderDrawingLog();
}

function drawSingleBall() {
  if (appState.drawing.currentBag.length === 0) {
    appState.drawing.history.push({
      number: appState.drawing.history.length + 1,
      result: "Posen er tom",
      mode: "Ingen trekk mulig",
      beforeTotal: 0,
      afterTotal: 0,
    });

    return false;
  }

  const drawMode = document.querySelector("#draw-mode").value;
  const selectedIndex = randomInteger(0, appState.drawing.currentBag.length - 1);
  const selectedBall = appState.drawing.currentBag[selectedIndex];

  const beforeTotal = appState.drawing.currentBag.length;
  appState.drawing.lastDrawnBall = selectedBall;

  if (drawMode === "without-replacement") {
    appState.drawing.currentBag.splice(selectedIndex, 1);
  }

  const afterTotal = appState.drawing.currentBag.length;

  appState.drawing.history.push({
    number: appState.drawing.history.length + 1,
    result: getBallName(selectedBall),
    mode:
      drawMode === "with-replacement"
        ? "med tilbakelegging"
        : "uten tilbakelegging",
    beforeTotal,
    afterTotal,
  });

  return true;
}

function renderBag() {
  const bagDisplay = document.querySelector("#bag-display");
  bagDisplay.innerHTML = "";

  if (appState.drawing.currentBag.length === 0) {
    bagDisplay.innerHTML = `<p class="placeholder-text">Posen er tom.</p>`;
    return;
  }

  appState.drawing.currentBag.forEach((color) => {
    const ball = document.createElement("span");
    ball.className = `ball ball--${color}`;
    ball.textContent = getBallLabel(color);
    bagDisplay.appendChild(ball);
  });
}

function renderDrawingProbability() {
  const display = document.querySelector("#drawing-probability");
  const counts = countBalls(appState.drawing.currentBag);
  const total = appState.drawing.currentBag.length;

  const lastDrawnText = appState.drawing.lastDrawnBall
    ? `<p class="formula">Sist trukket: ${getBallName(appState.drawing.lastDrawnBall)}</p>`
    : `<p class="formula">Ingen kule er trukket ennå.</p>`;

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

function renderDrawingLog() {
  document.querySelector("#drawing-log").value = appState.drawing.history
    .map((entry) => {
      return `Trekk ${entry.number}: ${entry.result} (${entry.mode}). Kuler før: ${entry.beforeTotal}. Kuler etter: ${entry.afterTotal}.`;
    })
    .join("\n");
}

function createProbabilityLine(label, count, total) {
  const percent = total === 0 ? 0 : (count / total) * 100;

  return `
    <p class="probability-line">
      P(${label}) = ${count}/${total} = ${formatPercent(percent)}
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

/* ----------------------------- Antrekk ----------------------------- */

function setupOutfitDemo() {
  const inputs = [
    "#hat-count",
    "#shirt-count",
    "#pants-count",
    "#shoe-count",
  ];

  document.querySelector("#calculate-outfits").addEventListener("click", calculateOutfits);
  document.querySelector("#random-outfit").addEventListener("click", showRandomOutfit);
  document.querySelector("#show-outfits").addEventListener("click", showOutfitList);

  inputs.forEach((selector) => {
    document.querySelector(selector).addEventListener("input", calculateOutfits);
  });
}

function calculateOutfits() {
  const counts = getOutfitCounts();
  const total = counts.reduce((product, value) => product * value, 1);
  const formula = `${counts.join(" × ")} = ${formatNumber(total)}`;

  document.querySelector("#outfit-formula").textContent = formula;
  document.querySelector("#outfit-total").textContent = formatNumber(total);

  if (total === 0) {
    document.querySelector("#outfit-example").textContent =
      "Minst én kategori har 0 valg. Da kan vi ikke lage et komplett antrekk.";
  }
}

function getOutfitCounts() {
  return [
    getNumberValue("#hat-count", 0, 20),
    getNumberValue("#shirt-count", 0, 20),
    getNumberValue("#pants-count", 0, 20),
    getNumberValue("#shoe-count", 0, 20),
  ];
}

function getOutfitOptions() {
  const [hatCount, shirtCount, pantsCount, shoeCount] = getOutfitCounts();

  return {
    hatter: createNamedOptions("Hatt", hatCount),
    skjorter: createNamedOptions("Skjorte", shirtCount),
    bukser: createNamedOptions("Bukse", pantsCount),
    sko: createNamedOptions("Sko", shoeCount),
  };
}

function showRandomOutfit() {
  calculateOutfits();

  const options = getOutfitOptions();

  if (
    options.hatter.length === 0 ||
    options.skjorter.length === 0 ||
    options.bukser.length === 0 ||
    options.sko.length === 0
  ) {
    document.querySelector("#outfit-example").textContent =
      "Kan ikke lage antrekk når en kategori har 0 valg.";
    return;
  }

  const outfit = [
    pickRandom(options.hatter),
    pickRandom(options.skjorter),
    pickRandom(options.bukser),
    pickRandom(options.sko),
  ];

  document.querySelector("#outfit-example").textContent =
    `Tilfeldig antrekk: ${outfit.join(" + ")}`;
}

function showOutfitList() {
  calculateOutfits();

  const options = getOutfitOptions();
  const outfits = [];

  if (
    options.hatter.length === 0 ||
    options.skjorter.length === 0 ||
    options.bukser.length === 0 ||
    options.sko.length === 0
  ) {
    document.querySelector("#outfit-list").value =
      "Ingen komplette antrekk kan lages når en kategori har 0 valg.";
    return;
  }

  for (const hat of options.hatter) {
    for (const shirt of options.skjorter) {
      for (const pants of options.bukser) {
        for (const shoes of options.sko) {
          outfits.push(`${hat} + ${shirt} + ${pants} + ${shoes}`);
        }
      }
    }
  }

  const maximumVisibleOutfits = 1000;
  const visibleOutfits = outfits.slice(0, maximumVisibleOutfits);

  document.querySelector("#outfit-list").value =
    visibleOutfits
      .map((outfit, index) => `${index + 1}. ${outfit}`)
      .join("\n") +
    (outfits.length > maximumVisibleOutfits
      ? `\n\nListen viser de første ${maximumVisibleOutfits} antrekkene av totalt ${formatNumber(outfits.length)}.`
      : "");
}

/* ----------------------------- Koder ----------------------------- */

function setupCodeDemo() {
  document.querySelector("#calculate-codes").addEventListener("click", calculateCodes);
  document.querySelector("#generate-code").addEventListener("click", () => generateCodes(1));
  document.querySelector("#generate-ten-codes").addEventListener("click", () => generateCodes(10));
  document.querySelector("#reset-code-log").addEventListener("click", resetCodeLog);

  document.querySelector("#code-length").addEventListener("input", calculateCodes);
  document.querySelector("#symbol-count").addEventListener("input", calculateCodes);
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

function generateCodes(amount) {
  calculateCodes();

  const codeLength = getNumberValue("#code-length", 1, 12);
  const symbolCount = getNumberValue("#symbol-count", 2, 100);
  const symbols = createSymbolPool(symbolCount);

  for (let index = 0; index < amount; index += 1) {
    const code = Array.from({ length: codeLength }, () => pickRandom(symbols)).join("");

    appState.codes.history.push({
      number: appState.codes.history.length + 1,
      code,
    });
  }

  const lastCode = appState.codes.history.at(-1);

  document.querySelector("#code-example").textContent =
    `Siste kode: ${lastCode.code}`;

  renderCodeLog();
}

function resetCodeLog() {
  appState.codes.history = [];
  document.querySelector("#code-example").textContent =
    "Trykk «Lag tilfeldig kode» for å vise et konkret eksempel.";
  document.querySelector("#code-log").value = "";
}

function renderCodeLog() {
  document.querySelector("#code-log").value = appState.codes.history
    .map((entry) => `Kode ${entry.number}: ${entry.code}`)
    .join("\n");
}

function createSymbolPool(symbolCount) {
  const baseSymbols = [
    ..."0123456789",
    ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    ..."abcdefghijklmnopqrstuvwxyz",
  ];

  const symbols = [...baseSymbols];

  while (symbols.length < symbolCount) {
    symbols.push(`¤${symbols.length + 1}`);
  }

  return symbols.slice(0, symbolCount);
}

/* ------------------------ Rekkefølge / valg ------------------------ */

function setupOrderDemo() {
  document.querySelector("#calculate-order").addEventListener("click", calculateOrder);
  document.querySelector("#random-order-example").addEventListener("click", showRandomOrderExample);
  document.querySelector("#show-order-list").addEventListener("click", showOrderList);

  document.querySelector("#people-count").addEventListener("input", calculateOrder);
  document.querySelector("#chosen-count").addEventListener("input", calculateOrder);
  document.querySelector("#order-mode").addEventListener("change", calculateOrder);
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
      "Rekkefølgen betyr noe. Anna, Bilal, Chen er ikke det samme som Chen, Bilal, Anna.";
    return;
  }

  const total = calculateCombination(peopleCount, chosenCount);

  formulaElement.textContent =
    `${peopleCount}C${chosenCount} = ${formatBigNumber(total)}`;

  totalElement.textContent = formatBigNumber(total);

  explanationElement.textContent =
    "Rekkefølgen betyr ikke noe. Anna, Bilal, Chen er samme gruppe uansett rekkefølge.";
}

function showRandomOrderExample() {
  calculateOrder();

  const peopleCount = getNumberValue("#people-count", 1, 20);
  const chosenCount = getNumberValue("#chosen-count", 1, 20);
  const mode = document.querySelector("#order-mode").value;

  if (chosenCount > peopleCount) {
    document.querySelector("#order-example").textContent =
      "Kan ikke lage eksempel når antall valgte er større enn antall personer.";
    return;
  }

  const people = PERSON_NAMES.slice(0, peopleCount);
  const shuffled = shuffleArray(people);
  const chosen = shuffled.slice(0, chosenCount);

  if (mode === "permutation") {
    document.querySelector("#order-example").textContent =
      `Tilfeldig rekkefølge: ${chosen.join(" → ")}`;
    return;
  }

  document.querySelector("#order-example").textContent =
    `Tilfeldig gruppe: ${chosen.join(", ")}`;
}

function showOrderList() {
  calculateOrder();

  const peopleCount = getNumberValue("#people-count", 1, 20);
  const chosenCount = getNumberValue("#chosen-count", 1, 20);
  const mode = document.querySelector("#order-mode").value;

  if (chosenCount > peopleCount) {
    document.querySelector("#order-list").value =
      "Kan ikke lage liste når antall valgte er større enn antall personer.";
    return;
  }

  const people = PERSON_NAMES.slice(0, peopleCount);
  const maximumVisibleChoices = 1000;

  const choices =
    mode === "permutation"
      ? createPermutations(people, chosenCount, maximumVisibleChoices)
      : createCombinations(people, chosenCount, maximumVisibleChoices);

  document.querySelector("#order-list").value =
    choices.items
      .map((choice, index) => `${index + 1}. ${choice.join(mode === "permutation" ? " → " : ", ")}`)
      .join("\n") +
    (choices.wasLimited
      ? `\n\nListen viser de første ${maximumVisibleChoices} valgene. Det finnes flere.`
      : "");
}

function createCombinations(items, chooseCount, limit) {
  const results = [];

  function backtrack(startIndex, current) {
    if (results.length >= limit) {
      return;
    }

    if (current.length === chooseCount) {
      results.push([...current]);
      return;
    }

    for (let index = startIndex; index < items.length; index += 1) {
      current.push(items[index]);
      backtrack(index + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);

  return {
    items: results,
    wasLimited: results.length >= limit,
  };
}

function createPermutations(items, chooseCount, limit) {
  const results = [];
  const used = new Set();

  function backtrack(current) {
    if (results.length >= limit) {
      return;
    }

    if (current.length === chooseCount) {
      results.push([...current]);
      return;
    }

    for (let index = 0; index < items.length; index += 1) {
      if (used.has(index)) {
        continue;
      }

      used.add(index);
      current.push(items[index]);
      backtrack(current);
      current.pop();
      used.delete(index);
    }
  }

  backtrack([]);

  return {
    items: results,
    wasLimited: results.length >= limit,
  };
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

/* ----------------------------- Hjelpere ----------------------------- */

function createNamedOptions(label, count) {
  return Array.from({ length: count }, (_, index) => `${label} ${index + 1}`);
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

function pickRandom(items) {
  return items[randomInteger(0, items.length - 1)];
}

function shuffleArray(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = randomInteger(0, index);
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function formatNumber(value) {
  return new Intl.NumberFormat("nb-NO").format(value);
}

function formatBigNumber(value) {
  return new Intl.NumberFormat("nb-NO").format(value);
}

function formatPercent(value) {
  return `${value.toFixed(1).replace(".", ",")} %`;
}

/*
  Slutt på fil: js/app.js
  Versjon: 0.2.0
*/
