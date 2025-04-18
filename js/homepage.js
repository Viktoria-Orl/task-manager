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
                <use href="icons/deleteButton.svg#delete"></use>
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

const tasksCompletedProgress = document.querySelector(
  ".tasksCompletedProgress"
);

function renderTaskWidget() {
  const taskWidgetText = document.querySelector(".taskWidgetText");

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

  //отрисовка прогресса

  const circle = document.querySelector(".taskWidgetProgressRing__circle");
  const text = document.querySelector(".taskWidgetProgressRing__text");

  const radius = circle.r.baseVal.value; // Радиус круга
  const circumference = 2 * Math.PI * radius; // Окружность круга

  circle.style.strokeDasharray = circumference; // Устанавливаем длину линии
  const offset =
    circumference - (countCompletedTasks / countTasks) * circumference; // Смещение для текущего процента
  circle.style.strokeDashoffset = offset; // Устанавливаем смещение

  text.textContent = `${
    Math.round((countCompletedTasks / countTasks) * 100) || 0
  }%`;

  // актуализация текста виджета

  taskWidgetText.innerHTML = `<h3 class="taskWidgetHeader">${countCompletedTasks} of ${countTasks} ${
    countTasks === 1 ? "task" : "tasks"
  }</h3>
    <p>completed today</p>`;
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
  // делегирую событие на ближайшего родителя button Методом elem.closest(css)
  const button = event.target.closest(".buttonDeleteTask");

  if (button) {
    const idDeletedTask = list.findIndex(
      (task) => task.id === Number(button.id)
    );

    if (idDeletedTask !== -1) {
      list[idDeletedTask].isDeleted = true;
      updateChanges();
    }
  }
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