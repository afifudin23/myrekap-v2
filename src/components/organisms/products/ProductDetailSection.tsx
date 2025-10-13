import { ButtonSmall, Image } from "@/components/atoms";
import { ProductInfo } from "@/components/molecules";
import { FaTrashCan } from "react-icons/fa6";
import { RiEdit2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

// interface ProductDetailSectionProps {
//     product: {
//         id: string;
//         name: string;
//         image: string;
//         price: number;
//         stock: number;
//         description?: string;
//     };
// }

const ProductDetailSection = ({ product, handleDeleteConfirm }: any) => {
    const navigate = useNavigate();

    return (
        <section className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start">
            <Image src={product.images[0]?.secureUrl || ""} alt={product.name} className="w-80 h-80" />
            <div className="flex flex-col gap-5 min-w-60">
                <ProductInfo product={product} />
                <div className="flex gap-2 flex-col md:flex-row font-semibold">
                    <ButtonSmall
                        className="bg-orange-400 hover:bg-orange-500 py-1 2xl:py-2 px-4"
                        onClick={() => navigate(`/products/${product.id}/edit`)}
                    >
                        <RiEdit2Fill /> Edit
                    </ButtonSmall>
                    <ButtonSmall
                        className="bg-blue-400 hover:bg-blue-500 py-1 2xl:py-2 px-4"
                        onClick={() => navigate(`/products/${product.id}/manage-stock`)}
                    >
                        <RiEdit2Fill /> Kelola Stok
                    </ButtonSmall>
                    <ButtonSmall
                        className="bg-red-500 hover:bg-red-600 py-1 2xl:py-2 px-4"
                        onClick={() => handleDeleteConfirm(product.name)}
                    >
                        <FaTrashCan /> Hapus
                    </ButtonSmall>
                </div>
            </div>
        </section>
    );
};

export default ProductDetailSection;
