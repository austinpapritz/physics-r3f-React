import { useRef, useState } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useFrame } from '@react-three/fiber'
import {
  Physics,
  RigidBody,
  Debug,
  CuboidCollider,
  BallCollider,
  HeightfieldCollider,
} from '@react-three/rapier'
import * as THREE from 'three'

export default function Experience() {
  const burger = useGLTF('./hamburger.glb')

  // this is a trick to save a sound to state so it doesn't overplay on re-renders
  const [hitSound] = useState(() => new Audio('./hit.mp3'))

  const cubeRef = useRef()
  const twisterRef = useRef()

  const cubeJump = () => {
    // declare mass to normalize the jump animation no matter what mass
    const mass = cubeRef.current.mass()

    cubeRef.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 })
    cubeRef.current.applyTorqueImpulse({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      z: Math.random() - 0.5,
    })
  }

  // spinning kinematic object animation
  useFrame((state) => {
    //save the elapsed time value from the state
    const time = state.clock.getElapsedTime()

    // we have to convert a Euler to a Quaternion
    // to speed up the animation, give time a coefficient
    const eulerRotation = new THREE.Euler(0, time * 3, 0)
    const quaternionRotation = new THREE.Quaternion()
    quaternionRotation.setFromEuler(eulerRotation)
    twisterRef.current.setNextKinematicRotation(quaternionRotation)

    // now to animate the spinning object itself using trigonometry
    const angle = time * 0.5
    const x = Math.cos(angle) * 2
    const z = Math.sin(angle) * 2
    // the y value is the value of the y on the object itself
    twisterRef.current.setNextKinematicTranslation({ x: x, y: -0.8, z: z })
  })

  // adds sound to a collision, add onCollisionEnter={collisionEnter} to RigidBody
  // const collisionEnter = () => {
  //   hitSound.currentTime = 0
  //   hitSound.volume = Math.random()
  //   hitSound.play()
  // }

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Physics gravity={[0, -9.81, 0]}>
        <Debug />

        {/* Burger */}
        <RigidBody>
          <primitive object={burger.scene} scale={0.35} />
        </RigidBody>

        {/* Ball */}
        {/* RigidBody creates a collision cuboidal, it works with multiple meshes for one RigidBody  */}
        <RigidBody colliders="ball">
          <mesh castShadow position={[-1, 4, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        {/* Cube */}
        {/* if you want custom mass, you must disable colliders in RigidBody then apply to collider  */}
        {/* use onSleep or onWake for collision physics to save a TON on perfs */}
        <RigidBody
          ref={cubeRef}
          position={[1.5, 2, 0]}
          gravityScale={1}
          restitution={0.5}
          friction={0.7}
          colliders={false}
        >
          <mesh castShadow onClick={cubeJump}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
          <CuboidCollider mass={11} args={[0.5, 0.5, 0.5]} />
        </RigidBody>

        {/* Floor */}
        <RigidBody type="fixed">
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>

        {/* twister kinematic */}
        <RigidBody
          ref={twisterRef}
          position={[0, -0.8, 0]}
          friction={0}
          type="kinematicPosition"
        >
          <mesh castShadow scale={[0.4, 0.4, 3]}>
            <boxGeometry />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>
      </Physics>
    </>
  )
}
