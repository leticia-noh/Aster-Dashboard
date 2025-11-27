import type { ProdutoFormSchemaType } from "../components/forms/ProdutoForm";
import api from "../services/api";
import type { PageRequest } from "../types/page-request";

export async function CriarProduto(data: ProdutoFormSchemaType) {
    try {
        await api.post('/operacoes/produto', data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}

export async function EditarProduto(data: ProdutoFormSchemaType) {
    try {
        await api.patch(`/operacoes/produto/${data.id}`, data)
    } catch(error) {
        console.log('Erro na rquisição')
        throw error
    }
}

type ProdutoListType = PageRequest<ProdutoFormSchemaType>

export async function ListProduto(pageNum: number): Promise<ProdutoFormSchemaType[]> {
       const response =  await api.get<ProdutoListType>(`operacoes/produto?page=${pageNum}`)
       console.log("VALOR REAL ===>", response.data, Array.isArray(response.data));
       return response.data.content;
}