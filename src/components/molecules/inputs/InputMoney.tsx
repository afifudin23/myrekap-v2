import { Label } from "@/components/atoms";
import { InputMoneyProps } from ".";
import React from "react";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";

const InputMoney = React.forwardRef<HTMLDivElement, InputMoneyProps>(
    ({ name, label, control, error, disabled }, ref) => {
        return (
            <div className="flex flex-col gap-3" ref={ref}>
                <Label id={name} children={label} />
                <Controller
                    name={name as string}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <NumericFormat
                            value={value as number}
                            onValueChange={(values: { floatValue: number | undefined }) => {
                                if (disabled) return;
                                onChange(values.floatValue);
                            }}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp. "
                            minLength={1}
                            allowNegative={false}
                            placeholder={`Masukan ${label}`}
                            className={`border py-2 2xl:py-4 px-4 2xl:px-6 text-base 2xl:text-xl rounded-lg w-full font-normal ${
                                disabled ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={disabled}
                        />
                    )}
                />
                {error && <p className="text-red-500 text-xs 2xl:text-sm">*{error}</p>}
            </div>
        );
    }
);
export default InputMoney;
