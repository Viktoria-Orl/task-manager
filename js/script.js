export let today = new Date();

export let todayDate = today.toLocaleDateString();

let list;

try {
  list = JSON.parse(localStorage.getItem("list")) || [];
} catch (error) {
  console.log("Error parsing data from localStorage:", error.message);
  list = [];
}

export { list };

