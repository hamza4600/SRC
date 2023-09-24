import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import ReactModal from 'react-modal';
import { OrbitControls } from '@react-three/drei';
import { useParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Layers } from 'three';

import ModelView from '../../../../../components/ModelView/ModelView';
import { useDynamicShowroom } from '../../../../../providers/DynamicShowrooomProvider/DynamicShowroomProvider';
import './style.css';

const layers = new Layers();
layers.disableAll();

const ObjectModal = () => {
  const { roomId } = useParams();
  const [dynamicShowroomState, dynamicShowroomDispatch] = useDynamicShowroom();
  const { selectedModel, apiData } = dynamicShowroomState;

  const selectedRoom = useMemo(
    () => apiData.rooms.filter((room) => room.id === roomId)[0],
    [apiData, roomId]
  );
  const model = useMemo(
    () => selectedRoom.models.filter((model) => model.id === selectedModel)[0],
    [selectedRoom, selectedModel]
  );

  return (
    <ReactModal
      ariaHideApp={false}
      onRequestClose={() => {
        dynamicShowroomDispatch({
          type: 'setSelectedModel',
          payload: null,
        });
        !isMobile && dynamicShowroomDispatch({
          type: 'setPointerLock',
          payload: true,
        });
      }}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'right',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
      isOpen={Boolean(selectedModel)}
    >
      <div id={'presentation'}>
        <Canvas
          concurrent
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            precision: isMobile ? 'lowp' : 'mediump'
          }}
          raycaster={{ layers }}
          dpr={window.devicePixelRatio || 1}
        >
          <OrbitControls
            enablePan={false}
            enableDamping={false}
            enableZoom={false}
            enableRotate
            target={[0, 0, 0]}
          />
          <Suspense fallback={null}>
            <ModelView
              model={model}
              isPresentationMode
            />
          </Suspense>
        </Canvas>
      </div>
    </ReactModal >
  )
};

export default ObjectModal;
