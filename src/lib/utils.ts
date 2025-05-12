import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
export function generateSlug(value: string) {
	return `${value
		.toLowerCase()
		.replace(/-+/g, "")
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "")
		.replace(/--/g, "-")}-${makeid(4)}`;
}
export function makeid(length: number) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(
			Math.floor(Math.random() * charactersLength),
		);
		counter += 1;
	}
	return result;
}
export function localDate(date: Date) {
	const formatted = moment(date);
	formatted.locale("id");
	return formatted.format("LLLL");
}

export function removeItemAtIndex(arr: string[], index: number): string[] {
	if (index < 0 || index >= arr.length) {
		throw new Error("Invalid index");
	}
	const newArray = [...arr.slice(0, index), ...arr.slice(index + 1)];
	return newArray;
}
export function fuzzyComparison(url: string, regexString: string) {
	const regexPattern = regexString.replace(/\*/g, ".*").replace(/\//g, "\\/");

	// Create the regex, without the start (^) and end ($) anchors
	const regex = new RegExp(regexPattern);

	// Compare the URL with the regex
	const result = regex.test(url);

	console.log(`URL: ${url}, Pattern: ${regexPattern}`);
	return result
}

export function validateAnswer(a: number, b: number, answer: number) {
	const c = plusKraepelin(a, b);
	return answer === c;
}
export function plusKraepelin(a: number, b: number) {
	return Math.floor((a + b) % 10);
}
