
'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cnGlass } from "../../utils/cn"
import { liquidGlassTokens } from "../../config/tokens"

const liquidButtonVariants = cva(
  // Base classes com glassmorphism
  "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-250 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 backdrop-blur-md border",
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-r from-[#5C7CFA] to-[#7C94FB]",
          "text-white border-white/40",
          "hover:from-[#4C6CF9] hover:to-[#6C84FB]",
          "hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(92,124,250,0.25)]",
          "active:scale-[0.98]",
          "shadow-[0_4px_16px_rgba(92,124,250,0.15)]"
        ],
        secondary: [
          "bg-gradient-to-r from-[#B4F461] to-[#C4F581]",
          "text-[#374151] border-white/40",
          "hover:from-[#A4E441] hover:to-[#B4F471]",
          "hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(180,244,97,0.25)]",
          "active:scale-[0.98]",
          "shadow-[0_4px_16px_rgba(180,244,97,0.15)]"
        ],
        ghost: [
          "bg-white/30 backdrop-blur-md",
          "text-[#374151] border-white/40",
          "hover:bg-white/50 hover:scale-[1.02]",
          "hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
          "active:scale-[0.98]",
          "shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
        ],
        pill: [
          "bg-white/70 backdrop-blur-md",
          "text-[#5C7CFA] border-[#5C7CFA]/30",
          "hover:bg-white/80 hover:scale-[1.02]",
          "hover:shadow-[0_8px_32px_rgba(92,124,250,0.15)]",
          "active:scale-[0.98]",
          "shadow-[0_4px_16px_rgba(92,124,250,0.08)]"
        ],
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-xl",
        md: "h-10 px-4 text-sm rounded-xl",
        lg: "h-12 px-6 text-base rounded-2xl",
      },
      glassEffect: {
        true: "backdrop-blur-md",
        false: "",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      glassEffect: true,
    },
  }
)

export interface LiquidButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof liquidButtonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, variant, size, glassEffect, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cnGlass(liquidButtonVariants({ variant, size, glassEffect, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {leftIcon && !loading && (
          <span className="mr-2 flex items-center">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className="ml-2 flex items-center">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)
LiquidButton.displayName = "LiquidButton"

export { LiquidButton, liquidButtonVariants }
