export type AuthActionState<TData = undefined> = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
  data?: TData;
};

export const initialAuthActionState: AuthActionState = { status: "idle" };

export type ForgotPasswordActionData = { challengeToken: string };
export type VerifyPasswordResetOtpActionData = { resetToken: string };
