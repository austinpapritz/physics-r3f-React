import { useRef, useState, useEffect, useMemo } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useFrame } from '@react-three/fiber'
import {
  Physics,
  RigidBody,
  Debug,
  CuboidCollider,
  CylinderCollider,
  BallCollider,
  HeightfieldCollider,
  InstancedRigidBodies,
} from '@react-three/rapier'
import * as THREE from 'three'

export default function Experience() {
  // TESTING PERFORMANCE WITH CUBES
  const cubesCount = 1000
  const cubesRef = useRef()
  // rendering the cubes on load, if you want them to have physics you have to put the matrix values in the InstancedRigidZBodies
  // useEffect(() => {
  //   for (let i = 0; i < cubesCount; i++) {
  //     const matrix = new THREE.Matrix4()
  //     matrix.compose(
  //       new THREE.Vector3(i * 2, 0, 0),
  //       new THREE.Quaternion(),
  //       new THREE.Vector3(
  //         Math.random() * 2,
  //         Math.random() * 2,
  //         Math.random() * 2
  //       )
  //     )
  //     cubesRef.current.setMatrixAt(i, matrix)
  //   }
  // }, [])

  const cubesTransform = useMemo(() => {
    const positions = []
    const rotations = []
    const scales = []

    for (let i = 0; i < cubesCount; i++) {
      // for random positions this is +-4
      positions.push([
        (Math.random() - 0.5) * 8,
        6 + i * 0.2,
        (Math.random() - 0.5) * 8,
      ])
      rotations.push([Math.random(), Math.random(), Math.random()])

      const scale = 0.2 + Math.random() * 0.8
      scales.push([scale, scale, scale])
    }

    return { positions, rotations, scales }
  }, [])

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
        {/* <Debug /> */}

        {/* Burger */}
        <RigidBody position={[0, 4, 0]} colliders={false}>
          <primitive object={burger.scene} scale={0.25} />
          <CylinderCollider args={[0.5, 1.25]} />
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

        {/* Rigid walls */}
        {/* these are invisible fixed walls to keep objects inside */}
        <RigidBody type="fixed">
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[5.26, 1, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
        </RigidBody>

        {/* Cubes for testing perf */}
        <InstancedRigidBodies
          positions={cubesTransform.positions}
          rotations={cubesTransform.rotations}
          scales={cubesTransform.scales}
        >
          <instancedMesh
            castShadows
            ref={cubesRef}
            args={[null, null, cubesCount]}
          >
            <boxGeometry />
            <meshStandardMaterial color="tomato" />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  )
}
