import {questions} from "./questions.js";
const nameRegex = /^[a-zA-Z0-9]{3,20}$/;
const form = document.querySelector('form');
const start = document.querySelector('.start');

let score = 0;
let name = "";
let category = "";


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputName = document.querySelector("input[type='text']");
    const categorySelect = document.querySelector('.category-select');

    name = inputName.value;
    category = categorySelect.value;

    if (nameRegex.test(name) && category !== "category") {
        score = 0;
        displayQuestion(0, category);
    } else if(!nameRegex.test(name)){
        alert("Le nom doit contenir entre 3 et 20 caractères (lettres et chiffres uniquement)");
    } else {
        alert("Veuillez sélectionner une catégorie");
    }
});

function displayQuestion(currentQuestionIndex, category) {
    const totalQuestions = questions[category].length;

    if (currentQuestionIndex >= totalQuestions) {
        endGame(totalQuestions, category);
        return;
    }

    start.innerHTML = "";
    start.style.backgroundColor = "";

    let message = name + " ton score est de " + score + " points.";
    start.innerHTML += `<h2 class="col-12 text-primary msg">${message}</h2>`;

    start.innerHTML += `<h3 class="col-12 text-primary">${questions[category][currentQuestionIndex].question}</h3>`;
    start.innerHTML += `<div class="col-12 image"><img src="${questions[category][currentQuestionIndex].image}"></div>`;

    for (let j = 0; j < questions[category][currentQuestionIndex].answers.length; j++) {
        start.innerHTML += `<button class="btn col-12 col-desktop-5 bg-primary">${questions[category][currentQuestionIndex].answers[j]}</button>`;
    }

    const btn = document.querySelectorAll('.btn');

    btn.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            checkAnswer(btn, category, currentQuestionIndex);

            setTimeout(() => {
                currentQuestionIndex++;
                displayQuestion(currentQuestionIndex, category);
            }, 1000);
        });
    });
}

function checkAnswer(btn, category, currentQuestionIndex) {
    let userAnswer = btn.textContent;
    let correctAnswer = questions[category][currentQuestionIndex].correctAnswer;

    const ring = () => {
        const audio = new Audio();
        audio.src ="win.mp3";
        audio.play();
    };

    if(userAnswer !== correctAnswer) {
        start.innerHTML += `<p class="text-warning">Mauvaise réponse !</p>`;
    } else {
        start.innerHTML += `<p class="text-success">Bonne réponse !</p>`;
        ring()
        score++;
    }
}

function endGame(totalQuestions, category) {
    start.innerHTML = "";

    let end = "Quiz terminé ! Score: " + score + "/" + totalQuestions;

    if(score === totalQuestions) {
        start.innerHTML = `<h3 class="col-12 text-primary">${end}</h3><h4 class="col-12 text-primary">Parfait !</h4>`;
    } else if(score > 2 && score < totalQuestions) {
        start.innerHTML = `<h3 class="col-12 text-primary">${end}</h3><h4 class="col-12 text-primary">Tu y étais presque !</h4>`;
    } else {
        start.innerHTML = `<h3 class="col-12 text-primary">${end}</h3><h4 class="col-12 text-primary">Retente ta chance.</h4>`;
    }

    start.innerHTML += `<button class="restart">Rejouer</button>`;

    const previousBest = getBestScore(name);

    if (previousBest && previousBest.score >= score) {
        start.innerHTML += `<p class="col-12 text-primary score">Ton meilleur score: ${previousBest.score}/${totalQuestions}</p>`;
    } else if (previousBest && score > previousBest.score) {
        start.innerHTML += `<p class="col-12 text-primary score">🎉 Nouveau record personnel !</p>`;
    }

    saveScore(name, score);
    localStorage.setItem('lastPlayer', name);

    const restart = document.querySelector(".restart");

    restart.addEventListener('click', () => {
        score = 0;
        displayQuestion(0, category);
    });
}

function saveScore(playerName, playerScore) {
    const gameData = {
        name: playerName,
        score: playerScore,
        date: new Date().toLocaleString()
    };
    localStorage.setItem('quizScore_' + playerName, JSON.stringify(gameData));
}

function getBestScore(playerName) {
    const saved = localStorage.getItem('quizScore_' + playerName);
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}