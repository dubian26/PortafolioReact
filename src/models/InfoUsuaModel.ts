
export interface InfoUsuaModel {
    id: number
    tipo: "access" | "refresh"
    nombre: string
    email: string
    rol: string
    expTime: string
    exp: number
}
