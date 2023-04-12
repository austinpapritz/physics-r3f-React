import { useRef } from 'react'
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

export default function Experience() {
  const cubeRef = useRef()

  const cubeJump = () => {
    cubeRef.current.applyImpulse({ x: 0, y: 5, z: 0 })
    cubeRef.current.applyTorqueImpulse({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      z: Math.random() - 0.5,
    })
  }

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Physics gravity={[0, -9.81, 0]}>
        <Debug />

        {/* Ball */}
        {/* RigidBody creates a collision cuboidal, it works with multiple meshes for one RigidBody  */}
        <RigidBody colliders="ball">
          <mesh castShadow position={[0, 4, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        {/* Cube */}
        <RigidBody ref={cubeRef} position={[1.5, 2, 0]} gravityScale={0.2}>
          <mesh castShadow onClick={cubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody>

        {/* Floor */}
        <RigidBody type="fixed">
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  )
}
