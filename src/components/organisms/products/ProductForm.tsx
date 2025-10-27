import { InputBoolean, InputDropdown, InputFile, InputMoney, InputText } from "@/components/molecules";
import { Button, Loading } from "@/components/atoms";
import { COLORS } from "@/constants/colors";

const getErrorMessage = (fieldName: string, errors: any) => {
    const error = errors[fieldName as keyof typeof errors];
    return typeof error?.message === "string" ? error.message : undefined;
};

function ProductForm({ control, onSubmit, errors, fieldRefs, isLoading, setValue, getValues, fields }: any) {
    return (
        <form className="flex flex-col justify-between gap-5 2xl:gap-6" onSubmit={onSubmit}>
            {fields.map((item: any) => {
                switch (item.type) {
                    case "text":
                        return (
                            <InputText
                                key={item.name}
                                label={item.label}
                                name={item.name}
                                ref={(el) => (fieldRefs.current[item.name] = el)}
                                error={errors[item.name as any]?.message}
                                control={control}
                                disabled={item.disabled}
                            />
                        );
                    case "money":
                        return (
                            <InputMoney
                                key={item.name}
                                label={item.label}
                                name={item.name}
                                ref={(el) => (fieldRefs.current[item.name] = el)}
                                error={errors[item.name as any]?.message}
                                control={control}
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
                                multiple={true}
                                error={getErrorMessage(item.name, errors)}
                                getValues={getValues}
                                setValue={setValue}
                            />
                        );
                    case "dropdown":
                        return (
                            <InputDropdown
                                key={item.name}
                                label={item.label}
                                name={item.name}
                                ref={(el) => (fieldRefs.current[item.name] = el)}
                                error={errors[item.name as any]?.message}
                                control={control}
                                options={item.options}
                                optionLabel={item.optionLabel}
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
                }
            })}
            <Button type="submit" className="mb-28 mt-20 2xl:mt-32 p-1 2xl:p-2 w-[15rem] 2xl:w-[20rem]" colors={COLORS}>
                Submit
            </Button>
        </form>
    );
}

export default ProductForm;
