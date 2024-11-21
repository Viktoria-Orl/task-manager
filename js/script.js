const today = new Date();

const todayDate = today.toLocaleDateString();

let list;

try {
  list = JSON.parse(localStorage.getItem("list")) || [];
} catch (error) {
  console.log("Error parsing data from localStorage:", error.message);
  list = [];
}

export { list, today, todayDate };
