import { TitlePage } from "@/components/molecules";
import MainLayout from "@/components/templates/MainLayout";
import { useRef, useState } from "react";
import { OrderForm } from "@/components/organisms/orders";
import { axiosInstance } from "@/utils";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";
import { Loading } from "@/components/atoms";
import { orderSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export function toFormData<T extends Record<string, unknown>>(data: T): FormData {
    const formData = new FormData();

    (Object.entries(data) as [keyof T, T[keyof T]][]).forEach(([key, value]) => {
        if (key === "paymentProof" && Array.isArray(value)) {
            (value as File[]).forEach((file) => {
                formData.append(key as string, file);
            });
        } else if (value instanceof Date) {
            formData.append(key as string, value.toISOString());
        } else if (typeof value === "object" && value !== null && !(value instanceof File)) {
            formData.append(key as string, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
            formData.append(key as string, String(value));
        }
    });

    return formData;
}

function OrderCreatePage() {
    const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const {
        handleSubmit,
        control,
        watch,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<orderSchema.CreateType>({
        resolver: zodResolver(orderSchema.create),
        defaultValues: {
            customerName: "",
            customerCategory: undefined,
            phoneNumber: "",
            items: [{ productId: "", quantity: 1, message: "", price: 0 }],
            readyDate: undefined,
            deliveryOption: undefined,
            deliveryAddress: "",
            shippingCost: 0,
            isPaid: false,
            paymentMethod: undefined,
            paymentProof: null,
        },
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            const formData = toFormData(data);
            await axiosInstance.post("orders/myrekap", formData);

            navigate("/orders", { state: { message: "Pesanan baru berhasil ditambahkan" } });
        } catch (error: any) {
            console.log(error.response.data);
            if (error.response.status === 500) {
                navigate("/orders", {
                    state: { message: "Oops! Server mengalami kendala teknis. Tim kami akan segera menanganinya" },
                });
            } else {
                navigate("/orders", { state: { message: error.response.data.message } });
            }
        } finally {
            setIsLoading(false);
        }
    });

    return (
        <MainLayout>
            <div className="flex justify-between">
                <TitlePage title="Tambah Order" subtitle="Menginput Order Sesuai Kebutuhan" />
                <button onClick={() => navigate("/orders")}>
                    <TbLogout2 className="text-5xl 2xl:text-6xl" />
                </button>
            </div>
            <OrderForm
                onSubmit={onSubmit}
                fieldRefs={fieldRefs}
                control={control}
                watch={watch}
                errors={errors}
                getValues={getValues}
                setValue={setValue}
            />

            {/* Loading */}
            {isLoading && <Loading />}
        </MainLayout>
    );
}

export default OrderCreatePage;
