// KakaoMap.jsx
import React, { useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

function KakaoMap({ partyListData, handlePartyClick, center, myLocation }) {
  const [map, setMap] = React.useState(null);

  useEffect(() => {
    if (map && center) {
      map.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    }
  }, [center, map]);

  return (
    <Map
      center={center}
      style={{ width: '100%', height: '100%' }}
      level={4}
      onCreate={setMap} // 지도 객체를 setMap에 저장
    >
      {partyListData.map((party) => (
        <MapMarker
          key={party.id}
          position={{ lat: party.location[0], lng: party.location[1] }}
          image={{
            src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
            size: { width: 24, height: 35 },
          }}
          title={party.name}
          onClick={() => handlePartyClick(party)}
        />
      ))}
      {myLocation && (
        <MapMarker
          position={{ lat: myLocation.lat, lng: myLocation.lng }}
          image={{
            src: '/Group109.svg', // 현재 위치를 나타내는 원형 아이콘
            size: { width: 20, height: 20 },
          }}
          title="현재 위치"
        />
      )}
    </Map>
  );
}

export default KakaoMap;
