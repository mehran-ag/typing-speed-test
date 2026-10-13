import { startTypingChallenge, updateText, restartTest } from './functions.js';

export const results = {
  personalScore: 0,
  accuracy: 0,
  correct: 0,
  incorrect: 0,
  bestScore: Number(localStorage.getItem('bestScore')) || 0,
  testCounter: Number(localStorage.getItem('testCounter')) || 0
};

/* Hide results panel at first */
document.querySelector('.js-first-result-panel').style.display = 'none';
document.querySelector('.js-results-panel').style.display = 'none';
document.querySelector('.js-achievement-panel').style.display = 'none';

const startButtonElement = document.querySelector('.js-start-typing-btn');

const inputTextElement = document.querySelector('.js-typing-input');

let timer;

document.querySelector('.js-best-score').textContent = results.bestScore;


/* Start the challenge as the user clicks the Start Button */
startButtonElement.addEventListener('click', async () => {
  timer = await startTypingChallenge(results, timer);
});

inputTextElement.addEventListener('input', () => {
  timer = updateText(results, timer);
});

document.querySelector('.js-restart-btn').addEventListener('click', () => {
  restartTest(timer);
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


document.querySelector('.js-beat-score').addEventListener('click', () => {
  document.querySelector('.js-first-result-panel').style.display = 'none';
  document.querySelector('.js-typing-panel').style.display = 'flex';
  restartTest(timer);
});

document.querySelector('.js-go-again').addEventListener('click', () => {
  document.querySelector('.js-achievement-panel').style.display = 'none';
  document.querySelector('.js-typing-panel').style.display = 'flex';
  restartTest(timer);
});

document.querySelector('.js-go-again-results').addEventListener('click', () => {
  document.querySelector('.js-results-panel').style.display = 'none';
  document.querySelector('.js-typing-panel').style.display = 'flex';
  restartTest(timer);
});


document.querySelector('.js-reset-score').addEventListener('click', () => {
  results.bestScore = 0;
  results.testCounter = 0;
  document.querySelector('.js-best-score').textContent = 0;
  localStorage.setItem('bestScore', 0);
  localStorage.setItem('testCounter', 0);
})