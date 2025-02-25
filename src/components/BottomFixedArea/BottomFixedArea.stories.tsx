import { Story } from '@storybook/react'
import * as React from 'react'

import { BottomFixedArea } from './BottomFixedArea'
import { Button } from '../Button'
import { FaTrashIcon } from '../Icon/'
import { action } from '@storybook/addon-actions'

export default {
  title: 'BottomFixedArea',
  component: BottomFixedArea,
}

export const _BottomFixedArea: Story = () => {
  return (
    <BottomFixedArea
      description="This is description."
      primaryButton={<Button variant="primary">Primary Button</Button>}
      secondaryButton={<Button>Secondary Button</Button>}
      tertiaryLinks={[
        { text: 'Tertiary_1', icon: FaTrashIcon, onClick: action('click_1') },
        { text: 'Tertiary_2', icon: FaTrashIcon, onClick: action('click_2') },
        { text: 'Tertiary_3', icon: FaTrashIcon, onClick: action('click_3') },
        { text: 'Tertiary_4', icon: FaTrashIcon, onClick: action('click_4') },
      ]}
    />
  )
}
_BottomFixedArea.storyName = 'BottomFixedArea'
