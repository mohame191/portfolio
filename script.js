document.addEventListener("DOMContentLoaded", function() {
  const typedElement = document.getElementById("typed");
  const phrases = ["Developer.", "Problem Solver.", "Web Enthusiast."];
  let phraseIndex = 0;
  let letterIndex = 0;
  let isDeleting = false;
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseTime = 2000;

  function type() {
    if (phraseIndex >= phrases.length) {
      phraseIndex = 0;
    }
    const currentPhrase = phrases[phraseIndex];
    
    if (!isDeleting) {
      typedElement.textContent = currentPhrase.substring(0, letterIndex + 1);
      letterIndex++;
      if (letterIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(type, pauseTime);
        return;
      }
    } else {
      typedElement.textContent = currentPhrase.substring(0, letterIndex - 1);
      letterIndex--;
      if (letterIndex === 0) {
        isDeleting = false;
        phraseIndex++;
      }
    }
    setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
  }
  type();
});
