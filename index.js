const horizontalRuler = `<span class="rune-segment middle-center" style="height: 1px !important; width: 50px; left: 0; bottom: 50%;"></span>`;
let vowelMeaning = '';
let consonantMeaning = '';
let inverted = false;

document.addEventListener('DOMContentLoaded', function () {
  setupRunesListeners();
  setupMeaningSwapListener();
});

function setupMeaningSwapListener() {
  document.getElementById('rune-meaning').addEventListener('click', function () {
    // when meaning is clicked, the meanings are swapped, vowel and consonant and vice-versa.
    if (vowelMeaning === '' || consonantMeaning === '') return;

    if (inverted) {
      document.getElementById('rune-meaning').innerHTML = consonantMeaning + vowelMeaning;
      document.getElementById('invert-indicator').classList.add('display-none');
      inverted = !inverted;
    } else {
      document.getElementById('rune-meaning').innerHTML = vowelMeaning + consonantMeaning;
      document.getElementById('invert-indicator').classList.remove('display-none');
      inverted = !inverted;
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
  const lastSelectedOfSameType = document.getElementById('resulting-runes')
    .querySelector(`[id^="${clonedRuneBaseId}"]`)
  // replace if there is already a rune of the same parent
  if (lastSelectedOfSameType) {
    lastSelectedOfSameType.replaceWith(clonedRune);
  } else {
    document.getElementById('resulting-runes').appendChild(clonedRune);
  }

  shortenRune(clonedRune);

  // This block adds the horizontal strike through segment.
  clonedRune.querySelector('.rune-middle-section-container')
    .insertAdjacentHTML('beforeend', horizontalRuler);
};

function mergeMeanings(currentRune, currentRuneMeaning) {
  if (currentRune.id.startsWith('vowel')) {
    vowelMeaning = currentRuneMeaning
  }
  else {
    consonantMeaning = currentRuneMeaning
  }
  const vowelFirst = vowelMeaning + consonantMeaning;
  const consonantFirst = consonantMeaning + vowelMeaning;
  document.getElementById('rune-meaning').innerHTML = inverted ? vowelFirst : consonantFirst;
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