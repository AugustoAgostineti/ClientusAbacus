
'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cnGlass } from "../../utils/cn"
import { LiquidButton } from "../button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react"

const liquidSidebarVariants = cva(
  "flex flex-col h-full border-r transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        minimal: "w-16",
        expanded: "w-64",
        collapsible: "w-16 hover:w-64 group",
      },
      position: {
        left: "left-0",
        right: "right-0",
      },
      glassEffect: {
        true: "bg-white/70 backdrop-blur-md border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
        false: "bg-white border-gray-200",
      }
    },
    defaultVariants: {
      variant: "expanded",
      position: "left",
      glassEffect: true,
    },
  }
)

export interface SidebarItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string | number
  subItems?: Array<{
    label: string
    href: string
  }>
}

export interface LiquidSidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof liquidSidebarVariants> {
  logoSrc?: string
  logoText?: string
  logoHref?: string
  items: SidebarItem[]
  userInfo?: {
    name: string
    email: string
    avatar?: string
    role?: string
  }
  onLogout?: () => void
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  showCollapseButton?: boolean
}

const LiquidSidebar = React.forwardRef<HTMLDivElement, LiquidSidebarProps>(
  ({ 
    className, 
    variant, 
    position, 
    glassEffect,
    logoSrc,
    logoText = "App",
    logoHref = "/",
    items = [],
    userInfo,
    onLogout,
    collapsed: controlledCollapsed,
    onCollapse,
    showCollapseButton = true,
    ...props 
  }, ref) => {
    const pathname = usePathname()
    const [internalCollapsed, setInternalCollapsed] = React.useState(false)
    
    const collapsed = controlledCollapsed ?? internalCollapsed
    const isCollapsible = variant === 'collapsible'
    const isMinimal = variant === 'minimal' || collapsed

    const handleCollapse = () => {
      const newCollapsed = !collapsed
      if (onCollapse) {
        onCollapse(newCollapsed)
      } else {
        setInternalCollapsed(newCollapsed)
      }
    }

    return (
      <div
        ref={ref}
        className={cnGlass(
          liquidSidebarVariants({ variant: collapsed && variant !== 'minimal' ? 'minimal' : variant, position, glassEffect, className }),
          "fixed inset-y-0 z-30"
        )}
        {...props}
      >
        {/* Header/Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/20">
          <Link href={logoHref} className="flex items-center space-x-3 min-w-0">
            {logoSrc && (
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#5C7CFA] to-[#D8C8F7] rounded-lg flex items-center justify-center">
                {/* Placeholder para logo */}
                <div className="w-5 h-5 bg-white rounded opacity-90"></div>
              </div>
            )}
            <span className={cnGlass(
              "font-semibold text-[#374151] transition-opacity duration-200",
              isMinimal && !isCollapsible && "opacity-0",
              isCollapsible && "group-hover:opacity-100 opacity-0"
            )}>
              {logoText}
            </span>
          </Link>
          
          {showCollapseButton && variant !== 'minimal' && (
            <LiquidButton
              variant="ghost"
              size="sm"
              onClick={handleCollapse}
              className={cnGlass(
                "flex-shrink-0 transition-opacity duration-200",
                isMinimal && !isCollapsible && "opacity-0",
                isCollapsible && "group-hover:opacity-100 opacity-0"
              )}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </LiquidButton>
          )}
        </div>

        {/* User Info */}
        {userInfo && (
          <div className="px-4 py-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#B4F461] to-[#D8C8F7] rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-[#374151]">
                  {userInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className={cnGlass(
                "min-w-0 transition-opacity duration-200",
                isMinimal && !isCollapsible && "opacity-0",
                isCollapsible && "group-hover:opacity-100 opacity-0"
              )}>
                <p className="text-sm font-medium text-[#374151] truncate">
                  {userInfo.name}
                </p>
                <p className="text-xs text-[#9CA3AF] truncate">
                  {userInfo.email}
                </p>
                {userInfo.role && (
                  <p className="text-xs text-[#5C7CFA] mt-1">
                    {userInfo.role}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {items.map((item, index) => {
            const isActive = pathname === item.href
            
            return (
              <div key={index}>
                <Link
                  href={item.href}
                  className={cnGlass(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 group/item",
                    isActive
                      ? "bg-gradient-to-r from-[#5C7CFA]/10 to-[#D8C8F7]/10 text-[#5C7CFA] border border-[#5C7CFA]/20"
                      : "text-[#9CA3AF] hover:text-[#374151] hover:bg-white/50"
                  )}
                >
                  <span className="flex-shrink-0 h-5 w-5 flex items-center justify-center">
                    {item.icon}
                  </span>
                  <span className={cnGlass(
                    "ml-3 transition-opacity duration-200",
                    isMinimal && !isCollapsible && "opacity-0",
                    isCollapsible && "group-hover:opacity-100 opacity-0"
                  )}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className={cnGlass(
                      "ml-auto px-2 py-1 text-xs bg-[#B4F461] text-[#374151] rounded-full transition-opacity duration-200",
                      isMinimal && !isCollapsible && "opacity-0",
                      isCollapsible && "group-hover:opacity-100 opacity-0"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
                
                {/* Sub-items */}
                {item.subItems && !isMinimal && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className={cnGlass(
                          "block px-3 py-1 text-xs text-[#9CA3AF] hover:text-[#374151] rounded-lg transition-colors duration-200",
                          pathname === subItem.href && "text-[#5C7CFA]"
                        )}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer/Logout */}
        {onLogout && (
          <div className="px-4 py-4 border-t border-white/20">
            <LiquidButton
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4" />
              <span className={cnGlass(
                "ml-3 transition-opacity duration-200",
                isMinimal && !isCollapsible && "opacity-0",
                isCollapsible && "group-hover:opacity-100 opacity-0"
              )}>
                Sair
              </span>
            </LiquidButton>
          </div>
        )}
      </div>
    )
  }
)
LiquidSidebar.displayName = "LiquidSidebar"

export { LiquidSidebar, liquidSidebarVariants }
