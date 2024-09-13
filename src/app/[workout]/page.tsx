import { redirect } from 'next/navigation'

import { Main } from '@/components/ui'
import Workout from '@/components/workout'
import { workouts } from '@/lib/workouts'

export default function WorkoutPage({
  params,
}: {
  params: { workout: keyof typeof workouts }
}) {
  if (!(params.workout in workouts)) {
    redirect('/a')
  }
  return (
    <Main className='flex flex-col p-4'>
      <div className='flex flex-grow flex-col space-y-4 md:items-center'>
        <Workout workout={params.workout} toggleMethod='url' />
      </div>
    </Main>
  )
}
