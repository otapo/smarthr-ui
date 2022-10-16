import React, { ButtonHTMLAttributes, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { BaseProps, Variant } from './types'
import { useClassNames } from './useClassNames'
import { ButtonWrapper } from './ButtonWrapper'
import { ButtonInner } from './ButtonInner'
import { Loader as shrLoader } from '../Loader'

type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps>

export const Button = forwardRef<HTMLButtonElement, BaseProps & ElementProps>(
  (
    {
      type = 'button',
      size = 'default',
      square = false,
      prefix,
      suffix,
      wide = false,
      variant = 'secondary',
      disabled,
      className = '',
      children,
      loading = false,
      ...props
    },
    ref,
  ) => {
    const classNames = useClassNames().button

    const actualPrefix = !loading && prefix
    const actualSuffix = loading ? <Loader size="s" type="light" variant={variant} /> : suffix
    const disabledOnLoading = loading || disabled

    return (
      <ButtonWrapper
        {...props}
        type={type}
        size={size}
        square={square}
        wide={wide}
        variant={variant}
        className={`${className} ${classNames.wrapper}`}
        buttonRef={ref}
        disabled={disabledOnLoading}
        loading={loading}
      >
        <ButtonInner prefix={actualPrefix} suffix={actualSuffix}>
          {children}
        </ButtonInner>
      </ButtonWrapper>
    )
  },
)
// BottomFixedArea での判定に用いるために displayName を明示的に設定する
Button.displayName = 'Button'

const Loader = styled(shrLoader)<{ variant: Variant }>`
  ${({ variant, theme: { color } }) => css`
    &&& {
      .s {
        width: 1em;
        height: 1em;
      }
    }

    .light {
      border-color: ${variant === 'secondary'
        ? color.TEXT_DISABLED
        : color.disableColor(color.TEXT_WHITE)};
    }
  `}
`
