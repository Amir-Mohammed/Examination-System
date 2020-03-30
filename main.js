////////////////////////////////////Function Constructor For Questions/////////////////////////////
var Question = function(questionHead, choices, correctAnswer) {
  this.questionHead = questionHead;
  this.choices = choices;
  this.correctAnswer = correctAnswer;
};

var q1 = new Question(
  "This is a good athlete ______ performance is admired by the audiences.",
  ["A. Who", "B. that", "C. whose", "D. whom"],
  2
);
var q2 = new Question(
  "All payments to the ICRC are __________ and are received as donations.",
  ["A. volunteer", "B. voluntary", "C. voluntarily", "D. voluntariness"],
  2
);
var q3 = new Question(
  "One of the tasks of the Red Cross is also to support local __________ care projects.",
  ["A. health", "B. healthy", "C. healthful", "D. healthily"],
  0
);
var q4 = new Question(
  "The World Health Organization is the United Nations agency for __________ health.",
  ["A. a", "B. an", "C. the", "D. X"],
  3
);
var q5 = new Question(
  "The International Red Cross and Red Crescent __________ occurs once every four years.",
  ["A. Globe", "B. Society", "C. Conference", "D. Nations"],
  2
);
var questions = [q1, q2, q3, q4, q5];

/////////////////////////////////Function To Generate Array Of Random Questions////////////////////////
function generateQuestions(arr, num) {
  var randomQuestions = [];
  var randNum;
  while (randomQuestions.length < num) {
    randNum = Math.floor(Math.random() * arr.length);
    if (randomQuestions.indexOf(arr[randNum]) === -1) {
      randomQuestions.push(arr[randNum]);
    }
  }
  return randomQuestions;
}
var generatedQuestions = generateQuestions(questions, 5);

////////////////////////////////Function To Update In The UI////////////////////////////////////////////////
var currentQuestion = 0;
var answers = [];
var header = document.querySelector(".heading-tertiary--quiz");
var inputs = document.querySelectorAll(".form__radio-input");
var textNumber = document.querySelector(".question-box__number");
var previousButton = document.querySelector(".previous");
var forwardButton = document.querySelector(".forward");

function displayQuestion(num) {
  header.textContent = generatedQuestions[num]["questionHead"];
  for (let i = 0; i < inputs.length; i++) {
    document.querySelector("#answer-" + i).nextElementSibling.innerHTML =
      '<span class="form__radio-button"></span>' +
      generatedQuestions[num]["choices"][i];

    if (answers[num] == undefined) {
      document.querySelector("#answer-" + i).checked = false;
    } else if (answers[num] === i) {
      document.querySelector("#answer-" + i).checked = true;
    }
  }
  textNumber.textContent = num + 1 + " / " + generatedQuestions.length;
  for (let i = 0; i < generatedQuestions.length; i++) {
    if (num === 0) {
      previousButton.classList.add("hide");
      forwardButton.classList.remove("hide");
    } else if (num === generatedQuestions.length - 1) {
      forwardButton.classList.add("hide");
      previousButton.classList.remove("hide");
    } else {
      forwardButton.classList.remove("hide");
      previousButton.classList.remove("hide");
    }
  }
}
displayQuestion(0);

/////////////////////////////////////////Function To Turn Questions///////////////////////////
function turnQuestion(num) {
  answers[currentQuestion] = getData();
  if (answers[currentQuestion] == undefined) {
    markQuestion();
  }
  currentQuestion += num;
  displayQuestion(currentQuestion);
}
////////////////////////Function To Get Choosen Answers///////////////////////////////
function getData() {
  var choosenAnswer;
  for (let i = 0; i < inputs.length; i++) {
    if (document.querySelector("#answer-" + i).checked) {
      choosenAnswer = Number(document.querySelector("#answer-" + i).value);
      break;
    } else {
      choosenAnswer = undefined;
    }
  }
  return choosenAnswer;
}
////////////////////////////Mark Questions//////////////////////////////
var markedQuestions = [];
function markQuestion() {
  markBox = document.querySelector(".mark-box");
  if (markedQuestions.indexOf(currentQuestion) == -1) {
    markedQuestions.push(currentQuestion);
    markBox.insertAdjacentHTML(
      "beforeend",
      '<button onclick="turnMArkedQuestions(' +
        currentQuestion +
        ')" class="zocial klout u-margin-bottom-small">Question No (' +
        (currentQuestion + 1) +
        ")</a>"
    );
  }
}
function turnMArkedQuestions(number) {
  answers[currentQuestion] = getData();
  currentQuestion = number;
  displayQuestion(currentQuestion);
}

///////////////////////////////////////Function To Get Results//////////////////////////
function getResults(answers) {
  var result = 0;
  for (let i = 0; i < generatedQuestions.length; i++) {
    if (answers[i] === generatedQuestions[i].correctAnswer) {
      result += (1 / generatedQuestions.length) * 100;
    }
  }
  return result;
}
////////////////////////////////////////Finishing Exam/////////////////////////////////////
function finish(flag) {
  answers[currentQuestion] = getData();
  if (flag) {
    if (!window.confirm("Are you sure you want to finish your exam?")) {
      return;
    }
  }
  var result = getResults(answers);
  var popup = document.querySelector(".popup");
  var img = document.querySelector(".popup__img");
  var heading = document.querySelector(".popup__heading");
  var text = document.querySelector(".popup__text");
  document.querySelector(".btn--finish").style.display = "none";
  document.querySelector(".btn--mark").style.display = "none";
  document.querySelector(".navbar__timer").classList.remove("timer");

  clearInterval(time);
  var timeSpent = getTimeSpent();

  if (result >= 50) {
    popup.classList.add("popup--success");
    img.src = "img/pass.png";
    heading.innerHTML = "Congratulations &ndash; You have passed the exam";
    text.innerHTML =
      "You scored " + result + "% " + "<br>" + "Time spent is " + timeSpent;
  } else {
    popup.classList.add("popup--fail");
    img.src = "img/fail.png";
    heading.innerHTML = "Sorry &ndash; You have failed the exam";
    text.innerHTML =
      "You scored " + result + "% " + "<br>" + "Time spent is " + timeSpent;
  }
}

//////////////////////////////////////Timer Function//////////////////////////////////////
var startTime = document.querySelector(".navbar__timer").innerHTML;
function startTimer() {
  var timer = document.querySelector(".navbar__timer").innerHTML;
  var arr = timer.split(":");
  var hour = arr[0];
  var min = arr[1];
  var sec = arr[2];
  if (sec == 0) {
    if (min == 0) {
      if (hour == 0) {
        document.querySelector(".navbar__timer").classList.remove("timer");
        alert("time - out");
        finish(false);
        return;
      }
      hour--;
      min = 60;
      if (hour < 10) {
        hour = "0" + hour;
      }
    }
    min--;
    sec = 59;
    if (min < 10) {
      min = "0" + min;
    }
  } else {
    sec--;
    if (sec < 10) {
      sec = "0" + sec;
    }
  }
  document.querySelector(".navbar__timer").innerHTML =
    hour + ":" + min + ":" + sec;
  if ((min == 1) & (hour == 0) & (sec == 0)) {
    document.querySelector(".navbar__timer").classList.add("timer");
  }
  return timer;
}
time = setInterval(startTimer, 1000);

///////////////////////////Function to Get Time Spent///////////////////////////////////
function getTimeSpent() {
  var t = document.querySelector(".navbar__timer").innerHTML;
  startTime = startTime.split(":");
  endTime = t.split(":");
  startTimeValue =
    Number(startTime[0]) * 3600 +
    Number(startTime[1]) * 60 +
    Number(startTime[2]);
  endTimeValue =
    Number(endTime[0]) * 3600 + Number(endTime[1]) * 60 + Number(endTime[2]);
  timeSpentValue = startTimeValue - endTimeValue;
  var date = new Date(null);
  date.setSeconds(timeSpentValue);
  var timeString = date.toISOString().substr(11, 8);
  return timeString;
}
