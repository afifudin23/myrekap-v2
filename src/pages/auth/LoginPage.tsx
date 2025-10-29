import { AuthForm, LOGIN_FIELDS } from "@/components/organisms/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { useAuthStore } from "@/stores/useAuthStore";
import { AnimatePresence } from "framer-motion";
import { AlertInfo } from "@/components/molecules";
import { Loading } from "@/components/atoms";
import AuthTemplate from "@/components/templates/AuthTemplate";
import { authSchema } from "@/schemas";

function LoginPage() {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const navigate = useNavigate();

    // Alert
    const location = useLocation();
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const state = location.state as { message?: string };
        if (state?.message) {
            setMessage(state.message);
            setShowAlert(true);

            navigate("/auth/login", { state: {} });
        }
    }, []);

    useEffect(() => {
        if (user?.username) {
            navigate("/dashboard");
        }
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<authSchema.LoginType>({ resolver: zodResolver(authSchema.login) });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post("auth/login", {
                username: data.username,
                password: data.password,
            });
            const resData = response.data.data;
            if (resData.needVerification) {
                setEmail(resData.email);
                setMessage("Email belum terverifikasi. Mengalihkan ke halaman verifikasi...");
                setShowAlert(true);
                return;
            }

            setIsLoading(false);
            navigate("/dashboard", { state: { message: "Selamat datang kembali, " + resData.fullName + " !" } });
            useAuthStore.getState().setUser(resData);
        } catch (error: any) {
            const axiosError = error as AxiosError;
            setIsLoading(false);
            setShowAlert(true);
            if (axiosError.code === "ERR_NETWORK") {
                setMessage("Tidak Dapat Terhubung Ke Server. Periksa Koneksi Internet Anda");
            } else {
                setMessage(error.response.data.message);
            }
        } finally {
            setIsLoading(false);
            setTimeout(() => setShowAlert(false), 3000);
        }
    });
    return (
        <AuthTemplate description="Masuk untuk mengelola pesanan dan melihat laporan rekap pelanggan.">
            <AuthForm
                fields={LOGIN_FIELDS}
                register={register}
                onSubmit={onSubmit}
                errors={errors}
                buttonName="Masuk"
                formType="login"
            />

            {/* Custom Alert */}
            <AnimatePresence>
                {showAlert && (
                    <AlertInfo
                        handleAlert={() => {
                            if (message.includes("Email belum terverifikasi"))
                                navigate("/auth/verify-otp", { state: { email, type: "email_verification" } });
                            setShowAlert(false);
                        }}
                        message={message}
                    />
                )}
            </AnimatePresence>

            {/* Loading */}
            {isLoading && <Loading />}
        </AuthTemplate>
    );
}
export default LoginPage;
