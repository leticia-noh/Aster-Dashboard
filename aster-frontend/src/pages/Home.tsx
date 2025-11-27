import { useState, useEffect } from "react"
import { useNavigate} from "react-router-dom";
import ProfileMenu from "../components/ProfileMenu";
import Glass from "../components/Glass";
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import api from "../services/api";


export default function Home() {
    const currentUser = localStorage.getItem('currentUser');
    const navigate = useNavigate();
    const [user, setUser] = useState("Fulano");
    const [visao, setVisao] = useState("Nenhuma");
    const [produtoGeral, setProdutoGeral] = useState();
    const [currentProduct, setCurrentProduct] = useState();
    const [currentProductIndex, setCurrentProductIndex] = useState(1);
    const [colorScheme1, setColorScheme1] = useState();
    
    async function fetchUserData(userId: string) {
        userId = userId.slice(1, -1);
        let userData;

        await fetch('/mocks/profiles.json')
            .then(response => response.json())
            .then(data => userData = (data))

        const user = userData.map((profile: any) => {
            if (profile.user === userId) {
                setUser(profile.nome);
                setVisao(profile.setor);
            }
            return;
        })
    }

    async function fetchProductData() {
        try {
            await api.get('/inicio/produtos-geral')
                .then(response => {setProdutoGeral(response.data), console.log(response.data)});
        } catch (error) {
            console.error("Error fetching product data:", error);
        }
    }

    function separarProduto(dados: any[], indice: number) {
        return dados[indice] ?? [];
    }

    useEffect(() => {
        if (currentUser) {
            fetchUserData(currentUser);
        }

        fetchProductData();

        fetch('/src/assets/files/color-palettes/chartPalette4.json')
            .then(response => response.json())
            .then(data => setColorScheme1(data));
    }, []);

    useEffect(() => {
        if (produtoGeral) {
            setCurrentProduct(separarProduto(produtoGeral, currentProductIndex));
        }
    }, [produtoGeral, currentProductIndex]);


    if (!produtoGeral || !currentProduct || !colorScheme1) {
        return <div>Carregando...</div>;
    }

    console.log(produtoGeral);
    
    return (
        <section className="w-full h-full flex flex-col items-center justify-start gap-6">
            <Glass padding="p-12" className="min-w-full">
                <div className="w-full flex flex-col gap-6">
                    <section className="w-full flex flex-row items-center justify-between">
                        <div className="flex flex-row gap-1.5">
                            <img src="/src/assets/logos/icon.svg" alt="Icone Aster" className="h-16 drop-shadow-xs" />
                            <div className="flex flex-col mt-2 gap-1">
                                <h2 className="drop-shadow-xs">Bem vindo(a) de volta, {user}</h2>
                                <p className="text-[var(--content-secondary)] drop-shadow-xs">Visão: {visao}</p>
                            </div>
                        </div>
                        <ProfileMenu />
                    </section>
                    <section className="w-full grid grid-flow-dense grid-cols-4 grid-rows-5 gap-6">
                        <div className="col-span-1 row-span-2 bg-[var(--background-fixed-white)] rounded-3xl shadow-md">
                            <div className="w-full h-full flex flex-col p-6 gap-3">
                                <p className="font-semibold">Acesso rápido</p>
                                <div className="flex flex-col gap-2.5"> 
                                    <button className="w-full p-2 bg-[var(--background-fixed-white)] text-[var(--content-primary)] rounded-[12px] font-semibold text-sm shadow-md outline-1 outline-gray-300 hover:bg-[var(--background-fixed-white)]/80 transition-discrete cursor-pointer" onClick={() => {window.open('http://localhost:5000/')}}>
                                        Website
                                    </button>
                                    <button className="w-full p-2 bg-[var(--background-fixed-white)] text-[var(--content-primary)] rounded-[12px] font-semibold text-sm shadow-md outline-1 outline-gray-300 hover:bg-[var(--background-fixed-white)]/80 transition-discrete cursor-pointer" onClick={() => {}}>
                                        Rede interna
                                    </button>
                                    <button className="w-full p-2 bg-[var(--background-fixed-white)] text-[var(--content-primary)] rounded-[12px] font-semibold text-sm shadow-md outline-1 outline-gray-300 hover:bg-[var(--background-fixed-white)]/80 transition-discrete cursor-pointer" onClick={() => {}}>
                                        Relatórios trimestrais
                                    </button>
                                    <button className="w-full p-2 bg-[var(--background-fixed-white)] text-[var(--content-primary)] rounded-[12px] font-semibold text-sm shadow-md outline-1 outline-gray-300 hover:bg-[var(--background-fixed-white)]/80 transition-discrete cursor-pointer" onClick={() => {}}>
                                        Suporte interno
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 row-span-1 bg-[var(--background-fixed-white)] rounded-3xl shadow-md">
                            <div className="w-full h-full flex flex-col items-center justify-between py-4 px-6">
                                <div className="w-full flex flex-row items-center justify-between">
                                    <p className="text-sm font-semibold">Licenças ativas:</p>
                                    <div className="flex flex-row gap-2">
                                        <p className="text-sm text-[var(--content-secondary)]">505.312</p>
                                        <img src="/src/assets/icons/home/up.svg" alt="up" className="h-4 w-4"/>
                                    </div>
                                </div>
                                <div className="w-full flex flex-row items-center justify-between">
                                    <p className="text-sm font-semibold">Downloads totais:</p>
                                    <div className="flex flex-row gap-2">
                                        <p className="text-sm text-[var(--content-secondary)]">7.995.396</p>
                                        <img src="/src/assets/icons/home/up.svg" alt="up" className="h-4 w-4"/>
                                    </div>
                                </div>
                                <div className="w-full flex flex-row items-center justify-between">
                                    <p className="text-sm font-semibold">Downloads recentes:</p>
                                    <div className="flex flex-row gap-2">
                                        <p className="text-sm text-[var(--content-secondary)]">12.886</p>
                                        <img src="/src/assets/icons/home/up.svg" alt="up" className="h-4 w-4"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 row-span-1 bg-[var(--background-fixed-white)] rounded-3xl shadow-md">
                                {currentProduct && (<>
                                    <div className="w-full h-full flex flex-row items-center justify-center py-6 px-3 gap-4">
                                        <img src={`src/assets/icons/home/left.svg`} alt="Produto anterior" className="h-6 hover:cursor-pointer" onClick={() => {if(currentProductIndex > 0) setCurrentProductIndex(currentProductIndex - 1); else setCurrentProductIndex(15)}}/>
                                        <div className="w-full flex flex-row items-center gap-3.5">
                                            <img src={`src/assets/product-icons/${currentProduct["icone"]}.svg`} alt="Ícone do produto" className="h-16 w-16 drop-shadow-sm"/>
                                            <div className="w-full h-full flex flex-col items-center justify-between gap-1">
                                                <div className="w-full flex flex-row items-center gap-1">
                                                    <p className="text-sm font-semibold">Avaliação:</p>
                                                    <p className="text-sm text-[var(--content-secondary)]">{currentProduct.mediaAvaliacoes}</p>
                                                </div>
                                                <div className="w-full flex flex-row items-center gap-1">
                                                    <p className="text-sm font-semibold">Cópias vendidas:</p>
                                                    <p className="text-sm text-[var(--content-secondary)]">{Intl.NumberFormat('pt-BR').format((currentProduct.mediaAvaliacoes + currentProduct.mediaAvaliacoes/20) * 100000)}</p>
                                                </div>
                                                <div className="w-full flex flex-row items-center gap-1 ">
                                                    <p className="text-sm font-semibold">Versão atual:</p>
                                                    <p className="text-sm text-[var(--content-secondary)]">{currentProduct.versaoAtual}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <img src={`src/assets/icons/home/right.svg`} alt="Próximo produto" className="h-6 hover:cursor-pointer" onClick={() => {if(currentProductIndex < 15) setCurrentProductIndex(currentProductIndex + 1); else setCurrentProductIndex(0)}}/>
                                    </div>
                                </>)}
                        </div>
                        <div className="col-span-1 row-span-2 bg-[var(--background-fixed-white)] rounded-3xl shadow-md">
                            <div className="w-full h-full flex flex-col items-center justify-center p-6">
                                <p className="font-semibold mb-4">Distribuição por sistema operacional</p>
                                <PieChart
                                    height={160}
                                    series={[{ 
                                        data: [ { "value": 38, "label": "Windows" }, { "value": 19, "label": "Linux" }, { "value": 38, "label": "MacOS" }, { "value": 5, "label": "Mobile" } ],
                                        valueFormatter: ({ value }) => value.toString() + '%',
                                        highlightScope: { fade: 'series', highlight: 'item' },
                                        innerRadius: 48,
                                    }]}
                                    colors={colorScheme1}
                                />
                            </div>
                        </div>

                        <div className="col-span-2 row-span-2 bg-[url(/src/assets/backgrounds/home-panel.jpg)] bg-cover bg-center rounded-3xl shadow-md">
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                <img src="/src/assets/logos/logo-white.svg" alt="Logo" className="h-32 mb-8 drop-shadow-lg hover:cursor-pointer" onClick={() => {window.open('http://localhost:5000/')}}/>
                            </div>
                        </div>

                        <div className="col-span-1 row-span-1 bg-[var(--background-fixed-white)] rounded-3xl shadow-md">
                            <div className="w-full h-full flex flex-col items-center justify-between py-4 px-6">
                                <div className="w-full flex flex-row items-center justify-between">
                                    <div className="flex flex-row items-center gap-3">
                                        <img src="/src/assets/icons/home/signal.svg" alt="Signal" className="h-6 w-6"/>
                                        <p className="text-sm">web-main . Amellus</p>
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <img src="/src/assets/icons/home/green-status.svg" alt="Status" className="h-2.5 w-2.5"/>
                                        <p className="text-sm font-semibold text-[var(--accent-green)]">Online </p>
                                    </div>
                                </div>
                                <div className="w-full flex flex-row items-center justify-between">
                                    <div className="flex flex-row items-center gap-3">
                                        <img src="/src/assets/icons/home/signal.svg" alt="Signal" className="h-6 w-6"/>
                                        <p className="text-sm">gen-storage . Bellidiastrum</p>
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <img src="/src/assets/icons/home/green-status.svg" alt="Status" className="h-2.5 w-2.5"/>
                                        <p className="text-sm font-semibold text-[var(--accent-green)]">Online </p>
                                    </div>
                                </div>
                                <div className="w-full flex flex-row items-center justify-between">
                                    <div className="flex flex-row items-center gap-3">
                                        <img src="/src/assets/icons/home/signal.svg" alt="Signal" className="h-6 w-6"/>
                                        <p className="text-sm">web-test . Hayatae</p>
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <img src="/src/assets/icons/home/red-status.svg" alt="Status" className="h-2.5 w-2.5"/>
                                        <p className="text-sm font-semibold text-[var(--accent-red)]">Offline</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1 row-span-3 bg-[var(--background-fixed-white)] rounded-3xl shadow-md">
                            <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-2 hover:cursor-pointer">
                                <div className="w-full h-12.5 flex flex-row items-center justify-between bg-[var(--brand-lavender)] text-[var(--content-inverse)] rounded-full shadow-sm py-2 px-3">
                                    <div className="flex flex-row items-center gap-1.5">
                                        <img src="/src/assets/icons/home/avatar.svg" alt="Avatar" className="h-8 w-8"/>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold">"Pretty solid features & interface"</p>
                                            <p className="text-xs ml-1">Hideo K.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-1 mr-0.5">
                                        <img src="/src/assets/icons/home/star.svg" alt="Avatar" className="h-4 w-4 mb-0.5"/>
                                        <p className="text-sm font-semibold">5.0</p>
                                    </div>
                                </div>

                                <div className="w-full h-12.5 flex flex-row items-center justify-between bg-[var(--brand-lavender)] text-[var(--content-inverse)] rounded-full shadow-sm py-2 px-3">
                                    <div className="flex flex-row items-center gap-1.5">
                                        <img src="/src/assets/icons/home/avatar.svg" alt="Avatar" className="h-8 w-8"/>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold">"Impressionante demais"</p>
                                            <p className="text-xs ml-1">Eduardo B. R. Kochs</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-1 mr-0.5">
                                        <img src="/src/assets/icons/home/star.svg" alt="Avatar" className="h-4 w-4 mb-0.5"/>
                                        <p className="text-sm font-semibold">4.9</p>
                                    </div>
                                </div>

                                <div className="w-full h-12.5 flex flex-row items-center justify-between bg-[var(--brand-lavender)] text-[var(--content-inverse)] rounded-full shadow-sm py-2 px-3">
                                    <div className="flex flex-row items-center gap-1.5">
                                        <img src="/src/assets/icons/home/avatar.svg" alt="Avatar" className="h-8 w-8"/>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold">"Peba"</p>
                                            <p className="text-xs ml-1">Cleiton R. Souza</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-1 mr-0.5">
                                        <img src="/src/assets/icons/home/star.svg" alt="Avatar" className="h-4 w-4 mb-0.5"/>
                                        <p className="text-sm font-semibold">2.1</p>
                                    </div>
                                </div>
                                
                                <div className="w-full h-12.5 flex flex-row items-center justify-between bg-[var(--brand-lavender)] text-[var(--content-inverse)] rounded-full shadow-sm py-2 px-3">
                                    <div className="flex flex-row items-center gap-1.5">
                                        <img src="/src/assets/icons/home/avatar.svg" alt="Avatar" className="h-8 w-8"/>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold">"Meio pah"</p>
                                            <p className="text-xs ml-1">Jão L. M. Pilha</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-1 mr-0.5">
                                        <img src="/src/assets/icons/home/star.svg" alt="Avatar" className="h-4 w-4 mb-0.5"/>
                                        <p className="text-sm font-semibold">1.0</p>
                                    </div>
                                </div>

                                <div className="w-full h-12.5 flex flex-row items-center justify-between bg-[var(--brand-lavender)] text-[var(--content-inverse)] rounded-full shadow-sm py-2 px-3">
                                    <div className="flex flex-row items-center gap-1.5">
                                        <img src="/src/assets/icons/home/avatar.svg" alt="Avatar" className="h-8 w-8"/>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold">"Absolute Cinema"</p>
                                            <p className="text-xs ml-1">Martin C. Scrocese</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-1 mr-0.5">
                                        <img src="/src/assets/icons/home/star.svg" alt="Avatar" className="h-4 w-4 mb-0.5"/>
                                        <p className="text-sm font-semibold">5.0</p>
                                    </div>
                                </div>
                                
                                <div className="w-full h-12.5 flex flex-row items-center justify-between bg-[var(--brand-lavender)] text-[var(--content-inverse)] rounded-full py-2 px-3">
                                    <div className="flex flex-row items-center gap-1.5">
                                        <img src="/src/assets/icons/home/avatar.svg" alt="Avatar" className="h-8 w-8"/>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold">"Cool"</p>
                                            <p className="text-xs ml-1">Michael G. Scott</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-1 mr-0.5">
                                        <img src="/src/assets/icons/home/star.svg" alt="Avatar" className="h-4 w-4 mb-0.5"/>
                                        <p className="text-sm font-semibold">3.4</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-3 row-span-2 bg-[var(--background-fixed-white)] rounded-3xl shadow-md">
                            <div className="w-full h-full flex flex-col items-center justify-center p-6">
                                <LineChart
                                    series={[
                                    { data: [2400, 1398, 2000, 2780, 1890, 2390, 3490], label: 'Meta', yAxisId: 'leftAxisId', color: '#f5cee2' },
                                    { data: [4000, 3000, 9800, 3908, 4800, 3800, 4300], label: 'Valor de mercado', yAxisId: 'rightAxisId', color: '#974cd4' },
                                    ]}
                                    xAxis={[{ scaleType: 'point', data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'] }]}
                                    yAxis={[
                                    { id: 'leftAxisId', width: 50 },
                                    { id: 'rightAxisId', position: 'right' },
                                    ]}
                                    width={1120}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </Glass>
        </section>
    )
}