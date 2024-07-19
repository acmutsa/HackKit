import { z, ZodError } from "zod";
import axios from "axios";
import superjson from "superjson";

interface zfetchOptions {
	url: string;
	superRes?: boolean;
}

interface zgetOptions<T extends z.ZodType<any, any>> extends zfetchOptions {
	v: T;
}

interface zpostOptions<Req = any, Res = any> extends zfetchOptions {
	vReq?: z.ZodType<Req, any>;
	vRes?: z.ZodType<Res, any>;
	superReq?: boolean;
	body?: Req;
}

export type SafeParseResult<T> =
	| {
			success: true;
			data: T;
	  }
	| {
			success: false;
			error: ZodError;
	  };

export async function zget<T extends z.ZodType<any, any>>({
	url,
	v,
	superRes,
}: zgetOptions<T>): Promise<z.infer<T>> {
	const { data } = await axios.get(url);
	return v.parse(superRes ? superjson.parse(data) : data);
}

export async function zgetSafe<T extends z.ZodType<any, any>>({
	url,
	v,
	superRes,
}: zgetOptions<T>): Promise<SafeParseResult<z.infer<T>>> {
	const { data } = await axios.get(url);
	const result = v.safeParse(superRes ? superjson.parse(data) : data);
	if (result.success) {
		return { success: true, data: result.data };
	} else {
		return { success: false, error: result.error };
	}
}

export async function zpost<Req = any, Res = any>({
	url,
	vReq,
	vRes,
	body,
	superReq,
	superRes,
}: zpostOptions<Req, Res>): Promise<Res> {
	if (vReq && body) {
		body = vReq.parse(body);
	}
	const { data } = await axios.post(
		url,
		superReq ? superjson.stringify(body) : body,
	);
	return vRes
		? vRes.parse(superRes ? superjson.parse(data) : data)
		: superRes
			? superjson.parse(data)
			: data;
}

export async function zpostSafe<Req = any, Res = any>({
	url,
	vRes,
	vReq,
	body,
	superReq,
	superRes,
}: zpostOptions<Req, Res>): Promise<SafeParseResult<Res>> {
	try {
		if (vReq && body) {
			body = vReq.parse(body);
		}
		const { data } = await axios.post(
			url,
			superReq ? superjson.stringify(body) : body,
		);
		if (vRes) {
			const result = vRes.safeParse(
				superRes ? superjson.parse(data) : data,
			);
			if (result.success) {
				return { success: true, data: result.data };
			} else {
				return { success: false, error: result.error };
			}
		} else {
			return { success: true, data: data as Res };
		}
	} catch (error) {
		return { success: false, error: error as ZodError };
	}
}
