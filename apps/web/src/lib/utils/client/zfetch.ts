import { z, ZodError } from "zod";
import axios from "axios";

interface zfetchOptions {
	url: string;
}

interface zgetOptions<T extends z.ZodType<any, any>> extends zfetchOptions {
	v: T;
}

interface zpostOptions<Req = any, Res = any> extends zfetchOptions {
	v?: z.ZodType<Res, any>;
	vbody?: z.ZodType<Req, any>;
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
}: zgetOptions<T>): Promise<z.infer<T>> {
	const { data } = await axios.get(url);
	return v.parse(data);
}

export async function zgetSafe<T extends z.ZodType<any, any>>({
	url,
	v,
}: zgetOptions<T>): Promise<SafeParseResult<z.infer<T>>> {
	const { data } = await axios.get(url);
	const result = v.safeParse(data);
	if (result.success) {
		return { success: true, data: result.data };
	} else {
		return { success: false, error: result.error };
	}
}

export async function zpost<Req = any, Res = any>({
	url,
	v,
	vbody,
	body,
}: zpostOptions<Req, Res>): Promise<Res> {
	if (vbody && body) {
		body = vbody.parse(body);
	}
	const { data } = await axios.post(url, body);
	return v ? v.parse(data) : data;
}

export async function zpostSafe<Req = any, Res = any>({
	url,
	v,
	vbody,
	body,
}: zpostOptions<Req, Res>): Promise<SafeParseResult<Res>> {
	try {
		if (vbody && body) {
			body = vbody.parse(body);
		}
		const { data } = await axios.post(url, body);
		if (v) {
			const result = v.safeParse(data);
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
