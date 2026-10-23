import { PREP_TIME } from './js/menu';

const form = document.querySelector('.form');
const formList = document.querySelector('.order-log');

function makeOrder(delay, shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

function addOrderRow(drinkNane) {
  const li = document.createElement('li');
  li.classList.add('row-pending');
  li.textContent = `⏳ ${drinkNane} · у роботі…`;
  formList.appendChild(li);
  return li;
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const drink = formData.get('drink');
  const state = formData.get('state');

  const delay = PREP_TIME[drink];
  const shouldResolve = state === 'fulfilled';
  const row = addOrderRow(drink);

  makeOrder(delay, shouldResolve)
    .then(delay => {
      row.classList.remove('row-pending');
      row.classList.add('row-ok');
      row.textContent = `✅ ${drink} · готове · ${delay} ms`;
    })
    .catch(delay => {
      row.classList.remove('row-ok');
      row.classList.add('row-err');
      row.textContent = `❌ ${drink} · скасовано · ${delay} ms`;
    })
    .finally(() => {
      const timeString = new Date().toLocaleTimeString('uk-UA');
      row.textContent += ` · ${timeString}`;
    });
});
