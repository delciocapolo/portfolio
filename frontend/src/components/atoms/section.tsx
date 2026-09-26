import { cn } from '@src/lib/utils'

type Props = {
  title: string
  center?: boolean
  description: string
  className?: string
}

export function SectionTitle({
  description,
  title,
  center = false,
  className = '',
}: Props) {
  return (
    <h2
      className={cn(
        'm-0 text-[clamp(28px,3.4vw,40px)] font-medium tracking-[-0.02em]',
        center ? 'text-center' : '',
        className,
      )}
    >
      {description} <span className="font-extrabold">{title}</span>
    </h2>
  )
}
