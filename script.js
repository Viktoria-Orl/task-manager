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

const weekProgressWidget = document.querySelector(".weekProgressWidget");
const weekProgressTable = document.createElement("table");

const tasksList = document.createElement("ul");

function renderList() {
  tasksList.innerHTML = "";

  // cчетчики для виджета выполненных задач

  let countTasks = 0;
  let countCompletedTasks = 0;
  
  list.forEach((listItem) => {
    //проверка на наличие свостйва isDeleted: true
    if (!listItem.isDeleted) {

      countTasks++; // считаю кол-во общих задач
      const isCompletedToday = listItem.completedDates.includes(todayDate); // проверка выполнения сегодня
      if (isCompletedToday) countCompletedTasks++; // если выполнено то увеличиваю

      tasksList.insertAdjacentHTML(
        "beforeend",
        `
          <li class="task">
            <label class="taskName ${isCompletedToday ? "completed" : ""}">
              <input type="checkbox" class="checkboxInput" ${isCompletedToday ? "checked" : ""}>
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

  // актуализация виджета

  taskWidget.innerText = `${countCompletedTasks}/${countTasks} ${
    countCompletedTasks > 1 ? "tasks" : "task"
  } completed today`;

  renderWeekProgressWidget();

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

  const existTask = list.find(
    (task) => task.taskName.toLowerCase() === newTaskName.toLowerCase()
  );

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
      completedDates: [],
    });
    inputAddTask.value = "";
    renderList();
  }
}

inputAddTask.addEventListener("keydown", (event) => { if (event.key === 'Enter') addItem()});
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

//виджет прогресса за неделю

function renderWeekProgressWidget() {
  weekProgressTable.innerHTML = "";

  if (!list.some(task => !task.isDeleted)) return;

  // шапка таблицы с датами

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  // первый столбец для Task name

  const taskNameHeader = document.createElement("th");
  taskNameHeader.innerText = "Task name";
  headerRow.append(taskNameHeader);

  //след столбцы для дат

  for (let i = 6; i >= 0; i--) {
    const dateHeader = document.createElement("th");
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dateHeader.innerText = date.toLocaleDateString(undefined, {
      month: "numeric",
      day: "numeric",
    });
    headerRow.append(dateHeader);
  }

  thead.append(headerRow);
  weekProgressTable.append(thead);

  // тело таблицы

  const tbody = document.createElement("tbody");

  list.forEach((listItem) => {
    //проверка на наличие свостйва isDeleted: true
    if (!listItem.isDeleted) {
      const taskRow = document.createElement("tr");

      // первый столбец для Task name

      const taskNameCell = document.createElement("th");
      taskNameCell.innerText = listItem.taskName;
      taskRow.append(taskNameCell);

      //след столбцы для дат

      for (let i = 6; i >= 0; i--) {
        const dateCell = document.createElement("td");
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dateCell.innerText = listItem.completedDates.includes(
          date.toLocaleDateString()
        )
          ? "✅"
          : "❌";
        taskRow.append(dateCell);
      }

      tbody.append(taskRow);
    }
  });
  weekProgressTable.append(tbody);
}

renderWeekProgressWidget();
weekProgressWidget.append(weekProgressTable);
