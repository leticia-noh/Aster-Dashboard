import type { VersaoFormSchemaType } from "../components/forms/VersaoForm";
import api from "../services/api";

export async function CriarVersao(data: VersaoFormSchemaType) {
    try {
        await api.post('/operacoes/versao', data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}

export async function EditarVersao(data: VersaoFormSchemaType) {
    try {
        await api.patch(`/operacoes/versao/${data.numeroVersao}/${data.produtoId}`, data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}