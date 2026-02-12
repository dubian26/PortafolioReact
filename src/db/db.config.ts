import { BaseDB, type DBConfig } from "./BaseDB"

const dbConfig: DBConfig = {
    name: "PortafolioDB",
    version: 3,
    stores: [
        {
            name: "usuarios",
            keyPath: "id",
            autoIncrement: true,
            indexes: [
                { name: "email", keyPath: "email", options: { unique: true } },
            ],
        },
        {
            name: "config",
            keyPath: "id",
            autoIncrement: true,
        },
        {
            name: "productos",
            keyPath: "id",
            autoIncrement: true,
            indexes: [
                { name: "codigo", keyPath: "codigo", options: { unique: true } },
                { name: "categoria", keyPath: "categoria", options: { unique: false } },
            ],
        },
        {
            name: "ordenes",
            keyPath: "id",
            autoIncrement: true,
            indexes: [
                { name: "usuarioId", keyPath: "usuarioId", options: { unique: false } },
                { name: "fecha", keyPath: "fecha", options: { unique: false } },
            ]
        },
        {
            name: "facturas",
            keyPath: "id",
            autoIncrement: true,
            indexes: [
                { name: "ordenId", keyPath: "ordenId", options: { unique: true } },
                { name: "numeroFactura", keyPath: "numeroFactura", options: { unique: true } },
            ],
        },
    ],
}

export const dbProvider = new BaseDB(dbConfig)
