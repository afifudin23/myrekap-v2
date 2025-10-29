import { TypeOf, z } from "zod";

export const create = z
    .object({
        fullName: z.string().nonempty("Nama Lengkap wajib diisi"),
        username: z.string().nonempty("Username wajib diisi"),
        email: z.string().email("Format email tidak valid"),
        phoneNumber: z.string().nonempty("Nomor telepon wajib diisi"),
        password: z.string().min(6, "Password minimal 6 karakter"),
        confPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter"),
    })
    .superRefine((data, ctx) => {
        if (data.password && data.confPassword && data.password !== data.confPassword) {
            ctx.addIssue({
                path: ["confPassword"],
                message: "Konfirmasi password harus sama dengan password baru",
                code: z.ZodIssueCode.custom,
            });
        }
    });

export type CreateType = TypeOf<typeof create>;

export const update = z
    .object({
        fullName: z.string().nonempty("Nama Lengkap wajib diisi"),
        username: z.string().nonempty("Username wajib diisi"),
        email: z.string().email("Format email tidak valid"),
        phoneNumber: z.string().nonempty("Nomor telepon wajib diisi"),
        password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
        confPassword: z.string().min(6, "Konfirmasi password Harus 6 Angka").optional().or(z.literal("")),
    })
    .superRefine((data, ctx) => {
        const oneFilled = !!(data.password || data.confPassword);
        const allFilled = !!(data.password && data.confPassword);

        if (oneFilled && !allFilled) {
            if (!data.password) {
                ctx.addIssue({
                    path: ["oldPassword"],
                    message: "Password lama tidak boleh kosong jika ingin mengganti password",
                    code: z.ZodIssueCode.custom,
                });
            }
            if (!data.confPassword) {
                ctx.addIssue({
                    path: ["confPassword"],
                    message: "Konfirmasi password tidak boleh kosong jika ingin mengganti password",
                    code: z.ZodIssueCode.custom,
                });
            }
        }

        if (data.password && data.confPassword && data.password !== data.confPassword) {
            ctx.addIssue({
                path: ["confPassword"],
                message: "Konfirmasi password harus sama dengan password baru",
                code: z.ZodIssueCode.custom,
            });
        }
    });

export type UpdateType = TypeOf<typeof update>;
