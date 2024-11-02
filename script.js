let dateHeading = document.getElementById('dateHeading');

let date = new Date();

const monthName = {
    0: 'january',
    1: 'february',
    2: 'march',
    3: 'april',
    4: 'may',
    5: 'june',
    6: 'july',
    7: 'august',
    8: 'september',
    9: 'october',
    10: 'november',
    11: 'december',
};

dateHeading.innerText += `Plan for ${date.getDate()} ${monthName[date.getMonth()]}`;

const list = JSON.parse(localStorage.getItem("list")) || [];

const taskWidget = document.querySelector(".taskWidget");

const tasksList = document.createElement('ul');

function renderList() {
  tasksList.innerHTML = '';

  list.forEach((element) => {
    tasksList.insertAdjacentHTML(
      "beforeend",
      `
        <li class="task">
          <label class="taskName ${element.completed ? 'completed' : ''}">
            <input type="checkbox" class="checkboxInput" ${element.completed ? 'checked' : ''}>
          ${element.taskName}
          </label>
          <button class="buttonDeleteTask" id="${element.id}">🗑️</button>
        </li>
      `)
  });

  //обработчик удаления на каждую вновь созданную кнопку delete

  tasksList.querySelectorAll('.buttonDeleteTask').forEach(button => {
    button.addEventListener('click', deleteItem);
  });

  // обработчик изменения статуса выполнения задаяи

  tasksList.querySelectorAll('.checkboxInput').forEach(element => element.addEventListener('change', completedToggle));

  // cчетчики для виджета выполненных задач

  const countTasks = document.getElementsByClassName("taskName").length;

  const countCompletedTasks = document.getElementsByClassName("completed").length;

  // актуализация виджета

  taskWidget.innerText = `${countCompletedTasks}/${countTasks} ${countCompletedTasks > 1 ? "tasks" : "task"} completed today`;

  localStorage.setItem("list", JSON.stringify(list));
}

renderList();

dateHeading.after(tasksList);

//добавление задач

const inputAddTask = document.querySelector('.inputAddTask');
const buttonAddTask = document.querySelector('.buttonAddTask');

function addItem() {

  const newId = list.length ? list[list.length - 1].id + 1 : 1;
  if (inputAddTask.value) {
    list.push(
      {taskName: inputAddTask.value, 
      completed: false, 
      id: newId}
    );
    inputAddTask.value = '';
    renderList();
  } else {alert('Empty task!');}
}

buttonAddTask.addEventListener('click', addItem);

//удаление задач

function deleteItem(event) {
  const idDeletedTask = list.findIndex((task) => task.id === Number(event.target.id));
  list.splice(idDeletedTask, 1);

  renderList();
}

//изменение свойства checked у задачи

function completedToggle(event) {
  const checkbox = event.target;

  const id = Number(checkbox.parentElement.nextElementSibling.id);

  const task = list.find((task) => task.id === id);

  task.completed = checkbox.checked;
  checkbox.parentElement.classList.toggle("completed", checkbox.checked);

  renderList();
}