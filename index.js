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