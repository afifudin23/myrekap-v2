import { TypeOf, z } from "zod";

export const create = z.object({
    fullName: z.string().nonempty("Nama Lengkap wajib diisi"),
    username: z.string().nonempty("Username wajib diisi"),
    email: z.string().email("Format email tidak valid"),
    phoneNumber: z.string().nonempty("Nomor telepon wajib diisi"),
    password: z.string().length(6, "Password Harus 6 Angka"),
    confPassword: z.string().length(6, "Password Harus 6 Angka"),
});

export type CreateType = TypeOf<typeof create>;

export const update = z.object({
    fullName: z.string().nonempty("Nama Lengkap wajib diisi"),
    username: z.string().nonempty("Username wajib diisi"),
    email: z.string().email("Format email tidak valid"),
    phoneNumber: z.string().nonempty("Nomor telepon wajib diisi"),
    password: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.string().length(6, "Password Harus 6 Angka").optional()
    ),
    confPassword: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.string().length(6, "Password Harus 6 Angka").optional()
    ),
});

export type UpdateType = TypeOf<typeof update>;
