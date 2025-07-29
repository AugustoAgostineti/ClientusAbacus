
'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cnGlass } from "../../utils/cn"
import { LiquidButton } from "../button"
import { X } from "lucide-react"


const liquidModalVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center p-4",
  {
    variants: {
      size: {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-7xl",
      },
      backdrop: {
        blur: "bg-black/20 backdrop-blur-sm",
        dark: "bg-black/50",
        light: "bg-white/30 backdrop-blur-sm",
      },
      rounded: {
        true: "rounded-2xl",
        false: "rounded-none",
      }
    },
    defaultVariants: {
      size: "md",
      backdrop: "blur",
      rounded: true,
    },
  }
)

const liquidModalContentVariants = cva(
  "relative w-full bg-white/90 backdrop-blur-md border border-white/40 shadow-[0_16px_64px_rgba(0,0,0,0.16)] transition-all duration-300 ease-out transform",
  {
    variants: {
      size: {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-7xl",
      },
      rounded: {
        true: "rounded-2xl",
        false: "rounded-none",
      }
    },
    defaultVariants: {
      size: "md",
      rounded: true,
    },
  }
)

export interface LiquidModalProps
  extends VariantProps<typeof liquidModalVariants> {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  className?: string
}

const LiquidModal: React.FC<LiquidModalProps> = ({ 
  open,
  onOpenChange,
  children,
  size,
  backdrop,
  rounded,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
  ...props 
}) => {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape && open) {
        onOpenChange(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, closeOnEscape, onOpenChange])

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnBackdropClick) {
      onOpenChange(false)
    }
  }

  if (!open) return null

  return (
    <div
      className={cnGlass(
        liquidModalVariants({ size, backdrop, rounded }),
        "animate-in fade-in duration-200",
        className
      )}
      onClick={handleBackdropClick}
      {...props}
    >
      <div
        className={cnGlass(
          liquidModalContentVariants({ size, rounded }),
          "animate-in zoom-in-95 duration-200"
        )}
        role="dialog"
        aria-modal="true"
      >
        {showCloseButton && (
          <div className="absolute top-4 right-4 z-10">
            <LiquidButton
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </LiquidButton>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
LiquidModal.displayName = "LiquidModal"

// Componente de Header para Modal
const LiquidModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cnGlass(
      "flex flex-col space-y-2 p-6 border-b border-white/20",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
LiquidModalHeader.displayName = "LiquidModalHeader"

// Componente de Título para Modal
const LiquidModalTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cnGlass(
      "text-xl font-semibold leading-none tracking-tight text-[#374151]",
      className
    )}
    {...props}
  />
))
LiquidModalTitle.displayName = "LiquidModalTitle"

// Componente de Descrição para Modal
const LiquidModalDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cnGlass(
      "text-sm text-[#9CA3AF]",
      className
    )}
    {...props}
  />
))
LiquidModalDescription.displayName = "LiquidModalDescription"

// Componente de Conteúdo para Modal
const LiquidModalContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cnGlass("p-6", className)}
    {...props}
  />
))
LiquidModalContent.displayName = "LiquidModalContent"

// Componente de Footer para Modal
const LiquidModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cnGlass(
      "flex items-center justify-end space-x-2 p-6 border-t border-white/20",
      className
    )}
    {...props}
  />
))
LiquidModalFooter.displayName = "LiquidModalFooter"

export {
  LiquidModal,
  LiquidModalHeader,
  LiquidModalTitle,
  LiquidModalDescription,
  LiquidModalContent,
  LiquidModalFooter,
  liquidModalVariants
}
