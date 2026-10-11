async function loadData() {
  const response = await fetch("../data/data.json");
  const tests = await response.json();

  return tests;

}


function testTimeout(results) {

  const inputTextElement = document.querySelector('.js-typing-input');

  const personalScoreElement = document.querySelector('.js-personal-score');

  const bestScoreElement = document.querySelector('.js-best-score');

  inputTextElement.disabled = true;

  personalScoreElement.textContent = results.personalScore;

  if (results.personalScore > results.bestScore) {

    results.bestScore = results.personalScore;

    bestScoreElement.textContent = `${results.personalScore}`;

    localStorage.setItem('bestScore', results.personalScore);

    document.querySelector('.js-achievement-score').textContent = `${results.personalScore}`;

    document.querySelector('.js-achievement-accuracy').textContent = `${results.accuracy}%`;

    document.querySelector('.js-achievement-correct').textContent = `${results.correct}`;

    document.querySelector('.js-achievement-incorrect').textContent = `${results.incorrect}`;

    document.querySelector('.js-typing-panel').style.display = 'none';

    document.querySelector('.js-achievement-panel').style.display = 'flex';

  } else {

    document.querySelector('.js-personal-scores-score').textContent = `${results.personalScore}`;

    document.querySelector('.js-personal-scores-accuracy').textContent = `${results.accuracy}%`;

    document.querySelector('.js-personal-scores-score-correct').textContent = `${results.correct}`;

    document.querySelector('.js-personal-scores-score-incorrect').textContent = `${results.incorrect}`;

    document.querySelector('.js-typing-panel').style.display = 'none';

    document.querySelector('.js-results-panel').style.display = 'flex';

  }

};



function timeDisplay(seconds) {

  let time = '';

  if (seconds < 60) {

    time = `0:${seconds.toString().padStart(2, '0')}`;

  } else {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    time = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

  }

  return time;

};




function updateTimeInterval(seconds, timeMode, results, timer) {

  let time = '';

  if (seconds === 0) {

    if (timeMode === '60') {

      time = timeDisplay('60');

    } else if (timeMode === 'passage') {

      time = timeDisplay('0');

    }
  } else {

    if (timeMode === '60') {

      time = timeDisplay(60 - seconds);

      if (seconds >= 60) {

        clearInterval(timer);

        testTimeout(results);

      };

    } else if (timeMode === 'passage') {

      time = timeDisplay(seconds)

    };

  };

  return time;
};





async function selectTestText() {

  /* Choosing test text from the existing sample */
  const tests = await loadData();
  const difficulty = document.querySelector('.js-difficulty-select').value;
  const randomNumber = Math.floor(Math.random() * 10) + 1;
  if (!tests[difficulty]) {
    console.error(`Difficulty level ${difficulty} not found.`);
    return '';
  }

  const test = tests[difficulty].find(
    test => test.id === `${difficulty}-${randomNumber}`
  );

  if (!test) {
    console.error(`Test with id ${difficulty}-${randomNumber} not found.`);
    return '';
  }

  return test.text;

};




export async function startTypingChallenge(results, timer) {

  const timerDisplayElement = document.querySelector('.js-timer');

  const inputTextElement = document.querySelector('.js-typing-input');

  const testTextElement = document.querySelector('.js-test-text');

  clearInterval(timer);

  inputTextElement.value = '';

  inputTextElement.disabled = false;

  const testText = await selectTestText();

  /* Adding spans to the selected test text */
  testTextElement.innerHTML = testText.split('').map(char => `<span>${char}</span>`).join('');

  const spannedChars = testTextElement.querySelectorAll('span');

  spannedChars.forEach((char) => {
    char.classList.add('dim');
  });

  const timeMode = document.querySelector('.js-time-mode-select').value;

  let seconds = 0;

  timerDisplayElement.textContent = updateTimeInterval(seconds, timeMode, results, timer);

  timer = setInterval(() => {

    seconds++;

    timerDisplayElement.textContent = updateTimeInterval(seconds, timeMode, results, timer);

  }, 1000);

  inputTextElement.focus();

  document.querySelector('.js-typing-backdrop').style.visibility = 'hidden';

  document.querySelector('.js-start-typing-btn').style.display = 'none';

  document.querySelector('.js-typing-text-instruction').style.display = 'none';

  timerDisplayElement.classList.add('yellow-font');

  return timer;

};




