export interface DBConfig {
    name: string
    version: number
    stores: {
        name: string
        keyPath: string
        autoIncrement: boolean
        indexes?: { name: string; keyPath: string; options?: IDBIndexParameters }[]
    }[]
}

export class BaseDB {
    private db: IDBDatabase | null = null
    private config: DBConfig

    constructor(config: DBConfig) {
        this.config = config
    }

    async connect(): Promise<IDBDatabase> {
        if (this.db) return this.db

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.config.name, this.config.version)

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result
                this.config.stores.forEach((store) => {
                    if (!db.objectStoreNames.contains(store.name)) {
                        const objectStore = db.createObjectStore(store.name, {
                            keyPath: store.keyPath,
                            autoIncrement: store.autoIncrement,
                        })

                        if (store.indexes) {
                            store.indexes.forEach((index) => {
                                objectStore.createIndex(index.name, index.keyPath, index.options)
                            })
                        }
                    }
                })
            }

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result
                resolve(this.db)
            }

            request.onerror = (event) => {
                reject((event.target as IDBOpenDBRequest).error)
            }
        })
    }

    async getStore(storeName: string, mode: IDBTransactionMode = "readonly"): Promise<IDBObjectStore> {
        const db = await this.connect()
        const transaction = db.transaction(storeName, mode)
        return transaction.objectStore(storeName)
    }
}
