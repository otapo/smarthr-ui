import React, { HTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'

import { flatArrayToMap } from '../../libs/map'
import {
  focusFirstSibling,
  focusLastSibling,
  focusNextSibling,
  focusPreviousSibling,
  getNewExpandedItems,
  keycodes,
} from './accordionPanelHelper'
import { useClassNames } from './useClassNames'

type Props = {
  /** アコーディオンの内容 */
  children: React.ReactNode
  /** アイコンの左右位置 */
  iconPosition?: 'left' | 'right'
  /** アイコンを表示するかどうか */
  displayIcon?: boolean
  /** 複数のパネルを同時に開くことを許容するかどうか */
  expandableMultiply?: boolean
  /** デフォルトで開いた状態にするアイテムの `name` の配列 */
  defaultExpanded?: string[]
  /** コンポーネントのクラス名 */
  className?: string
  /** トリガのクリックイベントを処理するハンドラ */
  onClick?: (expandedItems: string[]) => void
}
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>

export const AccordionPanelContext = React.createContext<{
  iconPosition: 'left' | 'right'
  displayIcon: boolean
  expandedItems: Map<string, string>
  expandableMultiply: boolean
  parentRef: React.RefObject<HTMLDivElement> | null
  onClickTrigger?: (itemName: string, isExpanded: boolean) => void
  onClickProps?: (expandedItems: string[]) => void
}>({
  iconPosition: 'left',
  displayIcon: true,
  expandedItems: new Map(),
  expandableMultiply: false,
  parentRef: null,
})

export const AccordionPanel: React.VFC<Props & ElementProps> = ({
  children,
  iconPosition = 'left',
  displayIcon = true,
  expandableMultiply = false,
  defaultExpanded = [],
  className = '',
  onClick: onClickProps,
  ...props
}) => {
  const [expandedItems, setExpanded] = useState(flatArrayToMap(defaultExpanded))
  const parentRef = useRef<HTMLDivElement>(null)
  const classNames = useClassNames()

  const onClickTrigger = useCallback(
    (itemName: string, isExpanded: boolean) => {
      setExpanded(getNewExpandedItems(expandedItems, itemName, isExpanded, expandableMultiply))
    },
    [expandableMultiply, expandedItems],
  )

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (!parentRef?.current) {
      return
    }

    const keyCode = event.keyCode
    const item = event.target as HTMLElement

    switch (keyCode) {
      case keycodes.HOME: {
        event.preventDefault()
        focusFirstSibling(parentRef.current)
        break
      }
      case keycodes.END: {
        event.preventDefault()
        focusLastSibling(parentRef.current)
        break
      }
      case keycodes.LEFT:
      case keycodes.UP: {
        event.preventDefault()
        focusPreviousSibling(item, parentRef.current)
        break
      }
      case keycodes.RIGHT:
      case keycodes.DOWN: {
        event.preventDefault()
        focusNextSibling(item, parentRef.current)
        break
      }
    }
  }

  useEffect(() => {
    if (defaultExpanded.length > 0) setExpanded(flatArrayToMap(defaultExpanded))
  }, [defaultExpanded])

  return (
    <AccordionPanelContext.Provider
      value={{
        onClickTrigger,
        onClickProps,
        expandedItems,
        iconPosition,
        displayIcon,
        expandableMultiply,
        parentRef,
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        {...props}
        className={`${className} ${classNames.wrapper}`}
        ref={parentRef}
        onKeyDown={handleKeyPress}
      >
        {children}
      </div>
    </AccordionPanelContext.Provider>
  )
}
