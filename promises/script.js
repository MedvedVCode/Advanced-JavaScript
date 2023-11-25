const addProductForm = document.querySelector('.add-product');
const addProductInput = addProductForm.querySelector('input');
const addProductBtn = addProductForm.querySelector('button');

const repository = [
	{
		prodId: 1,
		prodName: 'Молоко',
		reviews: [
			{
				reviewId: 1,
				reviewText: 'Отличное молоко, куплю еще',
			},
			{
				reviewId: 2,
				reviewText: 'Не очень, не буду покупать',
			},
		],
	},
];
addProduct = (product) => {};

addProductForm.addEventListener('submit', (e) => {
	e.preventDefault();
});

addProductBtn.addEventListener('click', (e) => {
	const inputText = addProductInput.value;
	if (!inputText) {
		alert('Поле ввода товара пустое');
		return;
	}
	checkProduct(inputText);
	const newProduct = { prodId: Date.now(), prodText: inputText };
	addProduct(newProduct);
});
