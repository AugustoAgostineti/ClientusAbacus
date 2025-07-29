
'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cnGlass } from "../../utils/cn"
import { LiquidButton } from "../button"
import Image from "next/image"

const liquidCardVariants = cva(
  // Base classes com glassmorphism
  "backdrop-blur-md border transition-all duration-250 ease-out hover:scale-[1.01] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
  {
    variants: {
      variant: {
        basic: [
          "bg-white/70 border-white/40",
          "shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
          "rounded-2xl"
        ],
        header: [
          "bg-white/70 border-white/40",
          "shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
          "rounded-2xl overflow-hidden"
        ],
        image: [
          "bg-white/70 border-white/40",
          "shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
          "rounded-2xl overflow-hidden"
        ],
        cta: [
          "bg-white/70 border-white/40",
          "shadow-[0_4px_16px_rgba(0,0,0,0.08)]",
          "rounded-2xl",
          "hover:bg-white/80"
        ],
      },
      padding: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
      glassIntensity: {
        light: "bg-white/70",
        medium: "bg-white/50",
        dark: "bg-white/30",
      }
    },
    defaultVariants: {
      variant: "basic",
      padding: "md",
      glassIntensity: "light",
    },
  }
)

export interface LiquidCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof liquidCardVariants> {
  asChild?: boolean
}

const LiquidCard = React.forwardRef<HTMLDivElement, LiquidCardProps>(
  ({ className, variant, padding, glassIntensity, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cnGlass(liquidCardVariants({ variant, padding, glassIntensity, className }))}
        {...props}
      />
    )
  }
)
LiquidCard.displayName = "LiquidCard"

// Componente de Header para Card
const LiquidCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { gradient?: boolean }
>(({ className, gradient, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cnGlass(
      "p-6 border-b border-white/20",
      gradient && "bg-gradient-to-r from-[#5C7CFA]/10 to-[#D8C8F7]/10",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
LiquidCardHeader.displayName = "LiquidCardHeader"

// Componente de Título para Card
const LiquidCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cnGlass(
      "text-lg font-semibold leading-none tracking-tight text-[#374151]",
      className
    )}
    {...props}
  />
))
LiquidCardTitle.displayName = "LiquidCardTitle"

// Componente de Descrição para Card
const LiquidCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cnGlass(
      "text-sm text-[#9CA3AF] mt-2",
      className
    )}
    {...props}
  />
))
LiquidCardDescription.displayName = "LiquidCardDescription"

// Componente de Conteúdo para Card
const LiquidCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cnGlass("p-6 pt-0", className)} {...props} />
))
LiquidCardContent.displayName = "LiquidCardContent"

// Componente de Footer para Card
const LiquidCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cnGlass("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
LiquidCardFooter.displayName = "LiquidCardFooter"

// Componente de Imagem para Card
interface LiquidCardImageProps {
  src: string
  alt: string
  height?: number
  className?: string
  aspectRatio?: 'square' | 'video' | 'wide'
}

const LiquidCardImage = React.forwardRef<HTMLDivElement, LiquidCardImageProps>(
  ({ src, alt, height = 200, className, aspectRatio = 'video', ...props }, ref) => {
    const aspectClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      wide: 'aspect-[21/9]'
    }

    return (
      <div
        ref={ref}
        className={cnGlass(
          "relative overflow-hidden",
          aspectClasses[aspectRatio],
          className
        )}
        {...props}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
    )
  }
)
LiquidCardImage.displayName = "LiquidCardImage"

// Card completo com CTA
interface LiquidCardWithCTAProps extends LiquidCardProps {
  title: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  ctaText: string
  ctaAction: () => void
  ctaVariant?: 'primary' | 'secondary' | 'ghost'
}

const LiquidCardWithCTA = React.forwardRef<HTMLDivElement, LiquidCardWithCTAProps>(
  ({ 
    title, 
    description, 
    imageSrc, 
    imageAlt, 
    ctaText, 
    ctaAction, 
    ctaVariant = 'primary',
    className,
    ...props 
  }, ref) => {
    return (
      <LiquidCard
        ref={ref}
        variant="cta"
        className={cnGlass("overflow-hidden", className)}
        {...props}
      >
        {imageSrc && imageAlt && (
          <LiquidCardImage src={imageSrc} alt={imageAlt} aspectRatio="video" />
        )}
        
        <div className="p-6">
          <LiquidCardTitle>{title}</LiquidCardTitle>
          {description && (
            <LiquidCardDescription>{description}</LiquidCardDescription>
          )}
          
          <div className="mt-4">
            <LiquidButton
              variant={ctaVariant}
              onClick={ctaAction}
              size="sm"
            >
              {ctaText}
            </LiquidButton>
          </div>
        </div>
      </LiquidCard>
    )
  }
)
LiquidCardWithCTA.displayName = "LiquidCardWithCTA"

export {
  LiquidCard,
  LiquidCardHeader,
  LiquidCardTitle,
  LiquidCardDescription,
  LiquidCardContent,
  LiquidCardFooter,
  LiquidCardImage,
  LiquidCardWithCTA,
  liquidCardVariants
}
