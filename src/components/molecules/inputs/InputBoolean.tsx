import { Label } from "@/components/atoms";
import React from "react";
import { Control, Controller } from "react-hook-form";

interface InputBooleanProps {
    label: string;
    name: string;
    error?: string;
    control: Control<any>;
    optionLabel: { true: string; false: string };
}

const InputBoolean = React.forwardRef<HTMLDivElement, InputBooleanProps>(
    ({ label, name, error, control, optionLabel }, ref) => {
        return (
            <div ref={ref} className="flex flex-col justify-center gap-4">
                <Label id={name} children={label} />
                <Controller
                    name={name as any}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <label className="flex items-center cursor-pointer gap-3 2xl:gap-5">
                            <span className="text-gray-700 text-sm 2xl:text-lg">{optionLabel.false}</span>
                            <div
                                className={`w-11 h-5 2xl:w-12 2xl:h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${
                                    value ? "bg-green-500" : ""
                                }`}
                            >
                                <input type="checkbox" checked={!!value} onChange={onChange} className="hidden" />
                                <div
                                    className={`bg-white w-3 h-3 2xl:w-4 2xl:h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                                        value ? "translate-x-6" : ""
                                    }`}
                                ></div>
                            </div>
                            <span className="text-gray-700 text-sm 2xl:text-lg">{optionLabel.true}</span>
                        </label>
                    )}
                />
                {error && <p className="text-red-500 text-sm">*{error}</p>}
            </div>
        );
    }
);

export default InputBoolean;
