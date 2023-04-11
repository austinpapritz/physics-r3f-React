import React, { useMemo } from 'react'
import { useRapier, HeightfieldCollider } from '@react-three/rapier'

const Floor = ({ heights, width, depth, xPos, yPos, zPos }) => {
  const { world } = useRapier()

  const cellWidth = useMemo(
    () => width / (heights.length - 1),
    [width, heights.length]
  )
  const cellDepth = useMemo(
    () => depth / (heights[0].length - 1),
    [depth, heights[0].length]
  )

  return (
    <HeightfieldCollider
      world={world}
      heights={heights.flat()}
      cellWidth={cellWidth}
      cellHeight={1}
      cellDepth={cellDepth}
      position={[xPos, yPos, zPos]}
    />
  )
}

export default Floor
