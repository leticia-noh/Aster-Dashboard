import type { ClienteIndividualFormSchemaType } from "../../components/forms/ClienteIndividualForm";
import api from "../../services/api";

export async function CriarClienteIndividual(data: ClienteIndividualFormSchemaType) {
    try {
        await api.post('/operacoes/cliente-individual', data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}

export async function EditarClienteIndividual(data: ClienteIndividualFormSchemaType) {
    try {
        await api.patch(`/operacoes/cliente-individual/${data.documento}`, data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}