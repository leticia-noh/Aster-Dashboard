import type { LicencaFormSchemaType } from "../components/forms/LicencaForm";
import api from "../services/api";

export async function CriarLicenca(data: LicencaFormSchemaType) {
    try {
        await api.post('/operacoes/licenca', data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}

export async function EditarLicenca(data: LicencaFormSchemaType) {
    try {
        await api.patch(`/operacoes/licenca/${data.id}`, data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}