import { InputDate, TitlePage } from "@/components/molecules";
import { DEFAULT_VALUE_REPORT_ORDER, REPORT_ORDER_FORM_FIELDS, ReportForm } from "@/components/organisms/reports";
import MainLayout from "@/components/templates/MainLayout";
import { reportOrderSchema, ReportOrderType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowRightLong } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const ReportOrderFilterPage = () => {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ReportOrderType>({
        resolver: zodResolver(reportOrderSchema),
        defaultValues: DEFAULT_VALUE_REPORT_ORDER,
    });
    useEffect(() => {
        if (!errors || Object.keys(errors).length === 0) return;
        const firstErrorField = Object.keys(errors)[0];
        const errorRef = fieldRefs.current[firstErrorField];

        // Delay scroll agar DOM sempat update (error message muncul)
        if (errorRef) {
            setTimeout(() => {
                errorRef.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 50);
        }
    }, [errors]);

    const onSubmit = (filter: ReportOrderType) => {
        try {
            const params = new URLSearchParams({
                from_date: filter.fromDate.toISOString(),
                to_date: filter.toDate.toISOString(),
                customer_category: filter.customerCategory.toLowerCase(),
                payment_method: filter.paymentMethod.toLowerCase(),
                payment_status: filter.paymentStatus.toLowerCase(),
                order_status: filter.orderStatus.toLowerCase(),
            });

            reset(DEFAULT_VALUE_REPORT_ORDER);
            navigate(`/reports/orders/result?${params}`);
        } catch (error: any) {
            console.log(error.response.data);
        }
    };
    return (
        <MainLayout>
            <div className="flex justify-between items-center">
                <TitlePage title="Laporan Penjualan" subtitle="Mencetak Rekap Penjualan Sesuai Kebutuhan" />
                <button onClick={() => navigate("/reports")}>
                    <TbLogout2 className="text-5xl 2xl:text-6xl" />
                </button>
            </div>

            <ReportForm
                fields={REPORT_ORDER_FORM_FIELDS}
                handleSubmit={handleSubmit}
                control={control}
                errors={errors}
                fieldRefs={fieldRefs}
                onSubmit={onSubmit}
                showAlert={showAlert}
                setShowAlert={setShowAlert}
                inputDate={
                    <div id="input-date" className="flex w-full justify-between items-center gap-10">
                        <InputDate
                            label="Dari Tanggal"
                            name="fromDate"
                            control={control}
                            ref={(el) => (fieldRefs.current["fromDate"] = el)}
                            error={errors.fromDate?.message}
                        />
                        <FaArrowRightLong className="text-5xl 2xl:text-7xl mt-6" />
                        <InputDate
                            label="Sampai Tanggal"
                            name="toDate"
                            control={control}
                            ref={(el) => (fieldRefs.current["toDate"] = el)}
                            error={errors.toDate?.message}
                        />
                    </div>
                }
            />
        </MainLayout>
    );
};

export default ReportOrderFilterPage;
