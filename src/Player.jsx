import { useRapier, RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Player()
{
    const body = useRef()
    const [ subscribeKeys, getKeys ] = useKeyboardControls();
    const { rapier, world } = useRapier()
    const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(100, 100, 10))
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

    const jump = () =>
    {

        // 자신과 바닥까지의 길이를 재어 0.15 이상이면 점프할수 없게 한다.
        const origin = body.current.translation()
        origin.y -= 0.31
        const direction = { x: 0, y: - 1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        console.log(hit.toi)

        if(hit.toi < 0.15) body.current.applyImpulse({ x: 0, y: 0.5, z: 0 })
    }

    useEffect(() =>
    {
        const unsubscribeJump = subscribeKeys(
            (state) => state.jump,
            (value) =>
            {
                if(value)
                    jump()
            }
        )
        return () => {
            unsubscribeJump()
        }
    }, [])

    useFrame((state, delta) =>
    {
        // Controls
        const { forward, back, left, right, jump } = getKeys()
        const keys = getKeys()
        const impulse = { x: 0, y: 0, z: 0 }
        const torque = { x: 0, y: 0, z: 0 }

        const impulseStrength = 1 * delta
        const torqueStrength = 0.2 * delta

        if(forward)
        {
            impulse.z += impulseStrength
            torque.x += torqueStrength
        }

        if(right)
        {
            impulse.x -= impulseStrength
            torque.z += torqueStrength
        }

        if(back)
        {
            impulse.z -= impulseStrength
            torque.x -= torqueStrength
        }
        
        if(left)
        {
            impulse.x += impulseStrength
            torque.z -= torqueStrength
        }

        
        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)

        // Camera
        const bodyPosition = body.current.translation()

        const cameraPosition = new THREE.Vector3()
        cameraPosition.copy(bodyPosition)
        cameraPosition.z -= 3
        cameraPosition.y += 1.5

        const cameraTarget = new THREE.Vector3()
        cameraTarget.copy(bodyPosition)
        cameraTarget.y += 0.5

        state.camera.position.copy(cameraPosition)
        state.camera.lookAt(cameraTarget)

        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)
    });

    return <>
        <RigidBody 
        ref={ body } 
        canSleep={ false } 
        colliders="ball" 
        restitution={ 1 } 
        friction={ 1 } 
        position={ [ 0, 1, 0 ] }
        linearDamping={ 0.5 }
        angularDamping={ 0.5 }
        >
            <mesh castShadow>
                <icosahedronGeometry args={ [ 0.3, 1 ] } />
                <meshStandardMaterial flatShading color="mediumpurple" />
            </mesh>
        </RigidBody>
    </>
}