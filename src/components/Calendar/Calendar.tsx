import React, { HTMLAttributes, MouseEvent, forwardRef, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import dayjs from 'dayjs'

import { Theme, useTheme } from '../../hooks/useTheme'
import { useClassNames } from './useClassNames'
import { Button } from '../Button'
import { FaCaretDownIcon, FaCaretUpIcon, FaChevronLeftIcon, FaChevronRightIcon } from '../Icon'
import { CalendarTable } from './CalendarTable'
import { YearPicker } from './YearPicker'
import { getFromDate, getToDate, isBetween, minDate } from './calendarHelper'
import { useId } from '../../hooks/useId'

type Props = {
  /** 選択可能な開始日 */
  from?: Date
  /** 選択可能な終了日 */
  to?: Date
  /** トリガのセレクトイベントを処理するハンドラ */
  onSelectDate: (e: MouseEvent, date: Date) => void
  /** 選択された日付 */
  value?: Date
}
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>

export const Calendar = forwardRef<HTMLElement, Props & ElementProps>(
  ({ from = minDate, to, onSelectDate, value, ...props }, ref) => {
    const themes = useTheme()
    const classNames = useClassNames()
    const now = dayjs().startOf('date')
    const fromDay = dayjs(getFromDate(from))
    const toDay = dayjs(getToDate(to))
    const isValidValue = value && isBetween(value, fromDay.toDate(), toDay.toDate())

    const [currentMonth, setCurrentMonth] = useState(isValidValue ? dayjs(value) : now)
    const [isSelectingYear, setIsSelectingYear] = useState(false)

    const yearPickerId = useId()

    useEffect(() => {
      if (value && isValidValue) {
        setCurrentMonth(dayjs(value))
      }
    }, [value, isValidValue])

    const prevMonth = currentMonth.subtract(1, 'month')
    const nextMonth = currentMonth.add(1, 'month')

    return (
      <Container
        {...props}
        themes={themes}
        ref={ref}
        className={`${props.className} ${classNames.calendar.wrapper}`}
      >
        <Header themes={themes} className={classNames.calendar.header}>
          <YearMonth className={classNames.calendar.yearMonth}>
            {currentMonth.year()}年{currentMonth.month() + 1}月
          </YearMonth>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              setIsSelectingYear(!isSelectingYear)
            }}
            size="s"
            square
            aria-expanded={isSelectingYear}
            aria-controls={yearPickerId}
            className={classNames.calendar.selectingYear}
          >
            {isSelectingYear ? (
              <FaCaretUpIcon alt="年を選択する" />
            ) : (
              <FaCaretDownIcon alt="年を選択する" />
            )}
          </Button>
          <MonthButtons className={classNames.calendar.monthButtons}>
            <Button
              disabled={isSelectingYear || prevMonth.isBefore(fromDay, 'month')}
              onClick={() => setCurrentMonth(prevMonth)}
              size="s"
              square
              className={classNames.calendar.monthButtonPrev}
            >
              <FaChevronLeftIcon alt="前の月へ" />
            </Button>
            <Button
              disabled={isSelectingYear || nextMonth.isAfter(toDay, 'month')}
              onClick={() => setCurrentMonth(nextMonth)}
              size="s"
              square
              className={classNames.calendar.monthButtonNext}
            >
              <FaChevronRightIcon alt="次の月へ" />
            </Button>
          </MonthButtons>
        </Header>
        <TableLayout>
          <YearPicker
            fromYear={fromDay.year()}
            toYear={toDay.year()}
            selectedYear={value?.getFullYear()}
            onSelectYear={(year) => {
              setCurrentMonth(currentMonth.year(year))
              setIsSelectingYear(false)
            }}
            isDisplayed={isSelectingYear}
            id={yearPickerId}
          />
          <CalendarTable
            current={currentMonth.toDate()}
            from={fromDay.toDate()}
            to={toDay.toDate()}
            onSelectDate={onSelectDate}
            selected={isValidValue ? value : null}
          />
        </TableLayout>
      </Container>
    )
  },
)

const Container = styled.section<{ themes: Theme }>`
  ${({ themes: { color, shadow } }) => css`
    display: inline-block;
    border-radius: 6px;
    background-color: ${color.WHITE};
    box-shadow: ${shadow.LAYER3};
    color: ${color.TEXT_BLACK};
    overflow: hidden;
  `}
`
const YearMonth = styled.div`
  margin-right: 8px;
  font-weight: bold;
`
const Header = styled.header<{ themes: Theme }>(({ themes }) => {
  const { color, fontSize } = themes
  return css`
    display: flex;
    align-items: center;
    padding: 16px;
    border-bottom: solid 1px ${color.BORDER};
    ${YearMonth} {
      font-size: ${fontSize.M};
    }
  `
})
const MonthButtons = styled.div`
  display: flex;
  margin-left: auto;
  & > *:not(:first-child) {
    margin-left: 8px;
  }
`
const TableLayout = styled.div`
  position: relative;
`
