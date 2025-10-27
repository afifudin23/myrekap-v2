import { Label } from "@/components/atoms";
import { axiosInstance, formatters } from "@/utils";
import { useEffect, useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";

type OrderItemField = {
    productId: string;
    quantity: number;
    message?: string;
    price: number;
};
type FormValues = {
    items: OrderItemField[];
};

interface InputProductProps {
    label: string;
    name: string;
    control: any;
    setValue: any;
}

function InputProduct({ label, name, control, setValue }: InputProductProps) {
    const [categoryProducts, setCategoryProducts] = useState([]);
    const { fields, append, remove } = useFieldArray<FormValues, "items">({
        control,
        name: "items",
    });

    useEffect(() => {
        const getCategoryProducts = async () => {
            try {
                const response = await axiosInstance.get("/products");
                const allProducts = response.data.data;

                // get all id from fields
                const selectedIds = fields.map((f) => f.productId);

                // filter: get active products OR already selected products
                const products = allProducts.filter(
                    (product: any) => product.isActive === true || selectedIds.includes(product.id)
                );

                setCategoryProducts(products);
            } catch (error) {
                console.log(error);
            }
        };
        getCategoryProducts();
    }, [fields]); // tambah dependency supaya re-run kalau fields berubah

    return (
        <div className="flex flex-col gap-3">
            <Label id={name} children={label} />

            <div className="space-y-6 w-full mx-auto p-4 border rounded-xl shadow">
                {fields.map((item, index) => (
                    <div key={item.id} className="border p-4 rounded-lg space-y-3 relative bg-gray-50">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold">Produk #{index + 1}</h4>
                            {fields.length > 1 && (
                                <button type="button" onClick={() => remove(index)} className="text-red-600 text-sm">
                                    Hapus
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {/* Product ID */}
                            <Controller
                                name={`items.${index}.productId`}
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <label className="block text-sm">Kategori Bunga</label>
                                        <select
                                            {...field}
                                            onChange={(e) => {
                                                const selected: any = categoryProducts.find(
                                                    (p: any) => p.id === e.target.value
                                                );
                                                field.onChange(e); // update productId
                                                setValue(`items.${index}.price`, selected?.price ?? 0); // set hidden price
                                            }}
                                            className="w-full border p-2 rounded"
                                            required
                                        >
                                            <option value="">-- Pilih Kategori --</option>
                                            {categoryProducts

                                                // filter produk yang sudah dipilih di field lain
                                                .filter(
                                                    (product: any) =>
                                                        !fields.some(
                                                            (f, i) => i !== index && f.productId === product.id // exclude current row
                                                        )
                                                )
                                                .map((product: any) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name} - {formatters.formatRupiah(product.price)}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                )}
                            />

                            {/* Quantity */}
                            <Controller
                                name={`items.${index}.quantity`}
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <label className="block text-sm">Jumlah (Qty)</label>
                                        <input
                                            {...field}
                                            type="number"
                                            min={1}
                                            className="w-full border p-2 rounded"
                                            required
                                        />
                                    </div>
                                )}
                            />

                            {/* Message */}
                            <Controller
                                name={`items.${index}.message`}
                                control={control}
                                render={({ field }) => (
                                    <div>
                                        <label className="block text-sm">Pesan (Optional)</label>
                                        <textarea {...field} className="w-full border p-2 rounded" />
                                    </div>
                                )}
                            />

                            {/* Hidden price */}
                            <Controller
                                name={`items.${index}.price`}
                                control={control}
                                render={({ field }) => <input type="hidden" {...field} />}
                            />
                        </div>
                    </div>
                ))}

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => append({ productId: "", quantity: 1, message: "", price: 0 })}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        + Tambah Produk
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InputProduct;
