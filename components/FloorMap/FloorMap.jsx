import React from "react";
import { ImageMap } from "@qiuz/react-image-map";
import spot from "../../assets/hotspot-icons/spot.png"

const FloorMap = ({ img, hotspots, renderRoom }) => {
  const mapArea = [];
  if (hotspots && hotspots.length > 0) {
    hotspots.forEach((hotspot) => {
      mapArea.push({
        roomid: hotspot.id,
        width: "5%",
        height: "5%",
        left: `${hotspot.left * 100}%`,
        top: `${hotspot.top * 100}%`,
        render: () => (
          <span>
            <img alt={`${hotspot.id} hotspot`} width="61px" src={spot} />
          </span>
        ),
      });
    });
  }

  const onMapClick = (area) => {
    renderRoom(area.roomid);
  };

  if (img) {
    return (
      <ImageMap
        className="usage-map"
        src={img}
        alt="Floor plan"
        map={mapArea}
        onMapClick={onMapClick}
      />
    )
  }

  return null
};
export default FloorMap;
