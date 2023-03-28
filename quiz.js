//quiz Code

const canvasWrapper = document.getElementById("canvasWrapper");
const quizWrapper = document.getElementById("quizWrapper");
const levels = ["easy", "medium", "hard"];
const quizScoreDisplay = document.getElementById("quizScore");
const categoryDisplay = document.getElementById("category");
const enterWallBtn = document.getElementById("WallBtn");
let quizScore = 0;
let cardFlipped = false;
const genre = [
  {
    name: "General Knowledge",
    id: 9,
  },
];

function createCategory() {
  categoryDisplay.innerHTML = genre[0].name;
  levels.forEach((level) => {
    const quizCard = document.createElement("div");
    quizCard.classList.add("quizCard");
    quizWrapper.append(quizCard);
    if (level === "easy") {
      quizCard.innerHTML = 100;
    }
    if (level === "medium") {
      quizCard.innerHTML = 200;
    }
    if (level === "hard") {
      quizCard.innerHTML = 300;
    }

    fetch(
      `https://opentdb.com/api.php?amount=1&category=9&difficulty=${level}&type=boolean`
    )
      .then((response) => response.json())
      .then((data) => {
        quizCard.setAttribute("data-question", data.results[0].question);
        quizCard.setAttribute("data-answer", data.results[0].correct_answer);
        quizCard.setAttribute("data-value", quizCard.getInnerHTML());
      })
      .then((done) => quizCard.addEventListener("click", flipCard));
  });
}
createCategory();

function flipCard() {
  this.innerHTML = " ";
  this.style.fontSize = "15px";
  const textDisplay = document.createElement("div");
  const trueBtn = document.createElement("button");
  const falseBtn = document.createElement("button");
  trueBtn.innerHTML = "True";
  trueBtn.classList.add("trueBtn");
  falseBtn.innerHTML = "False";
  falseBtn.classList.add("falseBtn");
  textDisplay.innerHTML = this.getAttribute("data-question");

  trueBtn.addEventListener("click", getResult);
  falseBtn.addEventListener("click", getResult);
  this.append(textDisplay, trueBtn, falseBtn);

  const allQuizCards = Array.from(document.querySelectorAll(".quizCard"));
  allQuizCards.forEach((card) => card.removeEventListener("click", flipCard));
}

function getResult() {
  const allCards = Array.from(document.querySelectorAll(".quizCard"));
  allCards.forEach((card) => card.addEventListener("click", flipCard));

  const cardOfBtn = this.parentElement;
  if (cardOfBtn.getAttribute("data-answer") === this.innerHTML) {
    cardFlipped = true;
    quizScore = quizScore + parseInt(cardOfBtn.getAttribute("data-value"));
    quizScoreDisplay.innerHTML = quizScore;
    cardOfBtn.classList.add("correctAnswer");
    setTimeout(() => {
      while (cardOfBtn.firstChild) {
        cardOfBtn.removeChild(cardOfBtn.lastChild);
      }
      cardOfBtn.innerHTML = cardOfBtn.getAttribute("data-value");
    }, 100);
  } else {
    cardFlipped = false;
    cardOfBtn.classList.add("wrongAnswer");
    setTimeout(() => {
      while (cardOfBtn.firstChild) {
        cardOfBtn.removeChild(cardOfBtn.lastChild);
      }
      cardOfBtn.innerHTML = 0;
    }, 100);
  }
  cardOfBtn.removeEventListener("click", flipCard);
}

enterWallBtn.addEventListener("click", function (e) {
   e.preventDefault();
  if (cardFlipped) {
    quizWrapper.classList.add("inactive");
    cardFlipped = false
  }
});
