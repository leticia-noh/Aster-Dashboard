import { useEffect, useState } from "react";
import ProfileMenu from "../../components/ProfileMenu";
import Glass from "../../components/Glass";
import ListButton from "../../components/ListButton";
import Button from "../../components/Button";
import BallButton from "../../components/BallButton";
import { PieChart } from '@mui/x-charts/PieChart';
import api from "../../services/api"

export default function Desempenho() {
    const [porcentagemLicencaData, setPorcentagemLicencaData] = useState();
    const [usuariosProdutoData, setUsuariosProdutoData] = useState();
    const [versoesRecentesData, setVersoesRecentesData] = useState();
    const [usuariosClienteData, setUsuariosClienteData] = useState();
    const [template, setTemplate] = useState();
    const [page, setPage] = useState();

    const [colorScheme1, setColorScheme1] = useState();
    const [colorScheme2, setColorScheme2] = useState();

    const fetchData = async (request: string) => {
        try {
            const response = await api.get(`/painel/i/tech/${request}`);
            return(response.data);
        } catch (error) {
            console.error(`Error fetching json ${request}:`, error);
        }
    };

    const fetchJson = async (path: string) => {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Erro ao buscar: ${path}`);
        return response.json();
    };

    const fetchPage = async (page_number: number) => {
        if (page_number < 0 || (page && page_number > page.lastPage)) {
            console.log("Invalid page number:", page_number);
            return;
        }
        
        await fetch(`/src/assets/files/entity-templates/usuario.json`)
            .then((res) => res.json())
            .then((data) => {setTemplate(data)});

        try {
            const response = await api.get(`/painel/i/tech/registros-usuarios?page=${page_number}`);
            setPage(response.data);
        } catch (error) {
            console.error(`Error fetching page ${page_number}:`, error);
        }
    };

    function recortarArray(dados: Record<string, any[]>, chave: string) { 
        return dados[chave] ?? [];
    }

    useEffect(() => {
        async function carregarDados() {
            const [
                porcentagemLicenca,
                usuariosProduto,
                versoesRecentes,
                usuariosCliente,
                palette1,
                palette2
            ] = await Promise.all([
                fetchData('porcentagem-status-licencas'),
                fetchData('quantidade-usuarios-produto'),
                fetchData('versoes-recentes'),
                fetchData('quantidade-usuarios-cliente'),

                fetchJson(`/src/assets/files/color-palettes/chartPalette4.json`),
                fetchJson(`/src/assets/files/color-palettes/chartPalette3.json`)
            ]);

            setPorcentagemLicencaData(porcentagemLicenca);
            setUsuariosProdutoData(usuariosProduto);
            setVersoesRecentesData(versoesRecentes);
            setUsuariosClienteData(usuariosCliente);

            setColorScheme1(palette1);
            setColorScheme2(palette2);
        }

        fetchPage(0);
        carregarDados();
    }, []);

    if (!porcentagemLicencaData || !usuariosProdutoData || !versoesRecentesData || !usuariosClienteData || !colorScheme1 || !colorScheme2) {
        return <div>Carregando...</div>;
    }
    
    return (
        <section className="w-full h-full flex flex-col items-center justify-start gap-6">
            <section className="w-full flex flex-row items-center justify-end">
                <ProfileMenu />
            </section>

            <section className="w-full flex flex-col 2xl:flex-row items-start justify-center gap-6"> 
                <section className="w-full flex flex-col items-start justify-center gap-6">
                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl">
                        <h5 className="text-xl font-semibold text-center">Taxa de cancelamento</h5>
                        <div className="w-full h-72 flex items-center justify-center gap-12">
                            <PieChart
                                series={[{ 
                                    data: porcentagemLicencaData,
                                    valueFormatter: ({ value }) => value + '%',
                                    highlightScope: { fade: 'series', highlight: 'item' },
                                }]}
                                height={200}
                                colors={['#ACA0FF', '#F798D0']}
                                hideLegend={true}
                                className="my-3"
                            />
                        </div>
                    </Glass>
                </section>

                <section className="w-full flex flex-col items-start justify-center gap-6">
                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl">
                        <h5 className="text-xl text-center font-semibold">Popularidade dos Produtos Aster</h5>
                        <div className="w-full h-72 flex items-center justify-center gap-12">
                            <PieChart
                                height={200}
                                series={[{ 
                                    data: usuariosProdutoData,
                                    valueFormatter: ({ value }) => value.toString() + '%',
                                    highlightScope: { fade: 'series', highlight: 'item' },
                                }]}
                                colors={colorScheme1}
                                hideLegend={true}
                                className="my-3"
                            />
                        </div>
                    </Glass>
                </section>

                <section className="w-full flex flex-col items-start justify-center gap-6">
                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl">
                        <h5 className="text-xl font-semibold text-center">Updates recentes</h5>
                        <div className="w-full h-72 flex items-end">
                           <div className="w-full flex flex-col items-start justify-center p-6 gap-2">
                                {versoesRecentesData.map((item: any, index: number) => (
                                    <ListButton label={`${item.produtoNome} - ${item.numeroVersao} : ${item.patchNotes}`} key={index} onClick={() => {}} />
                                ))}
                           </div>
                        </div>
                    </Glass>
                </section>
            </section>
            

            <section className="w-full flex flex-col 2xl:flex-row items-start justify-center gap-6"> 
                <section className="w-full max-w-140 flex flex-col items-start justify-center gap-6 ">
                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl">
                        <div className="ml-3 mb-2">
                            <h5 className="text-xl font-semibold">Divisão de Usuários</h5>
                            <p className="text-sm">Confira a quantidade de usuários por tipo de cliente Aster</p>
                        </div>
                        <div className="w-full flex flex-col items-center justify-center gap-5 mt-3">
                            <div className="h-full my-2">
                                <PieChart
                                    series={[{ 
                                        data: usuariosClienteData.filter(item => item.id === 0),
                                        valueFormatter: ({ value }) => 'R$ ' + value
                                    }]}
                                    width={128}
                                    height={128}
                                    colors={["#ACA0FF"]}
                                    hideLegend={true}
                                    className="border-2 rounded-full border-[var(--content-inverse)]/95"
                                />
                                <p className="text-center mt-2 font-semibold">Cliente<br/>Individual</p>
                            </div>

                            <div className="h-full my-2">
                                <PieChart
                                    series={[{ 
                                        data: usuariosClienteData,
                                        valueFormatter: ({ value }) => 'R$ ' + value
                                    }]}
                                    width={128}
                                    height={128}
                                    colors={["#C198F3", "#D691E6"]}
                                    hideLegend={true}
                                    className="border-2 rounded-full border-[var(--content-inverse)]/95"
                                />
                                <p className="text-center mt-2 font-semibold">Clientes<br/>Totais</p>
                            </div>

                            <div className="h-full my-2">
                                <PieChart
                                    series={[{ 
                                        data: usuariosClienteData.filter(item => item.id === 1),
                                        valueFormatter: ({ value }) => 'R$ ' + value
                                    }]}
                                    width={128}
                                    height={128}
                                    colors={["#E09ACB"]}
                                    hideLegend={true}
                                    className="border-2 rounded-full border-[var(--content-inverse)]/95"
                                />
                                <p className="text-center mt-2 font-semibold">Cliente<br/>Organizacional</p>
                            </div>
                        </div>
                    </Glass>
                </section>

                <section className="w-full flex flex-col items-start justify-center gap-6">
                    <section className="w-full flex flex-col items-start justify-start gap-4">   
                        <div className="w-full flex flex-row items-end justify-between">
                            <h3 className="text-[var(--content-inverse)]">{template?.nome}</h3>
                            <div className="max-w-[504px] flex flex-row gap-4">
                                <Glass padding="p-0" className="max-h-9">
                                    <div className="w-full min-w-[360px] h-9 gap-3 flex flex-row items-center px-6">
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
        
                        <Glass padding="p-0" className="min-w-[calc(100vw-62.5rem)] min-h-[41.25rem] w-full max-h-[680px] overflow-hidden">
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
                                        <tr key={item.id} className="bg-[var(--surface-700)] hover:bg-[var(--surface-600)] cursor-pointer border-b border-[var(--content-inverse)]" onClick={() => {}}>
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
            </section>

            
            


        </section>
    );
}