"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps, toast } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ theme = "light", ...props }: ToasterProps) => {
  const { theme: contextTheme } = useTheme()
  const activeTheme = ((contextTheme === "system" ? "light" : contextTheme) ?? theme ?? "light") as ToasterProps["theme"]

  return (
    <Sonner
      theme={activeTheme}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-white" />
        ),
        info: (
          <InfoIcon className="size-4 text-white" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-white" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-white" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-white" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": "rgba(14, 147, 132, 0.90)",
          "--success-border": "rgba(11, 122, 109, 0.75)",
          "--success-text": "#FFFFFF",
          "--warning-bg": "rgba(220, 38, 38, 0.90)",
          "--warning-border": "rgba(185, 28, 28, 0.75)",
          "--warning-text": "#FFFFFF",
          "--error-bg": "rgba(220, 38, 38, 0.90)",
          "--error-border": "rgba(185, 28, 28, 0.75)",
          "--error-text": "#FFFFFF",
          "--info-bg": "rgba(30, 109, 226, 0.90)",
          "--info-border": "rgba(24, 91, 191, 0.75)",
          "--info-text": "#FFFFFF",
          zIndex: 99999,
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export const notifySuccess = (message: string | React.ReactNode, options?: Parameters<typeof toast.success>[1]) =>
  toast.success(message, { duration: 5000, ...options });

export const notifyError = (message: string | React.ReactNode, options?: Parameters<typeof toast.error>[1]) =>
  toast.error(message, { duration: 8000, ...options });

export const notifyWarning = (message: string | React.ReactNode, options?: Parameters<typeof toast.warning>[1]) =>
  toast.warning(message, { duration: 5000, ...options });

export const notifyInfo = (message: string | React.ReactNode, options?: Parameters<typeof toast.info>[1]) =>
  toast.info(message, { duration: 5000, ...options });

export { Toaster, toast }
