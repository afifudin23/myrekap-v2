import { TitlePage } from "@/components/molecules";
import { PRODUCT_FORM_ITEMS, ProductForm } from "@/components/organisms/products";
import MainLayout from "@/components/templates/MainLayout";
import { axiosInstance } from "@/utils";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";

function ProductEditPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Handle form submission
    const {
        handleSubmit,
        control,
        reset,
        setValue, // Add setValue for push to publicIdsToDelete
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            price: 0,
            description: "",
            images: [],
            publicIdsToDelete: [],
        },
    });

    // Check if the product is already in the local storage
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("productDetail") || "{}");
        if (data.id === id) {
            reset(data);
        } else {
            navigate("/products");
        }
    }, [id]);

    const onSubmit = handleSubmit(async (data: any) => {
        console.log(data)
        setIsLoading(true);
        try {
            const formData = new FormData();

            for (const key in data) {
                const value = data[key];

                // Handle multiple file upload
                if (key === "images" && Array.isArray(value)) {
                    value.forEach((item: any) => {
                        if (item instanceof File) {
                            formData.append("images", item);
                        }
                    });
                } else if (key === "publicIdsToDelete" && Array.isArray(value)) {
                    value.forEach((publicId: string) => {
                        formData.append(key, publicId);
                    });
                } else {
                    formData.append(key, value);
                }
            }

            await axiosInstance.put(`products/${id}`, formData);
            navigate("/products", {
                state: {
                    message: "Perubahan pada produk telah berhasil disimpan",
                },
            });
        } catch (error: any) {
            console.log(error.response.data);
            if (error.response.status === 500) {
                navigate("/products", {
                    state: {
                        message: "Oops! Server mengalami kendala teknis. Tim kami akan segera menanganinya",
                    },
                });
            } else {
                navigate("/products", {
                    state: {
                        message: error.response.data.message,
                    },
                });
            }
        } finally {
            setIsLoading(false);
        }
    });

    return (
        <MainLayout>
            <div className="flex justify-between">
                <TitlePage title="Edit Produk" subtitle="Mengelola Data Produk Penjualan" />
                <button
                    onClick={() => {
                        navigate("/products");
                    }}
                >
                    <TbLogout2 className="text-5xl 2xl:text-6xl" />
                </button>
            </div>
            <ProductForm
                control={control}
                onSubmit={onSubmit}
                errors={errors}
                isLoading={isLoading}
                fieldRefs={fieldRefs}
                getValues={getValues}
                setValue={setValue}
                fields={PRODUCT_FORM_ITEMS}
            />
        </MainLayout>
    );
}

export default ProductEditPage;
