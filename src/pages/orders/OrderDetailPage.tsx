import { ButtonSmall, Loading } from "@/components/atoms";
import { AlertInfo, InputDropdown, InputFinishedProduct, TitlePage } from "@/components/molecules";
import { OrderDetailSection, OrderReceipt } from "@/components/organisms/orders";
import MainLayout from "@/components/templates/MainLayout";
import { ORDER_STATUS_ITEMS, ORDER_STATUS_LABELS } from "@/constants/category";
import { axiosInstance } from "@/utils";
import { pdf } from "@react-pdf/renderer";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

export interface ImageType {
    id: string;
    type: string;
    fileName: string;
    size: number;
    url: string;
    orderId: string;
}

function OrderDetailPage() {
    const navigate = useNavigate();
    const [order, setOrder] = useState(JSON.parse(localStorage.getItem("orderDetail") || "{}"));
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [isOpenUpdateStatus, setIsOpenUpdateStatus] = useState(false);
    const [isOpenPaymentProof, setIsOpenPaymentProof] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);
    const paymentProof = order.images?.find((img: ImageType) => img.type === "PAYMENT_PROOF");
    const finishedProduct = order.images?.find((img: ImageType) => img.type === "FINISHED_PRODUCT");

    const {
        control,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            finishedProduct,
            status: order.orderStatus,
            isDeleteImage: false,
        },
    });

    useEffect(() => {
        const storedOrder = localStorage.getItem("orderDetail");
        if (storedOrder) {
            setOrder(JSON.parse(storedOrder));
        }
        setIsLoading(false);
    }, []);

    const handleUpdateStatus = async (data: any) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("status", String(data.status));
            formData.append("isDeleteImage", String(data.isDeleteImage));
            formData.append("finishedProduct", data.finishedProduct);
            const response = await axiosInstance.patch(`orders/myrekap/${order.id}/status`, formData);
            const resData = response.data.data;
            const updatedOrder = {
                ...order,
                orderStatus: resData.orderStatus,
                images: resData.images,
            };

            localStorage.setItem("orderDetail", JSON.stringify(updatedOrder));
            setOrder(updatedOrder);

            setShowAlert(true);
            setMessage("Progres berhasil diperbarui");
        } catch (error: any) {
            console.log(error.response.data);
            if (error.response.status === 500) {
                setShowAlert(true);
                setMessage("Oops! Server mengalami kendala teknis. Tim kami akan segera menanganinya");
            } else {
                setShowAlert(true);
                setMessage(error.response.data.message);
            }
        } finally {
            setTimeout(() => setShowAlert(false), 3000);
            setIsLoading(false);
            setIsOpenUpdateStatus(false);
        }
    };
    const handleDeleteFinishedProduct = () => {
        setValue("finishedProduct", null);
        setValue("isDeleteImage", true);
    };

    const handlePrintPdf = async () => {
        const blob = await pdf(<OrderReceipt data={order} />).toBlob();
        const url = URL.createObjectURL(blob);

        const newWindow = window.open(url);
        if (newWindow) {
            newWindow.onload = function () {
                newWindow.focus();
                newWindow.print();
            };
        }
    };

    return (
        <MainLayout>
            <div className="flex justify-between">
                <TitlePage title="Detail Penjualan" subtitle="Mengelola Data Penjualan" />
                <button
                    onClick={() => {
                        navigate("/orders");
                        localStorage.removeItem("orderDetail");
                    }}
                >
                    <TbLogout2 className="text-5xl 2xl:text-6xl" />
                </button>
            </div>

            <OrderDetailSection
                order={order}
                isOpenUpdateStatus={isOpenUpdateStatus}
                setIsOpenUpdateStatus={setIsOpenUpdateStatus}
                setIsOpenPaymentProof={setIsOpenPaymentProof}
                printRef={printRef}
                handlePrintPdf={handlePrintPdf}
                paymentProof={paymentProof}
            />

            {/* PaymentProof */}
            {isOpenPaymentProof && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={() => setIsOpenPaymentProof(false)}
                >
                    <div
                        className="bg-white p-4 rounded-lg shadow-lg max-w-full max-h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={paymentProof.secureUrl}
                            alt={`Bukti pembayaran atas nama ${order.customerName}`}
                            className="max-w-[90vw] max-h-[80vh] object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Input Update Progress */}
            {isOpenUpdateStatus && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                    onClick={() => setIsOpenUpdateStatus(false)}
                >
                    <form
                        onSubmit={handleSubmit(handleUpdateStatus)}
                        className="bg-white p-6 rounded-lg shadow-lg w-2/4 h-4/5 grid grid-rows-[auto_1fr_auto] gap-3"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <InputDropdown
                            label="Status Pesanan"
                            name="status"
                            control={control}
                            className="py-1 2xl:py-2 px-4 text-base 2xl:text-xl"
                            options={ORDER_STATUS_ITEMS.filter((item) => {
                                const excludedLabels = ["ALL"];
                                if (order.deliveryOption === "SELF_PICKUP") excludedLabels.push("DELIVERY");
                                return !excludedLabels.includes(item);
                            })}
                            optionLabel={ORDER_STATUS_LABELS}
                        />
                        <div className="">
                            <InputFinishedProduct
                                control={control}
                                errors={errors}
                                finishedProduct={finishedProduct}
                                handleDelete={() => handleDeleteFinishedProduct()}
                            />
                        </div>
                        <ButtonSmall
                            type="submit"
                            className="w-1/6 mx-auto py-1 2xl:py-2 px-4 font-semibold bg-blue-600 hover:bg-blue-700 self-start"
                        >
                            Simpan
                        </ButtonSmall>
                    </form>
                </div>
            )}

            {/* Loading */}
            {isLoading && <Loading />}

            {/* Alert */}
            <AnimatePresence>
                {showAlert && message && <AlertInfo message={message} handleAlert={() => setShowAlert(false)} />}
            </AnimatePresence>
        </MainLayout>
    );
}

export default OrderDetailPage;
