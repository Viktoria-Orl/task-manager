let dateHeading = document.getElementById('dateHeading');

let date = new Date();

const monthName = {
    0: 'января',
    1: 'февраля',
    2: 'марта',
    3: 'апреля',
    4: 'мая',
    5: 'июня',
    6: 'июля',
    7: 'августа',
    8: 'сентября',
    9: 'октября',
    10: 'ноября',
    11: 'декабря',
}

dateHeading.innerText += `План на ${date.getDate()} ${monthName[date.getMonth()]}`