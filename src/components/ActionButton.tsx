import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof Button>

export function ActionButton({ className, ...props }: Props) {
  return (
    <Button
      className={cn('btn-duolingo font-bold tracking-wide', className)}
      {...props}
    />
  )
}
