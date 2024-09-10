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
    <div className='bg-cb-blue flex flex-col gap-4 rounded-lg border-4 border-black p-4 shadow-[8px_8px_0_0_rgba(0,0,0,1)]'>
      <div className='flex items-center'>
        <h2 className='grow'>{exercise}</h2>
        <label className='flex items-center gap-2'>
          weight
          <input
            className='bg-cb-blue w-20'
            type='number'
            value={weight}
            onChange={e => {
              const newWeight = Number(e.target.value)
              if (newWeight > 0) {
                setWeight(newWeight)
              } else {
                setWeight(BAR_WEIGHT)
              }
            }}
          />
        </label>
      </div>
      <p>{calculatePlatesPerSide(weight)}</p>
      <details>
        <summary>
          <h3 className='inline'>warmup</h3>
          <ol className='ms-4 list-decimal'>
            {warmup.map(({ rounded }, index) => (
              <li key={index}>
                <span className='font-semibold'>{rounded}</span>:{' '}
                {calculatePlatesPerSide(rounded)}
              </li>
            ))}
          </ol>
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
