import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'

const modes = ['light', 'dark', 'system'] as const

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  function cycle() {
    const next = modes[(modes.indexOf(theme) + 1) % modes.length]
    setTheme(next)
  }

  return (
    <Button variant="outline" size="icon" onClick={cycle} aria-label="Toggle theme">
      <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <Monitor className="absolute scale-0 transition-all" />
      <span className="sr-only">
        {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}
      </span>
    </Button>
  )
}
