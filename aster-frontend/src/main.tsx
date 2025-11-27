import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Devolutivas from './pages/Devolutivas.tsx'
import Home from './pages/Home.tsx'
import Documentacao from './pages/Documentacao.tsx'
import { painelRoutes } from './pages/Painel.tsx'
import Exibir from './pages/Exibir.tsx'
import { createTheme } from '@mui/material'
import { ThemeProvider } from '@mui/material'
import Responder from './pages/Responder.tsx'

// Teste das telas de formulário
import ProdutoForm from './components/forms/ProdutoForm.tsx'
import VersaoForm from './components/forms/VersaoForm.tsx'
import PacoteForm from './components/forms/PacoteForm.tsx'
import LicencaForm from './components/forms/LicencaForm.tsx'
import ClienteIndividualForm from './components/forms/ClienteIndividualForm.tsx'
import ClienteOrganizacaoForm from './components/forms/ClienteOrganizacaoForm.tsx'
import DevolutivaFeedbackForm from './components/forms/DevolutivaFeedbackForm.tsx'
import DevolutivaTicketForm from './components/forms/DevolutivaTicketForm.tsx'
import UsuarioForm from './components/forms/UsuarioForm.tsx'

// ----- Forms -----
// Criar: Para usar a função de Criar basta acessar o element de formulário da entidade desejada
// Editar: Para usar a função de Editar deve-se passar um registro da entidade para o element

// Tema global dos componentes MUI
  const theme = createTheme({
    typography: {
      fontFamily: 'Segoe UI'
    }
  })

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Login /> },

      { path: 'login', element: <Login /> },
      { path: 'operacoes/form/produto', element: <ProdutoForm />},
      { path: 'operacoes/form/versao', element: <VersaoForm />},
      { path: 'operacoes/form/pacote', element: <PacoteForm />},
      { path: 'operacoes/form/licenca', element: <LicencaForm />},
      { path: 'operacoes/form/cliente-individual', element: <ClienteIndividualForm />},
      { path: 'operacoes/form/cliente-organizacao', element: <ClienteOrganizacaoForm />},
      { path: 'operacoes/form/devolutiva-feedback', element: <DevolutivaFeedbackForm />},
      { path: 'operacoes/form/devolutiva-ticket', element: <DevolutivaTicketForm />},
      { path: 'operacoes/form/usuario', element: <UsuarioForm />},

      { path: 'home', element: <Home /> },
      { path: 'docs', element: <Documentacao /> },

      { path: 'operacoes/exibir/:entidade', element: <Exibir /> },

      { path: 'suporte/devolutivas', element: <Devolutivas /> },
      { path: 'suporte/responder', element: <Responder /> },

      ...painelRoutes,
    ]
  }
])

createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </ThemeProvider>
)
