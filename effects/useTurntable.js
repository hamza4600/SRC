import {useFrame} from "@react-three/fiber";
import {useRef} from "react";

export const useTurntable = () => {
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.y += 0.01
  })

  return ref
}
