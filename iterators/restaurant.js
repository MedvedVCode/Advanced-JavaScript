const chefs = new Map([
	['Виктор', 'Пицца'],
	['Ольга', 'Суши'],
	['Дмитрий', 'Десерты'],
]);

console.log(chefs);
for (const chef of chefs.entries()) {
	console.log(chef);
}

const dishes = new Map()
	.set('Пицца "Маргарита"', 'Виктор')
	.set('Пицца "Пепперони"', 'Виктор')
	.set('Суши "Филадельфия"', 'Ольга')
	.set('Суши "Ролл-дракон"', 'Ольга')
	.set('Десерт "Чизкейк"', 'Дмитрий')
	.set('Десерт "Тирамиссу"', 'Дмитрий');

dishes.forEach((value, key) => {
	console.log(`Блюдо ${key} готовит повар ${value}`);
});

const clients = [{ client: 'Maria' }, { client: 'Petya' }, { client: 'Dasha' }];

const orders = new Map()
	.set(
		clients[0],
		new Map().set('Пицца "Пепперони"', 1).set('Десерт "Тирамису"', 1)
	)
	.set(
		clients[1],
		new Map().set('Суши "Филадельфия"', 1).set('Пицца "Маргарита"', 1)
	)
	.set(
		clients[2],
		new Map().set('Десерт "Тирамису"', 1).set('Суши "Ролл-дракон"', 1)
	);
console.log(orders);
