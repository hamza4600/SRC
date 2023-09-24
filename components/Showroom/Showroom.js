import React from 'react';
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useState } from 'react'
import { useParams } from "react-router-dom";
import { Html } from "@react-three/drei";

import Room from "../Room/Room";
import { useShowroom } from "../../providers/ShowroomProvider/ShowroomProvider";
import PositionHotspot from '../PositionHotspot/PositionHotspot'
import MediaVideo from "../MediaVideo/MediaVideo";
import Modal from "../Modal/Modal";
import play from '../../assets/hotspot-icons/play.png'
import arrow from '../../assets/hotspot-icons/arrow.png'
import shoppingCart from '../../assets/hotspot-icons/shopping-cart-plus.png'

export const selectRoom = (textures, showrooms, id) => {
  let selectedRoom = 0;
  let roomName = "";

  Object.keys(showrooms).forEach((room,index) => {
    if (room === id) {
      selectedRoom = index;
      roomName = room;
    }
  })

  return [
    textures[selectedRoom],
    showrooms[roomName]
  ]
}

const Showroom = ({ currentRoom, onRoomChange }) => {
  let { roomId } = useParams();
  const [showroomState] = useShowroom();
  const [ show, setIsShow ] = useState(false);
  const showrooms = showroomState.apiData.staticShowrooms;

  if (!roomId) roomId = showroomState.apiData.defaultRoom
  if (currentRoom) roomId = currentRoom;

  console.log('-----showroomState', showrooms);

  const roomTextures = useLoader(TextureLoader, Object.values(showrooms).map(room => room.path));
  const playIcon = useLoader(TextureLoader, play)
  const arrowIcon = useLoader(TextureLoader, arrow)
  const shoppingCartIcon = useLoader(TextureLoader, shoppingCart)

  const [ texture, showroomData ] = selectRoom(roomTextures, showrooms, roomId)

  const onClose = () => {
    setIsShow(false)
  }

  const handleAddToCart = (productId) => {
    const shopifyButton = document.querySelector(`.shopify-buy__btn`);
    shopifyButton.click();
  };

  const handleVideoHotspotClick = () => {
    setIsShow(true)
  }

  const hotspotTypes = {
    video: (hotspot) => {
      return (
        <>
          {renderHotspot(hotspot, playIcon, handleVideoHotspotClick)}
          <Html>
            <Modal
              show={show}
              handleClose={onClose}
              body={<MediaVideo channel={hotspot.channel} videoId={hotspot.videoId} />}
              fullscreen
            />
          </Html>
        </>
      )
    },
    navigation: (hotspot) => (
      renderHotspot(hotspot, arrowIcon, () =>  onRoomChange(hotspot.id))
    ),
    shopify: (hotspot) => (
      renderHotspot(hotspot, shoppingCartIcon, handleAddToCart)
    )
  }

  const renderHotspot = (hotspot, icon, onClick) => {
    return (
      <PositionHotspot
        icon={icon}
        rotation={[
          verifyValueAndReturnZeroIfEmpty(hotspot.xRotation),
          verifyValueAndReturnZeroIfEmpty(hotspot.yRotation),
          verifyValueAndReturnZeroIfEmpty(hotspot.zRotation)
        ]}
        position={[
          verifyValueAndReturnZeroIfEmpty(hotspot.xPosition),
          verifyValueAndReturnZeroIfEmpty(hotspot.yPosition),
          verifyValueAndReturnZeroIfEmpty(hotspot.zPosition)
        ]}
        scale={40}
        onClick={onClick}
      />
    )
  }

  const verifyValueAndReturnZeroIfEmpty = (value) => {
    return value ?? 0
  }

  return (
    <group>
      <Room texture={texture} hotspots={showroomData?.hotspots} />

      {showroomData?.hotspots?.map((hotspot, index) => {
        return (
          <React.Fragment key={`${hotspot.id}${index}`}>
            {hotspotTypes[hotspot.type](hotspot)} 
          </React.Fragment>
        )}
      )}
    </group>
  )
}

export default Showroom;
