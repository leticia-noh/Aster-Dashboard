import Estrategia_D from "./Painel/Estrategia_D"
import Financas_D from "./Painel/Financas_D"
import Tech_D from "./Painel/Tech_D"

import Estrategia_I from "./Painel/Estrategia_I"
import Financas_I from "./Painel/Financas_I"
import Tech_I from "./Painel/Tech_I"

export const painelRoutes = [
  {
    path: "painel",
    children: [
      { path: "d/estrategia", element: <Estrategia_D /> },
      { path: "d/financas", element: <Financas_D /> },
      { path: "d/techlead", element: <Tech_D /> },
      
      { path: "i/estrategia", element: <Estrategia_I /> },
      { path: "i/financas", element: <Financas_I /> },
      { path: "i/techlead", element: <Tech_I /> }
    ]
  }
];
