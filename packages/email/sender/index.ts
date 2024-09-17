import Plunk from "@plunk/node";

export const plunk = new Plunk(process.env.PLUNK_API_KEY as string);
export { render } from "@react-email/render";
