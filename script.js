const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDateInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const remainingCount = document.getElementById("remainingCount");
const completedCount = document.getElementById("completedCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyMessage = document.getElementById("emptyMessage");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let theme = localStorage.getItem("theme") || "dark";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveTheme() {
  localStorage.setItem("theme", theme);
  document.body.classList.toggle("light-theme", theme === "light");
  themeToggle.textContent = theme === "light" ? "Dark mode" : "Light mode";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function isOverdue(dateString) {
  if (!dateString) return false;
  const due = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due < today;
}

function getFilteredTasks() {
  return tasks
    .map((task, index) => ({ ...task, index }))
    .filter((task) => {
      if (currentFilter === "active") return !task.completed;
      if (currentFilter === "completed") return task.completed;
      return true;
    });
}

function updateTaskCount() {
  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCountValue = tasks.filter((task) => task.completed).length;
  remainingCount.textContent = activeCount;
  completedCount.textContent = completedCountValue;
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
    const li = document.createElement("li");
    if (task.completed) {
      li.classList.add("completed");
    }

    const dueText = task.dueDate ? formatDate(task.dueDate) : "";
    const overdueClass = task.dueDate && isOverdue(task.dueDate) && !task.completed ? "overdue" : "";

    li.innerHTML = `
      <div class="task-body">
        <span class="task-title">${task.text}</span>
        ${dueText ? `<span class="due-date ${overdueClass}">Due ${dueText}</span>` : ""}
      </div>
      <div class="actions">
        <button onclick="toggleTask(${task.index})" title="Toggle complete">✔</button>
        <button onclick="editTask(${task.index})" title="Edit task">✎</button>
        <button onclick="deleteTask(${task.index})" title="Delete task">❌</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateTaskCount();
}

function addTask() {
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;

  if (text === "") return;

  tasks.push({
    text: text,
    completed: false,
    dueDate: dueDate || "",
  });

  taskInput.value = "";
  dueDateInput.value = "";
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

  const newDueDate = prompt("Edit due date (YYYY-MM-DD), or leave blank to remove", tasks[index].dueDate || "");
  if (newDueDate === null) return;

  tasks[index].text = trimmedText;
  tasks[index].dueDate = newDueDate.trim();
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

function toggleTheme() {
  theme = theme === "dark" ? "light" : "dark";
  saveTheme();
}

addBtn.addEventListener("click", addTask);
clearCompletedBtn.addEventListener("click", clearCompletedTasks);
filterButtons.forEach((button) => button.addEventListener("click", updateFilter));

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

themeToggle.addEventListener("click", toggleTheme);

saveTheme();
renderTasks();