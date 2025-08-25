"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { THEMES, ThemeType } from "@/constants/theme"
import { keys } from "es-toolkit/compat"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface ThemeMenuItemProps {
  theme: ThemeType
}

const ThemeMenuItem = ({ theme }: ThemeMenuItemProps) => {
  const { setTheme } = useTheme()

  return (
    <DropdownMenuItem onClick={() => setTheme(theme)}>
      Light
    </DropdownMenuItem>
  )
}


const ModeToggle = () => {
  const ThemeMenuItems = keys(THEMES).map((theme) => (
    <ThemeMenuItem key={theme} theme={theme as ThemeType} />
  ))

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {ThemeMenuItems}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModeToggle
