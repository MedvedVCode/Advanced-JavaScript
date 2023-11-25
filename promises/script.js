const addProductForm = document.querySelector('.add-product');
const addProductInput = addProductForm.querySelector('input');
const addProductBtn = addProductForm.querySelector('button');

const productArticle = document.querySelector('.product');

let repository = [];

const LOCAL_KEY = 'products';

//ищем у элемента родителя по className
findParentDetailEl = (childEl, className) => {
	let element = childEl;
	do element = element.parentElement;
	while (element.className !== className);
	return element;
};

//Добавление отзыва в ДОМ-дерево
appendReviewToDom = (parentEl, review) => {
	const liEl = document.createElement('li');
	liEl.className = 'review';
	parentEl.append(liEl);

	const reviewSpan = document.createElement('span');
	reviewSpan.className = 'review__text';
	reviewSpan.id = review.reviewId;
	reviewSpan.textContent = review.reviewText;

	const reviewDeleteBtn = document.createElement('button');
	reviewDeleteBtn.className = 'review__delete';
	reviewDeleteBtn.textContent = 'Удалить отзыв';
	liEl.append(reviewSpan, reviewDeleteBtn);

	//слушаем кнопку Удалить отзыв
	reviewDeleteBtn.addEventListener('click', (e) => {
		const detailEl = findParentDetailEl(e.target, 'product__wrp');
		const spanEl = e.target.previousElementSibling;
		deleteReviewByProductId(detailEl.id, spanEl.id);
		e.target.parentElement.remove();
	});
};

//Добавление товара в ДОМ-дерево
appendProductToDom = (product) => {
	const prodDetails = document.createElement('details');
	prodDetails.className = 'product__wrp';
	prodDetails.id = product.prodId;
	productArticle.append(prodDetails);

	const prodSummary = document.createElement('summary');
	prodSummary.className = 'product__details';
	prodDetails.append(prodSummary);

	const prodSpan = document.createElement('span');
	prodSpan.className = 'product__text';
	prodSpan.textContent = product.prodName;

	const prodDeleteBtn = document.createElement('button');
	prodDeleteBtn.className = 'product__delete';
	prodDeleteBtn.textContent = 'Удалить товар';
	prodSummary.append(prodSpan, prodDeleteBtn);

	//слушаем кнопку Удалить продукт 
	prodDeleteBtn.addEventListener('click', (e) => {
		const detailEl = findParentDetailEl(e.target, 'product__wrp');
		deleteProductById(detailEl.Id);
		detailEl.remove();
	});

	const reviewDiv = document.createElement('div');
	reviewDiv.className = 'review__wrp';
	prodDetails.append(reviewDiv);

	const reviewListUl = document.createElement('ul');
	reviewListUl.className = 'review__list';
	reviewDiv.append(reviewListUl);

	if (product?.reviews.length > 0) {
		product.reviews.forEach((item) => appendReviewToDom(reviewListUl, item));
	}

	const reviewForm = document.createElement('form');
	reviewForm.className = 'review__new';
	reviewDiv.append(reviewForm);

	reviewForm.addEventListener('submit', (e) => {
		e.preventDefault();
	});

	const reviewTextarea = document.createElement('textarea');
	reviewTextarea.className = 'review__new-text';
	reviewTextarea.placeholder = 'Введите текст отзыва';
	reviewTextarea.type = 'sdfsdfsdf';

	const reviewBtnDiv = document.createElement('div');
	reviewBtnDiv.className = 'review__new-btns';
	reviewForm.append(reviewTextarea, reviewBtnDiv);

	const reviewAddButton = document.createElement('button');
	reviewAddButton.className = 'review__new-add';
	reviewAddButton.textContent = 'Добавить отзыв';

	const reviewClearButton = document.createElement('button');
	reviewClearButton.className = 'review__new-clear';
	reviewClearButton.textContent = 'Очистить поле';
	reviewClearButton.type = 'reset';

	reviewBtnDiv.append(reviewAddButton, reviewClearButton);

	//слушаем кнопку Добавить отзыв
	reviewAddButton.addEventListener('click', (e) => {
		const textEl = e.target.parentElement.previousElementSibling;
		if (!textEl.value) {
			alert('Поле ввода отзыва пустое!');
			return;
		}
		const newReview = { reviewId: Date.now(), reviewText: textEl.value };
		const detailEl = findParentDetailEl(e.target, 'product__wrp');
		addReviewByProductId(detailEl.id, newReview);
		const reviewUl = findParentDetailEl(
			e.target,
			'review__wrp'
		).firstElementChild;
		appendReviewToDom(reviewUl, newReview);
		textEl.value = '';
	});
};

//Работа с репозиторием
addProductToRepository = (product) => {
	repository.push(product);
	console.log(repository);
	localStorage.setItem(LOCAL_KEY, JSON.stringify(repository));
};

getProductByProdName = (productName) =>
	repository.find((item) => item.prodName === productName);

getProductById = (id) => repository.find((item) => item.id === id);

deleteProductById = (id) => {
	const pos = repository.findIndex((item) => item.id === id);
	repository.splice(pos, 1);
	console.log(repository);
	localStorage.setItem(LOCAL_KEY, JSON.stringify(repository));
};

addReviewByProductId = (prodId, review) => {
	repository.forEach((p) => {
		if (p.prodId === Number(prodId)) {
			p.reviews.push(review);
		}
	});
	console.log(repository);
	localStorage.setItem(LOCAL_KEY, JSON.stringify(repository));
};

deleteReviewByProductId = (prodId, reviewId) => {
	repository.forEach((p) => {
		if (p.prodId === Number(prodId)) {
			const pos = p.reviews.find((r) => r.reviewId === Number(reviewId));
			p.reviews.splice(pos, 1);
		}
	});
	console.log(repository);
	localStorage.setItem(LOCAL_KEY, JSON.stringify(repository));
};

//Слушатели существующих элементов на страничке
addProductForm.addEventListener('submit', (e) => {
	e.preventDefault();
});

addProductBtn.addEventListener('click', (e) => {
	const productName = addProductInput.value;
	if (!productName) {
		alert('Поле ввода товара пустое!');
		return;
	}
	const product = getProductByProdName(productName);
	if (product) {
		alert('Такой товар уже существует!');
		return;
	}
	const newProduct = { prodId: Date.now(), prodName: productName, reviews: [] };
	addProductToRepository(newProduct);
	appendProductToDom(newProduct);
	addProductInput.value = '';
});

document.addEventListener('DOMContentLoaded', () => {
	const localRepo = localStorage.getItem(LOCAL_KEY);
	if (localRepo) {
		repository = JSON.parse(localRepo);
		repository.forEach((p) => appendProductToDom(p));
	}
});
