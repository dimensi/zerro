import { createSelector } from '@reduxjs/toolkit'
import { toISOMonth } from 'shared/helpers/date'
import { keys } from 'shared/helpers/keys'
import { DataEntity, TEnvelopeId, TISOMonth } from 'shared/types'
import { getBudgets } from 'models/budget'
import { getEnvelopeId } from 'models/envelope'
import { budgetStore } from './budgetStore'

export const getEnvelopeBudgets = createSelector(
  [getBudgets, budgetStore.getData],
  (tagBudgets, hiddenBudgets) => {
    const result: Record<TISOMonth, Record<TEnvelopeId, number>> = {}

    keys(tagBudgets).forEach(id => {
      const budget = tagBudgets[id]
      const month = toISOMonth(budget.date)
      const value = budget.outcome
      const envelopeId = getEnvelopeId(DataEntity.Tag, String(budget.tag))
      result[month] ??= {}
      result[month][envelopeId] = value
    })

    keys(hiddenBudgets).forEach(month => {
      keys(hiddenBudgets[month]).forEach(envelopeId => {
        result[month] ??= {}
        result[month][envelopeId] = hiddenBudgets[month][envelopeId]
      })
    })

    return result
  }
)