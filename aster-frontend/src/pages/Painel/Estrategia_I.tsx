import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileMenu from "../../components/ProfileMenu";
import Glass from "../../components/Glass";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { RadarChart } from "@mui/x-charts/RadarChart";
import api from "../../services/api"

export default function Desempenho() {
    const [quantidadesData, setQuantidadesData] = useState();
    const [clientesContinenteData, setClientesContinenteData] = useState();
    const [clientesPaisData, setClientesPaisData] = useState();
    const [porcentagemSegmentoData, setPorcentagemSegmentoData] = useState();
    const [porcentagemAplicacaoData, setPorcentagemAplicacaoData] = useState();
    const [porcentagemPorteData, setPorcentagemPorteData] = useState();

    const [colorScheme1, setColorScheme1] = useState();
    const [colorScheme2, setColorScheme2] = useState();

    const fetchData = async (request: string) => {
        try {
            const response = await api.get(`/painel/i/estrategia/${request}`);
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


    function recortarArray(dados: Record<string, any[]>, chave: string) { 
        return dados[chave] ?? [];
    }

    useEffect(() => {
        async function carregarDados() {
            const [
                quantidades,
                clientesContinente,
                clientesPais,
                porcentagemSegmento,
                porcentagemAplicacao,
                porcentagemPorte,
                palette1,
                palette2,
            ] = await Promise.all([
                fetchData('quantidades-entidades'),
                fetchData('clientes-continente'),
                fetchData('clientes-pais'),
                fetchData('porcentagem-segmento-atuacao'),
                fetchData('porcentagem-atividade-uso'),
                fetchData('porcentagem-porte'),

                fetchJson(`/src/assets/files/color-palettes/chartPalette4.json`),
                fetchJson(`/src/assets/files/color-palettes/chartPalette3.json`)
            ]);

            setQuantidadesData(quantidades);
            setClientesContinenteData(clientesContinente);
            setClientesPaisData(clientesPais);
            setPorcentagemSegmentoData(porcentagemSegmento);
            setPorcentagemAplicacaoData(porcentagemAplicacao);
            setPorcentagemPorteData(porcentagemPorte);

            setColorScheme1(palette1);
            setColorScheme2(palette2);
        }

        carregarDados();
    }, []);


    if (
        !quantidadesData || 
        !clientesContinenteData || 
        !clientesPaisData || 
        !porcentagemSegmentoData || 
        !porcentagemAplicacaoData || 
        !porcentagemPorteData || 
        !colorScheme1 || 
        !colorScheme2
    ) {
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
                        <div className="ml-3 mb-2">
                            <h5 className="text-xl font-semibold text-center">Quantidades totais</h5>
                            <p className="text-sm text-center">Confira as quantidades totais de cada recurso de negócio da Aster</p>
                        </div>
                        <div className="w-full flex items-center justify-center gap-12">
                            {Object.keys(quantidadesData).map((entidade) => (
                                <div className="h-full my-2" key={entidade}>
                                    {console.log(recortarArray(quantidadesData, entidade))}
                                    <PieChart
                                        series={[{ 
                                            data: recortarArray(quantidadesData, entidade),
                                            valueFormatter: ({ value }) => value + ' ' + entidade.toLowerCase()
                                        }]}
                                        width={128}
                                        height={128}
                                        colors={colorScheme1}
                                        hideLegend={true}
                                        key={entidade}
                                        className="border-2 rounded-full border-[var(--content-inverse)]/95"
                                    />
                                    <p className="text-center mt-2 font-semibold">{entidade}</p>
                                </div>
                            ))}
                        </div>
                    </Glass>
                </section>
            </section>

            <section className="w-full flex flex-col 2xl:flex-row items-start justify-center gap-6"> 
                <section className="w-full flex flex-col items-start justify-center gap-6">
                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl">
                        <div className="ml-3 mb-2">
                            <h5 className="text-xl font-semibold">Divisão por continente</h5>
                            <p className="text-sm">Distribuição dos nossos clientes por continente</p>
                        </div>
                        <RadarChart
                            height={360}
                            series={[{ label: 'Clientes', data: clientesContinenteData, color: '#974cd4' }]}
                            radar={{
                                max: 130,
                                metrics: ['América do Sul', 'América do Norte', 'África', 'Ásia', 'Europa', 'Oceania'],
                            }}
                            hideLegend={true}
                            />
                    </Glass>
                </section>

                <section className="w-full flex flex-col items-start justify-center gap-6">
                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl">
                        <div className="ml-3 mb-12">
                            <h5 className="text-xl font-semibold">Divisão por país</h5>
                            <p className="text-sm">Coloque o mouse sobre as barras para mais detalhes</p>
                        </div>
                        <BarChart
                            dataset={clientesPaisData}
                            yAxis={[{ scaleType: 'linear', }]}
                            xAxis={ [{ 
                                scaleType: 'band', 
                                dataKey: 'pais', 
                                colorMap: {
                                    type: 'ordinal',
                                    values: clientesPaisData.map((d: any) => d.pais),
                                    colors: colorScheme2
                                }}]}
                            series={[{ dataKey: 'clientes', label: 'Clientes' }]}
                            hideLegend={true}
                            layout="vertical"
                            height={320}
                            colors= {colorScheme2}
                        />
                    </Glass>
                </section>
            </section>

            <section className="w-full flex flex-col 2xl:flex-row items-start justify-center gap-6"> 
                <section className="w-full h-104 flex flex-col items-start justify-center gap-6">
                    <Glass className="min-w-full min-h-104 rounded-t-3xl rounded-b-3xl">
                        <h5 className="text-xl text-center font-semibold mb-2">Prevalescência de segmento de atuação</h5>
                        <div className="w-full h-80 flex items-center justify-center gap-12">
                        <PieChart
                            height={200}
                            series={[{ 
                                data: porcentagemSegmentoData,
                                valueFormatter: ({ value }) => value.toString() + '%',
                                highlightScope: { fade: 'series', highlight: 'item' },
                            }]}
                            colors={colorScheme1}
                            hideLegend={false}
                            className="my-3"
                            />
                        </div>
                    </Glass>
                </section>

                <section className="w-full h-104 flex flex-col items-start justify-center gap-6">
                    <Glass className="min-w-full min-h-104 rounded-t-3xl rounded-b-3xl">
                        <h5 className="text-xl text-center font-semibold mb-2">Prevalescência de aplicação das ferramentas</h5>
                        <div className="w-full h-80 flex items-center justify-center gap-12">
                        <PieChart
                            height={200}
                            series={[{ 
                                data: porcentagemAplicacaoData,
                                valueFormatter: ({ value }) => value.toString() + '%',
                                highlightScope: { fade: 'series', highlight: 'item' },
                            }]}
                            colors={colorScheme1}
                            hideLegend={false}
                            className="my-3"
                            />
                        </div>
                    </Glass>
                </section>

                <section className="w-full h-104 flex flex-col items-start justify-center gap-6">
                    <Glass className="min-w-full min-h-104 rounded-t-3xl rounded-b-3xl">
                        <h5 className="text-xl text-center font-semibold mb-2">Prevalescência de porte das empresas</h5>
                        <div className="w-full h-80 flex items-center justify-center gap-12">
                        <PieChart
                            height={200}
                            series={[{ 
                                data: porcentagemPorteData,
                                valueFormatter: ({ value }) => value.toString() + '%',
                                highlightScope: { fade: 'series', highlight: 'item' },
                            }]}
                            colors={colorScheme1}
                            hideLegend={false}
                            className="my-3"
                            />
                        </div>
                    </Glass>
                </section>
            </section>
            


        </section>
    );
}