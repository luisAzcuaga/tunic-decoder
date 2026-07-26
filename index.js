document.addEventListener('DOMContentLoaded', function () {
  let = lastClickedRune = null;
  let = runesClicked = 0;
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
      runesClicked++;
      const clonedRune = lastClickedRune.cloneNode(true);
      
      const clonedContainer = lastClickedRune.parentElement.cloneNode(false);
      clonedContainer.style.position = 'absolute';
      clonedContainer.appendChild(clonedRune);

      document.getElementById('combined-runes')
        .appendChild(clonedContainer);
    })
  });
});