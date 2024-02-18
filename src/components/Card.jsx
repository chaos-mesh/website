import { clsx } from 'clsx'

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        'tw-p-6 tw-border tw-border-solid tw-border-base-content tw-border-opacity-15 dark:tw-border-opacity-60 tw-rounded-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
