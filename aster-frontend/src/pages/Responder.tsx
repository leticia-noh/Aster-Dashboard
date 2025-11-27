import { useEffect, useState} from "react"
import { useNavigate, useParams } from "react-router-dom"
import Glass from "../components/Glass"
import ProfileMenu from "../components/ProfileMenu"
import Button from "../components/Button"
import BallButton from "../components/BallButton"
import api from "../services/api"
import { Modal } from "../components/Modal"


export default function Login() {
    let entidade = "devolutiva-ticket"
    
    const [ template, setTemplate ] = useState(null)
    const [ page, setPage ] = useState()
    const [ openModal, setOpenModal] = useState(false)
    const [selectedRegister, setSelectedRegister] = useState(null)
    const navigate = useNavigate()

    const fetchPage = async (page_number: number) => {
        if (page_number < 0 || (page && page_number > page.lastPage)) {
            console.log("Invalid page number:", page_number);
            return;
        }
        
        await fetch(`/src/assets/files/entity-templates/${entidade}.json`)
            .then((res) => res.json())
            .then((data) => setTemplate(data));
        
        try {
            const response = await api.get(`/operacoes/${entidade}?page=${page_number}`);
            setPage(response.data);
        } catch (error) {
            console.error(`Error fetching page ${page_number}:`, error);
        }
    };

    const criarRegistro = () => {
        navigate(`/operacoes/form/${entidade}`);
    }

    const alterarRegistro = () => {
        navigate(`/operacoes/form/${entidade}`, {state: { selectedRegister }});
    }


    const deletarRegistro = async () => {
        await api.delete(`/operacoes/${entidade}/${selectedRegister.id}`)
            .then(() => {
                console.log("Registro deletado com sucesso.");
                fetchPage(0);
            })
            .catch((error) => {
                console.error("Erro ao deletar o registro:", error);
            });
    }

    useEffect(() => {
        console.log("Entidade em display:", entidade);
        
        fetchPage(0);
    }, [entidade]);

    return (
        <section className="w-full h-full max-h-[896px] flex flex-col items-center justify-between gap-8">
            <section className="w-full flex flex-row items-center justify-center gap-6">
                <Glass padding="p-3">
                    <div className="w-full min-h-10 min-w-[calc(100vw-33.25rem)] flex flex-row justify-center items-center gap-6">
                        <Button variant="primary" label="Feedback" onClick={() => {entidade = "devolutiva-feedback"; fetchPage(0)}} />
                        <Button variant="primary" label="Ticket" onClick={() => {entidade = "devolutiva-ticket"; fetchPage(0)}} />
                    </div>
                </Glass>
                <ProfileMenu />
            </section>   

            <section className="w-full flex flex-col items-start justify-start gap-4">   
                <div className="w-full flex flex-row items-end justify-between">
                    <h3 className="text-[var(--content-inverse)]">{template?.nome}</h3>
                    <div className="max-w-[504px] flex flex-row gap-4">
                        <Glass padding="p-0" className="max-h-9 min-w-[360px]">
                            <div className="w-full h-9 gap-3 flex flex-row items-center px-6">
                                <img src="/src/assets/icons/search.svg" alt="busca" className="w-4 h-4"/>

                                <input 
                                type="text" 
                                id="search"
                                name="search-entry"
                                placeholder="Buscar"
                                className="w-full bg-transparent text-[var(--content-primary)] outline-none placeholder:text-[var(--content-primary)] text-sm placeholder:font-light"
                                />
                            </div>
                        </Glass>
                        <Button variant="primary" label="Consultar" onClick={() => {}} />
                    </div>
                </div>

                <Glass padding="p-0" className="min-w-full min-h-[41.25rem] w-full max-h-[680px] overflow-hidden">
                    <table className="w-full h-full max-h-[670px] table-auto">
                        <thead className="bg-[var(--background-fixed-white)]"> 
                            {template && (
                                <tr>
                                    {template.displayed.map((attrKey: string) => (
                                        <th key={attrKey} className="px-12 py-4 text-center font-bold text-[var(--content-primary)]">
                                            {template.atributos[attrKey]}
                                        </th>
                                    ))}
                                </tr>
                            )}
                        </thead>

                        <tbody>
                            {page && page.content.map((item: any) => (
                                <tr 
                                    key={item.id}
                                    className="bg-[var(--surface-700)] hover:bg-[var(--surface-600)] cursor-pointer border-b border-[var(--content-inverse)]"
                                    onClick={() => { setSelectedRegister(item); setOpenModal(true); }}
                                >
                                    {template.displayed.map((attrKey: string) => (
                                        <td key={attrKey} className="py-2.25 text-center text-[14px] text-[var(--content-primary)]">
                                            {Array.isArray(item[attrKey]) ? item[attrKey].join(", ") :
                                            item[attrKey]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Glass>

                <Modal
                    isOpen={openModal}
                    onClose={() => { setOpenModal(false); setSelectedRegister(null); }}
                    register={selectedRegister}
                    template={template}
                    type={template?.nome ?? "Registro"}
                    createRegister={criarRegistro}
                    updateRegister={alterarRegistro}
                    deleteRegister={deletarRegistro}
                />

                <div className="w-full flex flex-row items-start justify-between">
                    <p className="font-semibold">{page?.totalEntries} Registros encontrados</p>
                    <div className="flex flex-row gap-2">
                        <img src="/src/assets/icons/chevron-left.svg" alt="left arrow" className="w-9 h-9 cursor-pointer" onClick={() => {fetchPage(page.pageNumber)}}/>
                        <BallButton variant="white" label="1" onClick={() => {fetchPage(0)}} />
                        <BallButton variant="white" label={`${ page? page.pageNumber + 2 : "?" }`} onClick={() => {fetchPage(page.pageNumber + 1)}} />
                        <BallButton variant="glass" label="..." onClick={() => {}} />
                        <BallButton variant={page && page.pageNumber < page.lastPage ? "white" : "glass"} label={`${ page? page.lastPage + 1 : "?" }`} onClick={() => {fetchPage(page.lastPage)}} />
                        <img src="/src/assets/icons/chevron-right.svg" alt="right arrow" className="w-9 h-9 cursor-pointer" onClick={() => {fetchPage(page.pageNumber + 1)}} />
                    </div>
                </div>
            </section>
        </section>
    )}

        