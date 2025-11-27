import type { DevolutivaTicketFormSchemaType } from "../../components/forms/DevolutivaTicketForm";
import api from "../../services/api";

export async function CriarDevolutivaTicket(data: DevolutivaTicketFormSchemaType) {
    try {
        console.log(data)
        await api.post('/operacoes/devolutiva-ticket', data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}

export async function EditarDevolutivaTicket(data: DevolutivaTicketFormSchemaType) {
    try {
        await api.patch(`/operacoes/devolutiva-ticket/${data.id}`, data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}