import { useEffect, useState } from 'react';
import NavItem from './components/NavItem';
import Glass from './components/Glass';
import { Outlet, Link, useLocation, useNavigate, createContext, useOutletContext } from 'react-router-dom'

function App() {  
  const location = useLocation();

  const isLoginPage = location.pathname === "/" || location.pathname === "/login";
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const userViews = [
    {
      "user": "estrategia",
      "d": "Desempenho de Vendas",
      "i": "Demografia"
    },
    {
      "user": "techlead",
      "d": "Interação e Satisfação",
      "i": "Análise de Qualidade"
    },
    {
      "user": "financas",
      "d": "Métricas de Receita",
      "i": "Fluxo de Caixa"
    },  
    {
      "user": "admin",
      "d": ["Desempenho de Vendas", "Interação e Satisfação", "Métricas de Receita"],
      "i": ["Demografia", "Análise de Qualidade", "Fluxo de Caixa"],
    },
  ]

  const eqView = {
    "Desempenho de Vendas" : "estrategia",
    "Interação e Satisfação" : "techlead",
    "Métricas de Receita" : "financas",
    "Demografia" : "estrategia",
    "Análise de Qualidade" : "techlead",
    "Fluxo de Caixa" : "financas"
  }

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);
  
  const currentView = userViews.find(view => view.user === currentUser);

  if (window.innerWidth < 850) {
    return (
      <div className="w-full h-full min-h-screen min-w-screen flex flex-col items-center justify-center p-3 gap-4 bg-gradient-to-tr from-[var(--brand-blue)] via-[var(--brand-lavender)] to-[var(--brand-pink)]">
        <h1 className="text-2xl font-bold text-center text-white">Por favor, use o pc ou junte-se ao coleguinha mais próximo ;)</h1>
        <img src="/rat-spinning.gif" alt="rato girando" className="h-48" />
      </div>
    )
  }

  return (
    isLoginPage ? ( 
      <main className="w-full h-full min-h-screen min-w-screen flex flex-row items-center justify-center">
        <Outlet context={{ currentUser, setCurrentUser }} />
      </main>
     ) : (
      <div className="w-full h-full min-h-screen min-w-screen flex flex-row items-start justify-start bg-gradient-to-tr from-[var(--brand-blue)] via-[var(--brand-lavender)] to-[var(--brand-pink)]">  
        <div className="w-full h-full max-w-92 flex flex-row items-start justify-center p-6">
          <Glass shadow="lg">
            <div className="min-h-[calc(100vh-6rem)] min-w-68 max-h-268 w-full flex flex-col items-center justify-start gap-9">
              
              <img src="/src/assets/logos/dashboard-black.svg" alt="Aster Logo" className="h-12" />
              <div className="w-full flex flex-col items-center justify-start gap-3">
                <NavItem label="Início" onClick={() => {navigate('/home')}} />
                <NavItem label="Documentação" onClick={() => {navigate('/docs')}} />
              </div>

              <div className="w-full flex flex-col items-center justify-start gap-6" >
                <section className="w-full flex flex-col items-center justify-start gap-6 bg-[var(--content-primary)]/5 rounded-3xl p-3">
                  <div className="w-full flex flex-col items-center justify-start gap-3">
                    <div className="w-full flex flex-row gap-1 items-center">
                      <img src="/src/assets/icons/sidemenu/painel.svg" alt="Panel Icon" className="h-6" />
                      <p> Painel </p>
                    </div>
                     {currentView && (
                      <>
                        {Array.isArray(currentView.d)
                          ? currentView.d.map((label, idx) => (
                              <NavItem key={`d-${idx}`} label={label} onClick={() => {navigate(`/painel/d/${eqView[label]}`)}} />
                            ))
                          : <NavItem label={currentView.d} onClick={() => {navigate(`/painel/d/${currentUser}`)}} />}

                        {Array.isArray(currentView.i)
                          ? currentView.i.map((label, idx) => (
                              <NavItem key={`i-${idx}`} label={label} onClick={() => {navigate(`/painel/i/${eqView[label]}`)}} />
                            ))
                          : <NavItem label={currentView.i} onClick={() => {navigate(`/painel/i/${currentUser}`)}} />}
                      </>
                    )}
                  </div>
                </section>

                <section className="w-full flex flex-col items-center justify-start gap-6 bg-[var(--content-primary)]/5 rounded-3xl p-3">
                  <div className="w-full flex flex-col items-center justify-start gap-3">
                    <div className="w-full flex flex-row gap-1 items-center">
                      <img src="/src/assets/icons/sidemenu/operacoes.svg" alt="Operations Icon" className="h-6" />
                      <p> Operações </p>
                    </div>
                    <NavItem label="Licenças" onClick={() => {navigate('/operacoes/exibir/licenca'), window.location.reload()}} />
                    <NavItem label="Produtos" onClick={() => {navigate('/operacoes/exibir/produto'), window.location.reload()}} />
                    <NavItem label="Versões" onClick={() => {navigate('/operacoes/exibir/versao'), window.location.reload()}} />
                    <NavItem label="Clientes" onClick={() => {navigate('/operacoes/exibir/cliente'), window.location.reload()}} />
                    <NavItem label="Pacotes" onClick={() => {navigate('/operacoes/exibir/pacote'), window.location.reload()}} />
                  </div>
                </section>

                <section className="w-full flex flex-col items-center justify-start gap-6 bg-[var(--content-primary)]/5 rounded-3xl p-3">
                  <div className="w-full flex flex-col items-center justify-start gap-3">
                    <div className="w-full flex flex-row gap-1 items-center">
                      <img src="/src/assets/icons/sidemenu/suporte.svg" alt="Support Icon" className="h-6" />
                      <p> Suporte </p>
                    </div>
                    <NavItem label="Devolutivas" onClick={() => {navigate('/suporte/devolutivas'), window.location.reload()}} />
                    <NavItem label="Responder ticket" onClick={() => {navigate('/suporte/responder'), window.location.reload()}} />
                  </div>
                </section>
              </div>
            </div>
          </Glass>
        </div>

        <main className="w-full h-full pt-6 pb-6 pl-3 pr-9">
          <Outlet context={{ currentUser, setCurrentUser }} />
        </main>
      </div>
    )
  )
}

export default App
