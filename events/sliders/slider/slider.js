const sliderLineEl = document.querySelector('.slider-line');
const dotsEl = document.querySelector('.dots');
const prevBtn = document.querySelector('.btn-prev'),
	nextBtn = document.querySelector('.btn-next');
const imagesCount = data.length;

let activeImage = 0;

window.addEventListener('load', () => {
	data.forEach((element, index) => {
		const imgEl = document.createElement('img');
		imgEl.classList.add('slider-img');
		imgEl.src = `./img/${element}`;
		imgEl.alt = 'Котик-бегемотик';
		sliderLineEl.append(imgEl);

		const dotEL = document.createElement('li');
		dotEL.classList.add('dots-item');
		dotsEl.append(dotEL);

		dotEL.addEventListener('click', (e) => {
			activeImage = index;
			setActiveDot(activeImage);
			slideImg();
		});
	});
	setActiveDot(activeImage);
});

prevBtn.addEventListener('click', () => {
	activeImage = (activeImage - 1 + imagesCount) % imagesCount;
	slideImg();
	setActiveDot(activeImage);
});

nextBtn.addEventListener('click', () => {
	activeImage = (activeImage + 1) % imagesCount;
	slideImg();
	setActiveDot(activeImage);
});

const slideImg = () => {
	const imageWidth = sliderLineEl.clientWidth;
	const slideOffset = -activeImage * imageWidth;
	sliderLineEl.style.transform = `translateX(${slideOffset}px)`;
};

const setActiveDot = (position) => {
	const dot = Array.from(dotsEl.children).find(
		(item, index) => index === position
	);
	Array.from(dotsEl.children).forEach((item) => {
		if (item.classList.contains('active') && item !== dot) {
			item.classList.remove('active');
		}
	});
	dot.classList.add('active');
};
