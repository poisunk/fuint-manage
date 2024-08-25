type FormType =
    | "input"
    | "textarea"
    | "select"
    | "date"
    | "radio"
    | "checkbox"
    | "switch"
    | "upload"
    | "input-number";

interface ItemOption {
    label: string;
    value: string | number;
}

export interface FormItem {
    type: FormType;
    field: string;
    label: string;
    placeholder?: string;
    options?: ItemOption[];
    required?: boolean;
    imageUrl?: string;
}

