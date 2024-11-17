import { today, list } from "./script.js";

const weekProgressWidget = document.querySelector(".weekProgressWidget");
const weekProgressTable = document.createElement("table");

//виджет прогресса за неделю

function renderWeekProgressWidget() {
  weekProgressTable.innerHTML = "";

  if (!list.some((task) => !task.isDeleted)) return;

  //функция для создания ячеек таблицы

  function tableCells(cellType, rowVar, listItem) {
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

  thead.append(tableCells("th", headerRow));
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

      tbody.append(tableCells("td", taskRow, listItem));
    }
  });
  weekProgressTable.append(tbody);
}

weekProgressWidget.append(weekProgressTable);
renderWeekProgressWidget();