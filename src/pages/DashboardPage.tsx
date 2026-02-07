import "chart.js/auto"
import { Card } from "primereact/card"
import { Chart } from "primereact/chart"
import { Fragment, useEffect, useState } from "react"
import { HeaderText } from "../components/common/HeaderText"
import { usuarioRepository } from "../db/repositories/UsuarioRepository"

export const DashboardPage = () => {
   const [chartData, setChartData] = useState({})
   const [chartOptions, setChartOptions] = useState({})
   const [totalUsers, setTotalUsers] = useState<number | string>("...")

   useEffect(() => {
      const loadDashboardData = async () => {
         const users = await usuarioRepository.listarTodos()
         setTotalUsers(users.length)

         // Agrupar usuarios por fecha de registro (YYYY-MM-DD)
         const groupedData = users.reduce((acc: { [key: string]: number }, user) => {
            const date = new Date(user.fechaReg).toISOString().split("T")[0]
            acc[date] = (acc[date] || 0) + 1
            return acc
         }, {})

         // Ordenar fechas cronológicamente
         const sortedDates = Object.keys(groupedData).sort()
         const values = sortedDates.map(date => groupedData[date])

         const documentStyle = getComputedStyle(document.documentElement)
         const textColor = documentStyle.getPropertyValue("--text-color") || "#495057"
         const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary") || "#6c757d"
         const surfaceBorder = documentStyle.getPropertyValue("--surface-border") || "#dee2e6"

         const data = {
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
         }

         const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
               legend: {
                  labels: {
                     color: textColor,
                     font: {
                        size: 14,
                        weight: "bold"
                     }
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
                  ticks: {
                     color: textColorSecondary,
                     font: {
                        weight: 500
                     }
                  },
                  grid: {
                     display: false,
                     drawBorder: false
                  }
               },
               y: {
                  beginAtZero: true,
                  ticks: {
                     color: textColorSecondary,
                     stepSize: 1
                  },
                  grid: {
                     color: surfaceBorder,
                     drawBorder: false
                  }
               }
            },
            animation: {
               duration: 1000,
               easing: "easeInOutQuart"
            }
         }

         setChartData(data)
         setChartOptions(options)
      }

      loadDashboardData()
   }, [])

   return (
      <Fragment>
         <HeaderText>Dashboard</HeaderText>
         <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
               <Card
                  title="Actividad de Registros"
                  subTitle="Cantidad de usuarios creados por día"
                  className="overflow-hidden"
               >
                  <div className="h-100">
                     {
                        Object.keys(chartData).length > 0 ?
                           <Chart
                              type="bar" data={chartData}
                              options={chartOptions} className="h-full"
                           /> :
                           <div className="flex flex-col items-center justify-center h-full text-gray-400 italic">
                              <i className="pi pi-chart-bar text-4xl mb-4 opacity-50"></i>
                              <p>Cargando datos del dashboard...</p>
                           </div>
                     }
                  </div>
               </Card>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
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

               <Card className="border-none bg-linear-to-br from-cyan-600 via-blue-800 to-blue-900 text-white">
                  <div className="flex flex-col gap-4">
                     <h3 className="font-semibold text-lg">Resumen Diario</h3>
                     <p className="text-sm">
                        Este gráfico muestra la tendencia de crecimiento de la
                        plataforma basada en los nuevos registros diarios
                        realizados en el sistema local.
                     </p>
                  </div>
               </Card>
            </div>
         </div>
      </Fragment>
   )
}
