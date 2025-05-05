export function formatCurrency(amount, currency = 'USD', exchangeRate = 25000) {
    if (currency === 'VND') {
        return amount ? (amount * exchangeRate).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 ₫';
    }
    return amount ? amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : '$0.00';
}
