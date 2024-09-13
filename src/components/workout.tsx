import { Title } from '@/components/ui'
import WarmupCalculator from '../app/warmupCalculator'
import { workouts } from '@/lib/workouts'

export default function Workout({
  workout,
}: {
  workout: keyof typeof workouts
}) {
  const exercises = workouts[workout]
  return (
    <>
      <div className='flex'>
        <Title>5x5</Title>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        {exercises.map(exercise => (
          <WarmupCalculator key={exercise} exercise={exercise} />
        ))}
      </div>
    </>
  )
}
