import { ic } from 'azle';

const generateRandomUUID = (): string => {
    const hexChars = "0123456789abcdef";
    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";

    uuid = uuid.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return hexChars[v];
    });

    return uuid;
}

const getCaller = () => {
    const caller = ic.caller().toString();
    if (caller === null) {
        throw new Error("Caller is null");
    }
    return caller;
};

export { generateRandomUUID, getCaller };