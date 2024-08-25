import { ElNotification } from "element-plus";

export default function (type: "success" | "warning" | "info" | "error", message: string) {
    ElNotification({
        title: "提示",
        message: message,
        type: type
    });
}


export function successNotification(message: string) {
    ElNotification({
        title: "Success",
        message: message,
        type: "success"
    });
}


export function warningNotification(message: string) {
    ElNotification({
        title: "Warning",
        message: message,
        type: "warning"
    });
}


export function errorNotification(message: string) {
    ElNotification({
        title: "Error",
        message: message,
        type: "error"
    });
}