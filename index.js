
let vowelMeaning = '';
let consonantMeaning = '';

document.addEventListener('DOMContentLoaded', function () {
  setupRunesListeners();
  setupMeaningSwapListener();
});

function setupMeaningSwapListener() {
  document.getElementById('rune-meaning').addEventListener('click', function () {
    // when meaning is clicked, the meanings are swapped, vowel and consonant and vice-versa.
    const currentMeaning = document.getElementById('rune-meaning').innerHTML;
    if (currentMeaning === vowelMeaning + consonantMeaning) {
      document.getElementById('rune-meaning').innerHTML = consonantMeaning + vowelMeaning;
    } else {
      document.getElementById('rune-meaning').innerHTML = vowelMeaning + consonantMeaning;
    }
  });
};

const getRuneMeaning = (rune) =>
  window.getComputedStyle(rune, '::after')
    .getPropertyValue('content').replace(/"/g, '')

const resetAndReplaceWith = (runeMeaning) => {
  // replaces if the new selection is from the same container.
  document.getElementById('rune-meaning').innerHTML = runeMeaning;
  document.getElementById('resulting-runes').innerHTML = '';
  // runesClicked = 0;
}

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

  // in this next section we shorten middle left or middle center segments.
  // We always skip middle-right because is never usen by any rune.
  const middleCenterSegment = clonedRune.querySelector('[id^=consonant-] .rune-segment.middle-center');
  // The selected rune is a consonant with a middle-center segment? if so, let's shorten it.
  middleCenterSegment?.classList.add('shortened');

  // The selectred rune is a vowel with a middle-left segment? if so, let's split it in two, so it's looks striken through.
  const middleLeftSegment = clonedRune.querySelector('[id^=vowel-] .rune-segment.middle-left');
  if (middleLeftSegment) {
    const middleLeftClonnedSegment = middleLeftSegment.cloneNode(false);
    middleLeftSegment.classList.add('shortened');
    middleLeftClonnedSegment.classList.add('shortened-tip');
    middleLeftSegment.parentElement.appendChild(middleLeftClonnedSegment);
  }

  // This block adds the horizontal strike through segment.
  const horizontalRuler = `<span class="rune-segment middle-center" style="height: 1px !important; width: 50px; left: 0; bottom: 50%;"></span>`;
  clonedRune.querySelector('.rune-middle-section-container')
    .insertAdjacentHTML('beforeend', horizontalRuler);
};

function setupRunesListeners() {
  document.querySelectorAll('.rune').forEach(function (currentRune) {
    currentRune.addEventListener('click', function () {
      const currentRuneMeaning = getRuneMeaning(currentRune);
      if (currentRuneMeaning === '...') return;

      // append to inner html if the rune is from a different container
      // vowels go first
      const formerMeaning = document.getElementById('rune-meaning').innerHTML;
      if (currentRune.parentElement.id === 'consonants-container') {
        // If consonant is selected after a vowel, prepend the consonant.
        document.getElementById('rune-meaning').innerHTML = currentRuneMeaning +
          formerMeaning;
      } else {
        // If vowel is selected after, simply append.
        document.getElementById('rune-meaning').innerHTML += currentRuneMeaning;
      }
      if (currentRune.id.startsWith('vowel-')) {
        vowelMeaning = currentRuneMeaning;
      } else {
        consonantMeaning = currentRuneMeaning;
      }
      mergeRunes(currentRune.cloneNode(true));
    });
  });
};