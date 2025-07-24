import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { IncomePage } from './presentation/screens/income/IncomePage'
import { LoginPage } from './presentation/screens/login/LoginPage'
import { DashboardPage } from './presentation/screens/dashboard/DashboardPage'
import { ExpensePage } from './presentation/screens/expense/ExpensePage'
import { InvoicePage } from './presentation/screens/invoice/InvoicePage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ingresos" element={<IncomePage />} />
        <Route path="/gastos" element={<ExpensePage />} />
        <Route path="/facturas" element={<InvoicePage />} />


        {/* Ruta principal a la página de login */}
        <Route path="/login" element={<LoginPage />} />

        
        {/* Redireccionar la raíz a /ingresos */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
