import { Story } from '@storybook/react'
import React, { useState } from 'react'
import styled from 'styled-components'

import { Textarea } from './Textarea'

import { Stack } from '../Layout'
import { userEvent, within } from '@storybook/testing-library'

export default {
  title: 'Textarea',
  component: Textarea,
}

const Template: Story = () => {
  const [value, setValue] = useState('message👌')
  const onChangeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.currentTarget.value)
  return (
    <List>
      <li>
        <Label>
          標準
          <Textarea />
        </Label>
      </li>
      <li>
        <Label>
          入力欄を自動で広げる（初期： 3行、最大： 10行）
          <Textarea cols={35} rows={3} maxRows={10} autoResize />
        </Label>
      </li>
      <li>
        <Label>
          幅指定
          <Textarea width="100%" />
        </Label>
      </li>
      <li>
        <Label>
          disabled
          <Textarea disabled={true} />
        </Label>
      </li>
      <li>
        <Label>
          エラー時
          <Textarea error={true} />
        </Label>
      </li>
      <li>
        <Label>
          最大文字数 (defaultValue)
          <Textarea maxLength={140} defaultValue="message👌" />
        </Label>
      </li>
      <li>
        <Label>
          最大文字数 (value)
          <Textarea maxLength={140} value={value} onChange={onChangeValue} />
        </Label>
      </li>
    </List>
  )
}

export const All = Template.bind({})

export const RegInput = Template.bind({})
RegInput.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const notResizableTextarea = await canvas.findByLabelText('標準')
  // デフォルトでは入力欄が広がらないことを確認する
  await userEvent.type(notResizableTextarea, 'hoge\n'.repeat(3), { delay: 0.1 })

  const resizableTextarea = await canvas.findByLabelText(
    '入力欄を自動で広げる（初期： 3行、最大： 10行）',
  )
  // 11行入力し、入力欄が10行以上広がらないことを確認する
  await userEvent.type(resizableTextarea, 'hoge\n'.repeat(11), { delay: 0.1 })
}

const List = styled(Stack).attrs({ as: 'ul', gap: 1.5 })`
  padding: 0 24px;
  list-style: none;
`
const Label = styled(Stack).attrs({ as: 'label', gap: 0.25, align: 'flex-start' })``