function testCompletionCheck(spannedChars, results, timer) {

  const allCharactersChecked = [...spannedChars].every(char =>
    char.classList.contains('correct') ||
    char.classList.contains('incorrect')
  );

  if (allCharactersChecked) {

    clearInterval(timer);

    const bestScoreElement = document.querySelector('.js-best-score');

    document.querySelector('.js-typing-input').disabled = true;

    document.querySelector('.js-personal-score').textContent = results.personalScore;

    if (results.personalScore > results.bestScore) {

      results.bestScore = results.personalScore;

      bestScoreElement.textContent = `${results.bestScore}`;

      localStorage.setItem('bestScore', results.bestScore);

      document.querySelector('.js-achievement-score').textContent = `${results.personalScore}`;

      document.querySelector('.js-achievement-accuracy').textContent = `${results.accuracy}%`;

      document.querySelector('.js-achievement-correct').textContent = `${results.correct}`;

      document.querySelector('.js-achievement-incorrect').textContent = `${results.incorrect}`;

      document.querySelector('.js-typing-panel').style.display = 'none';

      document.querySelector('.js-achievement-panel').style.display = 'flex';

    } else {

      document.querySelector('.js-personal-scores-score').textContent = `${results.personalScore}`;

      document.querySelector('.js-personal-scores-accuracy').textContent = `${results.accuracy}%`;

      document.querySelector('.js-personal-scores-score-correct').textContent = `${results.correct}`;

      document.querySelector('.js-personal-scores-score-incorrect').textContent = `${results.incorrect}`;

      document.querySelector('.js-typing-panel').style.display = 'none';

      document.querySelector('.js-results-panel').style.display = 'flex';

    }

  }

};




export function updateText(results, timer) {

  const accuracyElement = document.querySelector('.js-accuracy');

  const testTextElement = document.querySelector('.js-test-text');

  const inputTextElement = document.querySelector('.js-typing-input');

  const spannedChars = testTextElement.querySelectorAll('span');

  const currentIndex = inputTextElement.value.length;

  // Remove the previous highlight
  spannedChars.forEach(char => {
    char.classList.remove('current-char');
  });

  if (currentIndex < spannedChars.length) {
    spannedChars[currentIndex].classList.add('current-char');
  }

  let typedText = inputTextElement.value;

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

  results.correct = correct;

  results.incorrect = incorrect;

  const total = correct + incorrect;

  let accuracy = 0;

  accuracy = total === 0
    ? 100
    : (correct / total) * 100;

  results.accuracy = Math.round(accuracy);

  accuracyElement.textContent = `${results.accuracy}%`;

  if (accuracy < 100) {
    accuracyElement.classList.add('red-font');
    accuracyElement.classList.remove('green-font');
  } else if (accuracy === 100) {
    accuracyElement.classList.add('green-font');
    accuracyElement.classList.remove('red-font');
  }

  results.personalScore = results.accuracy;

  testCompletionCheck(spannedChars, results, timer);

  return timer;

};






export function restartTest(timer) {

  const timerDisplayElement = document.querySelector('.js-timer');

  const timeModeElement = document.querySelector('.js-time-mode-select');

  const accuracyElement = document.querySelector('.js-accuracy');

  document.querySelector('.js-typing-backdrop').style.visibility = 'visible';

  document.querySelector('.js-start-typing-btn').style.display = 'block';

  document.querySelector('.js-typing-text-instruction').style.display = 'block';

  clearInterval(timer);

  timerDisplayElement.classList.remove('yellow-font');
  if (timeModeElement.value === '60') {
    timerDisplayElement.textContent = '1:00';
  } else if (timeModeElement.value === 'passage') {
    timerDisplayElement.textContent = '0:00';
  }

  accuracyElement.textContent = '100%';
  accuracyElement.classList.remove('red-font');

};