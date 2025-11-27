import { useEffect, useState } from "react";
import ProfileMenu from "../../components/ProfileMenu";
import Glass from "../../components/Glass";
import { PieChart } from '@mui/x-charts/PieChart';
import api from "../../services/api"
import { useYScale, useDrawingArea} from '@mui/x-charts/hooks';
import { LineChart, areaElementClasses } from '@mui/x-charts/LineChart';

export default function Desempenho() {
    const [tempoReceitaData, setTempoReceitaData] = useState();
    const [tempoDespesasData, setTempoDespesasData] = useState();
    const [ticketMedio, setTicketMedio] = useState();
    const [tempoSaldo, setTempoSaldo] = useState();

    const [colorScheme1, setColorScheme1] = useState();
    const [colorScheme2, setColorScheme2] = useState();

    const fetchData = async (request: string) => {
        try {
            const response = await api.get(`/painel/i/financas/${request}`);
            return(response.data);
        } catch (error) {
            console.error(`Error fetching json ${request}:`, error);
        }
    };

    // FETCH MOCKS
    const fetchJson = async (path: string) => {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Erro ao buscar: ${path}`);
        return response.json();
    };


    function recortarArray(dados: Record<string, any[]>, chave: string) { 
        return dados[chave] ?? [];
    }

    function prepararSerie(serie: any[]) {
        return serie.map((item) => ({
            ...item,
            data: new Date(item.data).getTime(),
        }));
    }

    useEffect(() => {
        async function carregarDados() {
            const [
                tempoReceita,
                tempoDespesas,
                ticketMedio,
                tempoSaldo,
                palette1,
                palette2,
            ] = await Promise.all([
                fetchData('receita-total-mensal'),
                /*fetchData('despesa-total-mensal'),
                fetchData('ticket-medio-cliente'),
                fetchData('saldo-anual'),*/ 
                fetchJson('/mocks/metricas-painel/despesa-total-mensal.json'),
                fetchJson('/mocks/metricas-painel/ticketMedio.json'),
                fetchJson('/mocks/metricas-painel/tempoProduto.json'),

                fetchJson(`/src/assets/files/color-palettes/chartPalette4.json`),
                fetchJson(`/src/assets/files/color-palettes/chartPalette3.json`)
            ]);

            setTempoReceitaData(tempoReceita);
            setTempoDespesasData(tempoDespesas);
            setTicketMedio(ticketMedio);
            setTempoSaldo(tempoSaldo);

            setColorScheme1(palette1);
            setColorScheme2(palette2);
        }

        carregarDados();
    }, []);

    type ColorSwitchProps = {
        threshold: number;
        color1: string;
        color2: string;
        id: string;
    };

    const dateFormatter = (value: string) => {
        const date = new Date(value);

        return date.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
        });
    };


    function ColorSwitch({ threshold, color1, color2, id }: ColorSwitchProps) {
        const { top, height, bottom } = useDrawingArea();
        const svgHeight = top + bottom + height;

        const scale = useYScale() as ScaleLinear<number, number>;
        const y0 = scale(threshold);
        const off = y0 !== undefined ? y0 / svgHeight : 0;
        
        return (
            <defs>
                <linearGradient
                    id={id}
                    x1="0"
                    x2="0"
                    y1="0"
                    y2={`${svgHeight}px`}
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset={off} stopColor={color1} stopOpacity={1} />
                    <stop offset={off} stopColor={color2} stopOpacity={1} />
                </linearGradient>
            </defs>
        );
    }

    if (
        !tempoReceitaData ||
        !tempoDespesasData ||
        !ticketMedio ||
        !tempoSaldo ||
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
                            <h5 className="text-xl font-semibold">Ticket Médio</h5>
                            <p className="text-sm">Confira o ticket médio por tipo de cliente Aster</p>
                        </div>
                        <div className="w-full flex items-center justify-center gap-16 py-5">
                            <div className="h-full my-2">
                                <PieChart
                                    series={[{ 
                                        data: ticketMedio.filter(item => item.id === 0),
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
                                        data: ticketMedio,
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
                                        data: ticketMedio.filter(item => item.id === 1),
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
                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl">
                        <div className="ml-3 mb-12">
                            <h5 className="text-xl font-semibold">Saldo em caixa</h5>
                            <p className="text-sm">Utilize o mouse para mais detalhes</p>
                        </div>
                        <LineChart
                            xAxis={[{ data: ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'], scaleType: 'point' }]}
                            yAxis={[{ min: -3000, max: 4000, width: 50 }]}
                            series={[{ data: [4000, 3000, -1000, 500, -2100, -250, 3490], showMark: false, area: true, color: '#9f95e6' }]}
                            height={200}
                            margin={{ right: 24, bottom: 0 }}
                            sx={{
                            [`& .${areaElementClasses.root}`]: {
                                fill: 'url(#switch-color-id-1)',
                                filter: 'none',
                            },
                            }}
                        >
                            <ColorSwitch
                            color1="#8ad6db" // green
                            color2="#F798D0" // red
                            threshold={0}
                            id="switch-color-id-1"
                            />
                        </LineChart>
                    </Glass>
                </section>
            </section>
                

            <section className="w-full flex flex-col 2xl:flex-row items-start justify-center gap-6"> 
                <section className="w-full flex flex-col items-start justify-center gap-6">
                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl">
                        <div className="ml-3 mb-2">
                            <h5 className="text-xl font-semibold text-center">Receita Recorrente Mensal (MRR)</h5>
                            <p className="text-sm text-center">Coloque o mouse sobre as barras para mais detalhes</p>
                        </div>
                        <div className="w-full flex items-center justify-center px-9 mt-3">
                            <LineChart
                                dataset={prepararSerie(tempoReceitaData)}
                                xAxis={[{
                                    dataKey: 'data',
                                    scaleType: 'time',
                                    valueFormatter: dateFormatter,
                                }]}
                                series={[{
                                    dataKey: 'receita',
                                    showMark: false,
                                    color: "#85bfd4",
                                    label: 'R$'
                                }]}
                                hideLegend={true}
                                height={240}
                                grid={{ vertical: true, horizontal: true }}
                            />
                        </div>
                    </Glass>
                </section>
            </section>

            <section className="w-full flex flex-col 2xl:flex-row items-start justify-center gap-6"> 
                <section className="w-full flex flex-col items-start justify-center gap-6">
                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl">
                        <div className="ml-3 mb-2">
                            <h5 className="text-xl font-semibold text-center">Despesas Operacionais (OPEX)</h5>
                            <p className="text-sm text-center">Coloque o mouse sobre as barras para mais detalhes</p>
                        </div>
                        <div className="w-full flex items-center justify-center px-9 mt-3">
                            <LineChart
                                dataset={prepararSerie(tempoDespesasData)}
                                xAxis={[{
                                    dataKey: 'data',
                                    scaleType: 'time',
                                    valueFormatter: dateFormatter,
                                }]}
                                series={[{
                                    dataKey: 'despesa',
                                    showMark: false,
                                    color: "#C198F3",
                                    label: '- R$'
                                }]}
                                hideLegend={true}
                                height={240}
                                grid={{ vertical: true, horizontal: true }}
                            />
                        </div>
                    </Glass>
                </section>
            </section>
        </section>
    );
}