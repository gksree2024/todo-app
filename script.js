const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const remainingCount = document.getElementById("remainingCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter((task) => !task.completed);
  }
  if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }
  return tasks;
}

function updateTaskCount() {
  const activeCount = tasks.filter((task) => !task.completed).length;
  remainingCount.textContent = activeCount;
}

function renderTasks() {
  const visibleTasks = getFilteredTasks();
  taskList.innerHTML = "";

  if (visibleTasks.length === 0) {
    emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
  } else {
    emptyMessage.style.display = "none";
  }

  visibleTasks.forEach((task) => {
    const index = tasks.indexOf(task);
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <span>${task.text}</span>
      <div class="actions">
        <button onclick="toggleTask(${index})" title="Toggle complete">✔</button>
        <button onclick="editTask(${index})" title="Edit task">✎</button>
        <button onclick="deleteTask(${index})" title="Delete task">❌</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateTaskCount();
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") return;

  tasks.push({
    text: text,
    completed: false,
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
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

function editTask(index) {
  const newText = prompt("Edit task", tasks[index].text);
  if (newText === null) return;

  const trimmedText = newText.trim();
  if (trimmedText === "") return;

  tasks[index].text = trimmedText;
  saveTasks();
  renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

function updateFilter(event) {
  filterButtons.forEach((button) => button.classList.remove("active"));
  event.currentTarget.classList.add("active");
  currentFilter = event.currentTarget.dataset.filter;
  renderTasks();
}

addBtn.addEventListener("click", addTask);
clearCompletedBtn.addEventListener("click", clearCompletedTasks);
filterButtons.forEach((button) => button.addEventListener("click", updateFilter));

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

renderTasks();