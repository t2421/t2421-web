import { add } from "@t2421/math/add";
export function setupCounter(element: HTMLButtonElement) {
	let counter = 0;
	const setCounter = (count: number) => {
		counter = count;
		element.innerText = `count is ${counter}`;
	};
	element.addEventListener("click", () => setCounter(add(counter, 1)));
	setCounter(0);
}
