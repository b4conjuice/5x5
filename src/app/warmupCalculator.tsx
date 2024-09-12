'use client'

import { useState } from 'react'
import classNames from 'classnames'
import { toast } from 'react-toastify'

import useLocalStorage from '@/lib/useLocalStorage'

const BAR_WEIGHT = 45
const PROGRESSION_INTERVAL = 4

function roundDownToNearest5(value: number) {
  return Math.floor(value / 5) * 5
}

function calculateWarmup(weight: number) {
  const platesWeight = weight - BAR_WEIGHT
  const progression = platesWeight / PROGRESSION_INTERVAL

  const actualWarmup = [
    BAR_WEIGHT,
    BAR_WEIGHT,
    BAR_WEIGHT + progression * 1,
    BAR_WEIGHT + progression * 2,
    BAR_WEIGHT + progression * 3,
  ]

  const roundedWarmup = actualWarmup.map(w => ({
    rounded: roundDownToNearest5(w),
    actual: w,
  }))

  return roundedWarmup
}

const plateWeights = [45, 25, 10, 5, 2.5]

// source: https://stackoverflow.com/a/53187807/24617735
function findLastIndex<T>(
  array: Array<T>,
  predicate: (value: T, index: number, obj: T[]) => boolean
): number {
  let l = array.length
  while (l--) {
    const item = array[l]
    if (item !== undefined && predicate(item, l, array)) return l
  }
  return -1
}

function Checklist({ warmup }: { warmup: Array<{ rounded: number }> }) {
  const defaultChecked = warmup.map(() => false)
  const [checked, setChecked] = useState(defaultChecked)
  const lastCheckedIndex = findLastIndex(checked, checked => checked)
  return (
    <div className='flex flex-col gap-3'>
      <ul className='flex flex-col gap-3'>
        {warmup.map(({ rounded }, index) => {
          const disabled =
            index > lastCheckedIndex + 1 || index <= lastCheckedIndex - 1
          return (
            <li key={index}>
              <label
                className={classNames(
                  'flex items-center gap-2',
                  disabled && 'opacity-50'
                )}
              >
                <input
                  type='checkbox'
                  checked={checked[index]}
                  onChange={() => {
                    setChecked(prev =>
                      prev.map((isChecked, i) =>
                        i === index ? !isChecked : isChecked
                      )
                    )
                  }}
                  //
                  disabled={disabled}
                />
                <span>
                  <span className='font-semibold'>{rounded}</span>:{' '}
                  {calculatePlatesPerSide(rounded)}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
      {checked.every(isChecked => isChecked) && (
        <label className={classNames('flex items-center gap-2')}>
          <input
            type='checkbox'
            defaultChecked
            onChange={() => {
              setChecked(defaultChecked)
            }}
          />
          reset
        </label>
      )}
    </div>
  )
}

function calculatePlatesPerSide(weight: number) {
  const platesWeight = weight - BAR_WEIGHT
  const platesWeightPerSide = platesWeight / 2
  let currentWeight = platesWeightPerSide
  const platesString = plateWeights
    .filter(plateWeight => plateWeight <= currentWeight)
    .reduce((prev, curr, index) => {
      const numberOfPlates = Math.floor(currentWeight / curr)
      if (numberOfPlates > 0) {
        prev = `${prev}${index !== 0 ? ' / ' : ''}${curr} x ${numberOfPlates}`
        currentWeight = currentWeight - curr * numberOfPlates
      }
      return prev
    }, '')
  return platesString || 'empty'
}

export default function WarmupCalculator({ exercise }: { exercise: string }) {
  const [weight, setWeight] = useLocalStorage(`${exercise}-weight`, 200)
  const warmup = calculateWarmup(weight)
  if (weight === undefined) return null
  return (
    <div className='flex flex-col gap-4 rounded-lg border-4 border-black bg-cb-blue p-4 shadow-[8px_8px_0_0_rgba(0,0,0,1)]'>
      <div className='flex items-center'>
        <h2 className='grow'>{exercise}</h2>
        <label className='flex items-center gap-2'>
          weight
          <input
            className='w-20 bg-cb-blue'
            type='number'
            value={weight}
            step={5}
            onChange={e => {
              const newWeight = Number(e.target.value)
              if (newWeight > 0) {
                setWeight(newWeight)
              } else {
                toast.error('weight must be greater than 0')
                setWeight(BAR_WEIGHT)
              }
            }}
          />
        </label>
      </div>
      <p className='text-wrap'>
        <span>
          plates<span className='hidden md:inline'> per side</span>
        </span>
        : <span>{calculatePlatesPerSide(weight)}</span>
      </p>
      <details>
        <summary>
          <h3 className='inline'>warmup</h3>
          <Checklist warmup={warmup} />
        </summary>
        <div>progression: {(weight - BAR_WEIGHT) / PROGRESSION_INTERVAL}</div>
        <ol className='ms-4 list-decimal'>
          {warmup.map(({ rounded, actual }, index) => (
            <li key={index}>
              <div>
                weight: {rounded}
                {rounded === actual ? '' : ` (${actual})`}
              </div>
              <div>plates weight (minus bar): {rounded - BAR_WEIGHT}</div>
              <div>plates weight per side : {(rounded - BAR_WEIGHT) / 2}</div>
              <div>plates: {calculatePlatesPerSide(rounded)}</div>
            </li>
          ))}
        </ol>
      </details>
    </div>
  )
}
