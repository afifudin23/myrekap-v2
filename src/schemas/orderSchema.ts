import { TypeOf, z } from "zod";

export const create = z
    .object({
        customerName: z.string().nonempty("Harap isi nama terlebih dahulu."),
        customerCategory: z.enum(["UMUM", "PEMDA", "PERBANKAN"], {
            required_error: "Harap pilih kategori terlebih dahulu.",
            invalid_type_error: "Kategori tidak valid.",
        }),
        phoneNumber: z.string().nonempty("Harap isi nomor telepon terlebih dahulu."),
        items: z.array(
            z.object({
                productId: z.string().nonempty("Harap pilih bunga terlebih dahulu."),
                quantity: z.coerce.number().positive("Jumlah pesanan harus lebih dari 0."),
                message: z
                    .string()
                    .transform((val) => (val === "" ? null : val))
                    .nullish(),
                price: z.coerce.number().positive("Harga harus lebih dari 0."),
            })
        ),
        readyDate: z.date({
            required_error: "Harap isi tanggal produk jadi terlebih dahulu.",
            invalid_type_error: "Format tanggal tidak valid.",
        }),
        deliveryOption: z.enum(["DELIVERY", "SELF_PICKUP"], {
            required_error: "Harap pilih metode pengiriman terlebih dahulu.",
            invalid_type_error: "Metode pengiriman tidak valid.",
        }),
        deliveryAddress: z
            .string()
            .transform((val) => (val === "" ? null : val))
            .nullish(),
        shippingCost: z
            .number()
            .optional()
            .refine((val) => val! >= 0, "Biaya pengiriman harus lebih dari atau sama dengan 0."),
        isPaid: z.boolean().default(false),
        paymentMethod: z
            .enum(["CASH", "BANK_TRANSFER"], {
                required_error: "Harap pilih metode pembayaran terlebih dahulu.",
                invalid_type_error: "Metode pembayaran tidak valid.",
            })
            .nullable(),
        paymentProof: z
            .array(
                z.instanceof(File).refine((file) => (file?.size ? file.size <= 2 * 1024 * 1024 : true), {
                    message: "Ukuran maksimal file adalah 2 MB.",
                })
            )
            .nullish(),
    })
    .superRefine((data, ctx) => {
        // If delivery option is "SELF_PICKUP", set delivery address to null
        if (data.deliveryOption === "DELIVERY") {
            if (!data.deliveryAddress) {
                ctx.addIssue({
                    path: ["deliveryAddress"],
                    code: z.ZodIssueCode.custom,
                    message: "Harap isi alamat pengiriman terlebih dahulu untuk metode pengiriman kirim ke alamat.",
                });
            } else if (!data.shippingCost) {
                ctx.addIssue({
                    path: ["shippingCost"],
                    code: z.ZodIssueCode.custom,
                    message: "Harap isi biaya pengiriman terlebih dahulu untuk metode pengiriman kirim ke alamat.",
                });
            }
        } else if (data.deliveryOption === "SELF_PICKUP") {
            data.deliveryAddress = null;
            data.shippingCost = undefined;
        }
        if (data.isPaid) {
            if (!data.paymentMethod) {
                ctx.addIssue({
                    path: ["paymentMethod"],
                    code: z.ZodIssueCode.custom,
                    message: "Harap pilih metode pembayaran terlebih dahulu untuk status pembayaran sudah dibayar.",
                });
            }
            if (data.paymentMethod === "BANK_TRANSFER" && (!data.paymentProof || data.paymentProof.length === 0)) {
                ctx.addIssue({
                    path: ["paymentProof"],
                    code: z.ZodIssueCode.custom,
                    message: "Harap unggah bukti transfer terlebih dahulu untuk metode pembayaran transfer.",
                });
            }
        } else if (!data.isPaid) {
            data.paymentMethod = null;
            data.paymentProof = [];
        }
    });

export type CreateType = TypeOf<typeof create>;

const existingFile = z.object({
    id: z.string(),
    fileName: z.string(),
    orderId: z.string(),
    publicId: z.string(),
    secureUrl: z.string(),
    size: z.number(),
});

