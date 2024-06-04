let words = [];
let usedWords = [];
let selectedWord = "";
let missingLetterIndex = 1;
let correctScore = 0;
let incorrectScore = 0;
let timer;

async function loadWords() {
  try {
    const response = await fetch("words.json");
    const data = await response.json();
    words = data.words;
    selectWord();
  } catch (error) {
    console.error("Error loading words:", error);
  }
}

function selectWord() {
  if (usedWords.length === words.length) {
    alert("All words have been used! Resetting the game.");
    usedWords = [];
  }

  do {
    selectedWord = words[Math.floor(Math.random() * words.length)];
  } while (usedWords.includes(selectedWord));

  usedWords.push(selectedWord);
  displayWord();
}

function displayWord() {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  for (let i = 0; i < selectedWord.length; i++) {
    if (i === missingLetterIndex) {
      wordContainer.innerHTML += `<div class="letter-box empty">?</div>`;
    } else {
      wordContainer.innerHTML += `<div class="letter-box">${selectedWord[i]}</div>`;
    }
  }
}

function updateScore(isCorrect) {
  if (isCorrect) {
    correctScore++;
    document.getElementById("correct-score").textContent = correctScore;
  } else {
    incorrectScore++;
    document.getElementById("incorrect-score").textContent = incorrectScore;
  }
}

function checkGuess() {
  const guess = document.getElementById("guess").value.toUpperCase();
  const result = document.getElementById("result");
  if (guess === selectedWord[missingLetterIndex]) {
    result.textContent = "Correct! Generating a new word...";
    updateScore(true);
    setTimeout(() => {
      selectWord();
      result.textContent = "";
      document.getElementById("guess").value = "";
    }, 10);
  } else {
    result.textContent = "Try again!";
    updateScore(false);
    document.getElementById("guess").value = "";
  }
}

function restartGame() {
  clearInterval(timer);
  correctScore = 0;
  incorrectScore = 0;
  document.getElementById("correct-score").textContent = correctScore;
  document.getElementById("incorrect-score").textContent = incorrectScore;
  selectWord();
  startTimer();
}

function startTimer() {
  let seconds = 300; // 5 minutes
  timer = setInterval(() => {
    seconds--;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById("timer").textContent = `${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
    if (seconds === 0) {
      clearInterval(timer);
      endGame(); // Oyun bittiğinde endGame fonksiyonunu çağır
    }
  }, 1000);
}

function endGame() {
  clearInterval(timer); // Zamanlayıcıyı durdur

  // Skor tablosunu oluştur
  const scoreMessage = `Game Over!\nCorrect Guesses: ${correctScore}\nIncorrect Guesses: ${incorrectScore}`;

  // Skor tablosunu kullanıcıya alert ile göster
  alert(scoreMessage);

  // Kelime kartını, tahmin girişini, gönderme düğmesini ve sonuç mesajını gizle
  document.getElementById("word-container").style.display = "none";
  document.getElementById("guess").style.display = "none";
  document.getElementById("submit-button").style.display = "none";
  document.getElementById("result").style.display = "none";

  // Skor tablosunu ve yeniden başlatma düğmelerini gizle
  document.querySelector(".score-board").style.display = "none";
  document.querySelector(".restart").style.display = "none";

  // Başlatma düğmesini göster
  document.getElementById("start-button").style.display = "block";
}

function startGame() {
  // Yeniden başlatma işlemleri
  clearInterval(timer); // Zamanlayıcıyı durdur
  correctScore = 0; // Doğru tahminleri sıfırla
  incorrectScore = 0; // Yanlış tahminleri sıfırla
  document.getElementById("correct-score").textContent = correctScore; // Doğru tahminlerin görüntüsünü güncelle
  document.getElementById("incorrect-score").textContent = incorrectScore; // Yanlış tahminlerin görüntüsünü güncelle
  selectWord(); // Yeni kelime seç
  startTimer(); // Zamanlayıcıyı yeniden başlat

  // Oyun başladığında gerekli bileşenleri göster, diğerlerini gizle
  document.getElementById("word-container").style.display = "block";
  document.getElementById("guess").style.display = "block";
  document.getElementById("submit-button").style.display = "block";
  document.getElementById("result").style.display = "block";
  document.querySelector(".score-board").style.display = "block";
  document.querySelector(".restart").style.display = "block";
  document.getElementById("start-button").style.display = "none";
}

loadWords();
startTimer();
