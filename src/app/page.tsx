import { Main } from '@/components/ui'
import Workout from '@/components/workout'

export default function Home() {
  return (
    <Main className='flex flex-col p-4'>
      <div className='flex flex-grow flex-col space-y-4 md:items-center'>
        <Workout toggleMethod='state' />
      </div>
    </Main>
  )
}
