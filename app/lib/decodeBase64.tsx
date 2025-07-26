function decodeUtf8Base64(base64: string): string {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return decoded;
}

export { decodeUtf8Base64 }