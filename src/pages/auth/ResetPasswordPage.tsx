import { Loading } from "@/components/atoms";
import { AlertInfo } from "@/components/molecules";
import { RESET_PASSWORD_FIELDS } from "@/components/organisms/auth";
import AuthForm from "@/components/organisms/auth/AuthForm";
import AuthTemplate from "@/components/templates/AuthTemplate";
import { authSchema } from "@/schemas";
import { axiosInstance } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPasswordPage() {
    const [message, setMessage] = useState("");
    const state = useLocation().state as { token: string } | null;
    const token = state?.token;
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<authSchema.ResetPasswordType>({ resolver: zodResolver(authSchema.resetPassword) });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await axiosInstance.patch("/auth/reset-password", data, { headers: { Authorization: `Bearer ${token}` } });
            alert("Reset berhasil! Sekarang kamu bisa masuk dengan kata sandi baru.");
            navigate("/auth/login");
        } catch (error: any) {
            console.log(error.response.data);
            const axiosError = error as AxiosError;
            if (axiosError.code === "ERR_NETWORK") {
                setMessage("Tidak Dapat Terhubung Ke Server. Periksa Koneksi Internet Anda");
            }
            if (axiosError.response) {
                setMessage(error.response.data.message);
            }
        } finally {
            setIsLoading(false);
        }
    });
    return (
        <AuthTemplate description="Reset Password, Silakan atur password kamu di bawah ini">
            <p className="text-red-500 ml-4 mb-5 text-center text-sm 2xl:text-lg">{message}</p>
            <AuthForm
                fields={RESET_PASSWORD_FIELDS}
                register={register}
                onSubmit={onSubmit}
                errors={errors}
                buttonName="Update Password"
            />

            {/* Custom Alert */}
            <AnimatePresence>
                {showAlert && <AlertInfo handleAlert={() => setShowAlert(false)} message={message} />}
            </AnimatePresence>

            {/* Loading */}
            {isLoading && <Loading />}
        </AuthTemplate>
    );
}

export default ResetPasswordPage;
