import c from "config";
export const ONE_HOUR_IN_MILLISECONDS = 3600000;
export const FIVE_MINUTES_IN_MILLISECONDS = 300000;
export const PHONE_NUMBER_REGEX =
	/^(\+\d{1,2}\s?)?\(?\d{3}\)?\s?[\s.-]?\s?\d{3}\s?[\s.-]?\s?\d{4}$/gm;
export const UNIQUE_KEY_CONSTRAINT_VIOLATION_CODE = "23505";
export const UNIQUE_KEY_MAPPER_DEFAULT_KEY =
	"default" as keyof typeof c.db.uniqueKeyMapper;
export const PAYLOAD_TOO_LARGE_CODE = 413;
export const HACKER_REGISTRATION_STORAGE_KEY = `${c.hackathonName}_${c.itteration}_hackerRegistrationData`;
export const HACKER_REGISTRATION_RESUME_STORAGE_KEY =
	"hackerRegistrationResume";
export const NOT_LOCAL_SCHOOL = "NOT_LOCAL_SCHOOL";
