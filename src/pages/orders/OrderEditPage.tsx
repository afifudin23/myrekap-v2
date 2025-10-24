import { Loading } from "@/components/atoms";
import { TitlePage } from "@/components/molecules";
import { OrderForm } from "@/components/organisms/orders";
import MainLayout from "@/components/templates/MainLayout";
import { toFormData } from "@/pages/orders/OrderCreatePage";
import { orderSchema } from "@/schemas";
import { axiosInstance, formatters } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate, useParams } from "react-router-dom";

function OrderEditPage() {
    const { id } = useParams();
    const data = JSON.parse(localStorage.getItem("orderDetail") || "{}");
    const order = formatters.parseInputOrder(data);
    const navigate = useNavigate();
    const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        handleSubmit,
        control,
        watch,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<orderSchema.UpdateType>({
        resolver: zodResolver(orderSchema.update),
        defaultValues: order,
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const formData = toFormData(data);
            await axiosInstance.patch(`orders/myrekap/${id}`, formData);

            navigate("/orders", { state: { message: `Pesanan berhasil diupdate` } });
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
    };

    return (
        <MainLayout>
            <div className="flex justify-between">
                <TitlePage title="Update Order" subtitle="Mengupdate Order Sesuai Kebutuhan" />
                <button
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    <TbLogout2 className="text-5xl 2xl:text-6xl" />
                </button>
            </div>
            <OrderForm
                onSubmit={handleSubmit(onSubmit)}
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

export default OrderEditPage;
