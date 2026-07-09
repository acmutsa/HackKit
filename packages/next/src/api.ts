import {
	APIError,
	createEndpoint,
	createRouter,
} from "better-call";
import { z } from "zod";
import {
	CoreSetting,
	type AuthAdapter,
	type AuthSession,
	type HackKit,
	type SettingKey,
	type SettingValue,
	type User,
} from "@hackkit/core";
import type {
	AssignRoleInput,
	ApproveUserInput,
	BanUserInput,
	CheckInUserInput,
	CreateRoleInput,
	EventFormValues,
	HackKitUIActions,
	HackTagFormValues,
	HackerRegistrationFormValues,
	PreviewEventPassQrInput,
	RecordEventScanInput,
	SetRsvpStatusInput,
	SetSettingsInput,
	UpdateRoleInput,
	UserDataFormValues,
	UserProfileFormValues,
} from "@hackkit/ui";
import { createHackKitMutations } from "./mutations";
import {
	HACKKIT_API_BASE_PATH,
	HACKKIT_UI_ACTION_ENDPOINTS,
} from "./endpoints";

export { HACKKIT_API_BASE_PATH, HACKKIT_UI_ACTION_ENDPOINTS } from "./endpoints";

const authId = z.string().min(1);
const roleId = z.string().min(1);
const eventForm = z.object({
	title: z.string().min(1).max(255),
	description: z.string().min(1),
	startTime: z.string().min(1),
	endTime: z.string().min(1),
	location: z.string().min(1).max(255),
	type: z.string().min(1),
	host: z.string(),
	hidden: z.boolean(),
});
const settingValues = z.array(
	z.object({ key: z.string().min(1), value: z.union([z.boolean(), z.number()]) }),
);

type RequestSessionResolver = (headers: Headers) => Promise<AuthSession | null>;

export type CreateHackkitApiOptions = {
	hackkit: HackKit;
	auth: AuthAdapter;
	resolveSession: RequestSessionResolver;
	getSettingValue: (key: SettingKey) => Promise<SettingValue>;
	invalidateSettingsCache?: () => void;
	afterCurrentUser?: (user: User, hackkit: HackKit) => Promise<void>;
	allowedOrigins?: readonly string[];
};

function requireSameOrigin(
	request: Request,
	allowedOrigins: readonly string[] | undefined,
): void {
	if (request.method === "GET" || request.method === "HEAD") return;
	const origin = request.headers.get("origin");
	const requestOrigin = new URL(request.url).origin;
	if (!origin || !(allowedOrigins ?? [requestOrigin]).includes(origin)) {
		throw new APIError("FORBIDDEN", {
			code: "CSRF_ORIGIN_MISMATCH",
			message: "This request origin is not allowed.",
		});
	}
}

/**
 * A static Better Call registry for the Core UI contract. Each endpoint takes
 * the incoming request headers explicitly, so cookie sessions never depend on
 * Next's ambient request context.
 */
