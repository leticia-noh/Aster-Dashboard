import type { ClienteOrganizacaoFormSchemaType } from "../../components/forms/ClienteOrganizacaoForm";
import api from "../../services/api";

export async function CriarClienteOrganizacao(data: ClienteOrganizacaoFormSchemaType) {
    try {
        await api.post('/operacoes/cliente-organizacao', data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}

export async function EditarClienteOrganizacao(data: ClienteOrganizacaoFormSchemaType) {
    try {
        await api.patch(`/operacoes/cliente-organizacao/${data.documento}`, data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}