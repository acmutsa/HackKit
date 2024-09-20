export function getClientTimeZone(vercelIPTimeZone: string | null) {
	return vercelIPTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatRegistrationField(fieldName:string,isOptional:boolean){
	return `${fieldName}${!isOptional ? " *" : ""}`;
}

export function capitalizeFirstLetter(string:string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}