export type HackKitActionResult<T = void> = {
    ok: true;
    data: T;
} | {
    ok: false;
    message: string;
};
export declare function actionSuccess<T = void>(data?: T): HackKitActionResult<T>;
export declare function actionFailure(error: unknown, message?: string): HackKitActionResult<never>;
//# sourceMappingURL=actions.d.ts.map