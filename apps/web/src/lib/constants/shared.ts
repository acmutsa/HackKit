import c from "config";

const { hackathonName, itteration } = c;

export const ONE_HOUR_IN_MILLISECONDS = 3600000;
export const VERCEL_IP_TIMEZONE_HEADER_KEY = "x-vercel-ip-timezone";
export const BLOB_RESUME_URL = `${c.hackathonName}/${c.itteration}/resume`;
