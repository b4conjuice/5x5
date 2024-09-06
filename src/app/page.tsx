import { Main, Title } from '@/components/ui'
import WarmupCalculator from './warmupCalculator'

const exercises = ['squat', 'bench', 'row', 'overhead', 'deadlift']

export default function Home() {
  return (
    <Main className='flex flex-col p-4'>
      <div className='grid gap-4 md:grid-cols-2'>
        <Title>5x5</Title>
        {exercises.map(exercise => (
          <WarmupCalculator key={exercise} exercise={exercise} />
        ))}
      </div>
    </Main>
  )
}
