
export interface InfoUsuaModel {
    id: string
    tipo: "access" | "refresh"
    nombre: string
    email: string
    rol: string
    expTime: string
    exp: number
}
