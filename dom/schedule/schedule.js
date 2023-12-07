const LOCAL_KEY = 'schedules';
let schedules = [];
const addBtnStatus = {
	maxParticipants: 'Нет мест',
	alreadySignUp: 'Вы записаны :-)',
	signUp: 'Записаться на занятие',
};

//функция проверки значений span и блокирование кнопок
checkDisabled = (currentEl) => {
	const scheduleEl = currentEl.closest('.schedule-item');

	//если поле существует, то берем значение
	const isSignUp = schedules.find(
		(schedule) => schedule.id === Number(scheduleEl.id)
	)?.isSignUpClass;

	const maxParticipants = Number(
		scheduleEl.querySelector('.schedule-max__item').textContent
	);
	const addBtn = scheduleEl.querySelector('.schedule-write');
	const removeBtn = scheduleEl.querySelector('.schedule-cancel');

	console.log('ID = ', scheduleEl.id, '\n isSignUpClass = ', isSignUp);
	if (maxParticipants <= Number(currentEl.textContent)) {
		addBtn.disabled = 'true';
		addBtn.textContent = addBtnStatus.maxParticipants;
		if (isSignUp) {
			if (removeBtn.classList.contains('hidden')) {
				removeBtn.classList.remove('hidden');
			}
		} else {
			if (!removeBtn.classList.contains('hidden')) {
				removeBtn.classList.add('hidden');
			}
		}
	} else {
		if (isSignUp) {
			addBtn.disabled = 'true';
			addBtn.textContent = addBtnStatus.alreadySignUp;
			if (removeBtn.classList.contains('hidden')) {
				removeBtn.classList.remove('hidden');
			}
		} else {
			if (!removeBtn.classList.contains('hidden')) {
				removeBtn.classList.add('hidden');
			}
			addBtn.textContent = addBtnStatus.signUp;
			addBtn.removeAttribute('disabled');
		}
	}
};

//создаем наблюдатель за span
let observer = new MutationObserver((mutationRecords) => {
	const currentEl = mutationRecords[0].target;
	checkDisabled(currentEl);
});

const scheduleUl = document.querySelector('.schedule');
const resetBtn = document.querySelector('.reset');

// обработчик кнопки сбросить все, удаляем schedules из localStorage, перезагружаем страницу
resetBtn.addEventListener('click', () => {
	if (localStorage.getItem(LOCAL_KEY)) {
		localStorage.removeItem(LOCAL_KEY);
	}
	location.reload();
});

//добавление занятия в список занятий в DOM
appendLiToUl = (schedule) => {
	//создаем блок li
	const scheduleItemLi = document.createElement('li');
	scheduleItemLi.classList.add('schedule-item');
	scheduleItemLi.id = schedule.id;
	scheduleUl.append(scheduleItemLi);

	//создаем все поля, кроме кнопок добавить/удалить участников
	const [start, , finish] = schedule.time.split(' ');
	const scheduleText = `<h2 class="schedule-title">${schedule.name}</h2>
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
	scheduleItemLi.innerHTML = scheduleText;

	// добавили div для кнопок
	const divBtns = document.createElement('div');
	scheduleItemLi.append(divBtns);

	// создаем кнопки и добавляем кнопки
	const writeBtn = document.createElement('button');
	writeBtn.classList.add('schedule-write');
	writeBtn.textContent = addBtnStatus.signUp;

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
		schedules.find((item) => item.id === id).currentParticipants = Number(
			currentParticipants.textContent
		);
		schedules.find((item) => item.id === id).isSignUpClass = true;
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
		schedules.find((item) => item.id === id).currentParticipants = Number(
			currentParticipants.textContent
		);
		schedules.find((item) => item.id === id).isSignUpClass = false;
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
