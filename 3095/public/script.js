const DATA = {
  question: 'Что делали древние люди, чтобы вызвать дождь?',
  answers: [
    '1 - Три дня ничего не ели', 
    '2 - Убивали мамонта', 
    '3 - Танцевали вокруг костра с бубном в руках', 
    '4 - Ходили с зонтиком и говорили «кажется, дождь начинается…»']
};

function initVariants() {
  const question = document.createElement('h2');
  question.textContent = DATA.question;
  document.body.append(question);  

  // const list = document.createElement('ul');

  // DATA.answers.forEach((item) => {
  //   const liEl = document.createElement('li');
  //   liEl.textContent = item;
  //   list.append(liEl);
  // });

  // document.body.append(list);  

  document.body.insertAdjacentHTML('beforeend', `
  <a href="/variants">Варинаты ответов</a>
  <a href="/vote">Голосовать</a>
  <a href="/stat">Статистика</a>`);  
}

initVariants();