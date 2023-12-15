const heartEl = document.querySelector('[name="heart"]');
const containerEl = document.querySelector('.container');
const imgEl = document.querySelector('.polaroid-img');
const authorEl = document.querySelector('.author-name');
const likesEl = document.querySelector('.likes-count');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let photos = [];
let day = 0;

const ACCESS_KEY = '8DiHb8DYErf8XYoiHo5BE4cRfKgcXdIVCcROkyvba5E';
const LOCAL_KEY = 'photos_all_days';

prevBtn.addEventListener('click', () => {
	console.log('prev day = ', day);
	if (day >= 0) {
		day--;
		renderItem(photos[day]);
		if (nextBtn.classList.contains('hidden'))
			nextBtn.classList.remove('hidden');
		if (day === 0) {
			if (!prevBtn.classList.contains('hidden'))
				prevBtn.classList.add('hidden');
		}
	}
});

nextBtn.addEventListener('click', () => {
	if (day < photos.length - 1) {
		if (prevBtn.classList.contains('hidden'))
			prevBtn.classList.remove('hidden');
		day++;
		renderItem(photos[day]);
		if (day === photos.length - 1) {
			if (!nextBtn.classList.contains('hidden'))
				nextBtn.classList.add('hidden');
		}
	}
});

//нажимаем на сердце и ставим/не ставим лайк
heartEl.addEventListener('click', () => {
	photos[day].clicked = !photos[day].clicked;
	if (photos[day].clicked) {
		heartEl.className = 'fa-solid fa-heart likes-heart';
		photos[day].likes++;
	} else {
		heartEl.className = 'fa-regular fa-heart fa-beat likes-heart';
		photos[day].likes--;
	}
	likesEl.textContent = photos[day].likes;
	localStorage.setItem(LOCAL_KEY, JSON.stringify(photos));
});

//получаем данные, скрываем нужные кнопки, устанавливаем day 
window.addEventListener('load', async () => {
	nextBtn.classList.add('hidden');

	if (localStorage.getItem(LOCAL_KEY)) {
		photos = JSON.parse(localStorage.getItem(LOCAL_KEY));
	}

	await fetchLoad()
		.then((item) => {
			const photo = setPhotoToStorage(item);
			renderItem(photo);
		})
		.catch(() => {
			if (photos.length) {
				renderItem(photos[photos.length - 1]);
			} else {
				
				const errorEl = document.createElement('div');
				errorEl.textContent =
					'localStorage пуст + ошибка получения данных с ресурса :-(';
				document.body.replaceChildren(errorEl);
			}
		});
	day = photos.length - 1;
	if (day <= 0) {
		prevBtn.classList.add('hidden');
	}
});

async function fetchLoad() {
	try {
		const response = await fetch(
			`https://api.unsplash.com/photos/random?client_id=${ACCESS_KEY}`
		);
		const photos = await response.json();
		return photos;
	} catch (error) {
		console.error('Ошибка при загрузке фотографий:', error);
		return [];
	}
}

const renderItem = (photo) => {
	imgEl.src = photo.url;
	imgEl.alt = photo.alt;
	authorEl.textContent = photo.author;
	likesEl.textContent = photo.likes;
	if (photo.clicked) {
		heartEl.className = 'fa-solid fa-heart likes-heart';
	} else {
		heartEl.className = 'fa-regular fa-heart fa-beat likes-heart';
	}
};

const setPhotoToStorage = (item) => {
	photos.push({
		id: item.id,
		author: item.user.name,
		url: item.urls.small,
		alt: item.alt_description,
		likes: item.likes,
		clicked: item.liked_by_user,
	});
	localStorage.setItem(LOCAL_KEY, JSON.stringify(photos));
	return photos[photos.length - 1];
};
