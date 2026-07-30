const horizontalRuler = `<span class="rune-segment middle-center" style="height: 1px !important; width: 50px; left: 0; bottom: 50%;"></span>`;
let vowelMeanings = [];
let consonantMeanings = [];
let inverted = [];

document.addEventListener('DOMContentLoaded', function () {
  setupRunesListeners();
  setupMeaningSwapListener();
  setupAddRuneListener();
});

const lastSelectionId = () => document.getElementById('rune-selection-container')
  .querySelectorAll('[id^="selection-"]').length;

const nextSelectionId = () => lastSelectionId() + 1;

function setupAddRuneListener() {
  document.getElementById('add-rune').addEventListener('click', function (event) {
    const nextId = nextSelectionId();
    document.getElementById('rune-selection-container').childElementCount;
    const nextSibling = document.getElementById('rune-selection-container').firstElementChild.cloneNode(true);
    nextSibling.id = `selection-${nextId}`;
    nextSibling.querySelector('.rune-meaning').textContent = '';
    nextSibling.querySelectorAll('.rune').forEach(rune => rune.remove());
    nextSibling.querySelector('.invert-indicator').classList.add('display-none');

    document.getElementById('rune-selection-container').insertBefore(nextSibling, event.target);

    setupMeaningSwapListener(nextSibling);
  });
};

function setupMeaningSwapListener(currentSelection = document.getElementById('selection-1')) {
  currentSelection.querySelector('.rune-meaning').addEventListener('click', function () {
    const clickedIndex = Number(currentSelection.id.replace('selection-', '')) - 1;
    inverted[clickedIndex] ??= false;
    // when meaning is clicked, the meanings are swapped, vowel and consonant and vice-versa.
    if (
      vowelMeanings[clickedIndex] === undefined ||
      consonantMeanings[clickedIndex] === undefined
    ) return;

    if (inverted[clickedIndex]) {
      currentSelection.querySelector('.rune-meaning').innerHTML = consonantMeanings[clickedIndex] + vowelMeanings[clickedIndex];
      currentSelection.querySelector('.invert-indicator').classList.add('display-none');
       inverted[clickedIndex] = false;
    } else {
      currentSelection.querySelector('.rune-meaning').innerHTML = vowelMeanings[clickedIndex] + consonantMeanings[clickedIndex];
      currentSelection.querySelector('.invert-indicator').classList.remove('display-none');
      inverted[clickedIndex] = true;
    }
  });
};

const getRuneMeaning = (rune) =>
  window.getComputedStyle(rune, '::after')
    .getPropertyValue('content').replace(/"/g, '')

const shortenRune = (clonedRune) => {
  // This function shortens the middle left/center segments.
  // We always skip middle-right because no rune has it :)
  const middleCenterSegment = clonedRune.querySelector('[id^=consonant-] .rune-segment.middle-center');
  // The selected rune is a consonant with a middle-center segment?
  // If so, let's shorten it.
  middleCenterSegment?.classList.add('shortened');

  // The selected rune is a vowel with a middle-left segment? 
  // If so, let's split it in two, so it's looks striken through.
  const middleLeftSegment = clonedRune.querySelector('[id^=vowel-] .rune-segment.middle-left');
  if (middleLeftSegment) {
    const middleLeftClonnedSegment = middleLeftSegment.cloneNode(false);
    middleLeftSegment.classList.add('shortened');
    middleLeftClonnedSegment.classList.add('shortened-tip');
    middleLeftSegment.parentElement.appendChild(middleLeftClonnedSegment);
  }
};

function mergeRunes(clonedRune) {
  clonedRune.style.position = 'absolute';
  const clonedRuneBaseId = clonedRune.id.replace(/\d+/g, '');
  const lastSelectedOfSameType = document.querySelector(`#selection-${lastSelectionId()} .resulting-runes`)
    .querySelector(`[id^="${clonedRuneBaseId}"]`)
  // replace if there is already a rune of the same parent
  if (lastSelectedOfSameType) {
    lastSelectedOfSameType.replaceWith(clonedRune);
  } else {
    document.querySelector(`#selection-${lastSelectionId()} .resulting-runes`)
      .appendChild(clonedRune);
  }

  shortenRune(clonedRune);

  // This block adds the horizontal strike through segment.
  clonedRune.querySelector('.rune-middle-section-container')
    .insertAdjacentHTML('beforeend', horizontalRuler);
};

function mergeMeanings(currentRune, currentRuneMeaning) {
  if (currentRune.id.startsWith('vowel')) {
    vowelMeanings[lastSelectionId() - 1] = currentRuneMeaning;
  }
  else {
    consonantMeanings[lastSelectionId() - 1] = currentRuneMeaning;
  }
  const vowelFirst = (vowelMeanings[lastSelectionId() - 1] || '') + (consonantMeanings[lastSelectionId() - 1] || '');
  const consonantFirst = (consonantMeanings[lastSelectionId() - 1] || '') + (vowelMeanings[lastSelectionId() - 1] || '');
  document.querySelector(`#selection-${lastSelectionId()} .rune-meaning`).innerHTML = inverted[lastSelectionId() - 1] ? vowelFirst : consonantFirst;
}

function setupRunesListeners() {
  document.querySelectorAll('.rune').forEach(function (currentRune) {
    currentRune.addEventListener('click', function () {
      const currentRuneMeaning = getRuneMeaning(currentRune);
      if (currentRuneMeaning === '...') return;

      mergeMeanings(currentRune, currentRuneMeaning);
      mergeRunes(currentRune.cloneNode(true));
    });
  });
};