import React, { useState, useEffect } from 'react';
import { useUser } from '../utils/UserContext';
import KakaoMap from '../utils/KakaoMap';
import { Box, Flex, Text } from '@chakra-ui/react';
import Header from '../components/Layout/Header';
import PartySearchBottomSheet from '../components/PartySearchBottomSheet';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function PartySearch() {
  const location = useLocation(); // get the states (paired with useNavigate)
  const option = location.state || null;
  // console.log('location.state: ', option); // debugging

  const { user } = useUser();
  const [isExpanded, setIsExpanded] = useState(option ? true : false);
  const [selectedParty, setSelectedParty] = useState(option);
  const [center, setCenter] = useState({
    lat: 36.370379109284,
    lng: 127.36265917051,
  });
  const [myLocation, setMyLocation] = useState(null);
  const [partyList, setPartyList] = useState([]); // 파티 리스트 상태
  // 파티 리스트를 불러오는 함수
  const fetchPartyList = async (latitude, longitude) => {
    try {
      const response = await axios.get('http://68.183.225.136:3000/party', {
        params: {
          latitude: latitude,
          longitude: longitude,
        },
      });
      setPartyList(response.data); // 응답 데이터를 상태에 저장
    } catch (error) {
      console.error('파티 목록을 불러오는데 실패했습니다:', error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 현재 위치로 이동
  useEffect(() => {
    goToCurrentLocation();
  }, []); // 빈 배열을 두 번째 인자로 주면 컴포넌트가 처음 렌더링될 때만 실행됨

  // useEffect를 수정하여 컴포넌트가 처음 렌더링될 때 fetchPartyList 호출
  useEffect(() => {
    if (myLocation) {
      fetchPartyList(myLocation.lat, myLocation.lng); // 현재 위치가 있으면 API 호출
    } else {
      fetchPartyList(36.370379109284, 127.36265917051); // 기본값 사용
    }
  }, [myLocation]); // myLocation이 변경될 때마다 호출
  const handlePartyClick = (party) => {
    console.log('handling party click: ', party);
    setSelectedParty(party);
    setIsExpanded(true);
  };

  const goToCurrentLocation = async () => {
    if (navigator.geolocation) {
      try {
        // 현재 위치 가져오기
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });

        // 위치 설정
        const { latitude, longitude } = position.coords;
        const newCenter = { lat: latitude, lng: longitude };
        setCenter(newCenter);
        setMyLocation(newCenter);

        // 현재 위치로 파티 리스트 갱신
        fetchPartyList(latitude, longitude);
      } catch (error) {
        console.error('현재 위치를 가져올 수 없습니다.', error);
        alert('현재 위치를 가져올 수 없습니다. 위치 접근 권한을 확인해주세요.');
      }
    } else {
      alert('위치 정보가 지원되지 않는 브라우저입니다.');
    }
  };

  // Monitor isExpanded for changes
  useEffect(() => {
    console.log(
      'Header visibility changed:',
      !isExpanded ? 'Visible' : 'Hidden'
    );
  }, [isExpanded]);

  return (
    <>
      <Flex direction="column" height="100vh" position="relative">
        {!isExpanded && (
          <Header
            user={user}
            id="Party-Search"
            title="파티 찾기"
            subtitle={null}
          />
        )}
      </Flex>
      <Box
        flex="1"
        width="100%"
        height="100%"
        position="absolute"
        paddingBottom="10vh"
        top="-5vh"
      >
        <KakaoMap
          partyListData={partyList}
          handlePartyClick={handlePartyClick}
          center={center}
          myLocation={myLocation}
        />
      </Box>
      <PartySearchBottomSheet
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        selectedParty={selectedParty}
        setSelectedParty={setSelectedParty}
        handlePartyClick={handlePartyClick}
        clearSelection={() => {
          setSelectedParty(null);
          setIsExpanded(false);
          console.log('SELECTION CLEARED');
        }}
        goToCurrentLocation={goToCurrentLocation} // 함수를 전달
        partyList={partyList}
      />
      {/* moved bottom sheet to here. Aware of similar component names!! */}
    </>
  );
}

export default PartySearch;
