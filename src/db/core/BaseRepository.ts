import { type BaseDB } from "./BaseDB"

export class BaseRepository<T> {
    protected db: BaseDB
    protected storeName: string

    constructor(db: BaseDB, storeName: string) {
        this.db = db
        this.storeName = storeName
    }

    async agregar(item: T): Promise<number | string> {
        const store = await this.db.getStore(this.storeName, "readwrite")
        return new Promise((resolve, reject) => {
            const request = store.add(item)
            request.onsuccess = () => resolve(request.result as number | string)
            request.onerror = () => reject(request.error)
        })
    }

    async listarTodos(): Promise<T[]> {
        const store = await this.db.getStore(this.storeName)
        return new Promise((resolve, reject) => {
            const request = store.getAll()
            request.onsuccess = () => resolve(request.result as T[])
            request.onerror = () => reject(request.error)
        })
    }

    async buscarPorId(id: number | string): Promise<T | undefined> {
        const store = await this.db.getStore(this.storeName)
        return new Promise((resolve, reject) => {
            const request = store.get(id)
            request.onsuccess = () => resolve(request.result as T)
            request.onerror = () => reject(request.error)
        })
    }

    async actualizar(item: T): Promise<void> {
        const store = await this.db.getStore(this.storeName, "readwrite")
        return new Promise((resolve, reject) => {
            const request = store.put(item)
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }

    async eliminar(id: number | string): Promise<void> {
        const store = await this.db.getStore(this.storeName, "readwrite")
        return new Promise((resolve, reject) => {
            const request = store.delete(id)
            request.onsuccess = () => resolve()
            request.onerror = () => reject(request.error)
        })
    }
}
