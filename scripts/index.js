async function loadData() {
  const response = await fetch("../data/data.json");
  const tests = await response.json();

  return tests;

}

let personalScore = 0;

function updateTimeInterval(seconds) {
  if (timeModeElement.value === '60') {

    timerDisplayElement.textContent = `0:${(60 - seconds).toString().padStart(2, '0')}`;

    if (seconds >= 60) {

      clearInterval(timer);
      inputTextElement.disabled = true;
      personalScoreElement.textContent = personalScore;
      localStorage.setItem('personalScore', personalScore);

      if (personalScore > Number(bestScoreElement.textContent)) {
        bestScoreElement.textContent = `${personalScore}`;
        localStorage.setItem('bestScore', personalScore);
      }

      document.querySelector('.js-personal-scores-score').textContent = `${personalScore}`;

      document.querySelector('.js-personal-scores-accuracy').textContent = `${Math.round(accuracy)}%`;

      document.querySelector('.js-personal-scores-score-correct').textContent = `${correct}`;

      document.querySelector('.js-personal-scores-score-incorrect').textContent = `${incorrect}`;

      typingPanelElement.style.display = 'none';

      resultsPanelElement.style.display = 'block';
    };

  } else if (timeModeElement.value === 'passage') {

    timerDisplayElement.textContent = `0:00`;

    if (seconds < 60) {
      timerDisplayElement.textContent = `0:${seconds}`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      timerDisplayElement.textContent = `${minutes}:${remainingSeconds}`;
    }
  };
};

const typingPanelElement = document.querySelector('.js-typing-panel');

const resultsPanelElement = document.querySelector('.js-results-panel');

const personalScoreElement = document.querySelector('.js-personal-score');
// personalScoreElement.textContent = personalScore;

const startButtonElement = document.querySelector('.js-start-typing-btn');

const testTextElement = document.querySelector('.js-test-text');

const timerDisplayElement = document.querySelector('.js-timer');

const bestScoreElement = document.querySelector('.js-best-score');

const bestScore = localStorage.getItem('bestScore') || 0;
bestScoreElement.textContent = bestScore;

const inputTextElement = document.querySelector('.js-typing-input');

const accuracyElement = document.querySelector('.js-accuracy');

const timeModeElement = document.querySelector('.js-time-mode-select');

let testTextContent = '';

let timer;

let typedText = '';

resultsPanelElement.style.display = 'none';

startButtonElement.addEventListener('click', async () => {

  clearInterval(timer);

  inputTextElement.disabled = false;

  inputTextElement.value = '';

  /* Choosing test text from the existing sample */
  const tests = await loadData();
  const difficulty = document.querySelector('.js-difficulty-select').value;
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  if (tests[difficulty]) {
    const test = tests[difficulty].find(test => test.id === `${difficulty}-${randomNumber}`);
    if (test) {
      testTextContent = test.text;
    } else {
      console.error(`Test with id ${difficulty}-${randomNumber} not found.`);
    }
  } else {
    console.error(`Difficulty level ${difficulty} not found.`);
  }

  /* Adding spans to the selected test text */
  testTextElement.innerHTML = testTextContent.split('').map(char => `<span>${char}</span>`).join('');

  const spannedChars = testTextElement.querySelectorAll('span');

  spannedChars.forEach((char) => {
    char.classList.add('dim');
  })

  let seconds = 0;

  updateTimeInterval(seconds);

  timer = setInterval(() => {

    seconds++;
    updateTimeInterval(seconds);

  }, 1000);

  inputTextElement.focus();

  document.querySelector('.js-typing-backdrop').style.visibility = 'hidden';

  startButtonElement.style.display = 'none';

  document.querySelector('.js-typing-text-instruction').style.display = 'none';

  timerDisplayElement.classList.add('yellow-font');

});

inputTextElement.addEventListener('keydown', (event) => {
  if (event.key === 'Backspace') {
    event.preventDefault();
  }
});

inputTextElement.addEventListener('keydown', (event) => {
  const capsLockOn = event.getModifierState('CapsLock');

  if (capsLockOn) {
    alert('CapsLock is ON');
  }
});

inputTextElement.addEventListener('input', () => {

  const spannedChars = testTextElement.querySelectorAll('span');

  const currentIndex = inputTextElement.value.length;

  // Remove the previous highlight
  spannedChars.forEach(char => {
    char.classList.remove('current-char');
  });

  if (currentIndex < spannedChars.length) {
    spannedChars[currentIndex].classList.add('current-char');
  }

  typedText = inputTextElement.value;

  let correct = 0;
  let incorrect = 0;

  spannedChars.forEach((spannedChar, index) => {

    const typedChar = typedText[index];

    if (typedChar === undefined) {
      return;
    };

    if (typedChar === spannedChar.textContent) {
      spannedChar.classList.remove('dim');
      spannedChar.classList.add('correct');
      correct++;
    } else {
      spannedChar.classList.remove('dim');
      spannedChar.classList.add('incorrect');
      incorrect++;
    }
  });

  const total = correct + incorrect;

  const accuracy = total === 0
    ? 100
    : (correct / total) * 100;


  accuracyElement.textContent = `${Math.round(accuracy)}%`;

  if (accuracy < 100) {
    accuracyElement.classList.add('red-font');
  } else if (accuracy === 100) {
    accuracyElement.classList.remove('red-font');
  }

  personalScore = Math.round(accuracy);

  const allCharactersChecked = [...spannedChars].every(char =>
    char.classList.contains('correct') ||
    char.classList.contains('incorrect')
  );

  if (allCharactersChecked) {
    clearInterval(timer);
    inputTextElement.disabled = true;
    personalScoreElement.textContent = personalScore;
    if (personalScore > Number(bestScoreElement.textContent)) {
      bestScoreElement.textContent = `${personalScore}`;
      localStorage.setItem('bestScore', personalScore);
    }

    document.querySelector('.js-personal-scores-score').textContent = `${personalScore}`;

    document.querySelector('.js-personal-scores-accuracy').textContent = `${Math.round(accuracy)}%`;

    document.querySelector('.js-personal-scores-score-correct').textContent = `${correct}`;

    document.querySelector('.js-personal-scores-score-incorrect').textContent = `${incorrect}`;

    typingPanelElement.style.display = 'none';

    resultsPanelElement.style.display = 'block';

  }

});



const restartButton = document.querySelector('.js-restart-btn');

restartButton.addEventListener('click', () => {
  document.querySelector('.js-typing-backdrop').style.visibility = 'visible';

  startButtonElement.style.display = 'block';

  document.querySelector('.js-typing-text-instruction').style.display = 'block';

  clearInterval(timer);

  personalScoreElement.textContent = '0';

  timerDisplayElement.classList.remove('yellow-font');
  if (timeModeElement.value === '60') {
    timerDisplayElement.textContent = '0:60';
  } else if (timeModeElement.value === 'passage') {
    timerDisplayElement.textContent = '0:00';
  }
  accuracyElement.textContent = '100%';
  accuracyElement.classList.remove('red-font');

});