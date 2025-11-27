import type { UsuarioFormSchemaType } from "../components/forms/UsuarioForm";
import api from "../services/api";

export async function CriarUsuario(data: UsuarioFormSchemaType) {
    try {
        await api.post('/operacoes/usuario', data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}

export async function EditarUsuario(data: UsuarioFormSchemaType) {
    try {
        await api.patch(`/operacoes/usuario/${data.chaveUso}`, data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}