'use client'

import { useRouter } from 'next/navigation'
import { Switch } from '@headlessui/react'

import WarmupCalculator from '../app/warmupCalculator'
import { Title } from '@/components/ui'
import { workouts } from '@/lib/workouts'
import { useState } from 'react'

export default function Workout({
  workout: initialWorkout = 'a',
  toggleMethod = 'url',
}: {
  workout?: keyof typeof workouts
  toggleMethod?: 'url' | 'state'
}) {
  const router = useRouter()
  const [workout, setWorkout] = useState(initialWorkout)
  const exercises = workouts[workout]

  const toggleViaUrl = () => {
    if (workout === 'a') {
      router.push('/b')
    } else {
      router.push('/a')
    }
  }
  const toggleViaState = () => {
    setWorkout(workout === 'a' ? 'b' : 'a')
  }
  const toggle = toggleMethod === 'url' ? toggleViaUrl : toggleViaState
  return (
    <>
      <div className='flex justify-between'>
        <Title>5x5</Title>
        <div className='flex gap-2'>
          <span>a</span>
          <Switch
            checked={workout === 'b'}
            onChange={toggle}
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
