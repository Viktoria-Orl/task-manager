import { today, todayDate, list } from "./script.js";

const weekProgressWidget = document.querySelector(".weekProgressWidget");
const weekProgressTable = document.createElement("table");

//виджет прогресса за неделю

function renderWeekProgressWidget() {
  weekProgressTable.innerHTML = "";

  if (!list.some((task) => !task.isDeleted)) return;

  //функция для создания ячеек таблицы

  function renderTableCells(cellType, rowVar, listItem) {
    const date = new Date(today);

    for (let i = 6; i >= 0; i--) {
      date.setDate(today.getDate() - i);

      if (cellType === "th") {
        const dateHeaderCell = document.createElement("th");
        dateHeaderCell.innerText = date.toLocaleDateString(undefined, {
          month: "numeric",
          day: "numeric",
        });
        rowVar.append(dateHeaderCell);
      } else if (cellType === "td") {
        const dateCell = document.createElement("td");
        dateCell.innerText = listItem.completedDates.includes(
          date.toLocaleDateString()
        )
          ? "✅"
          : "❌";
        rowVar.append(dateCell);
      }
    }

    return rowVar;
  }

  // шапка таблицы с датами

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  // первый столбец для Task name

  const taskNameHeader = document.createElement("th");
  headerRow.append(taskNameHeader);

  //след столбцы для дат

  thead.append(renderTableCells("th", headerRow));
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

      tbody.append(renderTableCells("td", taskRow, listItem));
    }
  });
  weekProgressTable.append(tbody);
  weekProgressWidget.append(weekProgressTable);
}

renderWeekProgressWidget();

const currentStrikeHeader = document.querySelector(".currentStrikeHeader");
const longestStrikeHeader = document.querySelector(".longestStrikeHeader");

function renderStrikeWidget() {
  currentStrikeHeader.innerText = "";
  longestStrikeHeader.innerText = "";

  const allCompletedDates = [];

  list.forEach(listItem => {
    if (!listItem.isDeleted) {
      allCompletedDates.push(...listItem.completedDates);
    }
  });

  function parseDate(dateString) {
    const [day, month, year] = dateString.split('.').map(Number);
    return new Date(year, month - 1, day);
  }
  
  allCompletedDates.sort((a, b) => parseDate(a) - parseDate(b))
  const uniqueCompletedDates = [...new Set(allCompletedDates)];

  const strikeDateArray = [];
  let currentStrike = 0;
  let longestStrike = 0;

  uniqueCompletedDates.forEach(date => {
    if (list.every(listItem => !listItem.isDeleted && listItem.completedDates.includes(date))) {
      strikeDateArray.push(date);
      
      if (strikeDateArray.length === 1) {
        currentStrike = 1;
      } else {
        const prevDate = parseDate(strikeDateArray[strikeDateArray.length - 2]); 
        const currDate = parseDate(date);

        if ((currDate - prevDate) / (1000 * 60 * 60 * 24) === 1) {
          currentStrike++;
          longestStrike = Math.max(longestStrike, currentStrike);
        } else {
          currentStrike = 1;
        }
      }
    }
  });

  if (!strikeDateArray.includes(todayDate)) {
    currentStrike = 0;
  };

  currentStrikeHeader.innerText = currentStrike + (currentStrike <= 1 ? " Day" : " Days");
  longestStrikeHeader.innerText = longestStrike + (longestStrike <= 1 ? " Day" : " Days");
}

renderStrikeWidget();

