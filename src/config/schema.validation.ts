import { z } from 'zod'

// CATEGORY VALIDATION
const categoriasSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    codigo: z.string().min(1, "El codigo es obligatorio"),
    descripcion: z.string().optional().nullable()
})


export const validationSchema = {
    categoriasSchema
}