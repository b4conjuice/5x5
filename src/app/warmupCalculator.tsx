'use client'

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

function calculatePlatesPerSide(weight: number) {
  const platesWeight = weight - BAR_WEIGHT
  const platesWeightPerSide = platesWeight / 2
  let currentWeight = platesWeightPerSide
  const plates = plateWeights
    .filter(plateWeight => plateWeight <= currentWeight)
    .reduce((prev, curr, index) => {
      const numberOfPlates = Math.floor(currentWeight / curr)
      if (numberOfPlates > 0) {
        prev = `${prev}${index !== 0 ? ' / ' : ''}${curr} x ${numberOfPlates}`
        currentWeight = currentWeight - curr * numberOfPlates
      }
      return prev
    }, '')
  return plates
}

export default function WarmupCalculator() {
  const [weight, setWeight] = useLocalStorage('weight', 200)
  const warmup = calculateWarmup(weight)
  if (!weight) return null
  return (
    <div className='flex flex-col gap-4'>
      <div>
        <input
          className='bg-cb-blue'
          type='number'
          value={weight}
          onChange={e => {
            setWeight(Number(e.target.value))
          }}
        />
      </div>
      <div>progression: {(weight - BAR_WEIGHT) / PROGRESSION_INTERVAL}</div>
      <ol className='list-decimal'>
        {warmup.map(({ rounded, actual }, index) => (
          <li key={index}>
            <div>
              weight: {rounded}
              {rounded === actual ? '' : ` (${actual})`}
            </div>
            <div>plates weight (minus bar): {rounded - BAR_WEIGHT}</div>
            <div>plates weight per side : {(rounded - BAR_WEIGHT) / 2}</div>
            <div>plates: {calculatePlatesPerSide(rounded) || 'none'}</div>
          </li>
        ))}
      </ol>
    </div>
  )
}
