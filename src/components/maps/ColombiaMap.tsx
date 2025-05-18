import dynamic from "next/dynamic";
import { coMill } from '@react-jvectormap/colombia';
import { useRef } from "react";
import { MapObject } from "@react-jvectormap/core/dist/types";
const VectorMap = dynamic(
  () => import("@react-jvectormap/core").then((mod) => mod.VectorMap),
  { ssr: false }
);


const ColombiaMap = ({ ...props }) => {
  const mapRef = useRef<MapObject | null>(null);
  const focusDepartment = (code: string) => {
    mapRef.current?.setFocus({
      region: code,
      scale: 3,
      animate: true,
    });
  };
  return (
    <VectorMap
      zoomOnScroll={false}
      zoomMax={12}
      zoomMin={1}
      zoomAnimate={true}
      zoomStep={1.5}
      mapRef={mapRef}
      map={coMill}
      backgroundColor="transparent"
      onRegionClick={(_, code) => focusDepartment(code)}
      regionStyle={{
        initial: {
          fill: '#e4e4e4',
          "fillOpacity": 1,
          stroke: 'none',
          "strokeWidth": 0,
          "strokeOpacity": 1
        },
        hover: {
          "fillOpacity": 0.8,
          cursor: 'pointer'
        }
      }}
      {...props}
    />
  );
};

export default ColombiaMap;