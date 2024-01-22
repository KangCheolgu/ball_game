import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

// Geometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

// Material
const floor1Material = new THREE.MeshToonMaterial({ color: '#808080' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })

function BlockStart({position = [0, 0, 0]}) {
    return <group position={ position }>
        <mesh geometry={boxGeometry} position={[ 0, -0.1, 0]} scale={[4, 0.2, 4]} material={floor1Material} receiveShadow />
    </group> 
}

function BlockSpinner({ position = [ 0, 0, 0 ] })
{
    const obstacle = useRef()
    const [ speed ] = useState(() => (Math.random() + 5) * (Math.random() < 0.5 ? - 1 : 1))

    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        const rotation = new THREE.Quaternion()
        rotation.setFromEuler(new THREE.Euler(0, time * speed, 0))
        obstacle.current.setNextKinematicRotation(rotation)
    })

    

    return <group position={ position }>
        <mesh geometry={ boxGeometry } material={ floor2Material } position={ [ 0, - 0.1, 0 ] } scale={ [ 4, 0.2, 4 ] } receiveShadow />
        <RigidBody ref={obstacle} type='kinematicPosition' position={[ 0, 0.3, 0]} restitution={ 0.2 } friction={ 0 }>
            <mesh geometry={ boxGeometry } material={ obstacleMaterial } scale={ [ 3.5, 0.3, 0.3 ] } castShadow receiveShadow />
        </RigidBody>
    </group>
}

function BlockLimbo({ position = [ 0, 0, 0 ] })
{
    const obstacle = useRef()
    const [ timeOffset ] = useState(() => Math.random() * Math.PI * 2)

    useFrame((state) =>
    {
        const time = state.clock.getElapsedTime()

        const y = Math.sin(time + timeOffset) + 0.8
        obstacle.current.setNextKinematicTranslation({ x: position[0], y: position[1] + y, z: position[2] })
    })

    return <group position={ position }>
        <mesh geometry={ boxGeometry } material={ floor2Material } position={ [ 0, - 0.1, 0 ] } scale={ [ 4, 0.2 , 4 ] }  receiveShadow />
        <RigidBody ref={ obstacle } type="kinematicPosition" position={ [ 0, 0.3, 0 ] } restitution={ 0.2 } friction={ 0 }>
            <mesh geometry={ boxGeometry } material={ obstacleMaterial } scale={ [ 3.5, 0.3, 3 ] } castShadow receiveShadow />
        </RigidBody>
    </group>
}

function BlockEnd({ position = [ 0, 0, 0 ] })
{
    const hamburger = useGLTF('./hamburger.glb')
    hamburger.scene.children.forEach((mesh) =>
    {
        mesh.castShadow = true
    })
    
    return <group position={ position }>
        <mesh geometry={ boxGeometry } material={ floor1Material } position={ [ 0, - 0.1, 0 ] } scale={ [ 4, 0.2, 4 ] }  receiveShadow />
        <RigidBody type='fixed' colliders="hull" restitution={ 0.2 } friction={ 0 } position={[0, 0.25, 0]} >
            <primitive object={ hamburger.scene } scale={0.2} />
        </RigidBody>
    </group>
}

function Bounds({ length = 1 })
{
    return <RigidBody type="fixed" restitution={ 0.2 } friction={ 0 }>
         <mesh
            position={ [ 2.15, 0.75, (length * 2) - 2] }
            geometry={ boxGeometry }
            material={ wallMaterial }
            scale={ [ 0.3, 1.5, 4 * length ] }
            castShadow
        />
        <mesh
            position={ [ - 2.15, 0.75, (length * 2) - 2 ] }
            geometry={ boxGeometry }
            material={ wallMaterial }
            scale={ [ 0.3, 1.5, 4 * length ] }
            castShadow
        />

        <mesh
            position={ [ 0, 0.75, 14.15 ] }
            geometry={ boxGeometry }
            material={ wallMaterial }
            scale={ [ length, 1.5,  0.3 ] }
            castShadow
        />

        <CuboidCollider args={ [ 2, 0.1, 2 * length ] }  position={ [ 0, -0.1, (length * 2) - 2 ] }/>
    </RigidBody>
}

export default function Level()
{
    return <>
        <BlockStart position={[ 0, 0, 0]} />
        <BlockSpinner position={[ 0, 0, 4]}/>
        <BlockLimbo position={ [ 0, 0, 8 ] } />
        <BlockEnd position={[ 0, 0, 12]} />
        <Bounds length={4}/>
    </>
}