import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const RootLayout = ({ children, className, ...props }: ComponentProps<'main'>) => {
  return (
    <main className={twMerge('flex h-screen flex-row', className)} {...props}>
      {children}
    </main>
  )
}

export const Sidebar = ({ className, children, ...props }: ComponentProps<'aside'>) => {
  return (
    <aside
      className={twMerge('h-full w-[250px] max-w-[250px] min-w-[250px] overflow-auto', className)}
      {...props}
    >
      {children}
    </aside>
  )
}

export const Content = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('h-screen flex-1 overflow-auto', className)} {...props}>
      {children}
    </div>
  )
}
