import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ScrollScene, useScrollRig } from '@14islands/r3f-scroll-rig'
import { Mesh } from 'three'

// Parallax group inside ScrollScene
const ParallaxGroup = ({ children, scrollState, parallax }: any) => {
  const mesh = useRef<Mesh>(null!)
  const size = useThree((s) => s.size)
  const { scaleMultiplier } = useScrollRig()

  useFrame(() => {
    if (!scrollState.inViewport) return
    const parallaxProgress = scrollState.progress * 2 - 1
    mesh.current.position.y = parallax * parallaxProgress * scaleMultiplier * size.height
  })

  return <mesh ref={mesh}>{children}</mesh>
}

/* Speed=1 is no parallax */
export const ParallaxScrollScene = ({ children, speed = 1, ...props }: any) => {
  const extraMargin = 50 // add 50vh extra margin to avoid aggressive clipping
  const parallaxAmount = speed - 1
  return (
    // @ts-ignore
    <ScrollScene scissor={false} inViewportMargin={`${Math.max(0, 1 - 0.5) * 200 + extraMargin}%`} {...props}>
      {(props) => (
        <ParallaxGroup parallax={parallaxAmount} {...props}>
          {children(props)}
        </ParallaxGroup>
      )}
    </ScrollScene>
  )
}
