'use client'

import { useRouter } from 'next/navigation'
import { Switch } from '@headlessui/react'

import WarmupCalculator from '../app/warmupCalculator'
import { Title } from '@/components/ui'
import { workouts } from '@/lib/workouts'

export default function Workout({
  workout,
}: {
  workout: keyof typeof workouts
}) {
  const router = useRouter()
  const exercises = workouts[workout]
  return (
    <>
      <div className='flex justify-between'>
        <Title>5x5</Title>
        <div className='flex gap-2'>
          <span>a</span>
          <Switch
            checked={workout === 'b'}
            onChange={() => {
              if (workout === 'a') {
                router.push('/b')
              } else {
                router.push('/a')
              }
            }}
            className='group inline-flex h-6 w-11 items-center rounded-full bg-cb-blue transition'
          >
            <span className='size-4 translate-x-1 rounded-full bg-cb-yellow transition group-data-[checked]:translate-x-6' />
          </Switch>
          <span>b</span>
        </div>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        {exercises.map(exercise => (
          <WarmupCalculator key={exercise} exercise={exercise} />
        ))}
      </div>
    </>
  )
}
