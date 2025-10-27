import { TypeOf, z } from "zod";

export const create = z
    .object({
        name: z.string().min(1, { message: "Nama produk harus diisi" }),
        price: z.number().min(1, { message: "Harga produk harus diisi" }),
        description: z.string().min(1, { message: "Deskripsi produk harus diisi" }),
        isActive: z.boolean({ required_error: "Harap pilih status produk terlebih dahulu." }),
        images: z.array(
            z
                .instanceof(File)
                .nullish()
                .refine((file) => (file?.size ? file.size <= 2 * 1024 * 1024 : true), {
                    message: "Ukuran maksimal file adalah 2 MB.",
                })
        ),
    })
    .superRefine((data, ctx) => {
        if (!data.images || data.images.length === 0) {
            ctx.addIssue({
                path: ["images"],
                code: z.ZodIssueCode.custom,
                message: "Harap unggah gambar produk terlebih dahulu.",
            });
        }
    });

export type CreateType = TypeOf<typeof create>;

const existingFile = z.object({
    id: z.string(),
    fileName: z.string(),
    productId: z.string(),
    publicId: z.string(),
    secureUrl: z.string(),
    size: z.number(),
});

export const update = z.object({
    name: z.string().min(1, { message: "Nama produk harus diisi" }),
    price: z.number().min(1, { message: "Harga produk harus diisi" }),
    description: z.string().min(1, { message: "Deskripsi produk harus diisi" }),
    isActive: z.boolean({ required_error: "Harap pilih status produk terlebih dahulu." }),
    publicIdsToDelete: z.array(z.string()).optional(),
    images: z.array(
        z.union([
            existingFile,
            z
                .instanceof(File)
                .nullish()
                .refine((file) => (file?.size ? file.size <= 2 * 1024 * 1024 : true), {
                    message: "Ukuran maksimal file adalah 2 MB.",
                }),
        ])
    ),
});

export type UpdateType = TypeOf<typeof update>;

export const manageStock = z.object({
    name: z.string(),
    type: z
        .enum(["stock_in", "stock_out"], {
            required_error: "Tipe perubahan stock harus diisi",
            invalid_type_error: "Tipe perubahan stock tidak valid",
        }),
    quantity: z.coerce
        .number({ invalid_type_error: "Jumlah produk tidak valid" })
        .min(1, { message: "Jumlah produk harus diisi" }),
    note: z.string().min(1, { message: "Note harus diisi" }),
});

export type ManageStockType = TypeOf<typeof manageStock>;
