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

      // does the selected rune has a center segment? if so, let's shorten it.
      if (clonedRune.querySelector('.rune-middle-chunk-container .rune-segment.center')) {
        clonedRune.querySelector('.rune-middle-chunk-container .rune-segment.center').style.height = '16.666px';
      }

      // does the selectred rune has a left segment? if so, let's split it in two, so it's looks striken through.
      const leftSegment = clonedRune.querySelector('.rune-middle-chunk-container .rune-segment.middle-left');
      if (leftSegment) {
        const clonedLeft = leftSegment.cloneNode(false);
        leftSegment.style.height = '33.3px';
        clonedLeft.style.height = '16.666px';
        clonedLeft.style.top = '100%';
        clonedRune.querySelector('.rune-middle-chunk-container')
          .appendChild(clonedLeft);
      }
      if (clonedRune.querySelector('.rune-middle-chunk-container .rune-segment.middle-right')) {
        clonedRune.querySelector('.rune-middle-chunk-container .rune-segment.middle-right').style.height = '16.666px';
      }
      // add this element to .rune-middle-chunk-container
      const horizontalRuler = `<span class="rune-segment center" style="height: 1px !important; width: 50px; left: 0; bottom: 50%;"></span>`;
      clonedRune.querySelector('.rune-middle-chunk-container').insertAdjacentHTML('beforeend', horizontalRuler);
    })
  });
};