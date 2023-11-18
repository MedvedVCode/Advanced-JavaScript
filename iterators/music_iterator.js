const books = [
	{ title: '1984', author: 'George Orwell' },
	{ title: 'Brave New World', author: 'Aldous Huxley' },
	{ title: 'Fahrenheit 451', author: 'Ray Bradbury' },
];

const music = [
	{
		title: 'My way',
		artist: 'Frank Senatra',
		year: '1978',
	},
	{
		title: 'Before',
		artist: 'Pet Shop Boys',
		year: '1999',
	},
	{
		title: 'So far away',
		artist: 'Mel Tayler',
		year: '2015',
	},
	{
		title: 'Путник',
		artist: 'Король и шут',
		year: '2003',
	},
];

const musicCollection = {
	music: [...music],
	[Symbol.iterator]: function () {
		let index = 0;
		return {
			next: () => {
				if (index < this.music.length) {
					return { value: this.music[index++], done: false };
				} else {
					return { done: true };
				}
			},
		};
	},
};

for (let music of musicCollection) {
	console.log(`${music.title} - ${music.artist} (${music.year})`);
}
