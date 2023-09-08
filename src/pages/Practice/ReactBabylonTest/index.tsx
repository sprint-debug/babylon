
import React, { FC, useEffect, useState, useRef } from 'react'
import { Scene, Engine, Html } from 'react-babylonjs'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { RTSCameraKeyboardController } from '@/clients/util/RTSCameraKeyboardController';
import { RTSCameraMouseController } from '@/clients/util/RTSCameraMouseController';
import { FreeCamera } from '@babylonjs/core';

let lastTime = Date.now()

const WithHtmlText: FC = () => {
  const [position, setPosition] = useState(Vector3.Zero())
  const [rotation, setRotation] = useState(Vector3.Zero())

  let handle = useRef<number | undefined>(undefined)
  let direction = 1

  const animate = (_) => {
    if (position.x > 1) {
      direction = -1
    } else if (position.x < -1) {
      direction = 1
    }

    const velocity = 0.005 * direction
    position.x += velocity
    const rpm = 10
    const now = Date.now()
    const deltaTimeInMillis = now - lastTime
    lastTime = now
    const rotationRads = (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000)
    rotation.y += rotationRads
    setPosition(position.clone())
    setRotation(rotation.clone())
    handle.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    handle.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(handle.current!)
  }, [])

  return (
    <transformNode
      name="transform-node"
      position={position}
      rotation={rotation}
    >
      <sphere
        name="sphere1"
        diameter={2}
        segments={16}
        position={new Vector3(0, 1, 0)}
      >
        <Html name="html" center occlude={false}>
          {
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '5px',
                // border: '3px solid red',
                padding: '8px',
              }}
            >
              Text
            </div>
          }
        </Html>
      </sphere>
    </transformNode>
  )
}


const ReactBabylonTest: FC = () => {
  const cameraRef = useRef();

  // const [cameraRef, setCameraRef] = useState();

  useEffect(() => {
    if (cameraRef && cameraRef.current) {
      console.log('TEST ', cameraRef.current)
      cameraRef.current;
      // cameraRef.attachControl(canvas, true);
      // cameraRef.inputs.add(new RTSCameraKeyboardController());
      // cameraRef.inputs.add(new RTSCameraMouseController());
    }
  }, [])

  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <Engine
        antialias
        adaptToDeviceRatio
        canvasId="babylon-js"
        renderOptions={{
          whenVisibleOnly: true,
        }}
      >
        <Scene>
          <freeCamera
            ref={cameraRef}

            name="camera1"
            position={new Vector3(0, 5, -10)}
            setTarget={[Vector3.Zero()]}

          />

          <hemisphericLight
            name="light1"
            intensity={0.7}
            direction={new Vector3(0, 1, 0)}
          />
          <ground name="ground" width={6} height={6} />
          <box
            name="box"
            size={2}
            position={new Vector3(0, 1, 0)}
            rotation={Vector3.Zero()}
          />
          {/* <WithHtmlText /> */}
        </Scene>
      </Engine>
    </div>
  )
}

export default ReactBabylonTest;