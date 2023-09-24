import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { Html } from "@react-three/drei";
import { useState } from 'react';

import PositionHotspot from '../PositionHotspot/PositionHotspot'
import MediaVideo from "../MediaVideo/MediaVideo";
import Modal from "../Modal/Modal";
import play from "../../assets/hotspot-icons/play.png"

const VideoHotspot = (hotspot, icon) => {
  const [show, setShow] = useState(false);
  const playIcon = useLoader(TextureLoader, play)

  const onClose = () => {
    setShow(false);
  }

  const onHotspotClick = () => {
    setShow(true);
  }

  return (
    <>
      <PositionHotspot
        icon={playIcon}
        position={[hotspot?.xPosition, hotspot?.yPosition, hotspot?.zPosition]}
        rotation={[hotspot?.xRotation, hotspot?.yRotation, hotspot?.zRotation]}
        scale={hotspot?.radius}
        onClick={onHotspotClick}
      />
      <Html>
        <Modal
          show={show}
          handleClose={onClose}
          body={<MediaVideo channel={hotspot.channel} videoId={hotspot.videoId}/>}
          fullscreen
        />
      </Html>
    </>
  )
}

export default VideoHotspot