export const update = z
    .object({
        customerName: z.string().nonempty("Harap isi nama terlebih dahulu."),
        customerCategory: z.enum(["UMUM", "PEMDA", "PERBANKAN"], {
            required_error: "Harap pilih kategori terlebih dahulu.",
            invalid_type_error: "Kategori tidak valid.",
        }),
        phoneNumber: z.string().nonempty("Harap isi nomor telepon terlebih dahulu."),
        items: z.array(
            z.object({
                productId: z.string().nonempty("Harap pilih bunga terlebih dahulu."),
                quantity: z.coerce.number().positive("Jumlah pesanan harus lebih dari 0."),
                price: z.number(),
                message: z
                    .string()
                    .transform((val) => (val === "" ? null : val))
                    .nullish(),
            })
        ),
        readyDate: z.date({
            required_error: "Harap isi tanggal siap terlebih dahulu.",
            invalid_type_error: "Format tanggal tidak valid.",
        }),
        deliveryOption: z.enum(["DELIVERY", "SELF_PICKUP"], {
            required_error: "Harap pilih metode pengiriman terlebih dahulu.",
            invalid_type_error: "Metode pengiriman tidak valid.",
        }),
        deliveryAddress: z
            .string()
            .transform((val) => (val === "" ? null : val))
            .nullish(), // Make it nullable to allow clearing the field
        shippingCost: z
            .number({
                required_error: "Harap isi biaya pengiriman terlebih dahulu.",
                invalid_type_error: "Biaya pengiriman tidak valid.",
            })
            .nullish(),
        isPaid: z.boolean({
            required_error: "Harap pilih status pembayaran terlebih dahulu.",
            invalid_type_error: "Status pembayaran tidak valid.",
        }),
        paymentMethod: z
            .enum(["CASH", "BANK_TRANSFER"], {
                required_error: "Harap pilih metode pembayaran terlebih dahulu.",
                invalid_type_error: "Metode pembayaran tidak valid.",
            })
            .nullish(),
        paymentProof: z
            .array(
                z.union([
                    existingFile,
                    z
                        .instanceof(File)
                        .nullish()
                        .refine((file) => (file?.size ? file.size <= 2 * 1024 * 1024 : true), {
                            message: "Ukuran maksimal file adalah 2 MB.",
                        }),
                ])
            )
            .nullish(),
    })
    .superRefine((data, ctx) => {
        // If delivery option is "SELF_PICKUP", set delivery address to null
        if (data.deliveryOption === "DELIVERY") {
            if (!data.deliveryAddress) {
                ctx.addIssue({
                    path: ["deliveryAddress"],
                    code: z.ZodIssueCode.custom,
                    message: "Harap isi alamat pengiriman terlebih dahulu untuk metode pengiriman kirim ke alamat.",
                });
            } else if (!data.shippingCost) {
                ctx.addIssue({
                    path: ["shippingCost"],
                    code: z.ZodIssueCode.custom,
                    message: "Harap isi biaya pengiriman terlebih dahulu untuk metode pengiriman kirim ke alamat.",
                });
            }
        } else if (data.deliveryOption === "SELF_PICKUP") {
            data.deliveryAddress = null;
            data.shippingCost = 0;
        }
        if (data.isPaid) {
            if (!data.paymentMethod) {
                ctx.addIssue({
                    path: ["paymentMethod"],
                    code: z.ZodIssueCode.custom,
                    message: "Harap pilih metode pembayaran terlebih dahulu untuk status pembayaran sudah dibayar.",
                });
            }
            if (data.paymentMethod === "BANK_TRANSFER" && (!data.paymentProof || data.paymentProof?.length === 0)) {
                ctx.addIssue({
                    path: ["paymentProof"],
                    code: z.ZodIssueCode.custom,
                    message: "Harap unggah bukti transfer terlebih dahulu untuk metode pembayaran transfer.",
                });
            }
        } else if (!data.isPaid) {
            data.paymentMethod = null;
            data.paymentProof = null;
        }
    });

export type UpdateType = TypeOf<typeof update>;
