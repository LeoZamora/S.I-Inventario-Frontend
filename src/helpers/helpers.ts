export function formateDate(date: string, showTime: boolean) {
    if(!date) return 'xx-xx-xxxx'

    const timeDate: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        second: 'numeric',
    }

    const settings: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }

    if(/^\d{4}-\d{2}-\d{2}/.test(date)) {
        const dateFormat = new Date(date)
        return dateFormat.toLocaleDateString('es-NI',
            showTime ? Object.assign(settings, timeDate)
            : settings
        )
    }
}

export function formatCurrency(key: number, currency: string) {
    return new Intl.NumberFormat('es-NI', {
        maximumFractionDigits: 4,
        style: 'currency',
        currency: currency === 'USD' ? 'USD' : 'NIO',
    }).format(key)
}