
'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cnGlass } from "../../utils/cn"
import { LiquidButton } from "../button"
import Link from "next/link"
import { Menu, X, Bell, Search, User } from "lucide-react"

const liquidNavbarVariants = cva(
  "flex items-center justify-between px-4 lg:px-6 h-16 border-b transition-all duration-250 ease-out",
  {
    variants: {
      variant: {
        fixed: "fixed top-0 left-0 right-0 z-50",
        sticky: "sticky top-0 z-40",
        relative: "relative",
      },
      transparency: {
        transparent: "bg-transparent border-transparent",
        translucent: "bg-white/70 backdrop-blur-md border-white/40",
        opaque: "bg-white border-gray-200",
      },
      blur: {
        true: "backdrop-blur-md",
        false: "",
      }
    },
    defaultVariants: {
      variant: "sticky",
      transparency: "translucent",
      blur: true,
    },
  }
)

export interface LiquidNavbarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof liquidNavbarVariants> {
  logo?: React.ReactNode
  logoText?: string
  logoHref?: string
  showSearch?: boolean
  showNotifications?: boolean
  showProfile?: boolean
  onMenuClick?: () => void
  menuItems?: Array<{
    label: string
    href: string
    icon?: React.ReactNode
  }>
  rightContent?: React.ReactNode
}

const LiquidNavbar = React.forwardRef<HTMLElement, LiquidNavbarProps>(
  ({ 
    className, 
    variant, 
    transparency, 
    blur,
    logo,
    logoText = "App",
    logoHref = "/",
    showSearch = true,
    showNotifications = true,
    showProfile = true,
    onMenuClick,
    menuItems = [],
    rightContent,
    ...props 
  }, ref) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    const handleMenuClick = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen)
      onMenuClick?.()
    }

    return (
      <>
        <nav
          ref={ref}
          className={cnGlass(
            liquidNavbarVariants({ variant, transparency, blur, className }),
            "shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          )}
          {...props}
        >
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href={logoHref} className="flex items-center space-x-2">
              {logo && (
                <div className="flex items-center">
                  {logo}
                </div>
              )}
              <span className="text-xl font-semibold text-[#374151] hover:text-[#5C7CFA] transition-colors">
                {logoText}
              </span>
            </Link>
          </div>

          {/* Center - Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-[#9CA3AF] hover:text-[#5C7CFA] hover:bg-white/50 rounded-xl transition-all duration-200"
              >
                {item.icon && (
                  <span className="mr-2 h-4 w-4">
                    {item.icon}
                  </span>
                )}
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            {showSearch && (
              <LiquidButton
                variant="ghost"
                size="sm"
                className="hidden sm:flex"
              >
                <Search className="h-4 w-4" />
              </LiquidButton>
            )}

            {/* Notifications */}
            {showNotifications && (
              <LiquidButton
                variant="ghost"
                size="sm"
                className="relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-[#B4F461] rounded-full"></span>
              </LiquidButton>
            )}

            {/* Profile */}
            {showProfile && (
              <LiquidButton
                variant="ghost"
                size="sm"
              >
                <User className="h-4 w-4" />
              </LiquidButton>
            )}

            {/* Custom right content */}
            {rightContent}

            {/* Mobile menu button */}
            <LiquidButton
              variant="ghost"
              size="sm"
              onClick={handleMenuClick}
              className="md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </LiquidButton>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 z-40 bg-white/90 backdrop-blur-md border-b border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-[#9CA3AF] hover:text-[#5C7CFA] hover:bg-white/50 rounded-xl transition-all duration-200"
                >
                  {item.icon && (
                    <span className="mr-3 h-4 w-4">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile search */}
              {showSearch && (
                <div className="px-3 py-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-white/50 rounded-xl">
                    <Search className="h-4 w-4 text-[#9CA3AF]" />
                    <input
                      type="text"
                      placeholder="Buscar..."
                      className="bg-transparent border-none outline-none text-sm text-[#374151] placeholder-[#9CA3AF] flex-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )
  }
)
LiquidNavbar.displayName = "LiquidNavbar"

export { LiquidNavbar, liquidNavbarVariants }
