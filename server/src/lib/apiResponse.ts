export type ApiResponse<T> = {
    success: boolean;
    message: string;
    requestId?: string;
    data?: T;
    errors?: unknown;
};

export const ok = <T>(data: T, message = 'OK', requestId?: string): ApiResponse<T> => ({
    success: true,
    message,
    requestId,
    data,
});

export const fail = (
    message: string,
    errors?: unknown,
    requestId?: string,
): ApiResponse<undefined> => ({
    success: false,
    message,
    requestId,
    errors,
});
