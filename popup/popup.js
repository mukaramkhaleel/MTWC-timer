let tasks = [];

function updateTimer() {
  chrome.storage.local.get(["timer", "timeOption"], (res) => {
    const time = document.getElementById("time");
    const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(
      2,
      "0"
    );
    let seconds = "00";
    if (res.timer % 60 != 0) {
      seconds = `${60 - (res.timer % 60)}`.padStart(2, "0");
    }

    time.textContent = `${minutes}:${seconds}`;
  });
}

updateTimer();
setInterval(updateTimer, 1000);

const startTimerButton = document.getElementById("start-timer-button");
startTimerButton.addEventListener("click", () => {
  chrome.storage.local.get(["isRunning"], (res) => {
    chrome.storage.local.set(
      {
        isRunning: !res.isRunning,
      },
      () => {
        startTimerButton.textContent = !res.isRunning
          ? "Pause Timer"
          : "Start Timer";
      }
    );
  });
});

const resetTimerButton = document.getElementById("reset-timer-button");
resetTimerButton.addEventListener("click", () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      startTimerButton.textContent = "Start Timer";
    }
  );
});

const addTaskButton = document.getElementById("add-task-button");
addTaskButton.addEventListener("click", () => addTask());

chrome.storage.sync.get(["tasks"], (res) => {
  tasks = res.tasks ? res.tasks : [];
  renderTasks();
});

function saveTasks() {
  chrome.storage.sync.set({
    tasks,
  });
}

function renderTask(taskNumber) {
  const taskRow = document.createElement("div");

  const taskName = document.createElement("input");
  taskName.type = "text";
  taskName.placeholder = "Enter the task name";
  taskName.value = tasks[taskNumber];
  taskName.addEventListener("change", () => {
    tasks[taskNumber] = taskName.value;
    saveTasks();
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.addEventListener("click", () => {
    deleteTask(taskNumber);
  });

  taskRow.appendChild(taskName);
  taskRow.appendChild(deleteButton);

  const taskContainer = document.getElementById("task-container");
  taskContainer.appendChild(taskRow);
}

function addTask() {
  const taskNumber = tasks.length;
  tasks.push("");
  renderTask(taskNumber);
  saveTasks();
}

function deleteTask(taskNumber) {
  tasks.splice(taskNumber, 1);
  renderTasks();
  saveTasks();
}

function renderTasks() {
  const taskContainer = document.getElementById("task-container");
  taskContainer.textContent = "";
  tasks.forEach((taskText, taskNumber) => {
    renderTask(taskNumber);
  });
}
