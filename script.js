let dateHeading = document.getElementById("dateHeading");

let today = new Date();

const monthName = {
  0: "january",
  1: "february",
  2: "march",
  3: "april",
  4: "may",
  5: "june",
  6: "july",
  7: "august",
  8: "september",
  9: "october",
  10: "november",
  11: "december",
};

dateHeading.innerText += `Plan for ${today.getDate()} ${
  monthName[today.getMonth()]
}`;

let todayDate = today.toLocaleDateString();

let list;

try {
  list = JSON.parse(localStorage.getItem("list")) || [];
} catch (error) {
  console.log("Error parsing data from localStorage:", error.message);
  list = [];
}

const taskWidget = document.querySelector(".taskWidget");

const tasksList = document.createElement("ul");

function renderList() {
  tasksList.innerHTML = "";

  list.forEach((listItem) => {
    //проверка на наличие свостйва isDeleted: true
    if (!listItem.isDeleted) {
      tasksList.insertAdjacentHTML(
        "beforeend",
        `
          <li class="task">
            <label class="taskName ${listItem.completed ? "completed" : ""}">
              <input type="checkbox" class="checkboxInput" ${
                listItem.completed ? "checked" : ""
              }>
            ${listItem.taskName}
            </label>
            <button class="buttonDeleteTask" id="${listItem.id}">🗑️</button>
          </li>
        `
      );
    }
  });

  //обработчик удаления на каждую вновь созданную кнопку delete

  tasksList.querySelectorAll(".buttonDeleteTask").forEach((button) => {
    button.addEventListener("click", deleteItem);
  });

  // обработчик изменения статуса выполнения задачи

  tasksList
    .querySelectorAll(".checkboxInput")
    .forEach((element) => element.addEventListener("change", completedToggle));

  // cчетчики для виджета выполненных задач

  const countTasks = document.getElementsByClassName("taskName").length;

  const countCompletedTasks =
    document.getElementsByClassName("completed").length;

  // актуализация виджета

  taskWidget.innerText = `${countCompletedTasks}/${countTasks} ${
    countCompletedTasks > 1 ? "tasks" : "task"
  } completed today`;

  localStorage.setItem("list", JSON.stringify(list));
}

renderList();

dateHeading.after(tasksList);

//добавление задач

const inputAddTask = document.querySelector(".inputAddTask");
const buttonAddTask = document.querySelector(".buttonAddTask");

function addItem() {
  const newTaskName = inputAddTask.value.trim();

  if (!newTaskName) {
    return alert("Empty task!");
  }

  const existTask = list.find(task => task.taskName.toLowerCase() === newTaskName.toLowerCase());

  if (existTask) {
    if (existTask.isDeleted) {
      delete existTask.isDeleted;
      inputAddTask.value = "";
      renderList();
    } else {
      inputAddTask.value = "";
      return alert("This task already exists! Enter a new one.");
    }
  } else {
    const newId = list.length ? list[list.length - 1].id + 1 : 1;
    list.push({
      id: newId,
      taskName: newTaskName,
      completed: false,
      completedDates: []
    });
    inputAddTask.value = "";
    renderList();
  }
}

buttonAddTask.addEventListener("click", addItem);

//удаление задач

function deleteItem(event) {
  const idDeletedTask = list.findIndex(
    (task) => task.id === Number(event.target.id)
  );
  list[idDeletedTask].isDeleted = true;
  renderList();
}

//изменение свойства checked у задачи

function completedToggle(event) {
  const checkbox = event.target;

  const id = Number(checkbox.parentElement.nextElementSibling.id);

  const task = list.find((task) => task.id === id);

  task.completed = checkbox.checked;
  checkbox.parentElement.classList.toggle("completed", checkbox.checked);
  
  if (!task.completedDates.includes(todayDate)) {
    task.completedDates.push(todayDate);
  } else {
    task.completedDates = task.completedDates.filter(
      (date) => date !== todayDate
    );
  }

  renderList();
}