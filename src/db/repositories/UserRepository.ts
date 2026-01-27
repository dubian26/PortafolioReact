import { type UsuarioModel } from "../../models/UsuarioModel"
import { BaseRepository } from "../core/BaseRepository"
import { dbProvider } from "../db.config"

class UserRepository extends BaseRepository<UsuarioModel> {
    constructor() {
        super(dbProvider, "usuarios")
    }

    async buscarPorEmail(email: string): Promise<UsuarioModel | undefined> {
        const store = await this.db.getStore(this.storeName)
        const index = store.index("email")
        return new Promise((resolve, reject) => {
            const request = index.get(email)
            request.onsuccess = () => resolve(request.result as UsuarioModel)
            request.onerror = () => reject(request.error)
        })
    }
}

export const userRepository = new UserRepository()
