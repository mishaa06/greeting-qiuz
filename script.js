
let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer = null;
let answerSubmitted = false;

const welcomeBox = document.getElementById("welcomeBox");
const quizBox = document.getElementById("quizBox");
const resultBox = document.getElementById("resultBox");
const thankYouBox = document.getElementById("thankYouBox");

const startBtn = document.getElementById("startBtn");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const timerElement = document.getElementById("timer");
const feedbackElement = document.getElementById("feedback");
const scoreElement = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const questionCount = document.getElementById("questionCount");
const progressBar = document.getElementById("progressBar");

const resultHeading = document.getElementById("resultHeading");
const finalScore = document.getElementById("finalScore");
const reviewMessage = document.getElementById("reviewMessage");

const playAgainBtn = document.getElementById("playAgainBtn");
const exitBtn = document.getElementById("exitBtn");

const quizHomeBtn = document.getElementById("quizHomeBtn");
const resultHomeBtn = document.getElementById("resultHomeBtn");
const thankYouHomeBtn = document.getElementById("thankYouHomeBtn");

// Button events
startBtn.addEventListener("click", startQuiz);
playAgainBtn.addEventListener("click", startQuiz);

quizHomeBtn.addEventListener("click", returnToWelcome);
resultHomeBtn.addEventListener("click", returnToWelcome);
thankYouHomeBtn.addEventListener("click", returnToWelcome);

exitBtn.addEventListener("click", showThankYou);

nextBtn.addEventListener("click", () => {
    currentQuestion++;
    loadQuestion();
});

// Start Quiz
function startQuiz() {
    clearInterval(timer);

    currentQuestion = 0;
    score = 0;
    answerSubmitted = false;

    scoreElement.textContent = score;

    welcomeBox.hidden = true;
    resultBox.hidden = true;
    thankYouBox.hidden = true;
    quizBox.hidden = false;

    loadQuestion();
}

// Load Question
async function loadQuestion() {
    clearInterval(timer);

    answerSubmitted = false;
    timeLeft = 30;

    timerElement.textContent = timeLeft;
    feedbackElement.textContent = "";
    optionsElement.innerHTML = "";
    nextBtn.hidden = true;

    try {
        const response = await fetch(`/get_question?index=${currentQuestion}`);

        if (!response.ok) {
            throw new Error("Question could not be loaded.");
        }

        const data = await response.json();

        if (data.finished) {
            showResult();
            return;
        }

        questionElement.textContent = data.question;

        questionCount.textContent =
            `Question ${data.question_number} of ${data.total_questions}`;

        progressBar.style.width =
            `${(data.question_number / data.total_questions) * 100}%`;

        data.options.forEach(option => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "option-btn";
            button.textContent = option;

            button.addEventListener("click", () => checkAnswer(option));

            optionsElement.appendChild(button);
        });

        startTimer();

    } catch (error) {
        feedbackElement.textContent =
            "Unable to load question. Please refresh and try again.";

        console.error(error);
    }
}

// Timer
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null);
        }
    }, 1000);
}

// Check Answer
async function checkAnswer(selectedAnswer) {
    if (answerSubmitted) return;

    answerSubmitted = true;
    clearInterval(timer);

    const buttons = optionsElement.querySelectorAll("button");

    buttons.forEach(button => {
        button.disabled = true;
    });

    try {
        const response = await fetch("/check_answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question_index: currentQuestion,
                answer: selectedAnswer
            })
        });

        if (!response.ok) {
            throw new Error("Answer could not be checked.");
        }

        const data = await response.json();

        if (data.correct) {
            score++;
            feedbackElement.textContent = "Correct Answer! 🎉";
        } else {
            feedbackElement.textContent = selectedAnswer === null
                ? "Time's Up!"
                : "Wrong Answer!";

            buttons.forEach(button => {
                if (button.textContent === data.correct_answer) {
                    button.classList.add("correct");
                }
            });
        }

        buttons.forEach(button => {
            if (button.textContent === selectedAnswer) {
                button.classList.add(data.correct ? "correct" : "wrong");
            }
        });

        scoreElement.textContent = score;

        nextBtn.textContent =
            currentQuestion === 9 ? "View Review" : "Next Question";

        nextBtn.hidden = false;

    } catch (error) {
        feedbackElement.textContent =
            "Something went wrong. Please try again.";

        console.error(error);
    }
}

// Show Review
function showResult() {
    clearInterval(timer);

    quizBox.hidden = true;
    resultBox.hidden = false;

    resultHeading.textContent = "YOUR QUIZ REVIEW";
    finalScore.textContent = `Your Score: ${score} / 10`;

    if (score <= 4) {
        reviewMessage.textContent = "You Can Do Better!";
    } else if (score === 5) {
        reviewMessage.textContent = "Average";
    } else if (score <= 8) {
        reviewMessage.textContent = "Good!";
    } else if (score === 9) {
        reviewMessage.textContent = "Excellent!";
    } else {
        reviewMessage.textContent = "You're a Genius!";
    }
}

// Exit - Show Thank You Page
function showThankYou() {
    clearInterval(timer);

    quizBox.hidden = true;
    resultBox.hidden = true;
    welcomeBox.hidden = true;

    thankYouBox.hidden = false;
}

// Return to Home
function returnToWelcome() {
    clearInterval(timer);

    currentQuestion = 0;
    score = 0;
    timeLeft = 30;
    answerSubmitted = false;

    quizBox.hidden = true;
    resultBox.hidden = true;
    thankYouBox.hidden = true;
    welcomeBox.hidden = false;

    scoreElement.textContent = "0";
    timerElement.textContent = "30";
    feedbackElement.textContent = "";
    optionsElement.innerHTML = "";
    questionElement.textContent = "Question will appear here";

    questionCount.textContent = "Question 1 of 10";
    progressBar.style.width = "0%";

    nextBtn.hidden = true;
}
