import {
    CategoryRounded,
    PeopleOutlineRounded,
    Inventory2Rounded,
    WarehouseRounded,
    LabelOutlined,
    ClassOutlined,
    BookmarksRounded
} from '@mui/icons-material'
import type React from "react"

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

export function formatCurrency(key: number, currency: "NIO" | "USD") {
    return new Intl.NumberFormat('es-NI', {
        maximumFractionDigits: 4,
        style: 'currency',
        currency: currency === 'USD' ? 'USD' : 'NIO',
    }).format(key)
}

export const generatePath = (text: string) => {
    return text
        .toLocaleLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace("de", "")
        .replace(/\s+/g, "-")
        .trim()
}

export async function resizeImage(file: Blob, maxWidth: number, quality: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event: ProgressEvent<FileReader>) => {
            const img = new Image();
            img.src = event?.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error("No se pudo obtener el contexto del canvas"));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
        };
        reader.onerror = error => reject(error);
    });
}

export async function onFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
        const base64Optimizado = await resizeImage(file, 1000, 0.5);

        return base64Optimizado
    } catch (error) {
        console.error("Error al procesar imagen:", error);
    }
}


// MAPER ICON
export const iconMap: Record<string, React.ReactNode> = {
    inventory: <Inventory2Rounded />,
    category: <CategoryRounded />,
    tipoProducto: <LabelOutlined />,
    proveedores: <PeopleOutlineRounded />,
    logistica: <WarehouseRounded />,
    tipoSolicitud: <ClassOutlined />,
    tipoOrden: <BookmarksRounded />,
}