import { useEffect, useState } from "react";
import ProfileMenu from "../../components/ProfileMenu";
import Glass from "../../components/Glass";
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import api from "../../services/api";

export default function Desempenho() {
    const [usuariosData, setUsuariosData] = useState();
    const [avaliacoesData, setAvaliacoesData] = useState();
    const [usuariosProdutoData, setUsuariosProdutoData] = useState();
    const [avaliacoesProdutoData, setAvaliacoesProdutoData] = useState();

    const [produtoSelecionado, setProdutoSelecionado] = useState("nova");
    const [pacoteSelecionado, setPacoteSelecionado] = useState("aikonic");

    const [colorScheme1, setColorScheme1] = useState();
    const [colorScheme2, setColorScheme2] = useState();
    const [colorScheme3, setColorScheme3] = useState();

    const fetchData = async (request: string) => {
        try {
            const response = await api.get(`/painel/d/tech/${request}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${request}:`, error);
        }
    };

    // FETCH MOCKS
    const fetchJson = async (path: string) => {
        const response = await fetch(path);
        if (!response.ok) throw new Error(`Erro ao buscar: ${path}`);
        return response.json();
    };

    function recortarArray(dados: Record<string, any[]>, chave: string) {
        return dados[chave];
    }

    function prepararSerie(serie: any[]) {
        return serie.map((item) => ({
            ...item,
            data: new Date(item.data).getTime(),
        }));
    }

    const formatString = (value: string) => {
        const formatted = value.replace(/_/g, " ");
        return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    };

    useEffect(() => {
        async function carregarDados() {
            const [
                usuarios,
                avaliacoes,
                usuariosProduto,
                avaliacoesProduto,
                palette1,
                palette2,
                palette3,
            ] = await Promise.all([
                fetchData('usuarios-produto'),
                fetchData('media-avaliacoes-pacote'),
                fetchData('usuarios-mensais-produto'),
                fetchData('avaliacoes-mensais-pacote'),
                
                fetchJson(`/src/assets/files/color-palettes/chartPalette3.json`),
                fetchJson(`/src/assets/files/color-palettes/chartPalette1.json`),
                fetchJson(`/src/assets/files/color-palettes/chartPalette2.json`),
            ]);

            setUsuariosData(usuarios);
            setAvaliacoesData(avaliacoes);
            setUsuariosProdutoData(usuariosProduto);
            setAvaliacoesProdutoData(avaliacoesProduto);

            setColorScheme1(palette1);
            setColorScheme2(palette2);
            setColorScheme3(palette3);
        }

        carregarDados();
    }, []);

    if (
        !usuariosData ||
        !avaliacoesData ||
        !usuariosProdutoData ||
        !avaliacoesProdutoData ||
        !colorScheme1 ||
        !colorScheme2 ||
        !colorScheme3
    ) {
        return <div>Carregando...</div>;
    }

    const dateFormatter = (value: number) => {
        return new Date(value).toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
        });
    };

    return (
        <section className="w-full h-full flex flex-col items-center justify-start gap-6">
            <section className="w-full flex flex-row items-center justify-end">
                <ProfileMenu />
            </section>

            <section className="w-full flex flex-col 2xl:flex-row items-start justify-center gap-6"> 
                <section className="w-full flex flex-col items-start justify-center gap-6">
                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl">
                        <div className="ml-3 mb-2">
                            <h5 className="text-xl font-semibold">Quantidade de usuários dos Produtos</h5>
                            <p className="text-sm">Coloque o mouse sobre as barras para mais detalhes</p>
                        </div>
                        <BarChart
                            dataset={usuariosData}
                            xAxis={[{ 
                                scaleType: 'band', 
                                dataKey: 'produto', 
                                colorMap: {
                                    type: 'ordinal',
                                    values: usuariosData.map((d: any) => d.produto),
                                    colors: colorScheme1
                                }
                            }]}
                            series={[{ dataKey: 'usuarios', label: 'Usuários' }]}
                            height={320}
                            hideLegend={true}
                        />
                    </Glass>

                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl" >
                        <div className="ml-3 mb-2">
                            <h5 className="text-xl font-semibold">Avaliação média dos Produtos</h5>
                            <p className="text-sm">Coloque o mouse sobre as barras para mais detalhes</p>
                        </div>
                        <BarChart
                            dataset={avaliacoesData}
                            xAxis={[{ 
                                scaleType: 'band', 
                                dataKey: 'pacote', 
                                colorMap: {
                                    type: 'ordinal',
                                    values: avaliacoesData.map((d: any) => d.pacote),
                                    colors: colorScheme3
                                }
                            }]}
                            series={[{ dataKey: 'avaliacao', label: 'Usuários' }]}
                            height={320}
                            hideLegend={true}
                        />
                    </Glass>

                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl">
                        <div className="flex flex-row items-center ml-3 gap-14">
                            <h5 className="text-xl font-semibold">Quantidades totais:</h5>
                            <div>
                                <p className="font-semibold">Licenças ativas: </p>
                                <p className="text-center"> 505.312 </p>
                            </div>
                            <div>
                                <p className="font-semibold">Downloads totais: </p>
                                <p className="text-center"> 7.995.396 </p>
                            </div>
                            <div>
                                <p className="font-semibold">Downloads recentes: </p>
                                <p className="text-center"> 12.886 </p>
                            </div>
                        </div>
                    </Glass>
                </section>

                <section className="w-full flex flex-col items-start justify-center gap-6">
                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl">
                        <div className="ml-3 mb-2">
                            <h5 className="text-xl font-semibold">Usuários do Produto</h5>
                            <p className="text-sm">Selecione o produto que deseja visualizar</p>
                        </div>
                        <LineChart
                            dataset={prepararSerie(recortarArray(usuariosProdutoData, produtoSelecionado))}
                            xAxis={[{
                                dataKey: 'data',
                                scaleType: 'time',
                                valueFormatter: dateFormatter,
                            }]}
                            series={[{
                                dataKey: 'usuarios',
                                showMark: false,
                                label: 'Usuários',
                                color: colorScheme2[formatString(produtoSelecionado)]
                            }]}
                            height={240}
                            hideLegend={true}
                            grid={{ vertical: true, horizontal: true }}
                        />

                        <div className="flex gap-2 mt-4 pb-3 flex-wrap justify-center">
                            {Object.keys(usuariosProdutoData).map((produto) => (
                                <button
                                    key={produto}
                                    onClick={() => setProdutoSelecionado(produto)}
                                    className={`
                                        px-4 py-1 rounded-lg
                                        ${produtoSelecionado === produto 
                                            ? "bg-[var(--content-secondary)] font-semibold text-[var(--content-inverse)]" 
                                            : "bg-[var(--background-fixed-white)] text-[var(--content-primary)] hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    {formatString(produto)}
                                </button>
                            ))}
                        </div>
                    </Glass>

                    <Glass className="min-w-full rounded-t-3xl rounded-b-3xl">
                        <div className="ml-3 mb-2">
                            <h5 className="text-xl font-semibold">Feedback do Produto</h5>
                            <p className="text-sm">Selecione o produto que deseja visualizar</p>
                        </div>
                        <LineChart
                            dataset={prepararSerie(recortarArray(avaliacoesProdutoData, pacoteSelecionado))}
                            xAxis={[{
                                dataKey: 'data',
                                scaleType: 'time',
                                valueFormatter: dateFormatter,
                            }]}
                            series={[{
                                dataKey: 'avaliacao',
                                showMark: false,
                                label: 'Médias de Avaliação',
                                color: colorScheme2[formatString(pacoteSelecionado)]
                            }]}
                            height={240}
                            hideLegend={true}
                            grid={{ vertical: true, horizontal: true }}
                        />

                        <div className="flex gap-2 mt-4 pb-3 flex-wrap justify-center">
                            {Object.keys(avaliacoesProdutoData).map((produto) => (
                                <button
                                    key={produto + '2'}
                                    onClick={() => setPacoteSelecionado(produto)}
                                    className={`
                                        px-4 py-1 rounded-lg
                                        ${pacoteSelecionado === produto 
                                            ? "bg-[var(--content-secondary)] font-semibold text-[var(--content-inverse)]" 
                                            : "bg-[var(--background-fixed-white)] text-[var(--content-primary)] hover:bg-gray-100"
                                        }
                                    `}
                                >
                                    {formatString(produto)}
                                </button>
                            ))}
                        </div>
                    </Glass>
                </section>
            </section>
            


        </section>
    );
}