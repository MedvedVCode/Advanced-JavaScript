class Books {
	#books = [];
	constructor() {
		this.#books = Array.from(arguments);
	}
	get allBooks() {
		return this.#books;
	}
	addBook(title) {
		try {
			if (this.hasBook(title))
				throw new Error(`Книга "${title}" уже существует в библиотеке`);
			this.#books.push(title);
			console.log(`:-) Книга "${title}" успешно добавлена в библиотеку`);
		} catch (e) {
			console.log('Error ADD: ', e.message);
		}
	}
	removeBook(title) {
		try {
			if (!this.hasBook(title))
				throw new Error(`Книга "${title}" не найдена в библиотеке`);
			this.#books = this.#books.filter((item) => item !== title);
			console.log(`:-) Книга "${title}" удалена из библиотеки`);
		} catch (e) {
			console.log('Error DELETE: ', e.message);
		}
	}
	hasBook(title) {
		const book = this.#books.find((item) => item === title);
		return book ? true : false;
	}
}

const book1 = 'Унесенные ветром';
const book2 = '451 по Фаренгейту';
const book3 = 'Старик и море';
const book4 = 'По ком звонит колокол';

const library = new Books(book1, book2, book3, book4);
console.log(library.allBooks);
library.addBook('Дядя Ваня');
library.addBook(book2);
library.removeBook('Война и мир');
library.removeBook(book1);
console.log(library.allBooks);
