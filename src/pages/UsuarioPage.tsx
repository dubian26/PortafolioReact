export const UsuarioPage = () => {
    return (
        <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <p className="text-gray-400">Aquí podrás ver y gestionar la lista de usuarios del sistema.</p>
                <div className="mt-6 flex gap-2">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors">
                        <i className="fa-solid fa-plus mr-2"></i>
                        Nuevo Usuario
                    </button>
                </div>
            </div>
        </div>
    )
}
