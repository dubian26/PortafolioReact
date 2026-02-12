import "chart.js/auto"
import { Card } from "primereact/card"
import { Chart } from "primereact/chart"
import { Fragment, useEffect, useState } from "react"
import { HeaderText } from "../components/common/HeaderText"
import { usuarioRepository } from "../repositories/UsuarioRepository"
import { productoRepository } from "../repositories/ProductoRepository"
import { ordenRepository } from "../repositories/OrdenRepository"

export const DashboardPage = () => {
   const [chartData, setChartData] = useState({})
   const [chartOptions, setChartOptions] = useState({})
   const [stockChartData, setStockChartData] = useState({})
   const [stockChartOptions, setStockChartOptions] = useState({})
   const [ventasChartData, setVentasChartData] = useState({})
   const [ventasChartOptions, setVentasChartOptions] = useState({})
   const [totalUsers, setTotalUsers] = useState<number | string>("...")
   const [totalProductos, setTotalProductos] = useState<number | string>("...")
   const [totalVentas, setTotalVentas] = useState<number | string>("...")

   useEffect(() => {
      const loadDashboardData = async () => {
         const documentStyle = getComputedStyle(document.documentElement)
         const textColor = documentStyle.getPropertyValue("--text-color") || "#495057"
         const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary") || "#6c757d"
         const surfaceBorder = documentStyle.getPropertyValue("--surface-border") || "#dee2e6"

         // ─── Usuarios por día ───
         const users = await usuarioRepository.listarTodos()
         setTotalUsers(users.length)

         const groupedData = users.reduce((acc: { [key: string]: number }, user) => {
            const date = new Date(user.fechaReg).toISOString().split("T")[0]
            acc[date] = (acc[date] || 0) + 1
            return acc
         }, {})

         const sortedDates = Object.keys(groupedData).sort()
         const values = sortedDates.map(date => groupedData[date])

         setChartData({
            labels: sortedDates,
            datasets: [
               {
                  label: "Usuarios Creados",
                  data: values,
                  backgroundColor: "rgba(54, 162, 235, 0.4)",
                  borderColor: "rgb(54, 162, 235)",
                  borderWidth: 2,
                  borderRadius: 6,
                  hoverBackgroundColor: "rgba(54, 162, 235, 0.6)"
               }
            ]
         })

         setChartOptions({
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
               legend: {
                  labels: {
                     color: textColor,
                     font: { size: 14, weight: "bold" }
                  }
               },
               tooltip: {
                  mode: "index",
                  intersect: false,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  padding: 12,
                  cornerRadius: 8
               }
            },
            scales: {
               x: {
                  ticks: { color: textColorSecondary, font: { weight: 500 } },
                  grid: { display: false, drawBorder: false }
               },
               y: {
                  beginAtZero: true,
                  ticks: { color: textColorSecondary, stepSize: 1 },
                  grid: { color: surfaceBorder, drawBorder: false }
               }
            },
            animation: { duration: 1000, easing: "easeInOutQuart" }
         })

         // ─── Top 10 productos con mayor stock ───
         const productos = await productoRepository.listarTodos()
         setTotalProductos(productos.length)

         const top10Stock = [...productos]
            .sort((a, b) => b.stock - a.stock)
            .slice(0, 10)

         const stockColors = [
            "rgba(34, 197, 94, 0.7)",
            "rgba(16, 185, 129, 0.7)",
            "rgba(20, 184, 166, 0.7)",
            "rgba(6, 182, 212, 0.7)",
            "rgba(59, 130, 246, 0.7)",
            "rgba(99, 102, 241, 0.7)",
            "rgba(139, 92, 246, 0.7)",
            "rgba(168, 85, 247, 0.7)",
            "rgba(217, 70, 239, 0.7)",
            "rgba(236, 72, 153, 0.7)"
         ]

         const stockBorderColors = stockColors.map(c => c.replace("0.7", "1"))

         setStockChartData({
            labels: top10Stock.map(p => p.nombre.length > 20 ? p.nombre.substring(0, 20) + "..." : p.nombre),
            datasets: [
               {
                  label: "Unidades en Stock",
                  data: top10Stock.map(p => p.stock),
                  backgroundColor: stockColors,
                  borderColor: stockBorderColors,
                  borderWidth: 2,
                  borderRadius: 6
               }
            ]
         })

         setStockChartOptions({
            indexAxis: "y" as const,
            maintainAspectRatio: false,
            plugins: {
               legend: {
                  display: false
               },
               tooltip: {
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  padding: 12,
                  cornerRadius: 8,
                  callbacks: {
                     label: (context: { parsed: { x: number } }) =>
                        ` ${context.parsed.x} unidades`
                  }
               }
            },
            scales: {
               x: {
                  beginAtZero: true,
                  ticks: { color: textColorSecondary },
                  grid: { color: surfaceBorder, drawBorder: false }
               },
               y: {
                  ticks: {
                     color: textColor,
                     font: { size: 12, weight: "500" }
                  },
                  grid: { display: false, drawBorder: false }
               }
            },
            animation: { duration: 1200, easing: "easeInOutQuart" }
         })

         // ─── Ventas (Órdenes) por día ───
         const ordenes = await ordenRepository.listarTodos()
         setTotalVentas(
            ordenes.reduce((sum, o) => sum + o.total, 0).toLocaleString("es-CO", {
               style: "currency",
               currency: "COP",
               minimumFractionDigits: 0
            })
         )

         const ventasPorDia = ordenes.reduce((acc: { [key: string]: { cantidad: number, total: number } }, orden) => {
            const date = new Date(orden.fecha).toISOString().split("T")[0]
            if (!acc[date]) {
               acc[date] = { cantidad: 0, total: 0 }
            }
            acc[date].cantidad += 1
            acc[date].total += orden.total
            return acc
         }, {})

         const sortedVentasDates = Object.keys(ventasPorDia).sort()
         const ventasCantidades = sortedVentasDates.map(d => ventasPorDia[d].cantidad)
         const ventasTotales = sortedVentasDates.map(d => ventasPorDia[d].total)

         setVentasChartData({
            labels: sortedVentasDates,
            datasets: [
               {
                  label: "Cantidad de Órdenes",
                  data: ventasCantidades,
                  borderColor: "rgb(234, 179, 8)",
                  backgroundColor: "rgba(234, 179, 8, 0.15)",
                  fill: true,
                  tension: 0.4,
                  borderWidth: 3,
                  pointBackgroundColor: "rgb(234, 179, 8)",
                  pointBorderColor: "#fff",
                  pointBorderWidth: 2,
                  pointRadius: 5,
                  pointHoverRadius: 7,
                  yAxisID: "y"
               },
               {
                  label: "Total Ventas ($)",
                  data: ventasTotales,
                  borderColor: "rgb(239, 68, 68)",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  fill: true,
                  tension: 0.4,
                  borderWidth: 3,
                  pointBackgroundColor: "rgb(239, 68, 68)",
                  pointBorderColor: "#fff",
                  pointBorderWidth: 2,
                  pointRadius: 5,
                  pointHoverRadius: 7,
                  yAxisID: "y1"
               }
            ]
         })

         setVentasChartOptions({
            maintainAspectRatio: false,
            interaction: {
               mode: "index",
               intersect: false
            },
            plugins: {
               legend: {
                  labels: {
                     color: textColor,
                     font: { size: 13, weight: "bold" },
                     usePointStyle: true,
                     pointStyle: "circle"
                  }
               },
               tooltip: {
                  backgroundColor: "rgba(0, 0, 0, 0.85)",
                  padding: 14,
                  cornerRadius: 10,
                  titleFont: { size: 14, weight: "bold" },
                  bodyFont: { size: 13 }
               }
            },
            scales: {
               x: {
                  ticks: { color: textColorSecondary, font: { weight: 500 } },
                  grid: { display: false, drawBorder: false }
               },
               y: {
                  type: "linear",
                  display: true,
                  position: "left",
                  beginAtZero: true,
                  title: {
                     display: true,
                     text: "Cantidad",
                     color: "rgb(234, 179, 8)",
                     font: { size: 13, weight: "bold" }
                  },
                  ticks: { color: "rgb(234, 179, 8)", stepSize: 1 },
                  grid: { color: surfaceBorder, drawBorder: false }
               },
               y1: {
                  type: "linear",
                  display: true,
                  position: "right",
                  beginAtZero: true,
                  title: {
                     display: true,
                     text: "Total ($)",
                     color: "rgb(239, 68, 68)",
                     font: { size: 13, weight: "bold" }
                  },
                  ticks: { color: "rgb(239, 68, 68)" },
                  grid: { drawOnChartArea: false }
               }
            },
            animation: { duration: 1400, easing: "easeInOutQuart" }
         })
      }

      loadDashboardData()
   }, [])

   const renderLoadingPlaceholder = (icon: string) => (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
         <i className={`${icon} text-4xl mb-4 opacity-50`}></i>
         <p>Cargando datos del dashboard...</p>
      </div>
   )

   return (
      <Fragment>
         <HeaderText>Dashboard</HeaderText>

         {/* ─── KPI Cards ─── */}
         <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none bg-linear-to-br from-cyan-600 via-blue-800 to-blue-900 text-white">
               <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                     <i className="fa-solid fa-users text-3xl text-white"></i>
                  </div>
                  <div>
                     <p className="text-blue-100 text-lg font-semibold tracking-wider">Total Usuarios</p>
                     <h2 className="text-3xl font-bold">{totalUsers}</h2>
                  </div>
               </div>
            </Card>

            <Card className="border-none bg-linear-to-br from-emerald-600 via-green-700 to-teal-800 text-white">
               <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                     <i className="fa-solid fa-boxes-stacked text-3xl text-white"></i>
                  </div>
                  <div>
                     <p className="text-green-100 text-lg font-semibold tracking-wider">Total Productos</p>
                     <h2 className="text-3xl font-bold">{totalProductos}</h2>
                  </div>
               </div>
            </Card>

            <Card className="border-none bg-linear-to-br from-amber-500 via-orange-600 to-red-700 text-white">
               <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                     <i className="fa-solid fa-cash-register text-3xl text-white"></i>
                  </div>
                  <div>
                     <p className="text-orange-100 text-lg font-semibold tracking-wider">Total Ventas</p>
                     <h2 className="text-2xl font-bold">{totalVentas}</h2>
                  </div>
               </div>
            </Card>
         </div>

         {/* ─── Gráfico: Usuarios creados por día ─── */}
         <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
               <Card
                  title="Actividad de Registros"
                  subTitle="Cantidad de usuarios creados por día"
                  className="overflow-hidden"
               >
                  <div className="h-80">
                     {
                        Object.keys(chartData).length > 0 ?
                           <Chart type="bar" data={chartData} options={chartOptions} className="h-full" /> :
                           renderLoadingPlaceholder("fa-solid fa-chart-column")
                     }
                  </div>
               </Card>
            </div>

            <div className="lg:col-span-4">
               <Card className="border-none bg-linear-to-br from-cyan-600 via-blue-800 to-blue-900 text-white h-full">
                  <div className="flex flex-col gap-4 justify-center h-full">
                     <div className="bg-white/10 p-4 rounded-xl">
                        <i className="fa-solid fa-chart-line text-2xl mb-3 block"></i>
                        <h3 className="font-semibold text-lg">Resumen de Registros</h3>
                        <p className="text-sm mt-2 leading-relaxed text-blue-100">
                           Este gráfico muestra la tendencia de crecimiento de la
                           plataforma basada en los nuevos registros diarios
                           realizados en el sistema local.
                        </p>
                     </div>
                  </div>
               </Card>
            </div>
         </div>

         {/* ─── Gráfico: Top 10 Productos con más Stock ─── */}
         <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
               <Card
                  title="Top 10 Productos con Mayor Stock"
                  subTitle="Productos con mayor cantidad de unidades disponibles"
                  className="overflow-hidden"
               >
                  <div className="h-96">
                     {
                        Object.keys(stockChartData).length > 0 ?
                           <Chart type="bar" data={stockChartData} options={stockChartOptions} className="h-full" /> :
                           renderLoadingPlaceholder("fa-solid fa-boxes-stacked")
                     }
                  </div>
               </Card>
            </div>

            {/* ─── Gráfico: Ventas por día ─── */}
            <div className="lg:col-span-6">
               <Card
                  title="Ventas por Día"
                  subTitle="Cantidad de órdenes y montos totales diarios"
                  className="overflow-hidden"
               >
                  <div className="h-96">
                     {
                        Object.keys(ventasChartData).length > 0 ?
                           <Chart type="line" data={ventasChartData} options={ventasChartOptions} className="h-full" /> :
                           renderLoadingPlaceholder("fa-solid fa-chart-area")
                     }
                  </div>
               </Card>
            </div>
         </div>
      </Fragment>
   )
}
