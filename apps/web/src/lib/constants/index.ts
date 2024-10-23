import c from "config";
export const ONE_HOUR_IN_MILLISECONDS = 3600000;
export const VERCEL_IP_TIMEZONE_HEADER_KEY = "x-vercel-ip-timezone";
export const PHONE_NUMBER_REGEX = /^(\+\d{1,2}\s?)?\(?\d{3}\)?\s?[\s.-]?\s?\d{3}\s?[\s.-]?\s?\d{4}$/gm;
export const DUPLICATE_KEY_ERROR_CODE = '23505';
export const UNIQUE_KEY_MAPPER_DEFAULT_KEY = 'default' as keyof typeof c.db.UniqueKeyMapper;