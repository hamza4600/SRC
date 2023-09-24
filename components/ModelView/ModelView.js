import { useMemo,useEffect } from 'react';
import { useThree } from "@react-three/fiber";
import { useGLTF } from '@react-three/drei';
import { Box3, Vector3, PointLight, AmbientLight } from 'three';

import { useTurntable } from "../../effects/useTurntable"

const ModelView = ({ model, isPresentationMode }) => {
  const { camera, scene: globalScene } = useThree();
  const { scene } = useGLTF(model.url, true);

  const { convertedScene, box, position } = useMemo(() => {
    const convertedScene = scene.clone()
    convertedScene.traverse((obj) => {
      if (obj.isMesh) {
        obj.layers.enable(2);
        obj.userData.model = model;
      }
    })
    const box = new Box3().setFromObject(convertedScene, 0.01);
    const center = new Vector3();
    box.getCenter(center)
    const size = new Vector3();
    box.getSize(size);
    const position = new Vector3().copy((center.clone().multiplyScalar(-1)));
    return { convertedScene, box, position };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene])

  useEffect(() => {
    if (isPresentationMode) {
      const size = new Vector3();
      box.getSize(size);
      const maxSize = Math.max(size.x, size.y, size.z)
      camera.position.set(-maxSize, 0, 0);
      camera.rotation.set(0, 0, 0);
      camera.updateMatrixWorld()
      camera.updateProjectionMatrix()

      let light1 = new PointLight(0xffffff, maxSize * 0.3);
      light1.position.set(-maxSize, maxSize, 0);
      globalScene.add(light1)
      const light2 = new PointLight(0xffffff, maxSize * 0.3);
      light2.position.set(maxSize, maxSize, 0);
      globalScene.add(light2)
      const light3 = new AmbientLight(0xffffff, 0.15);
      globalScene.add(light3);
    }
    window.scene = globalScene;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene])

  const ref = useTurntable(!isPresentationMode);
  const scale = 1;
  return (
    <primitive
      name={'model-' + model.id}
      object={convertedScene}
      ref={ref}
      position={position}
      scale={[scale, scale, scale]}
    />
  )
};

export default ModelView;
