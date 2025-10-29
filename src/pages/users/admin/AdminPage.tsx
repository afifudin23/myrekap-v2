import { ButtonSmall } from "@/components/atoms";
import { AlertConfirm, AlertInfo, TitlePage } from "@/components/molecules";
import { UserTable } from "@/components/organisms/users";
import MainLayout from "@/components/templates/MainLayout";
import { useUsers } from "@/hooks";
import { axiosInstance } from "@/utils";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { MdAddToPhotos } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminPage = () => {
    const { users, setUsers } = useUsers("admins");
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // Alert
    const location = useLocation();
    const navigate = useNavigate();
    const [message, setMessage] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showAlertConfirm, setShowAlertConfirm] = useState<boolean>(false);

    useEffect(() => {
        const state = location.state as { message?: string };
        if (state?.message) {
            setMessage(state.message);
            setShowAlert(true);
        }
    }, []);

    const handleDeleteUser = (id: string, name: string) => {
        setSelectedUserId(id);
        setMessage(`Apakah anda akan menghapus user ${name} ?`);
        setShowAlertConfirm(true);
    };

    const handleDeleteUserConfirm = async () => {
        if (!selectedUserId) return;

        try {
            const response = await axiosInstance.delete(`users/${selectedUserId}`);
            if (response.status === 200) {
                const updated = users.filter((user: any) => user.id !== selectedUserId);
                setUsers(updated);
                setMessage("User berhasil dihapus dari sistem");
            } else {
                setMessage("Gagal menghapus user");
            }
        } catch (error) {
            setMessage("Oops! Server mengalami kendala teknis. Tim kami akan segera menanganinya");
        } finally {
            setShowAlert(true);
            setShowAlertConfirm(false);
            setSelectedUserId(null);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };
    return (
        <MainLayout>
            <TitlePage title="Admin" subtitle="Mengelola Data Semua User Admin" />
            <Link to="/users/admin/create" className="inline-block">
                <ButtonSmall className="bg-[#4fcd53] hover:bg-[#42b146] py-1 2xl:py-2 px-4 font-bold mb-8">
                    <MdAddToPhotos /> Tambah
                </ButtonSmall>
            </Link>
            <UserTable settings={true} handleDeleteUser={handleDeleteUser} users={users} />

            {/* Alert */}
            <AnimatePresence>
                {showAlert && message && (
                    <AlertInfo
                        message={message}
                        handleAlert={() => {
                            setShowAlert(false);
                            navigate("/users/admin", { state: {} });
                        }}
                    />
                )}
                {showAlertConfirm && message && (
                    <AlertConfirm
                        message={message}
                        handleAlert={() => {
                            setShowAlertConfirm(false);
                            setSelectedUserId(null);
                        }}
                        handleResultConfirm={handleDeleteUserConfirm}
                    />
                )}
            </AnimatePresence>
        </MainLayout>
    );
};

export default AdminPage;
