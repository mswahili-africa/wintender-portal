

export function formatPhoneNumber(number: string) {
    const regex = /\d{1,3}(?=(\d{3})+(?!\d))/g;
    return number.toString().replace(regex, '$&-');
}