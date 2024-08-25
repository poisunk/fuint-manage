// @ts-ignore
import Cookies from "js-cookie";

export function setToken(tokenKey: string, token: string) {
    return Cookies.set(tokenKey, token);
}

export function getToken(tokenKey: string) {
    return Cookies.get(tokenKey);
}

export function removeToken(tokenKey: string) {
    return Cookies.remove(tokenKey);
}