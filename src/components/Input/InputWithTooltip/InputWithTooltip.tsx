import React, { ComponentProps } from 'react'
import styled from 'styled-components'

import { Input } from '../Input'
import { Tooltip as shrTooltip } from '../../Tooltip'

type Props = ComponentProps<typeof Input> & {
  /** 入力欄に紐付けるツールチップに表示するメッセージ */
  tooltipMessage: React.ReactNode
}

export const InputWithTooltip: React.FC<Props> = ({ tooltipMessage, ...props }) => {
  return (
    <Tooltip message={tooltipMessage} tabIndex={-1} ariaDescribedbyTarget="inner">
      <Input {...props} />
    </Tooltip>
  )
}

const Tooltip = styled(shrTooltip)`
  /* Input のフォーカスリングを表示するため */
  overflow: revert;
`
