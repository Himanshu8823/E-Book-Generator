'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, createContext, useContext, ReactNode } from "react"

interface ConfirmDialogProps {
  title: string
  description: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
}

interface ConfirmContextType {
  confirm: (props: Omit<ConfirmDialogProps, 'onConfirm' | 'onCancel'>) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [dialogState, setDialogState] = useState<{
    open: boolean
    title: string
    description: string
    confirmText: string
    cancelText: string
    resolve?: (value: boolean) => void
  }>({
    open: false,
    title: '',
    description: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  })

  const confirm = ({
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
  }: Omit<ConfirmDialogProps, 'onConfirm' | 'onCancel'>) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        open: true,
        title,
        description,
        confirmText,
        cancelText,
        resolve,
      })
    })
  }

  const handleConfirm = () => {
    dialogState.resolve?.(true)
    setDialogState({ ...dialogState, open: false })
  }

  const handleCancel = () => {
    dialogState.resolve?.(false)
    setDialogState({ ...dialogState, open: false })
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={dialogState.open} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogState.title}</DialogTitle>
            <DialogDescription>{dialogState.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              {dialogState.cancelText}
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              {dialogState.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return context
}
