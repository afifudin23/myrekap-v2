import { Button } from "@/components/atoms";
import { InputDropdown } from "@/components/molecules";

import { COLORS } from "@/constants/colors";

const ReportForm = ({ fields, onSubmit, control, errors, fieldRefs, inputDate }: any) => {
    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            {inputDate}
            {fields.map((field: any) => {
                return (
                    <InputDropdown
                        key={field.name}
                        label={field.label}
                        options={field.options || []}
                        optionLabel={field.optionLabel}
                        name={field.name}
                        control={control}
                        ref={(el) => (fieldRefs.current[field.name] = el)}
                        error={errors[field.name as any]?.message}
                    />
                );
            })}
            <Button type="submit" className="mb-28 mt-20 2xl:mt-32 p-1 2xl:p-2 w-[15rem] 2xl:w-[20rem]" colors={COLORS}>
                Cetak
            </Button>
        </form>
    );
};

export default ReportForm;
