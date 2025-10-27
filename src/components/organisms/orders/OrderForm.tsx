import { useEffect } from "react";
import { ORDER_FORM_ITEMS } from ".";
import {
    InputBoolean,
    InputDate,
    InputDropdown,
    InputFile,
    InputMoney,
    InputProduct,
    InputText,
} from "@/components/molecules";
import { Button } from "@/components/atoms";
import { COLORS } from "@/constants/colors";
import { formatters } from "@/utils";

// interface OrderFormProps<TSchema extends ZodType<any, any>> {
//     onSubmit: SubmitHandler<TypeOf<TSchema>>; // ini lebih tepat daripada React.FormEventHandler
//     fieldRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
//     control: Control<TypeOf<TSchema>>;
//     watch: UseFormWatch<TypeOf<TSchema>>;
//     clearErrors: UseFormClearErrors<TypeOf<TSchema>>;
//     showAlert: boolean;
//     setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
//     alertMessage: string;
//     isLoading: boolean;
//     errors: FieldErrors<TypeOf<TSchema>>;
// }

const getErrorMessage = (fieldName: string, errors: any) => {
    const error = errors[fieldName as keyof typeof errors];
    return typeof error?.message === "string" ? error.message : undefined;
};

function OrderForm({ onSubmit, fieldRefs, control, watch, errors, getValues, setValue }: any) {
    const deliveryOption = watch("deliveryOption");
    const paymentMethod = watch("paymentMethod");
    const items = watch("items");
    const isPaid = watch("isPaid");
    const totalPrice = items.reduce(
        (total: number, item: { price: number; quantity: number }) => total + item.price * item.quantity,
        0
    );
    const shippingCost = watch("shippingCost");

    useEffect(() => {
        if (!errors || Object.keys(errors).length === 0) return;
        const firstErrorField = Object.keys(errors)[0];
        const errorRef = fieldRefs.current[firstErrorField];

        if (errorRef) {
            setTimeout(() => {
                errorRef.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
        }
    }, [errors]);
    return (
        <form className="flex flex-col justify-between gap-5 2xl:gap-6" onSubmit={onSubmit}>
            {ORDER_FORM_ITEMS.map((item) => {
                switch (item.type) {
                    case "text":
                        return (
                            <InputText
                                key={item.name}
                                label={item.label}
                                name={item.name}
                                control={control}
                                ref={(el) => (fieldRefs.current[item.name] = el)}
                                error={getErrorMessage(item.name, errors)}
                                disabled={deliveryOption !== "DELIVERY" && item.name === "deliveryAddress"}
                            />
                        );
                    case "product":
                        return (
                            <InputProduct
                                key={item.name}
                                label={item.label}
                                name={item.name}
                                control={control}
                                setValue={setValue}
                            />
                        );
                    case "money":
                        return (
                            <InputMoney
                                key={item.name}
                                label={item.label}
                                name={item.name}
                                control={control}
                                ref={(el) => (fieldRefs.current[item.name] = el)}
                                error={getErrorMessage(item.name, errors)}
                                disabled={item.name === "shippingCost" && deliveryOption !== "DELIVERY"}
                            />
                        );
                    case "dropdown":
                        return (
                            <InputDropdown
                                key={item.name}
                                label={item.label}
                                options={item.options}
                                optionLabel={item.optionLabel}
                                name={item.name}
                                control={control}
                                ref={(el) => (fieldRefs.current[item.name] = el)}
                                error={getErrorMessage(item.name, errors)}
                                disabled={!isPaid && item.name === "paymentMethod"}
                            />
                        );
                    case "date":
                        return (
                            <InputDate
                                key={item.name}
                                label={item.label}
                                name={item.name}
                                control={control}
                                ref={(el) => (fieldRefs.current[item.name] = el)}
                                error={getErrorMessage(item.name, errors)}
                            />
                        );
                    case "boolean":
                        return (
                            <InputBoolean
                                key={item.name}
                                label={item.label}
                                name={item.name}
                                control={control}
                                optionLabel={item.optionLabel}
                                ref={(el) => (fieldRefs.current[item.name] = el)}
                                error={getErrorMessage(item.name, errors)}
                            />
                        );
                    case "file":
                        return (
                            <InputFile
                                key={item.name}
                                label={item.label}
                                name={item.name}
                                control={control}
                                ref={(el) => (fieldRefs.current[item.name] = el)}
                                disabled={paymentMethod !== "BANK_TRANSFER" || isPaid === false}
                                multiple={false}
                                error={getErrorMessage(item.name, errors)}
                                getValues={getValues}
                                setValue={setValue}
                            />
                        );
                }
            })}
            <ul className="list-inside mt-5 2xl:mt-8 space-y-3 2xl:space-y-3 text-base 2xl:text-lg">
                <li>
                    Biaya Pengiriman <span className="float-right">{formatters.formatRupiah(shippingCost)}</span>
                </li>
                <li>
                    Total Harga Produk <span className="float-right">{formatters.formatRupiah(totalPrice)}</span>
                </li>
                <li className="font-semibold">
                    Total Pembayaran{" "}
                    <span className="float-right">{formatters.formatRupiah(totalPrice + shippingCost)}</span>
                </li>
            </ul>

            <Button type="submit" className="mb-28 mt-20 2xl:mt-32 p-1 2xl:p-2 w-[15rem] 2xl:w-[20rem]" colors={COLORS}>
                Submit
            </Button>
        </form>
    );
}

export default OrderForm;
