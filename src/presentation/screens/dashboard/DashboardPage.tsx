import { Link } from 'react-router-dom'

export const DashboardPage = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <ul>
        <li><Link to="/ingresos">Ingresos</Link></li>
        <li><Link to="/gastos">Gastos</Link></li>
        <li><Link to="/facturas">Facturas</Link></li>
      </ul>
    </div>
  )
}