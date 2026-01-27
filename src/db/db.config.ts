import { BaseDB, type DBConfig } from "./core/BaseDB"

const dbConfig: DBConfig = {
    name: "PortafolioDB",
    version: 1,
    stores: [
        {
            name: "usuarios",
            keyPath: "id",
            autoIncrement: true,
            indexes: [
                { name: "email", keyPath: "email", options: { unique: true } },
            ],
        },
    ],
}

export const dbProvider = new BaseDB(dbConfig)
