import type { DevolutivaFeedbackFormSchemaType } from "../../components/forms/DevolutivaFeedbackForm";
import api from "../../services/api";

export async function CriarDevolutivaFeedback(data: DevolutivaFeedbackFormSchemaType) {
    try {
        console.log(data)
        await api.post('/operacoes/devolutiva-feedback', {...data, avaliacao: parseFloat(data.avaliacao)})
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}

export async function EditarDevolutivaFeedback(data: DevolutivaFeedbackFormSchemaType) {
    try {
        await api.patch(`/operacoes/devolutiva-feedback/${data.id}`, {...data, avaliacao: parseFloat(data.avaliacao)})
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}