/**
 * className prop 을 추가하는 인터페이스
 */
export interface TailWindClasses {
  className?: string
}

/**
 * shadcn 컴포넌트의 크기를 지정하는 인터페이스
 */
export interface SizeProps {
  size?: ComponentSize
}

/**
 * shadcn 컴포넌트의 크기 타입
 */
export type ComponentSize = 'default' | 'sm' | 'lg' | 'icon' | null | undefined
