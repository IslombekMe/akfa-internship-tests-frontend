let progressBar = document.querySelector(".e-c-progress");
let indicator = document.getElementById("e-indicator");
let pointer = document.getElementById("e-pointer");
let length = Math.PI * 2 * 100;

progressBar.style.strokeDasharray = length;

function update(value, timePercent) {
  if (screen.width < 1000) {
    var offset = -length - (length * value) / timePercent;
    progressBar.style.strokeDashoffset = offset;
    pointer = document.getElementById("mobile-countdown");
    pointer.style.width = (value / timePercent) * 100 + "%";
  } else {
    var offset = -length - (length * value) / timePercent;
    progressBar.style.strokeDashoffset = offset;
    pointer.style.transform = `rotate(${(360 * value) / timePercent}deg)`;
  }
}

//circle ends
const displayOutput = document.querySelector(".display-remain-time");
const pauseBtn = document.getElementById("pause");
const setterBtns = document.querySelectorAll("button[data-setter]");

let intervalTimer;
let timeLeft;
let wholeTime = 900; // manage this to set the whole time
let isPaused = false;
let isStarted = false;

update(wholeTime, wholeTime); //refreshes progress bar
displayTimeLeft(wholeTime);

function changeWholeTime(seconds) {
  if (wholeTime + seconds > 0) {
    wholeTime += seconds;
    update(wholeTime, wholeTime);
  }
}

for (var i = 0; i < setterBtns.length; i++) {
  setterBtns[i].addEventListener("click", function(event) {
    var param = this.dataset.setter;
    switch (param) {
      case "minutes-plus":
        changeWholeTime(1 * 60);
        break;
      case "minutes-minus":
        changeWholeTime(-1 * 60);
        break;
      case "seconds-plus":
        changeWholeTime(1);
        break;
      case "seconds-minus":
        changeWholeTime(-1);
        break;
    }
    displayTimeLeft(wholeTime);
  });
}

function timer(seconds) {
  //counts time, takes seconds
  let remainTime = Date.now() + seconds * 1000;
  displayTimeLeft(seconds);

  intervalTimer = setInterval(function() {
    timeLeft = Math.round((remainTime - Date.now()) / 1000);
    if (timeLeft < 0) {
      clearInterval(intervalTimer);
      isStarted = false;
      setterBtns.forEach(function(btn) {
        btn.disabled = false;
        btn.style.opacity = 1;
      });
      displayTimeLeft(wholeTime);
      $("#thanks-modal").iziModal("open");
      return;
    }
    displayTimeLeft(timeLeft);
  }, 1000);
}
function pauseTimer(event) {
  if (isStarted === false) {
    timer(wholeTime);
    isStarted = true;

    setterBtns.forEach(function(btn) {
      btn.disabled = true;
      btn.style.opacity = 0.5;
    });
  } else if (isPaused) {
    this.classList.remove("play");
    this.classList.add("pause");
    timer(timeLeft);
    isPaused = isPaused ? false : true;
  } else {
    this.classList.remove("pause");
    this.classList.add("play");
    clearInterval(intervalTimer);
    isPaused = isPaused ? false : true;
  }
}

function displayTimeLeft(timeLeft) {
  //displays time on the input
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  if (screen.width < 1000) {
    let displayString = `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    let displayOutput = document.getElementById("mobile-minute");
    displayOutput.textContent = displayString;
    update(timeLeft, wholeTime);
  } else {
    let displayString = `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    displayOutput.textContent = displayString;
    update(timeLeft, wholeTime);
  }
}

window.onload = function() {
  pauseTimer();
  removeLoader();
};

function removeLoader() {
  $(".preloader").remove();
}

for (let i = 0; i < questions.length; i++) {
  const questionObj = questions[i];
  const image = questionObj.image
    ? `<img src="${questionObj.image}" class="question-img">`
    : "";
  let answers = "";

  console.log(questionObj.answers);

  for (const answerKey in questionObj.answers) {
    answers += `<div class="answer">
      <input type="radio" class="answer-radio" name="${questionObj.id}" value="${answerKey}" id="${questionObj.id}">
      <label for="${questionObj.id}">${questionObj.answers[answerKey]}</label>
    </div>`;
  }

  $(".test-wrapper").append(
    `<div class="test">
      <div class="order-numbers">
          <p class="order-number">1</p>
      </div>
      <div class="question">
          
          <p> ${questionObj.question}</p> 
          
          ${image}
          
          <div class="answers">
              ${answers}
          </div>
      </div>
    </div>`
  );
}

// pauseBtn.addEventListener('click',pauseTimer);
