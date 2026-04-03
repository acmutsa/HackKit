import {auth} from "@/lib/utils/server/auth";
import {toNextJsHandler} from "better-auth/next-js";


export const {POST, GET} = toNextJsHandler(auth);