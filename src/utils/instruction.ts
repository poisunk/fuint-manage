
export function debounce(fn: Function, delay: number = 500) {
    let timer: any = null;
    return function (...args: any[]) {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            timer = null;
            return fn(...args)
        }, delay);
    }
}