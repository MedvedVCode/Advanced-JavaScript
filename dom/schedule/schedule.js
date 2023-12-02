const LOCAL_KEY = 'schedules';
let schedules = [];

//функция проверки значений span
checkDisabled = (currentEl) => {
	const maxItem = currentEl
		.closest('.schedule-item')
		.querySelector('.schedule-max__item');
	const addBtn = currentEl
		.closest('.schedule-item')
		.querySelector('.schedule-write');
	const removeBtn = currentEl
		.closest('.schedule-item')
		.querySelector('.schedule-cancel');
	if (Number(maxItem.textContent) <= Number(currentEl.textContent)) {
		addBtn.setAttribute('disabled', 'true');
	} else {
		addBtn.removeAttribute('disabled');
	}
	if (Number(currentEl.textContent) <= 0) {
		removeBtn.setAttribute('disabled', 'true');
	} else {
		removeBtn.removeAttribute('disabled');
	}
};

//создаем наблюдатель за span
let observer = new MutationObserver((mutationRecords) => {
	const currentEl = mutationRecords[0].target;
	checkDisabled(currentEl);
});

const scheduleUl = document.querySelector('.schedule');
const resetBtn = document.querySelector('.reset');

// обработчик кнопки сбросить все, удаляем localStorage, перезагружаем страницу
resetBtn.addEventListener('click', () => {
	if (localStorage.getItem(LOCAL_KEY)) {
		localStorage.removeItem(LOCAL_KEY);
	}
	location.reload();
});

appendLiToUl = (schedule) => {
	//создаем блок li
	const scheduleItemLi = document.createElement('li');
	scheduleItemLi.classList.add('schedule-item');
	scheduleItemLi.id = schedule.id;
	scheduleUl.append(scheduleItemLi);

	//создаем все поля, кроме кнопок добавить/удалить участников
	const [start, , finish] = schedule.time.split(' ');
	scheduleItemLi.innerHTML = `<h2 class="schedule-title">${schedule.name}</h2>
	<p class="schedule-date">
		Время проведения: <span class="date-start">${start}</span> -
		<span class="date-finish">${finish}</span>
	</p>
	<p class="schedule-max">
		Всего мест на занятии: <span class="schedule-max__item">${schedule.maxParticipants}</span>
	</p>
	<p class="schedule-current">
		Записалось: <span class="schedule-current__item">${schedule.currentParticipants}</span>
	</p>`;

	// добавили div для кнопок
	const divBtns = document.createElement('div');
	scheduleItemLi.append(divBtns);

	// кнопки и их обработчики
	const writeBtn = document.createElement('button');
	writeBtn.classList.add('schedule-write');
	writeBtn.textContent = 'Записаться на занятие';

	const cancelBtn = document.createElement('button');
	cancelBtn.classList.add('schedule-cancel');
	cancelBtn.textContent = 'Отписаться от занятия';

	divBtns.append(writeBtn, cancelBtn);

	const watchedSpan = scheduleItemLi.querySelector('.schedule-current__item');

	//проверяем, должны ли быть сразу заблокированы кнопки
	checkDisabled(watchedSpan);

	//передаем span на слежение обзерверу
	observer.observe(watchedSpan, {
		childList: true,
		characterData: true,
	});

	// событие для кнопки Записаться на занятие
	writeBtn.addEventListener('click', (e) => {
		const currentParticipants = e.target
			.closest('.schedule-item')
			.querySelector('.schedule-current__item');

		currentParticipants.textContent =
			Number(currentParticipants.textContent) + 1;
		const id = Number(e.target.closest('.schedule-item').id);
		console.log(id);
		schedules.find((item) => item.id === id).currentParticipants = Number(
			currentParticipants.textContent
		);
		localStorage.setItem(LOCAL_KEY, JSON.stringify(schedules));
	});

	// событие для кнопки Отписаться от занятия
	cancelBtn.addEventListener('click', (e) => {
		const currentParticipants = e.target
			.closest('.schedule-item')
			.querySelector('.schedule-current__item');
		currentParticipants.textContent =
			Number(currentParticipants.textContent) - 1;

		const id = Number(e.target.closest('.schedule-item').id);
		console.log(id);
		schedules.find((item) => item.id === id).currentParticipants = Number(
			currentParticipants.textContent
		);
		localStorage.setItem(LOCAL_KEY, JSON.stringify(schedules));
	});
};

//перед загрузкой, получаем данные, строим DOM
document.addEventListener('DOMContentLoaded', async () => {
	if (localStorage.getItem(LOCAL_KEY)) {
		schedules = JSON.parse(localStorage.getItem(LOCAL_KEY));
	} else {
		await fetch('./data.json')
			.then((response) => response.json())
			.then((data) => (schedules = data));
		localStorage.setItem(LOCAL_KEY, JSON.stringify(schedules));
	}
	schedules.forEach((schedule) => appendLiToUl(schedule));
});
