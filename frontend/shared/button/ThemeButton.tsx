"use client"

import { THEMES, ThemeType } from "@/lib/constants/theme"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { keys } from "es-toolkit/compat"
import { MonitorCog, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface ThemeMenuItemProps {
  theme: ThemeType
}

const ThemeMenuItem = ({ theme }: ThemeMenuItemProps) => {
  const { setTheme } = useTheme()

  return (
    <DropdownMenuItem onClick={() => setTheme(theme)}>
      <span className="ml-2">{THEMES[theme].name}</span>
    </DropdownMenuItem>
  )
}

const ThemeButton = () => {
  const { theme } = useTheme()

  const ThemeMenuItems = keys(THEMES).map((theme) => (
    <ThemeMenuItem key={theme} theme={theme as ThemeType} />
  ))

  let themeIcon;
  switch (theme) {
    case 'light':
      themeIcon = <Sun className="small-icon" />
      break;
    case 'dark':
      themeIcon = <Moon className="small-icon" />
      break;
    default:
      themeIcon = <MonitorCog className="small-icon" />
      break;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="테마 변경">
          {themeIcon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {ThemeMenuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeButton
