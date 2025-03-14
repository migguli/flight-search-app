import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { AlertCircle, Info, CheckCircle, XCircle } from "lucide-react"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-success-500/50 text-success-500 dark:border-success-500 bg-success-500/10 [&>svg]:text-success-500",
        warning:
          "border-warning-500/50 text-warning-500 dark:border-warning-500 bg-warning-500/10 [&>svg]:text-warning-500",
        info:
          "border-primary-500/50 text-primary-500 dark:border-primary-500 bg-primary-500/10 [&>svg]:text-primary-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & 
  VariantProps<typeof alertVariants> & 
  { 
    icon?: React.ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
  }
>(({ className, variant, icon, dismissible, onDismiss, children, ...props }, ref) => {
  // Select the icon based on variant if not provided
  const defaultIcon = () => {
    if (!icon) {
      switch (variant) {
        case 'destructive':
          return <AlertCircle className="h-4 w-4" />;
        case 'success':
          return <CheckCircle className="h-4 w-4" />;
        case 'warning':
          return <AlertCircle className="h-4 w-4" />;
        case 'info':
          return <Info className="h-4 w-4" />;
        default:
          return null;
      }
    }
    return icon;
  }

  return (
    <div
      ref={ref}
      role="alert"
      aria-live={variant === 'destructive' ? 'assertive' : 'polite'}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {defaultIcon()}
      {children}
      {dismissible && (
        <button 
          onClick={onDismiss} 
          className="absolute top-4 right-4 text-foreground/50 hover:text-foreground"
          aria-label="Dismiss alert"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription } 