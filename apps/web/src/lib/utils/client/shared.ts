import { ONE_HOUR_IN_MILLISECONDS } from "@/lib/constants/shared";


export function getClientTimeZone(vercelIPTimeZone: string | null) {
	return vercelIPTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export function convertDateToUtc(date: Date){
	return date.toISOString();
};

export function getLocaleStringWithTimeZone(
	date: Date,
	timeZone: string,
	locales?: Intl.LocalesArgument,
	options?: Intl.DateTimeFormatOptions,
) {
	return date.toLocaleString(locales, {
		...options,
		timeZone,
	});
}

export function getDateAndTimeWithTimeZoneString(date: Date, timeZone: string){
	return getLocaleStringWithTimeZone(date, timeZone, undefined, {
		hourCycle: "h12",
		dateStyle: "medium",
		timeStyle: "short",
	});
};

export function getDateInUserTimeZone(date: Date, timeZone: string){
	return getLocaleStringWithTimeZone(date, timeZone, undefined, {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export function getTimeWithTimeZoneString(date: Date, timeZone: string){
	return getLocaleStringWithTimeZone(date, timeZone, undefined, {
		hourCycle: "h12",
		hour: "numeric",
		minute: "2-digit",
		timeZone: timeZone,
	});
}



export function getUTCDate(){
	const currentDate = new Date();
	return new Date(currentDate.toUTCString());
}

export function getDateDifferentInHours(date1: Date, date2: Date){
	const diffInMs = date1.getTime() - date2.getTime();
	return diffInMs / ONE_HOUR_IN_MILLISECONDS;
}

export function localeDateToUtc(date: Date){
  return new Date(date.toISOString());
}

export function isEventCurrentlyHappening(currentDateUTC:Date,eventStart: Date, eventEnd: Date){
	return currentDateUTC >= eventStart && currentDateUTC <= eventEnd;
}

export function isEventCheckinAllowed(currentDateUTC:Date,checkinStart:Date,checkinEnd:Date){
	return currentDateUTC >= checkinStart && currentDateUTC <= checkinEnd;
}

export function deepFreeze <T extends object>(obj: T) {
	Object.keys(obj).forEach((prop) => {
		const value = obj[prop as keyof T];
		if (
			typeof value === "object" &&
			!Object.isFrozen(value)
		) {
			deepFreeze(value as object);
		}
	});
	return Object.freeze(obj);
};