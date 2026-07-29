let lastClickedRune = null;
let runesClicked = 0;

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

function setupRunesListeners() {
  document.querySelectorAll('.rune').forEach(function (currentRune) {
    currentRune.addEventListener('click', function () {
      const currentRuneMeaning = window.getComputedStyle(currentRune, '::after')
        .getPropertyValue('content').replace(/"/g, '');
      if (currentRuneMeaning === '...') return;

      if (currentRune.parentElement.id === lastClickedRune?.parentElement?.id || runesClicked >= 2) {
        // replaces if the new selection is from the same container.
        document.getElementById('rune-meaning').innerHTML = currentRuneMeaning;
        document.getElementById('combined-runes').innerHTML = '';
        runesClicked = 0;
      } else {
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
      }
      if (currentRune.id.startsWith('vowel-')) {
        vowelMeaning = currentRuneMeaning;
      } else {
        consonantMeaning = currentRuneMeaning;
      }
      runesClicked++;
      const clonedRune = currentRune.cloneNode(true);
      lastClickedRune = currentRune;

      clonedRune.style.position = 'absolute';
      document.getElementById('combined-runes')
        .appendChild(clonedRune);

      // in this next section we shorten middle left or middle center segments.
      // We always skip middle-right because is never usen by any rune.
      if (clonedRune.querySelector('[id^=consonant-] .rune-segment.middle-center')) {
        // The selected rune is a consonant with a middle-center segment? if so, let's shorten it.
        clonedRune.querySelector('[id^=consonant-] .rune-segment.middle-center').classList.add('shortened');
      }

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
      clonedRune.querySelector('.rune-middle-chunk-container').insertAdjacentHTML('beforeend', horizontalRuler);
    })
  });
};