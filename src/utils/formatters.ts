import { CUSTOMER_CATEGORY_LABELS, ORDER_STATUS_LABELS, PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from "@/constants/category";

const formatters = {
    // parse = frontend -> backend
    // format = backend -> frontend

    formatCapital(data: string = "") {
        return data
            .toLowerCase() // change to lowercase
            .replace(/_/g, " ") // change underscore to space
            .replace(/\b\w/g, (char) => char.toUpperCase()); // cpitalize each word
    },
    formatCustomerNameReceipt(data: string) {
        const words = data.trim().split(/\s+/);
        const first = words.slice(0, 2).join(" ");
        const twoInitial = words.length > 2 ? words[2].charAt(0).toUpperCase() + "." : "";
        return twoInitial ? `${first} ${twoInitial}` : first;
    },

    //  UBAH FRONTEND -> BACKEND
    parseCapital(data: string) {
        return data.toUpperCase().replace(/[ /-]/g, "_"); // Replace spaces and slashes with underscores
    },
    formatRupiah: (data: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(data);
    },

    isoDateToStringDateTime: (isoDate: any) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    },
    
    dateToString: (isoDate: any) => {
        const date = new Date(isoDate);
        const options: Intl.DateTimeFormatOptions = {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        };
        return date.toLocaleString("id-ID", options);
    },

    isoDateToStringDate: (isoDate: any) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    },
    simplyfyEmail: (email: string) => {
        const [username, domain] = email.split("@");
        const shortUsername = username.length > 6 ? `${username.slice(0, 6)}***` : username;
        return `${shortUsername}@${domain}`;
    },
    formatInputOrderSummary(data: any) {
        return {
            id: data.id,
            customerName: this.formatCapital(data.customerName),
            flowerCategory: this.formatCapital(data.flowerCategory),
            quantity: Number(data.quantity),
            greetingMessage: data.greetingMessage,
            deliveryDate: new Date(data.deliveryDate),
            deliveryAddress: data.deliveryAddress,
            customerCategory: this.formatCapital(data.customerCategory),
            price: Number(data.price),
            shippingCost: Number(data.shippingCost),
            isPaid: Boolean(data.isPaid),
            paymentMethod: data.paymentMethod ? this.formatCapital(data.paymentMethod) : "Pending",
            paymentProof: data.paymentProof === "null" ? null : data.paymentProof,
        };
    },

    parseInputOrder(data: any) {
        return {
            customerName: data.customerName,
            customerCategory: data.customerCategory,
            phoneNumber: data.phoneNumber,
            items: data.items.map((item: any) => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                message: item.message || "",
                price: item.unitPrice,
            })),
            deliveryOption: data.deliveryOption,
            deliveryAddress: data.deliveryAddress || "",
            readyDate: new Date(data.readyDate),
            paymentMethod: data.paymentMethod,
            paymentProof:
                data.paymentProof === null
                    ? []
                    : Array.isArray(data.paymentProof)
                    ? data.paymentProof
                    : [data.paymentProof],
            totalPrice: data.totalPrice,
            shippingCost: data.shippingCost,
        };
    },

    formatDataOrderSummary(data: any) {
        return {
            id: data.id,
            orderCode: data.orderCode,
            customerName: this.formatCapital(data.customerName),
            quantity: data.quantity,
            greetingMessage: data.greetingMessage,
            deliveryDate: this.isoDateToStringDateTime(data.deliveryDate),
            deliveryAddress: data.deliveryAddress,
            customerCategory: this.formatCapital(data.customerCategory),
            price: this.formatRupiah(data.totalPrice),
            shippingCost: this.formatRupiah(data.shippingCost),
            isPaid: data.isPaid,
            paymentMethod: data.paymentMethod ? this.formatCapital(data.paymentMethod) : "Pending",
            paymentProof: data.paymentProof,
            paymentStatus: data.paymentStatus,
            previousPaymentStatus: data.previousPaymentStatus,
            orderStatus: this.formatCapital(data.orderStatus),
            orderDate: this.dateToString(data.orderDate),
            finishedProduct: data.finishedProduct,
        };
    },
    formatReportOrder(data: any) {
        return {
            orderCode: data.orderCode,
            customerName: this.formatCustomerNameReceipt(data.customerName),
            customerCategory: CUSTOMER_CATEGORY_LABELS[data.customerCategory].toUpperCase(),
            phoneNumber: data.phoneNumber,
            paymentMethod: data.paymentMethod ? PAYMENT_METHOD_LABELS[data.paymentMethod].toUpperCase()  : "-",
            totalPrice: data.totalPrice,
            paymentProvider: data.paymentProvider ? data.paymentProvider.split("_").join(" ") : "-",
            paymentStatus: PAYMENT_STATUS_LABELS[data.paymentStatus].toUpperCase(),
            orderStatus: ORDER_STATUS_LABELS[data.orderStatus].toUpperCase(),
            orderDate: this.isoDateToStringDate(data.orderDate),
        };
    },

    formatSource(value: string) {
        return value
            .toLowerCase()
            .replace(/^([a-z])/, (m) => m.toUpperCase()) // Kapital huruf pertama
            .replace(/([a-z])([a-z])/, (_, a, b) => a + b.toUpperCase()); // Kapital huruf ke-3 (index 2)
    },
};
export default formatters;
