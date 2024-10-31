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
}

dateHeading.innerText += `Plan for ${date.getDate()} ${monthName[date.getMonth()]}`;

const list = [
  {
    taskName: 'Медитация',
    completed: false,
  },
  {
    taskName: 'Почитать книгу',
    completed: false,
  },
  {
    taskName: 'Почистить зубы',
    completed: true,
  },
];

const tasksList = document.createElement('ul');

function renderList() {
  tasksList.innerHTML = '';

  list.forEach(element => {
    tasksList.insertAdjacentHTML(
      "beforeend",
      `
        <li class="task">
          <label class="taskName ${element.completed ? 'completed' : ''}">
            <input type="checkbox" class="checkboxInput" ${element.completed ? 'checked' : ''}>
          ${element.taskName}
          </label>
          <button class="buttonDeleteTask">🗑️</button>
        </li>
      `)
  });
};

renderList();

dateHeading.after(tasksList);

const inputAddTask = document.getElementsByClassName('inputAddTask')[0];
const buttonAddTask = document.getElementsByClassName('buttonAddTask')[0];

function addItem() {
  if (inputAddTask.value) {
    list.push({taskName: inputAddTask.value, completed: false});
    inputAddTask.value = '';
    renderList();
  } else {alert('Empty task!')}
};

buttonAddTask.addEventListener('click', addItem)

function deleteItem() {
  

  renderList();
}

//работало пока не написала функцию addItem, надо корректировать
const checkboxInputs = Array.from(document.getElementsByClassName('checkboxInput'));

function completedToggle() {
  this.checked ? this.parentElement.classList.add("completed") : this.parentElement.classList.remove("completed");
};

checkboxInputs.forEach(element => element.addEventListener('change', completedToggle));