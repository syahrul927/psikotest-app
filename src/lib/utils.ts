import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function removeItemAtIndex(arr: string[], index: number): string[] {
	if (index < 0 || index >= arr.length) {
		throw new Error("Invalid index");
	}
	const newArray = [...arr.slice(0, index), ...arr.slice(index + 1)];
	return newArray;
}
export function fuzzyComparison(url: string, regexString: string) {
	// Mengubah karakter '*' dalam regexString menjadi '.*' agar sesuai dengan pola regex
	const regexPattern = regexString.replace(/\*/g, ".*");

	// Membuat pola regex
	const regex = new RegExp("^" + regexPattern + "$");

	// Memeriksa apakah string URL cocok dengan pola regex
	return regex.test(url);
}
