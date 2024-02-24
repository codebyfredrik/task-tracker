import { useMediaQuery, usePrevious } from '@react-hookz/web'
import React from 'react'

import { TaskBoard } from './TaskBoard'
import { Switch } from './ui/Switch'

export function App() {
  const [isMultipleColumns, setMultipleColumns] = React.useState(false)
  const isMediumDeviceAndAbove = useMediaQuery(
    'only screen and (min-width : 768px)'
  )
  const previousIsMediumDeviceAndAbove = usePrevious(isMediumDeviceAndAbove)

  React.useEffect(() => {
    if (previousIsMediumDeviceAndAbove && !isMediumDeviceAndAbove) {
      setMultipleColumns(false)
    }
  }, [isMediumDeviceAndAbove, previousIsMediumDeviceAndAbove])

  return (
    <div className="relative flex min-h-screen justify-center bg-gradient-to-br from-pink1 to-indigo1 pb-4">
      <Switch
        className="absolute left-4 top-4 font-semibold"
        onChange={setMultipleColumns}
        isDisabled={!isMediumDeviceAndAbove}
        isSelected={isMultipleColumns}
      >
        Multiple columns
      </Switch>
      <div className="mt-14 w-full flex-col items-center justify-center">
        <TaskBoard
          multipleColumns={isMultipleColumns}
          isLargeScreen={isMediumDeviceAndAbove}
        />
      </div>
    </div>
  )
}
