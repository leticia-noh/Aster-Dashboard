import type { PacoteFormSchemaType } from "../components/forms/PacoteForm";
import api from "../services/api";

export async function CriarPacote(data: PacoteFormSchemaType) {
    try {
        await api.post('/operacoes/pacote', data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}

export async function EditarPacote(data: PacoteFormSchemaType) {
    try {
        await api.patch(`/operacoes/pacote/${data.nome}`, {...data, precoIndividual: parseFloat(data.precoIndividual), precoOrganizacional: parseFloat(data.precoOrganizacional)})
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}