import { Main, Title } from '@/components/ui'
import WarmupCalculator from './warmupCalculator'

export default function Home() {
  return (
    <Main className='flex flex-col p-4'>
      <div className='flex flex-grow flex-col items-center space-y-4'>
        <Title>5x5</Title>
        <WarmupCalculator />
      </div>
    </Main>
  )
}
