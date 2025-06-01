import { genThumbs, transformId, itemOptions } from "./utilities";

export const imagePath = process.env.PUBLIC_URL + '/images/';

//colors
export const colorWhite = '#EFEFEF';
export const colorBlack = '#0F0F0F';
export const colorDarkGrey = '#383838';
export const colorYellow = '#FFF59B';
export const colorRed = '#9E1800';

//info of the product on current page
const productName = 'Your Product';
export const currentProduct = {
	prodName: productName,
	prodId: transformId(productName),
	opt: '',
	qty: 1,
	price: 10.50,
	thumb: genThumbs(3, 'jar'),
};

//items initially in cart
const initItems = ['Product 1', 'Product 2']
export const initInCart = [
	{
		prodName: initItems[0],
		prodId: transformId(initItems[0]),
		opt: itemOptions[2].id,
		qty: 1,
		price: 29.99,
		thumb: genThumbs(3, 'notebook'),
	},
	{
		prodName: initItems[1],
		prodId: transformId(initItems[1]),
		opt: itemOptions[1].id,
		qty: 3,
		price: 11.45,
		thumb: genThumbs(3, 'necklace'),
	},
];

//max qty of items in cart
export const maxQty = 9;

const userNames = ['Cool User', 'Troll'];
//initial revies
export const initReviews = [
	{
		user: userNames[0],
		id: transformId(userNames[0]),
		rating: 4,
		rated: [],
		publishedRating: 4,
		review: "I love this product sooooo much, what would I do without it??",
		hidden: false,
		feedback: { up: 38, down: 2 },
		date: new Intl.DateTimeFormat('en-US', { dateStyle: "medium", timeStyle: "medium" }).format(new Date(2018, 3, 10, 7, 45, 16)),
	},
	{
		user: userNames[1],
		id: transformId(userNames[1]),
		rating: 1,
		rated: [],
		publishedRating: 1,
		review: "I didn’t use this product correctly and I HATE IT.",
		hidden: false,
		feedback: { up: 10, down: 155 },
		date: new Intl.DateTimeFormat('en-US', { dateStyle: "medium", timeStyle: "medium" }).format(new Date(2019, 6, 23, 18, 12, 13)),
	},
].sort((a, b) => b.feedback.up - a.feedback.up);

export const maxRating = 4;