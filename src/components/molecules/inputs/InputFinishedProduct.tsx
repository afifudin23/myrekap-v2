import { Label } from "@/components/atoms";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller } from "react-hook-form";
import { IoMdClose } from "react-icons/io";

function InputFinishedProduct({ control, finishedProduct, handleDelete, errors }: any) {
    const [preview, setPreview] = useState<any | null>(finishedProduct);
    return (
        <Controller
            name="finishedProduct"
            control={control}
            render={({ field: { onChange, value } }) => {
                useEffect(() => {
                    if (value instanceof File) setPreview(value);
                }, [value]);
                const { getRootProps, getInputProps, isDragActive } = useDropzone({
                    accept: { "image/*": [] }, // Hanya menerima file gambar
                    multiple: false,
                    onDrop: (acceptedFiles) => {
                        const selectedFile = acceptedFiles[0];
                        if (selectedFile) {
                            onChange(selectedFile); // Simpan file ke react-hook-form
                        }
                    },
                });
                const isFile = preview instanceof File;
                const imageUrl = isFile ? URL.createObjectURL(preview) : preview?.secureUrl;
                return (
                    <div className="w-full flex flex-col justify-between gap-3">
                        <Label id="finishedProduct" children="Upload Foto Produk Selesai" />
                        <div
                            {...getRootProps()}
                            className="relative border-2 border-dashed p-4 rounded-lg cursor-pointer w-full h-64 2xl:h-[21rem] flex items-center justify-center text-xl"
                        >
                            <input {...getInputProps()} />
                            {preview ? (
                                <>
                                    <img
                                        src={imageUrl}
                                        alt="Preview Produk Selesai"
                                        className="h-full object-contain rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete?.(); // panggil handleDelete jika ada
                                            setPreview(null);
                                            onChange(null); // reset react-hook-form value
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                                    >
                                        <IoMdClose />
                                    </button>
                                </>
                            ) : isDragActive ? (
                                <p>Drop file di sini...</p>
                            ) : (
                                <p>Drag & drop file di sini, atau klik untuk memilih file</p>
                            )}
                            {errors.finishedProduct?.message && (
                                <p className="text-red-500 text-sm absolute bottom-2 left-2">
                                    *{errors.finishedProduct.message as string}
                                </p>
                            )}
                        </div>
                    </div>
                );
            }}
        />
    );
}

export default InputFinishedProduct;
