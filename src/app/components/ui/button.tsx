// src/components/ui/button.tsx
import React from 'react'
import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'outline' | 'solid'
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'solid',
    className,
    ...props
}) => {
    return (
        <button
            className={clsx(
                'px-4 py-2 rounded font-medium transition-colors focus:outline-none',
                variant === 'outline'
                    ? 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700',
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}