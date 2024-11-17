import { today, todayDate, list } from "./script.js";

let dateHeading = document.querySelector(".dateHeading");

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

const tasksContainer = document.querySelector(".tasksContainer");
const tasksList = document.createElement("ul");

function renderList() {
  tasksList.innerHTML = "";

  list.forEach((listItem) => {
    if (!listItem.isDeleted) {
      //проверка на наличие свостйва isDeleted: true

      const isCompletedToday = listItem.completedDates.includes(todayDate); // проверка выполнения сегодня

      tasksList.insertAdjacentHTML(
        "beforeend",
        `
          <li class="taskItem">
            <label class="taskName ${isCompletedToday ? "completed" : ""}">
              <input type="checkbox" class="checkboxInput" ${
                isCompletedToday ? "checked" : ""
              }>
            ${listItem.taskName}
            </label>
            <button class="buttonDeleteTask" id="${listItem.id}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.9376 8H5.06238V19C5.06238 20.6569 6.39356 22 8.03565 22H15.9644C17.6064 22 18.9376 20.6569 18.9376 19V8Z" fill="#CDCDD0" />
                <path d="M10.0178 12C9.47046 12 9.02673 12.4477 9.02673 13V17C9.02673 17.5523 9.47046 18 10.0178 18C10.5652 18 11.0089 17.5523 11.0089 17V13C11.0089 12.4477 10.5652 12 10.0178 12Z" fill="#040415" />
                <path d="M13.9822 12C13.4348 12 12.9911 12.4477 12.9911 13V17C12.9911 17.5523 13.4348 18 13.9822 18C14.5295 18 14.9733 17.5523 14.9733 17V13C14.9733 12.4477 14.5295 12 13.9822 12Z" fill="#040415" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.03565 6V5C8.03565 3.34315 9.36682 2 11.0089 2H12.9911C14.6332 2 15.9644 3.34315 15.9644 5V6H18.9376C19.485 6 19.9287 6.44772 19.9287 7C19.9287 7.55228 19.485 8 18.9376 8H5.06238C4.51501 8 4.07129 7.55228 4.07129 7C4.07129 6.44772 4.51501 6 5.06238 6H8.03565ZM10.0178 5C10.0178 4.44772 10.4615 4 11.0089 4H12.9911C13.5385 4 13.9822 4.44772 13.9822 5V6H10.0178V5Z" fill="#040415" />
              </svg>
            </button>
          </li>
        `
      );
    }
  });

  //обработчик удаления на каждую вновь созданную кнопку delete- если добавлять в атрибут то не видит
  //- Uncaught ReferenceError: completedToggle is not defined at HTMLInputElement.onchange

  tasksList.querySelectorAll(".buttonDeleteTask").forEach((button) => {
    button.addEventListener("click", deleteItem);
  });

  // обработчик изменения статуса выполнения задачи

  tasksList
    .querySelectorAll(".checkboxInput")
    .forEach((element) => element.addEventListener("change", completedToggle));

  tasksContainer.prepend(tasksList);
}

// виджет выполненных задач

const taskWidgetText = document.querySelector(".taskWidgetText");
const tasksCompletedProgress = document.querySelector(
  ".tasksCompletedProgress"
);

function renderTaskWidget() {
  let countTasks = 0;
  let countCompletedTasks = 0;

  list.forEach((listItem) => {
    //проверка на наличие свостйва isDeleted: true
    if (!listItem.isDeleted) {
      countTasks++; // кол-во общих задач
      const isCompletedToday = listItem.completedDates.includes(todayDate); // проверка выполнения сегодня
      if (isCompletedToday) countCompletedTasks++; // если выполнено то увеличивается
    }
  });

  // актуализация виджета

  taskWidgetText.innerHTML = `<h3 class="taskWidgetHeader">${countCompletedTasks} of ${countTasks} ${
    countCompletedTasks > 1 ? "tasks" : "task"
  }</h3>
    <p>completed today</p>`;

  tasksCompletedProgress.max = countTasks;
  tasksCompletedProgress.value = countCompletedTasks;
}

//функция для обновления страницы

function updateChanges() {
  localStorage.setItem("list", JSON.stringify(list));
  renderList();
  renderTaskWidget();
}

updateChanges();

//добавление задач

const inputAddTask = document.querySelector(".inputAddTask");
const buttonAddTask = document.querySelector(".buttonAddTask");

function addItem() {
  const newTaskName = inputAddTask.value.trim();

  if (!newTaskName) {
    return alert("Empty task!");
  }

  const existTask = list.find(
    (task) => task.taskName.toLowerCase() === newTaskName.toLowerCase()
  );

  if (existTask) {
    if (existTask.isDeleted) {
      delete existTask.isDeleted;
      inputAddTask.value = "";
      updateChanges();
    } else {
      inputAddTask.value = "";
      return alert("This task already exists! Enter a new one.");
    }
  } else {
    const newId = list.length ? list[list.length - 1].id + 1 : 1;
    list.push({
      id: newId,
      taskName: newTaskName,
      completedDates: [],
    });
    inputAddTask.value = "";
    updateChanges();
  }
}

inputAddTask.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addItem();
});
buttonAddTask.addEventListener("click", addItem);

//удаление задач

function deleteItem(event) {
  const idDeletedTask = list.findIndex(
    (task) => task.id === Number(this.event.target.id)
  );
  list[idDeletedTask].isDeleted = true;

  updateChanges();
}

//изменение свойства checked у задачи

function completedToggle(event) {
  const checkbox = event.target;

  const id = Number(checkbox.parentElement.nextElementSibling.id);

  const task = list.find((task) => task.id === id);

  checkbox.parentElement.classList.toggle("completed", checkbox.checked);

  if (!task.completedDates.includes(todayDate)) {
    task.completedDates.push(todayDate);
  } else {
    task.completedDates = task.completedDates.filter(
      (date) => date !== todayDate
    );
  }

  updateChanges();
}
