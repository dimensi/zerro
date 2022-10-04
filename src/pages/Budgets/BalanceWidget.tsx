import { getMonthTotals } from '@entities/envelopeData'
import { useDisplayCurrency } from '@entities/instrument/hooks'
import { Chip, Divider, Paper, Typography } from '@mui/material'
import { keys } from '@shared/helpers/keys'
import { convertFx, formatMoney } from '@shared/helpers/money'
import pluralize from '@shared/helpers/pluralize'
import { TFxAmount, TISOMonth } from '@shared/types'
import { DataLine } from '@shared/ui/DataLine'
import { Total } from '@shared/ui/Total'
import { useAppSelector } from '@store/index'

export function BalanceWidget(props: { month: TISOMonth }) {
  const totals = useAppSelector(getMonthTotals)[props.month]
  const displayCurrency = useDisplayCurrency()
  const { rates } = totals
  const toDisplay = (a: TFxAmount) => convertFx(a, displayCurrency, rates)
  const currencies = keys(totals.fundsEnd)
  const currCount = currencies.length

  const currString =
    currCount > 1
      ? ` | ${currCount} ${pluralize(currCount, ['валюта', 'валюты', 'валют'])}`
      : ''
  const fundsEnd = toDisplay(totals.fundsEnd)
  const fundsChange = toDisplay(totals.fundsChange)
  const available = toDisplay(totals.available)
  const budgetedInFuture = toDisplay(totals.budgetedInFuture)
  const toBeBudgeted = toDisplay(totals.toBeBudgetedFx)
  const overspend = toDisplay(totals.overspend)

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: 'background.default',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Total name={'В бюджете'} value={fundsEnd} currency={displayCurrency} />
      {/* <div>
        <Chip label={currString.trim()} />
        <Chip label={'5 счетов'} />
        <Chip label={formatMoney(fundsChange, displayCurrency)} />
      </div> */}
      <Divider />
      <DataLine
        name="В конвертах"
        tooltip="Эта сумма сейчас лежит в конвертах (столбец «Доступно»)"
        amount={available}
        currency={displayCurrency}
      />
      {!!budgetedInFuture && (
        <DataLine
          name="Отложено на будущее"
          tooltip="Эти деньги зарезервированы под будущие бюджеты"
          amount={budgetedInFuture}
          currency={displayCurrency}
        />
      )}
      <DataLine
        name="Свободно"
        tooltip="Нераспределённые деньги"
        amount={toBeBudgeted}
        currency={displayCurrency}
      />
      <Divider />
      <Typography variant="body2" color="text.secondary" align="center">
        {getExplaining(fundsEnd, toBeBudgeted, overspend)}
      </Typography>
    </Paper>
  )

  function getExplaining(
    balance: number,
    toBeBudgeted: number,
    overspend: number
  ) {
    if (!!overspend) {
      return 'Добавьте денег в категории с перерасходом.'
    }
    if (toBeBudgeted > 0) {
      return 'Выглядит замечательно! Распределите свободные деньги, чтобы было совсем хорошо.'
    }
    if (balance < 0) {
      return 'Кажется, у вас отрицательный баланс, поэтому распределять нечего. Кредиты лучше всего унести за баланс.'
    }
    if (toBeBudgeted === 0) {
      return 'Все деньги распределены, так держать!'
    }
    return 'Вы разложили по конвертам больше денег, чем у вас есть. На что-то может не хватить. Чтобы исправить, выложите излишки из конвертов.'
  }
}