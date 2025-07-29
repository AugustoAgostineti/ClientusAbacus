
'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cnGlass } from "../../utils/cn"
import { liquidGlassTokens } from "../../config/tokens"

const liquidChartVariants = cva(
  "backdrop-blur-md border border-white/40 transition-all duration-250 ease-out",
  {
    variants: {
      theme: {
        light: "bg-white/70",
        dark: "bg-slate-900/70",
        pastel: "bg-gradient-to-br from-white/70 to-purple-50/70",
      },
      glassBackground: {
        true: "backdrop-blur-md",
        false: "",
      },
      animated: {
        true: "hover:scale-[1.01] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        false: "",
      }
    },
    defaultVariants: {
      theme: "light",
      glassBackground: true,
      animated: true,
    },
  }
)

// Paleta de cores para gráficos
const chartColors = {
  primary: liquidGlassTokens.colors.primary['blue-violet'], // #5C7CFA
  secondary: liquidGlassTokens.colors.secondary['lime-green'], // #B4F461
  accent: liquidGlassTokens.colors.accent['lilac'], // #D8C8F7
  neutral: liquidGlassTokens.colors.neutral['mist'], // #E5E7EB
  gradient: [
    '#5C7CFA', '#7C94FB', '#B4F461', '#C4F581', 
    '#D8C8F7', '#E8D8FF', '#F9FAFB', '#F3F4F6'
  ]
}

export interface LiquidChartProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof liquidChartVariants> {
  title?: string
  description?: string
  loading?: boolean
  height?: number
  data?: any[]
}

const LiquidChart = React.forwardRef<HTMLDivElement, LiquidChartProps>(
  ({ 
    className, 
    theme, 
    glassBackground, 
    animated,
    title,
    description,
    loading = false,
    height = 300,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cnGlass(
          liquidChartVariants({ theme, glassBackground, animated, className }),
          "rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
        )}
        {...props}
      >
        {/* Header */}
        {(title || description) && (
          <div className="mb-6">
            {title && (
              <h3 className="text-lg font-semibold text-[#374151] mb-1">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-[#9CA3AF]">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="relative" style={{ height }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#5C7CFA] border-t-transparent" />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    )
  }
)
LiquidChart.displayName = "LiquidChart"

// Placeholder para Line Chart
interface LiquidLineChartProps extends LiquidChartProps {
  data?: Array<{ name: string; value: number; [key: string]: any }>
}

const LiquidLineChart = React.forwardRef<HTMLDivElement, LiquidLineChartProps>(
  ({ data = [], ...props }, ref) => {
    return (
      <LiquidChart ref={ref} {...props}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-[#9CA3AF]">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <p className="text-sm">Gráfico de Linha</p>
            <p className="text-xs opacity-75">Pronto para dados reais</p>
          </div>
        </div>
      </LiquidChart>
    )
  }
)
LiquidLineChart.displayName = "LiquidLineChart"

// Placeholder para Bar Chart
interface LiquidBarChartProps extends LiquidChartProps {
  data?: Array<{ name: string; value: number; [key: string]: any }>
}

const LiquidBarChart = React.forwardRef<HTMLDivElement, LiquidBarChartProps>(
  ({ data = [], ...props }, ref) => {
    return (
      <LiquidChart ref={ref} {...props}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-[#9CA3AF]">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm">Gráfico de Barras</p>
            <p className="text-xs opacity-75">Pronto para dados reais</p>
          </div>
        </div>
      </LiquidChart>
    )
  }
)
LiquidBarChart.displayName = "LiquidBarChart"

// Placeholder para Area Chart
interface LiquidAreaChartProps extends LiquidChartProps {
  data?: Array<{ name: string; value: number; [key: string]: any }>
}

const LiquidAreaChart = React.forwardRef<HTMLDivElement, LiquidAreaChartProps>(
  ({ data = [], ...props }, ref) => {
    return (
      <LiquidChart ref={ref} {...props}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-[#9CA3AF]">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <p className="text-sm">Gráfico de Área</p>
            <p className="text-xs opacity-75">Pronto para dados reais</p>
          </div>
        </div>
      </LiquidChart>
    )
  }
)
LiquidAreaChart.displayName = "LiquidAreaChart"

// Placeholder para Pie Chart
interface LiquidPieChartProps extends LiquidChartProps {
  data?: Array<{ name: string; value: number; color?: string }>
}

const LiquidPieChart = React.forwardRef<HTMLDivElement, LiquidPieChartProps>(
  ({ data = [], ...props }, ref) => {
    return (
      <LiquidChart ref={ref} {...props}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-[#9CA3AF]">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth={1.5} />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2a10 10 0 0110 10" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12V2" />
            </svg>
            <p className="text-sm">Gráfico de Pizza</p>
            <p className="text-xs opacity-75">Pronto para dados reais</p>
          </div>
        </div>
      </LiquidChart>
    )
  }
)
LiquidPieChart.displayName = "LiquidPieChart"

// Componente Stats Card
interface LiquidStatsCardProps extends LiquidChartProps {
  value: string | number
  label: string
  trend?: {
    value: number
    label: string
    direction: 'up' | 'down' | 'neutral'
  }
  icon?: React.ReactNode
  formatter?: (value: string | number) => string
}

const LiquidStatsCard = React.forwardRef<HTMLDivElement, LiquidStatsCardProps>(
  ({ value, label, trend, icon, formatter, className, ...props }, ref) => {
    const formattedValue = formatter ? formatter(value) : value

    const getTrendColor = (direction: 'up' | 'down' | 'neutral') => {
      switch (direction) {
        case 'up': return 'text-[#B4F461]'
        case 'down': return 'text-red-500'
        case 'neutral': return 'text-[#9CA3AF]'
        default: return 'text-[#9CA3AF]'
      }
    }

    return (
      <LiquidChart 
        ref={ref} 
        className={cnGlass("p-6", className)}
        height={120}
        {...props}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#9CA3AF] mb-1">
              {label}
            </p>
            <p className="text-2xl font-bold text-[#374151] mb-2">
              {formattedValue}
            </p>
            {trend && (
              <p className={cnGlass("text-xs", getTrendColor(trend.direction))}>
                {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'} {trend.value}% {trend.label}
              </p>
            )}
          </div>
          {icon && (
            <div className="text-[#5C7CFA] opacity-60">
              {icon}
            </div>
          )}
        </div>
      </LiquidChart>
    )
  }
)
LiquidStatsCard.displayName = "LiquidStatsCard"

export {
  LiquidChart,
  LiquidLineChart,
  LiquidBarChart,
  LiquidAreaChart,
  LiquidPieChart,
  LiquidStatsCard,
  liquidChartVariants,
  chartColors
}
