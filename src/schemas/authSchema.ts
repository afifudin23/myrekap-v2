import { z, TypeOf } from "zod";

export const login = z.object({
    username: z.string()
        .nonempty("Username wajib diisi")
        .min(3, "Username minimal 3 karakter")
        .max(10, "Username maksimal 10 karakter"),
    password: z.string().nonempty("Password wajib diisi").min(6, "Password minimal 6 karakter"),
});

export type LoginType = TypeOf<typeof login>;

export const forgotPassword = z.object({
    email: z.string().email(),
});

export type ForgotPasswordType = TypeOf<typeof forgotPassword>;

export const resetPassword = z.object({
    password: z.string().min(6, "Password minimal 6 karakter"),
    confPassword: z.string().min(6, "Password minimal 6 karakter"),
});

export type ResetPasswordType = TypeOf<typeof resetPassword>;