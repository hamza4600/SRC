import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

const PanoramaControl = props => {
  const { camera, gl } = useThree();
  const ref = useRef();

  useFrame(() => ref.current.update())
  return (
    <orbitControls
      ref={ref}
      args={[camera, gl.domElement]}
      {...props} />
  )
}

export default PanoramaControl;