export function createHackkitApi(options: CreateHackkitApiOptions) {
	async function getActorAuthId(headers: Headers): Promise<string> {
		const session = await options.resolveSession(headers);
		if (!session) {
			throw new APIError("UNAUTHORIZED", {
				code: "UNAUTHENTICATED",
				message: "Sign in to continue.",
			});
		}
		const authId = options.auth.toAuthId(session);
		const identity = options.auth.getIdentity(session);
		const user = await options.hackkit.users.ensureUser({ authId, ...identity });
		await options.afterCurrentUser?.(user, options.hackkit);
		return authId;
	}

	async function mutations(headers: Headers) {
		const actorAuthId = await getActorAuthId(headers);
		return createHackKitMutations({
			hackkit: options.hackkit,
			getAuthId: async () => actorAuthId,
			getSettingValue: options.getSettingValue,
			invalidateSettingsCache: options.invalidateSettingsCache,
		});
	}

	function endpoint<Body, Result>(
		path: string,
		body: z.ZodType<Body>,
		call: (actions: HackKitUIActions, body: Body) => Promise<Result>,
	) {
		return createEndpoint(
			path,
			{
				method: "POST",
				body,
				requireHeaders: true,
				metadata: { scope: "rpc" },
			},
			async (context) => call(await mutations(context.headers), context.body),
		);
	}

	const api = {
		completeUserData: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.completeUserData,
			z.object({
				age: z.number(),
				gender: z.string(),
				race: z.string(),
				ethnicity: z.string(),
				shirtSize: z.string(),
				dietaryRestrictions: z.array(z.string()),
				accommodationNote: z.string().optional(),
				phoneNumber: z.string().optional(),
				countryOfResidence: z.string().optional(),
				hasAcceptedMLHCodeOfConduct: z.boolean(),
				hasSharedDataWithMLH: z.boolean(),
				isEmailable: z.boolean(),
			}),
			(actions, body) => actions.completeUserData(body as UserDataFormValues),
		),
		claimHackTag: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.claimHackTag,
			z.object({ hackTag: z.string().min(1).max(50) }),
			(actions, body) => actions.claimHackTag(body as HackTagFormValues),
		),
		updateUserProfile: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.updateUserProfile,
			z.object({
				firstName: z.string().min(1).max(100),
				lastName: z.string().min(1).max(100),
				hackTag: z.string().min(1).max(50),
				bio: z.string().max(500).optional(),
				pronouns: z.string().max(40).optional(),
				skills: z.array(z.string().min(1).max(40)).max(20),
				isProfileSearchable: z.boolean(),
				discordDisplayHandle: z.string().max(40).optional(),
				profilePhotoUrl: z.string().optional(),
			}),
			(actions, body) => actions.updateUserProfile(body as UserProfileFormValues),
		),
		registerHacker: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.registerHacker,
			z.object({
				university: z.string().min(1),
				major: z.string().min(1),
				schoolId: z.string().optional(),
				levelOfStudy: z.string().min(1),
				hackathonsAttended: z.number().int().nonnegative(),
				softwareExperience: z.string().min(1),
				heardFrom: z.string().optional(),
				githubUrl: z.string().url().optional(),
				linkedInUrl: z.string().url().optional(),
				personalWebsiteUrl: z.string().url().optional(),
				resumeUrl: z.string().min(1).optional(),
			}),
			(actions, body) => actions.registerHacker(body as HackerRegistrationFormValues),
		),
		createEvent: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.createEvent,
			eventForm,
			(actions, body) => actions.createEvent(body as EventFormValues),
		),
		updateEvent: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.updateEvent,
			z.object({ eventId: z.string().min(1), values: eventForm }),
			(actions, body) =>
				actions.updateEvent(body.eventId, body.values as EventFormValues),
		),
		deleteEvent: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.deleteEvent,
			z.object({ eventId: z.string().min(1) }),
			(actions, body) => actions.deleteEvent(body.eventId),
		),
		previewEventPassQr: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.previewEventPassQr,
			z.object({ rawQr: z.string().min(1), eventId: z.string().min(1).optional() }),
			(actions, body) => actions.previewEventPassQr(body as PreviewEventPassQrInput),
		),
		recordEventScan: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.recordEventScan,
			z.object({ rawQr: z.string().min(1), eventId: z.string().min(1) }),
			(actions, body) => actions.recordEventScan(body as RecordEventScanInput),
		),
		checkInUser: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.checkInUser,
			z.object({ rawQr: z.string().min(1) }),
			(actions, body) => actions.checkInUser(body as CheckInUserInput),
		),
		clearCheckIn: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.clearCheckIn,
			z.object({ targetAuthId: authId }),
			(actions, body) => actions.clearCheckIn(body.targetAuthId),
		),
		confirmRsvp: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.confirmRsvp,
			z.object({}),
			(actions) => actions.confirmRsvp(),
		),
		cancelRsvp: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.cancelRsvp,
			z.object({ targetAuthId: authId }),
			(actions, body) => actions.cancelRsvp(body.targetAuthId),
		),
		setRsvpStatus: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.setRsvpStatus,
			z.object({
				targetAuthId: authId,
				status: z.enum(["confirmed", "waitlisted", "cancelled"]),
			}),
			(actions, body) => actions.setRsvpStatus(body as SetRsvpStatusInput),
		),
		promoteRsvp: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.promoteRsvp,
			z.object({ targetAuthId: authId.optional() }),
			(actions, body) => actions.promoteRsvp(body.targetAuthId),
		),
		approveUser: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.approveUser,
			z.object({ targetAuthId: authId, approved: z.boolean() }),
			(actions, body) => actions.approveUser(body as ApproveUserInput),
		),
		banUser: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.banUser,
			z.object({ targetAuthId: authId, reason: z.string().optional() }),
			(actions, body) => actions.banUser(body as BanUserInput),
		),
		unbanUser: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.unbanUser,
			z.object({ targetAuthId: authId }),
			(actions, body) => actions.unbanUser(body.targetAuthId),
		),
		assignRoleToUser: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.assignRoleToUser,
			z.object({ targetAuthId: authId, roleId }),
			(actions, body) => actions.assignRoleToUser(body as AssignRoleInput),
		),
		createRole: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.createRole,
			z.object({
				id: roleId.optional(),
				name: z.string().min(1).max(50),
				position: z.number().int().nonnegative(),
				permissions: z.array(z.string().min(1)),
				color: z.string().optional(),
			}),
			(actions, body) => actions.createRole(body as CreateRoleInput),
		),
		updateRole: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.updateRole,
			z.object({
				roleId,
				name: z.string().min(1).max(50).optional(),
				position: z.number().int().nonnegative().optional(),
				permissions: z.array(z.string().min(1)).optional(),
				color: z.string().optional(),
			}),
			(actions, body) => actions.updateRole(body as UpdateRoleInput),
		),
		deleteRole: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.deleteRole,
			z.object({ roleId }),
			(actions, body) => actions.deleteRole(body.roleId),
		),
		listSettings: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.listSettings,
			z.object({}),
			(actions) => actions.listSettings(),
		),
		setSettings: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.setSettings,
			settingValues,
			(actions, body) => actions.setSettings(body as SetSettingsInput),
		),
		resetSetting: endpoint(
			HACKKIT_UI_ACTION_ENDPOINTS.resetSetting,
			z.object({ key: z.string().min(1) }),
			(actions, body) => actions.resetSetting(body.key as SettingKey),
		),
	} as const;

	function errorResponse(error: unknown): Response {
		if (error instanceof APIError) {
			return Response.json(error.body ?? { message: error.message }, {
				status: error.statusCode,
			});
		}
		return Response.json(
			{ message: "The HackKit API could not process this request." },
			{ status: 500 },
		);
	}

	const router = createRouter(api, {
		basePath: HACKKIT_API_BASE_PATH,
		allowedMediaTypes: ["application/json"],
		onError: errorResponse,
	});

	return {
		api,
		router,
		handler: async (request: Request) => {
			try {
				requireSameOrigin(request, options.allowedOrigins);
				return await router.handler(request);
			} catch (error) {
				return errorResponse(error);
			}
		},
	};
}
