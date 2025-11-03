export function titleCase(str: string): string {
	if (!str) {
		return "";
	}
	return str
		.toLowerCase()
		.split(" ")
		.map(function (word) {
			return word.charAt(0).toUpperCase() + word.substr(1);
		})
		.join(" ");
}
