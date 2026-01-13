
function generateContractCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `HD-${timestamp}-${random}`;
}

console.log('Generated Code 1:', generateContractCode());
setTimeout(() => {
    console.log('Generated Code 2:', generateContractCode());
}, 10);
