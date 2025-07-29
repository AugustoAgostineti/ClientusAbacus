
'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cnGlass } from "../../utils/cn"
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react"

const liquidTableVariants = cva(
  "w-full border-collapse overflow-hidden",
  {
    variants: {
      variant: {
        clean: "bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
        bordered: "bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
        striped: "bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
      },
      glassHeaders: {
        true: "",
        false: "",
      },
      hoverEffect: {
        true: "",
        false: "",
      }
    },
    defaultVariants: {
      variant: "clean",
      glassHeaders: true,
      hoverEffect: true,
    },
  }
)

export interface Column<T = any> {
  key: string
  title: string
  dataIndex?: keyof T
  render?: (value: any, record: T, index: number) => React.ReactNode
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  className?: string
}

export interface LiquidTableProps<T = any>
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof liquidTableVariants> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number, pageSize: number) => void
  }
  sortable?: boolean
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  emptyText?: string
  rowKey?: keyof T | ((record: T) => string)
  onRowClick?: (record: T, index: number) => void
}

const LiquidTable = <T extends Record<string, any>>({
  className,
  variant,
  glassHeaders,
  hoverEffect,
  columns,
  data,
  loading = false,
  pagination,
  sortable = false,
  sortKey,
  sortDirection,
  onSort,
  emptyText = "Nenhum dado encontrado",
  rowKey = 'id',
  onRowClick,
  ...props
}: LiquidTableProps<T>) => {
  const [internalSortKey, setInternalSortKey] = React.useState<string>()
  const [internalSortDirection, setInternalSortDirection] = React.useState<'asc' | 'desc'>('asc')

  const currentSortKey = sortKey ?? internalSortKey
  const currentSortDirection = sortDirection ?? internalSortDirection

  const handleSort = (key: string) => {
    const newDirection = currentSortKey === key && currentSortDirection === 'asc' ? 'desc' : 'asc'
    
    if (onSort) {
      onSort(key, newDirection)
    } else {
      setInternalSortKey(key)
      setInternalSortDirection(newDirection)
    }
  }

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record)
    }
    const keyValue = record[rowKey]
    return keyValue ? String(keyValue) : index.toString()
  }

  const renderSortIcon = (columnKey: string) => {
    if (currentSortKey !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 text-[#9CA3AF]" />
    }
    return currentSortDirection === 'asc' 
      ? <ChevronUp className="h-3 w-3 text-[#5C7CFA]" />
      : <ChevronDown className="h-3 w-3 text-[#5C7CFA]" />
  }

  const renderCell = (column: Column<T>, record: T, index: number) => {
    if (column.render) {
      return column.render(record[column.dataIndex as keyof T], record, index)
    }
    
    const value = column.dataIndex ? record[column.dataIndex] : ''
    return value ? String(value) : ''
  }

  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center': return 'text-center'
      case 'right': return 'text-right'
      default: return 'text-left'
    }
  }

  return (
    <div 
      className={cnGlass(liquidTableVariants({ variant, glassHeaders, hoverEffect, className }))}
      {...props}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead>
            <tr className={cnGlass(
              "border-b border-white/20",
              glassHeaders && "bg-gradient-to-r from-[#5C7CFA]/5 to-[#D8C8F7]/5"
            )}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cnGlass(
                    "px-6 py-4 text-left text-xs font-semibold text-[#374151] uppercase tracking-wider",
                    getAlignmentClass(column.align),
                    (sortable || column.sortable) && "cursor-pointer hover:bg-white/20 transition-colors duration-200",
                    column.className
                  )}
                  style={{ width: column.width }}
                  onClick={() => (sortable || column.sortable) && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.title}</span>
                    {(sortable || column.sortable) && renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#5C7CFA] border-t-transparent" />
                    <span className="text-sm text-[#9CA3AF]">Carregando...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-sm text-[#9CA3AF]">
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((record, index) => (
                <tr
                  key={getRowKey(record, index)}
                  className={cnGlass(
                    "border-b border-white/10 transition-all duration-200",
                    hoverEffect && "hover:bg-white/30 hover:scale-[1.001] hover:shadow-sm",
                    onRowClick && "cursor-pointer",
                    variant === 'striped' && index % 2 === 1 && "bg-white/20"
                  )}
                  onClick={() => onRowClick?.(record, index)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cnGlass(
                        "px-6 py-4 text-sm text-[#374151]",
                        getAlignmentClass(column.align),
                        column.className
                      )}
                      style={{ width: column.width }}
                    >
                      {renderCell(column, record, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/20">
          <div className="text-sm text-[#9CA3AF]">
            Mostrando {Math.min((pagination.current - 1) * pagination.pageSize + 1, pagination.total)} até{' '}
            {Math.min(pagination.current * pagination.pageSize, pagination.total)} de {pagination.total} registros
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
              disabled={pagination.current <= 1}
              className={cnGlass(
                "px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "bg-white/50 hover:bg-white/70 text-[#374151]"
              )}
            >
              Anterior
            </button>
            
            <span className="px-3 py-1 text-xs font-medium text-[#374151]">
              {pagination.current} de {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            
            <button
              onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              className={cnGlass(
                "px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "bg-white/50 hover:bg-white/70 text-[#374151]"
              )}
            >
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export { LiquidTable, liquidTableVariants }
