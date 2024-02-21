import React from 'react'
import {
  Switch as AriaSwitch,
  SwitchProps as AriaSwitchProps
} from 'react-aria-components'
import { tv } from 'tailwind-variants'
import { composeTailwindRenderProps, focusRing } from '../utils'

export interface SwitchProps extends Omit<AriaSwitchProps, 'children'> {
  children: React.ReactNode
}

const track = tv({
  extend: focusRing,
  base: 'flex h-4 w-7 shrink-0 cursor-default items-center rounded-full border border-transparent px-px shadow-inner transition duration-200 ease-in-out',
  variants: {
    isSelected: {
      false:
        'group-pressed:bg-gray-500 dark:group-pressed:bg-zinc-300 bg-gray-400 dark:bg-zinc-400',
      true: 'group-pressed:bg-gray-800 dark:group-pressed:bg-zinc-200 bg-gray-700 dark:bg-zinc-300 forced-colors:!bg-[Highlight]'
    },
    isDisabled: {
      true: 'forced-colors:group-selected:!bg-[GrayText] bg-gray-200 dark:bg-zinc-700 forced-colors:border-[GrayText]'
    }
  }
})

const handle = tv({
  base: 'size-3 transform rounded-full bg-white shadow outline outline-1 -outline-offset-1 outline-transparent transition duration-200 ease-in-out dark:bg-zinc-900',
  variants: {
    isSelected: {
      false: 'translate-x-0',
      true: 'translate-x-[100%]'
    },
    isDisabled: {
      true: 'forced-colors:outline-[GrayText]'
    }
  }
})

const text = tv({
  base: 'text-sm text-zinc-200 transition duration-200 ease-in-out dark:text-slate-200',
  variants: {
    isDisabled: {
      true: 'text-zinc-300/50 dark:text-slate-200/50'
    }
  }
})

export function Switch({ children, ...props }: SwitchProps) {
  return (
    <AriaSwitch
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        'group flex gap-2 items-center transition'
      )}
    >
      {(renderProps) => (
        <>
          <div className={track(renderProps)}>
            <span className={handle(renderProps)} />
          </div>
          <span className={text(renderProps)}>{children}</span>
        </>
      )}
    </AriaSwitch>
  )
}

// text-zinc-200 dark:text-zinc-800
