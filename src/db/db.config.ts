import { BaseDB, type DBConfig } from "./BaseDB"

const dbConfig: DBConfig = {
    name: "PortafolioDB",
    version: 2,
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
    ],
}

export const dbProvider = new BaseDB(dbConfig)
