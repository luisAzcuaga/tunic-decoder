document.addEventListener('DOMContentLoaded', function () {
  let = lastClickedRune = null;
  let = runesClicked = 0;

  let vowelMeaning = '';
  let consonantMeaning = '';
  document.querySelectorAll('.rune').forEach(function (rune) {
    rune.addEventListener('click', function (event) {
      const currentRuneMeaning = window.getComputedStyle(rune, '::after')
        .getPropertyValue('content').replace(/"/g, '');
      if (currentRuneMeaning === '...') return;

      if (rune.parentElement.id === lastClickedRune?.parentElement?.id || runesClicked >= 2) {
        // replaces if the new selection is from the same container.
        document.getElementById('rune-meaning').innerHTML = currentRuneMeaning;
        document.getElementById('combined-runes').innerHTML = '';
        runesClicked = 0;
      } else {
        // append to inner html if the rune is from a different container
        // vowels go first
        const formerMeaning = document.getElementById('rune-meaning').innerHTML;
        if (rune.parentElement.id === 'consonants-container') {
          // If consonant is selected after a vowel, prepend the consonant.
          document.getElementById('rune-meaning').innerHTML = currentRuneMeaning +
            formerMeaning;
        } else {
          // If vowel is selected after, simply append.
          document.getElementById('rune-meaning').innerHTML += currentRuneMeaning;
        }
      }
      lastClickedRune = rune;
      if (rune.parentElement.id === 'vowels-container') {
        vowelMeaning = currentRuneMeaning;
      } else {
        consonantMeaning = currentRuneMeaning;
      }
      runesClicked++;
      const clonedRune = lastClickedRune.cloneNode(true);

      const clonedContainer = lastClickedRune.parentElement.cloneNode(false);
      clonedContainer.style.position = 'absolute';
      clonedContainer.appendChild(clonedRune);

      document.getElementById('combined-runes')
        .appendChild(clonedContainer);
      
      // shorten rune-segment center to height: 16.666px;
      if (clonedRune.querySelector('.rune-middle-chunk-container .rune-segment.center')) {
        clonedRune.querySelector('.rune-middle-chunk-container .rune-segment.center').style.height = '16.666px';
      }
      if (clonedRune.querySelector('.rune-middle-chunk-container .rune-segment.middle-left')) {
        const clonedLeft = clonedRune.querySelector('.rune-middle-chunk-container .rune-segment.middle-left').cloneNode(false);
        clonedRune.querySelector('.rune-middle-chunk-container .rune-segment.middle-left').style.height = '16.666px';
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
  document.getElementById('rune-meaning').addEventListener('click', function () {
    // when meaning is clicked, the meanings are swapped, vowel and consonant and vice-versa.
    const currentMeaning = document.getElementById('rune-meaning').innerHTML;
    if (currentMeaning === vowelMeaning + consonantMeaning) {
      document.getElementById('rune-meaning').innerHTML = consonantMeaning + vowelMeaning;
    } else {
      document.getElementById('rune-meaning').innerHTML = vowelMeaning + consonantMeaning;
    }

  });
});