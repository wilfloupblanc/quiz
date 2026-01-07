const inputName = document.querySelector("input[type='text']");
const nameRegex = /^[a-zA-Z0-9]{3,20}$/;
const form = document.querySelector('form');
const start = document.querySelector('.start')

let score = 0;
let name = "";

let questions = [
    {
        question: "Quel est ce cours ?",
        answers: [
            "Javascript",
            "PHP",
            "HTML",
            "CSS"
        ],
        correctAnswer: "Javascript",
    },

    {
        question: "Quelle est la capitale de la Suisse ?",
        answers: [
            "Berne",
            "Zurich",
            "Paris",
            "Genève"
        ],
        correctAnswer: "Berne"
    },

    {
        question: "Aime-t-on la neige ?",
        answers: [
            "Oui",
            "Non",
            "Stop SVP",
            "La mer Noire"
        ],
        correctAnswer: "La mer Noire"
    },

    {
        question: "Quelle est la bonne écriture de ce mot ?",
        answers: [
            "Matiu Petiu",
            "Matchu Pitchu",
            "Machtu Pichtu",
            "Bob"
        ],
        correctAnswer: "Matchu Pitchu"
    },

    {
        question: "Quel est le meilleur circuit de GT3 ?",
        answers: [
            "Fuji",
            "Bahreïn",
            "Le Mans",
            "Portimão"
        ],
        correctAnswer: "Le Mans"
    }
]


inputName.addEventListener("input", (e) => {
    name = e.target.value;

});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (nameRegex.test(name)) {
        let currentQuestionIndex = 0;
        displayQuestion(currentQuestionIndex);
    } else {
        alert("Le nom doit contenir entre 3 et 20 caractères (lettres et chiffres uniquement)");
    }
});

function displayQuestion(currentQuestionIndex) {
    start.innerHTML = "";
    start.style.backgroundColor = "";

    window.addEventListener('DOMContentLoaded', () => {
        const lastPlayer = localStorage.getItem('lastPlayer');
        if (lastPlayer !== null) {
            const bestScore = getBestScore(lastPlayer);
            if (bestScore !== null) {
                const welcome = document.createElement('p');
                welcome.textContent = `Bienvenue ${bestScore.name} ! Dernier score: ${bestScore.score}/${questions.length}`;
                welcome.style.color = '#666';
                start.prepend(welcome);
            }
        }
    });

    let message = name + " ton score est de " + score + " points.";
    start.innerHTML += `<h2 class="col-12 text-primary msg">${message}</h2>`;


    endGame(currentQuestionIndex);

    start.innerHTML += `<h3 class="col-12 text-primary">${questions[currentQuestionIndex].question} </h3>`;

    for (let j = 0; j < questions[currentQuestionIndex].answers.length; j++) {
        start.innerHTML += `<button class="btn col-5 bg-primary">${questions[currentQuestionIndex].answers[j]}</button>`;
    }

    const btn = document.querySelectorAll('.btn');

    btn.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            checkAnswer(btn, currentQuestionIndex);

            setTimeout(() => {
                currentQuestionIndex++;
                displayQuestion(currentQuestionIndex);
            }, 1000);
        })
    })

}

function checkAnswer(btn, currentQuestionIndex) {
    let userAnswer = btn.textContent;
    let correctAnswer = questions[currentQuestionIndex].correctAnswer;

    if(userAnswer !== correctAnswer) {
        start.innerHTML += `<p class="text-warning">Mauvaise réponse !</p>`
    } else {
        start.innerHTML += `<p class="text-success">Bonne réponse !</p>`
        score++;
    }
}

function endGame(currentQuestionIndex) {
    if (currentQuestionIndex >= questions.length) {
        start.innerHTML = "";

        let end = "Quiz terminé ! Score: " + score + "/" + questions.length;


        if(score === questions.length) {
            start.innerHTML = `<h3 class="col-12 text-primary">${end}</h3>` + `<h4 class="col-12 text-primary">Parfait !</h4>`;
        } else if(score > 2 && score < questions.length) {
            start.innerHTML = `<h3 class="col-12 text-primary">${end}</h3>` + `<h4 class="col-12 text-primary">Tu y étais presque !</h4>`;
        } else {
            start.innerHTML = `<h3 class="col-12 text-primary">${end}</h3>` + `<h4 class="col-12 text-primary">Retente ta chance.</h4>`;
        }

        start.innerHTML += `<button class="restart">Rejouer</button>`;

        const previousBest = getBestScore(name);

        if (previousBest && previousBest.score >= score) {
            start.innerHTML += `<p class="col-12 text-primary score">Ton meilleur score: ${previousBest.score}/${questions.length}</p>`;
            console.log(previousBest.score);
        } else if (previousBest && score > previousBest.score) {
            start.innerHTML += `<p class="col-12 text-primary score">🎉 Nouveau record personnel !</p>`;
        }

        saveScore(name, score);
        localStorage.setItem('lastPlayer', name);

        console.log(previousBest.score);

        const restart = document.querySelector(".restart");

        restart.addEventListener('click', () => {
            currentQuestionIndex = 0;
            score = 0
            displayQuestion(currentQuestionIndex);
        })
    }
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





