import { imagePath } from './variables';

// deep copy helper for arrays
export function deepCopy(ele) {
	return JSON.parse(JSON.stringify(ele));
};

//shallow clone
// export function shallowClone(obj) {
//   return Object.create(
//       Object.getPrototypeOf(obj),
//       Object.getOwnPropertyDescriptors(obj)
//   );
// };

//generate thumbnails
export function genThumbs(amt, def) {
	return Array(amt).fill(def).map((pic, i) => `${imagePath}${pic}-${i + 1}.jpg`);
};

//regex
export function transformId(ele) {
	// const symbols = /[-!$%^&*()_+|~=`{}[\]:";'<>?,./]/;
	const invalidChars = /[^A-Za-z0-9_-]/;
	if (!ele.match(invalidChars)) {
		return false;
	} else {
		const whitespace = /\s/g;
		return ele.split('').map(i => i.match(whitespace) ? '-' : i.toLowerCase()).join('');
	};
};

export function transformUserId(ele) {
	// const symbols = /[-!$%^&*()_+|~=`{}[\]:";'<>?,./]/;
	const invalidChars = /[^A-Za-z0-9_-]/;
	if (ele.match(invalidChars)) {
		return false;
	} else {
		const whitespace = /\s/g;
		return ele.split('').map(i => i.match(whitespace) ? '-' : i).join('');
	};
};

//product options
export const itemOptions = Array(3).fill(null).map((opt, i) => {
	return { name: `Option ${i + 1}`, id: `opt-${i + 1}` }
});