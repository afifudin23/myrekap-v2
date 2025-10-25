import { AlertInfo } from "@/components/molecules";
import { OTPInput } from "@/components/organisms/auth";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosInstance } from "@/utils";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OTPVerificationPage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { email, type } = state || {};
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleVerify = async (otp: string) => {
        setLoading(true);
        try {
            // Call the email verification API
            const response = await axiosInstance.post("/auth/otp/verify", { email, code: otp, type });
            if (type === "email_verification") {
                if (response.status === 200) {
                    useAuthStore.getState().setUser(response.data.data);
                    setMessage("Email terverifikasi. Mengalihkan ke halaman dashboard...");
                    setShowAlert(true);
                } else {
                    setError("Gagal memverifikasi OTP. Silahkan coba lagi.");
                }
            } else if (type === "password_reset") {
                if (response.status === 200) {
                    console.log(response.data.data);
                    navigate("/auth/reset-password", { state: { token: response.data.data.resetToken } });
                } else {
                    setError("Gagal memverifikasi OTP. Silahkan coba lagi.");
                }
            }
        } catch (error: any) {
            console.log(error.response.data);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError("");
        setLoading(true);
        try {
            const response = await axiosInstance.post("/auth/otp/resend", { email, type });
            if (response.status === 200) {
                setError("OTP sent successfully.");
            } else {
                setError("Failed to send OTP. Please try again.");
            }
        } catch (error: any) {
            console.log(error.response.data);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-32 flex flex-col gap-2 p-6 text-center border border-gray-300 rounded-lg shadow-lg">
            <h1>{type === "email_verification" ? "Verify OTP for Your Email" : "Verify OTP for Password Reset"}</h1>
            <p>
                Enter the OTP sent to <span className="font-semibold">{email}</span>:
            </p>
            <OTPInput onComplete={handleVerify} length={6} onResend={handleResend} />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {loading && <p className="text-blue-500 mt-2">Verifying...</p>}

            <AnimatePresence>
                {showAlert && (
                    <AlertInfo
                        handleAlert={() => {
                            if (message.includes("Email terverifikasi. Mengalihkan ke halaman dashboard..."))
                                navigate("/dashboard");
                            setShowAlert(false);
                        }}
                        message={message}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default OTPVerificationPage;
