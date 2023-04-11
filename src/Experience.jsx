import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import {
  Physics,
  RigidBody,
  Debug,
  CuboidCollider,
  BallCollider,
  HeightfieldCollider,
} from '@react-three/rapier'

import Floor from './Floor.jsx'

export default function Experience() {
  const heightsArr = [
    [1, 4, 4, 3, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 4, 5, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
    [1, 4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 2],
    [1, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 3, 2],
    [1, 4, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 4, 3, 2, 1],
    [1, 4, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 4, 3, 2, 1, 1],
    [1, 4, 5, 6, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 7, 5, 3, 2, 1, 1, 1],
    [1, 4, 5, 6, 7, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 8, 6, 4, 2, 1, 1, 1, 1],
    [
      1, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 9, 7, 5, 3, 1, 1,
      1, 1, 1,
    ],
    [
      1, 4, 5, 6, 7, 8, 9, 10, 11, 11, 11, 11, 11, 11, 11, 10, 8, 6, 4, 2, 1, 1,
      1, 1, 1,
    ],
    [
      1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 11, 10, 8, 6, 4, 2, 1, 1, 1,
      1, 1, 1,
    ],
    [
      1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 12, 11, 10, 8, 6, 4, 2, 1, 1, 1, 1,
      1, 1, 1,
    ],
    [
      1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 11, 10, 8, 6, 4, 2, 1, 1, 1, 1,
      1, 1, 1,
    ],
    [
      1, 4, 5, 6, 7, 8, 9, 10, 11, 11, 11, 11, 11, 10, 8, 6, 4, 2, 1, 1, 1, 1,
      1, 1, 1,
    ],
    [
      1, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 10, 10, 9, 7, 5, 3, 1, 1, 1, 1, 1, 1,
      1, 1,
    ],
    [1, 4, 5, 6, 7, 8, 9, 9, 9, 9, 9, 9, 9, 8, 6, 4, 2, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 5, 6, 7, 8, 8, 8, 8, 8, 8, 8, 8, 7, 5, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 5, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 4, 3, 2, 1, 1, 1, 1, 1, 1, 1, 2],
    [1, 4, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 5, 4, 3, 2, 1, 1, 1, 1, 1, 1, 2, 3],
    [1, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 3, 2, 1, 1, 1, 1, 1, 2, 3, 4],
    [1, 4, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1, 1, 1, 1, 2, 3, 4, 5],
    [1, 4, 5, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 1, 1, 2, 3, 4, 5, 6],
    [1, 4, 4, 3, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 3, 4, 5, 6, 7],
    [1, 3, 3, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 2, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8],
    [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7],
  ]

  const flatHeights = [].concat(...heightsArr)
  const heightsFloat32Array = new Float32Array(flatHeights)

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Physics>
        <Debug />
        {/* RigidBody creates a collision cuboidal, it works with multiple meshes for one RigidBody  */}
        <RigidBody colliders="ball">
          <mesh castShadow position={[0, 4, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        <RigidBody
          colliders={false}
          position={[0, 1, 0]}
          rotation={[Math.PI * 0.5, 0, 0]}
        >
          <BallCollider args={[1.5]} />

          <mesh castShadow>
            <torusGeometry args={[1, 0.5, 16, 32]} />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody>

        {/* <RigidBody type="fixed">
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody> */}
        <Floor
          heights={heightsFloat32Array}
          width={25}
          depth={25}
          xPos={0}
          yPos={-1}
          zPos={0}
        />
      </Physics>
    </>
  )
}
