// import * as React from "react"
// import {
//   Toast,
//   ToastClose,
//   ToastDescription,
//   ToastProvider,
//   ToastTitle,
//   ToastViewport,
// } from "@/components/ui/toast"

// const ToastContext = React.createContext<{
//   toast: (props: {
//     title?: string
//     description?: string
//     variant?: "default" | "destructive" | "success"
//   }) => void
// }>({
//   toast: () => {},
// })

// export function ToastContextProvider({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const [toasts, setToasts] = React.useState<Array<{
//     id: string
//     title?: string
//     description?: string
//     variant?: "default" | "destructive" | "success"
//   }>>([])

//   const toast = React.useCallback(
//     ({ title, description, variant = "default" }) => {
//       const id = Math.random().toString(36).slice(2)
//       setToasts((toasts) => [...toasts, { id, title, description, variant }])

//       setTimeout(() => {
//         setToasts((toasts) => toasts.filter((t) => t.id !== id))
//       }, 5000)
//     },
//     []
//   )

//   return (
//     <ToastContext.Provider value={{ toast }}>
//       <ToastProvider>
//         {children}
//         {toasts.map(({ id, title, description, variant }) => (
//           <Toast key={id} variant={variant}>
//             {title && <ToastTitle>{title}</ToastTitle>}
//             {description && <ToastDescription>{description}</ToastDescription>}
//             <ToastClose />
//           </Toast>
//         ))}
//         <ToastViewport />
//       </ToastProvider>
//     </ToastContext.Provider>
//   )
// }

// export const useToast = () => {
//   const context = React.useContext(ToastContext)
//   if (context === undefined) {
//     throw new Error("useToast must be used within a ToastContextProvider")
//   }
//   return context
// }