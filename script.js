const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <span>${task.text}</span>
      <div>
        <button onclick="toggleTask(${index})">✔</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") return;

  tasks.push({
    text: text,
    completed: false
  });

  saveTasks();
  renderTasks();

  taskInput.value = "";
}

function deleteTask(index) {
  tasks.splice(index, 1);

  saveTasks();
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;

  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);

renderTasks();