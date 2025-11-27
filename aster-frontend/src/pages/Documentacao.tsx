import { useEffect, useState } from "react";
import Glass from "../components/Glass";
import Button from "../components/Button";
import ProfileMenu from "../components/ProfileMenu";
import ListButton from "../components/ListButton";

export default function Documentacao() {
    const [documents, setDocuments] = useState();

    async function fetchDocuments() {
        await fetch("/mocks/docs.json")
        .then((response) => response.json())
        .then((data) => setDocuments(data));
    }

    useEffect(() => {
        fetchDocuments();
    }, [documents]);

    if (!documents) {
        return <div>Carregando...</div>;
    }

    return (
        <section className="h-full w-full flex flex-col items-center gap-4">
            <section className="w-full flex flex-row gap-6">
                <div className="w-full max-h-9 flex flex-row gap-3">
                    <Glass padding="p-0" className="max-h-9 min-w-[calc(100vw-44.75rem)]">
                        <div className="w-full h-9 gap-3 flex flex-row items-center px-6">
                            <img src="/src/assets/icons/search.svg" alt="busca" className="w-4 h-4"/>

                            <input 
                            type="text" 
                            id="search"
                            name="search-entry"
                            placeholder="Busque por um documento ou coleção"
                            className="w-full bg-transparent text-[var(--content-primary)] outline-none placeholder:text-[var(--content-primary)] text-sm placeholder:font-light"
                            />
                        </div>
                    </Glass>
                    <button className="w-9 h-9 px-2 flex items-center justify-center bg-[var(--background-fixed-white)] text-[var(--content-primary)] hover:bg-[var(--background-fixed-white)]/80 rounded-[80px] shadow-md transition-discrete cursor-pointer" onClick={() => {}}>
                        <img src="/src/assets/icons/mais.svg" alt="+" className="w-8 h-8" />
                    </button>
                    <Button variant="primary" label="Nova coleção" onClick={() => {}} />
                </div>
                <ProfileMenu />
            </section>

            <section className="w-full flex flex-row justify-center gap-8">
                <div className="w-full flex flex-col gap-8">
                    <Glass padding="p-6" className="min-w-[calc((100vw-32rem)/4)] rounded-t-4xl rounded-b-4xl">
                        <div className="flex flex-col gap-3 mb-2">
                            <p className="text-lg font-semibold mb-3">Guias de infraestrutura Aster</p>
                            {documents["Guias de infraestrutura Aster"].map((doc) => (
                                <ListButton key={doc} label={doc} />
                            ))}
                        </div>
                    </Glass>
                    <Glass padding="p-6" className="min-w-[calc((100vw-32rem)/4)] rounded-t-4xl rounded-b-4xl">
                        <div className="flex flex-col gap-3 mb-2">
                            <p className="text-lg font-semibold mb-3">Modelo de negócio</p>
                            {documents["Modelo de negócio"].map((doc) => (
                                <ListButton key={doc} label={doc} />
                            ))}
                        </div>
                    </Glass>
                </div>
                <Glass padding="p-6" className="min-w-[calc((100vw-32rem)/4)] rounded-t-4xl rounded-b-4xl">
                    <div className="flex flex-col gap-3 mb-3">
                        <p className="text-lg font-semibold mb-3">Tecnologias</p>
                        {documents["Tecnologias"].map((doc) => (
                            <ListButton key={doc} label={doc} />
                        ))}
                    </div>
                </Glass>
                <Glass padding="p-6" className="min-w-[calc((100vw-32rem)/4)] rounded-t-4xl rounded-b-4xl">
                    <div className="flex flex-col gap-3 mb-3">
                        <p className="text-lg font-semibold mb-3">Produtos</p>
                        {documents["Produtos"].map((doc) => (
                            <ListButton key={doc} label={doc} />
                        ))}
                    </div>
                </Glass>
                <Glass padding="p-6" className="min-w-[calc((100vw-32rem)/4)] rounded-t-4xl rounded-b-4xl">
                    <div className="flex flex-col gap-3 mb-3">
                        <p className="text-lg font-semibold mb-3">Identidade Aster</p>
                        {documents["Identidade Aster"].map((doc) => (
                            <ListButton key={doc} label={doc} />
                        ))}
                    </div>
                </Glass>
            </section>
        </section>
    );
}