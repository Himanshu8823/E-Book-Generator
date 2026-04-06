"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Settings,
  FileText,
  X,
} from "lucide-react"

interface PageSettingsProps {
  showBorders: boolean
  onShowBordersChange: (show: boolean) => void
  showPageNumbers: boolean
  onShowPageNumbersChange: (show: boolean) => void
  showHeader: boolean
  onShowHeaderChange: (show: boolean) => void
  showFooter: boolean
  onShowFooterChange: (show: boolean) => void
  headerLeft: string
  headerCenter: string
  headerRight: string
  onHeaderChange: (position: 'left' | 'center' | 'right', value: string) => void
  footerLeft: string
  footerCenter: string
  footerRight: string
  onFooterChange: (position: 'left' | 'center' | 'right', value: string) => void
}

export function PageSettings({
  showBorders,
  onShowBordersChange,
  showPageNumbers,
  onShowPageNumbersChange,
  showHeader,
  onShowHeaderChange,
  showFooter,
  onShowFooterChange,
  headerLeft,
  headerCenter,
  headerRight,
  onHeaderChange,
  footerLeft,
  footerCenter,
  footerRight,
  onFooterChange,
}: PageSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Settings className="h-4 w-4" />
        Page Settings
      </Button>
    )
  }

  return (
    <div className="fixed right-4 top-20 z-50 w-80 rounded-lg border bg-card p-4 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <h3 className="font-semibold">Page Settings</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Page Borders */}
        <div className="flex items-center justify-between">
          <Label htmlFor="page-borders" className="text-sm">
            Show Page Borders
          </Label>
          <Switch
            id="page-borders"
            checked={showBorders}
            onCheckedChange={onShowBordersChange}
          />
        </div>

        <Separator />

        {/* Page Numbers */}
        <div className="flex items-center justify-between">
          <Label htmlFor="page-numbers" className="text-sm">
            Show Page Numbers
          </Label>
          <Switch
            id="page-numbers"
            checked={showPageNumbers}
            onCheckedChange={onShowPageNumbersChange}
          />
        </div>

        <Separator />

        {/* Header Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="show-header" className="text-sm">
            Show Header
          </Label>
          <Switch
            id="show-header"
            checked={showHeader}
            onCheckedChange={onShowHeaderChange}
          />
        </div>

        {/* Header Settings */}
        {showHeader && (
          <div className="space-y-3 pl-2">
            <div className="space-y-2">
              <div>
                <Label htmlFor="header-left" className="text-xs text-muted-foreground">
                  Left
                </Label>
                <Input
                  id="header-left"
                  value={headerLeft}
                  onChange={(e) => onHeaderChange('left', e.target.value)}
                  placeholder="Left header text"
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="header-center" className="text-xs text-muted-foreground">
                  Center
                </Label>
                <Input
                  id="header-center"
                  value={headerCenter}
                  onChange={(e) => onHeaderChange('center', e.target.value)}
                  placeholder="Center header text"
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="header-right" className="text-xs text-muted-foreground">
                  Right
                </Label>
                <Input
                  id="header-right"
                  value={headerRight}
                  onChange={(e) => onHeaderChange('right', e.target.value)}
                  placeholder="Right header text"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        <Separator />

        {/* Footer Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="show-footer" className="text-sm">
            Show Footer
          </Label>
          <Switch
            id="show-footer"
            checked={showFooter}
            onCheckedChange={onShowFooterChange}
          />
        </div>

        {/* Footer Settings */}
        {showFooter && (
          <div className="space-y-3 pl-2">
            <div className="space-y-2">
              <div>
                <Label htmlFor="footer-left" className="text-xs text-muted-foreground">
                  Left
                </Label>
                <Input
                  id="footer-left"
                  value={footerLeft}
                  onChange={(e) => onFooterChange('left', e.target.value)}
                  placeholder="Left footer text"
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="footer-center" className="text-xs text-muted-foreground">
                  Center
                </Label>
                <Input
                  id="footer-center"
                  value={footerCenter}
                  onChange={(e) => onFooterChange('center', e.target.value)}
                  placeholder="Center footer text"
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="footer-right" className="text-xs text-muted-foreground">
                  Right
                </Label>
                <Input
                  id="footer-right"
                  value={footerRight}
                  onChange={(e) => onFooterChange('right', e.target.value)}
                  placeholder="{page} of {total}"
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        <div className="pt-2">
          <p className="text-xs text-muted-foreground">
            Use <code className="bg-muted px-1 rounded">{"{page}"}</code> and{" "}
            <code className="bg-muted px-1 rounded">{"{total}"}</code> for dynamic page numbers
          </p>
        </div>
      </div>
    </div>
  )
}
