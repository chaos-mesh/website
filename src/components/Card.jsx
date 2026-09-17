import { clsx } from 'clsx'

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={clsx(
        'tw:p-6 tw:border tw:border-solid tw:border-base-content/15 tw:dark:border-base-content/60 tw:rounded-2xl',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
