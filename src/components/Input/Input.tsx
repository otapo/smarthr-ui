import React, {
  FocusEvent,
  InputHTMLAttributes,
  ReactNode,
  WheelEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import styled, { css } from 'styled-components'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'

type Props = {
  /** input 要素の `type` 値 */
  type?: HTMLInputElement['type']
  /** フォームにエラーがあるかどうか */
  error?: boolean
  /** コンポーネントの幅 */
  width?: number | string
  /** オートフォーカスを行うかどうか */
  autoFocus?: boolean
  /** コンポーネント内の先頭に表示する内容 */
  prefix?: ReactNode
  /** コンポーネント内の末尾に表示する内容 */
  suffix?: ReactNode
  /**
   * @deprecated placeholder属性は非推奨です。別途ヒント用要素を設置するか、それらの領域を確保出来ない場合はTooltipコンポーネントの利用を検討してください。
   */
  placeholder?: string
}
type ElementProps = Omit<InputHTMLAttributes<HTMLInputElement>, keyof Props>

export const Input = forwardRef<HTMLInputElement, Props & ElementProps>(
  ({ onFocus, onBlur, autoFocus, prefix, suffix, className = '', width, ...props }, ref) => {
    const theme = useTheme()
    const innerRef = useRef<HTMLInputElement>(null)

    useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(
      ref,
      () => innerRef.current,
    )

    const handleFocus = useMemo(() => {
      if (!onFocus) {
        return undefined
      }

      return (e: FocusEvent<HTMLInputElement>) => onFocus(e)
    }, [onFocus])

    const handleBlur = useMemo(() => {
      if (!onBlur) {
        return undefined
      }

      return (e: FocusEvent<HTMLInputElement>) => onBlur(e)
    }, [onBlur])

    const handleWheel = useMemo(
      () => (props.type === 'number' ? disableWheel : undefined),
      [props.type],
    )

    useEffect(() => {
      if (autoFocus && innerRef.current) {
        innerRef.current.focus()
      }
    }, [autoFocus])

    const classNames = useClassNames()

    return (
      <Wrapper
        themes={theme}
        $width={width}
        $disabled={props.disabled}
        error={props.error}
        onClick={() => innerRef.current?.focus()}
        className={`${className} ${classNames.wrapper}`}
      >
        {prefix && (
          <Affix themes={theme} className={classNames.prefix}>
            {prefix}
          </Affix>
        )}
        <StyledInput
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onWheel={handleWheel}
          ref={innerRef}
          themes={theme}
          aria-invalid={props.error || undefined}
          className={classNames.input}
        />
        {suffix && (
          <Affix themes={theme} className={classNames.suffix}>
            {suffix}
          </Affix>
        )}
      </Wrapper>
    )
  },
)

const disableWheel = (e: WheelEvent) => {
  // wheel イベントに preventDefault はないため
  e.target && (e.target as HTMLInputElement).blur()
}

const Wrapper = styled.span<{
  themes: Theme
  $width?: string | number
  $disabled?: boolean
  error?: boolean
}>(({ themes, $width = 'auto', $disabled, error }) => {
  const { border, color, radius, shadow, spacingByChar } = themes
  return css`
    cursor: text;
    box-sizing: border-box;
    display: inline-flex;
    gap: ${spacingByChar(0.5)};
    align-items: center;
    border-radius: ${radius.m};
    border: ${border.shorthand};
    background-color: ${color.WHITE};
    padding-right: ${spacingByChar(0.5)};
    padding-left: ${spacingByChar(0.5)};
    width: ${typeof $width === 'number' ? `${$width}px` : $width};

    &:focus-within {
      ${shadow.focusIndicatorStyles};
    }

    ${error &&
    css`
      border-color: ${color.DANGER};
    `}
    ${$disabled &&
    css`
      pointer-events: none;
      border-color: ${color.disableColor(color.BORDER)};
      background-color: ${color.hoverColor(color.WHITE)};
    `}
  `
})
const StyledInput = styled.input<Props & { themes: Theme }>(
  ({ themes: { fontSize, leading, color, radius, spacingByChar } }) =>
    css`
      flex-grow: 1;

      display: inline-block;
      outline: none;
      border-radius: ${radius.m};
      border: none;
      background-color: transparent;
      padding: ${spacingByChar(0.75)} 0;
      font-size: ${fontSize.M};
      line-height: ${leading.NONE};
      color: ${color.TEXT_BLACK};
      width: 100%;

      /* font-size * line-height で高さが思うように行かないので、相対値の font-size で高さを指定 */
      height: ${fontSize.M};

      &::placeholder {
        color: ${color.TEXT_GREY};
      }

      &[disabled] {
        color: ${color.TEXT_DISABLED};
        -webkit-text-fill-color: ${color.TEXT_DISABLED};
        opacity: 1;
      }
    `,
)
const Affix = styled.span<{ themes: Theme }>(
  ({ themes: { color } }) => css`
    flex-shrink: 0;

    display: flex;
    align-items: center;
    color: ${color.TEXT_GREY};
  `,
)
