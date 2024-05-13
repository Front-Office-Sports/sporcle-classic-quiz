let interval;
let score = 0;
const answered = [];

questions.forEach((question, index) => {
  question.rowIndex = index;
});

document.getElementById("max-score").textContent = questions.length;

populateHints();

function populateHints() {
  const tableBody = document.getElementById("correct-answers");
  questions.forEach((question) => {
    const row = tableBody.insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    cell1.innerHTML = '<span class="answer"></span>';
    cell2.textContent = question.hint;
  });
}

function startQuiz() {
  var startButton = document.getElementById("start-button");
  var userInput = document.getElementById("answer-input");

  startButton.classList.add("d-none");
  userInput.classList.remove("d-none");
  userInput.focus(); // Automatically focus on the text field

  // Additional actions specific to starting the quiz can be added here
  interval = setInterval(countdown, 1000); // Start countdown timer, etc.
}

// Listen for input and check if answer is correct
document.getElementById("answer-input").addEventListener("input", checkAnswer);

// Listen for enter key and check if answer is correct
document
  .getElementById("answer-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      checkAnswer();
    }
  });

function checkAnswer() {
  const userInput = document.getElementById("answer-input").value;
  const inputBox = document.getElementById("answer-input");
  const lowerCaseUserInput = userInput.toLowerCase();

  const question = questions.find((q) => {
    const answerWords = q.answer.split(" ");
    const lastWord = answerWords[answerWords.length - 1].toLowerCase();
    return (
      q.answer.toLowerCase() === lowerCaseUserInput ||
      lastWord === lowerCaseUserInput
    );
  });

  if (question && !answered.includes(question.answer)) {
    inputBox.style.backgroundColor = "#90EE90"; // change border color to green

    setTimeout(() => {
      inputBox.style.backgroundColor = "white"; // revert to original color after 0.5 seconds
    }, 500);

    answered.push(question.answer); // Store the correct case answer
    score++;
    document.getElementById("current-score").textContent = score;

    // Populate the answer directly based on rowIndex
    document.querySelectorAll(".answer")[question.rowIndex].textContent =
      question.answer;

    if (score === questions.length) {
      endQuiz("won");
    }

    document.getElementById("answer-input").value = "";
  }
}

function countdown() {
  const timeElement = document.getElementById("time-left");
  const currentTime = parseInt(timeElement.textContent);
  if (currentTime > 0) {
    timeElement.textContent = currentTime - 1;
  } else {
    endQuiz("timeout");
  }
}

function endQuiz(reason) {
  clearInterval(interval);
  document.getElementById("answer-input").disabled = true;

  // Populate the table with answers not filled in
  const tableRows = document.querySelectorAll(".answer");
  for (let i = 0; i < tableRows.length; i++) {
    if (tableRows[i].textContent === "") {
      tableRows[i].textContent = questions[i].answer;
      tableRows[i].style.color = "red";
    }
  }

  // set the score message
  let score_message = `Your score is ${score}/${questions.length}.`;

  if (reason === "timeout") {
    reason_message = `Time's up!`;
  } else if (reason === "won") {
    reason_message = `Congratulations, you won!`;
  } else if (reason === "giveup") {
    reason_message = `You gave up!`;
  }

  // Update the score value
  document.getElementById("scoreValue").innerText = score_message;

  // Update gameOverModalLabel
  document.getElementById("gameOverModalLabel").innerText = reason_message;

  // Show the modal
  $("#gameOverModal").modal("show");

  // // Call displayGameOver after a delay (simulating game over)
  // setTimeout(() => {
  //   const score = 100; // Replace with your actual score
  //   displayGameOver(score);
  // }, 100); // Delay alert by 100ms to give DOM time to update
}
