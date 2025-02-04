import React, { useState, useEffect } from 'react';
import { Text, Flex, Box, Image, Button, Grid } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon as IconifyIcon } from '@iconify/react/dist/iconify.js';
import { useUser } from '../utils/UserContext';
import axios from 'axios';
import { useDisclosure } from '@chakra-ui/react';
import { useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react';
import ClothingPost from '../components/ClothingPost';

function PartyDetailPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const { partyId } = useParams(); // routing 후 parameter로 파티 아이디 받음
  const { user, userUnregisteredClothes } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); // 파티의 좋아요 상태 가져와야됨
  // 랜더링 상태 변화 ('info', 'all-clothes', 'register-mine')
  const [currentView, setCurrentView] = useState('info'); // Default view

  // '내 옷 등록하기'에서 특정 옷이 선택되었는지 확인
  const [selectedClothesMine, setSelectedClothesMine] = useState(null); // default null selected
  // '모든 등록된 옷 보기'에서 특정 옷이 선택되었는지 확인
  const [selectedClothesAll, setSelectedClothesAll] = useState(null); // default null selected

  // data to fetch
  const [partyDetails, setPartyDetails] = useState(null);
  const [partyAllClothes, setPartyAllClothes] = useState(null);
  const [userAllClothes, setUserAllClothes] = useState(userUnregisteredClothes); // 로그인 시 이미 fetch 해서 context에 저장함

  const navigate = useNavigate();

  const fetchPartyDetailandClothes = async (id) => {
    try {
      const detailResponse = await axios.get(
        `http://68.183.225.136:3000/party/${id}`
      );
      const clothesResponse = await axios.get(
        `http://68.183.225.136:3000/cloth/party/${id}`
      ); // 파티 id

      console.log('party detail fetched: ', detailResponse.data); // got the data
      console.log('party clothes fetched: ', clothesResponse.data); // got the data

      setPartyDetails(detailResponse.data); // Save the data to state
      setPartyAllClothes(clothesResponse.data);
      // MUST CHANGE AFTER USER CONTEXT IS CREATED!!! 현재 내 옷 등록하기의 옷도 전부 파티 옷 데이터로 둠!!!
      //setUserAllClothes(clothesResponse.data);
      setIsLoading(false); // Update loading state
    } catch (error) {
      console.error(
        '파티 정보 혹은 등록된 옷을 불러오는데 실패했습니다:',
        error
      );
      setIsLoading(false); // Even on error, stop the loading state
    }
  };

  /* const fetchPartyAllClothes = async (id) => {
    try {
      const response = await axios.get(`http://68.183.225.136:3000/cloth/party/${id}`); // 파티 id
      console.log("party clothes fetched:", response.data);
      setPartyAllClothes(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('파티에 등록된 옷을 불러오는데 실패했습니다:', error);
      setIsLoading(false); // Even on error, stop the loading state
    }
  } */

  /* const fetchUserAllClothes = async (id) => {
    try {
      const response = await axios.get(
        `http://68.183.225.136:3000/cloth/user/${id}`
      ); // 유저 id
      console.log("user's clothes fetched:", response.data);
      setUserAllClothes(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('유저의 등록된 옷을 불러오는데 실패했습니다:', error);
      setIsLoading(false); // Even on error, stop the loading state
    }
  }; */

  // Fetch party details & party clothes on mount
  useEffect(() => {
    fetchPartyDetailandClothes(partyId);
  }, [partyId]);

  if (isLoading) {
    return (
      <Flex
        justify="center"
        align="center"
        height="100vh"
        bg="var(--background-silver, #FAF9FF)"
      >
        <Text fontSize="xl" color="gray.600">
          Loading...
        </Text>
      </Flex>
    );
  }

  if (!partyDetails) {
    return (
      <Flex
        justify="center"
        align="center"
        height="100vh"
        bg="var(--background-silver, #FAF9FF)"
      >
        <Text fontSize="xl" color="red.600">
          파티 정보를 불러올 수 없습니다.
        </Text>
      </Flex>
    );
  }

  const { name, image, date } = partyDetails;
  const startDate = new Date(date[0]);
  const endDate = new Date(date[1]);
  const formatTime = (date) => `${date.getHours()}시 ~ ${endDate.getHours()}시`;

  // 전체 옷 보기에서 오른쪽 화살표 누르기
  const handleNextSelectedClothesAll = () => {
    if (!partyAllClothes || partyAllClothes.length === 0) return; // Prevent errors on empty array

    const cur = partyAllClothes.indexOf(selectedClothesAll); // Use indexOf for arrays
    const next = (cur + 1) % partyAllClothes.length; // Correctly access array length

    setSelectedClothesAll(partyAllClothes[next]);
  };

  // 전체 옷 보기에서 왼쪽 화살표 누르기
  const handlePriorSelectedClothesAll = () => {
    if (!partyAllClothes || partyAllClothes.length === 0) return; // Prevent errors on empty array

    const cur = partyAllClothes.indexOf(selectedClothesAll); // Use indexOf for arrays
    const prior = (cur - 1 + partyAllClothes.length) % partyAllClothes.length; // Correctly access array length

    setSelectedClothesAll(partyAllClothes[prior]);
  };

  // 내 옷 등록하기에서 오른쪽 화살표 누르기
  const handleNextSelectedClothesMine = () => {
    if (!userAllClothes || userAllClothes.length === 0) return; // Prevent errors on empty array

    const cur = userAllClothes.indexOf(selectedClothesMine); // Use indexOf for arrays
    const next = (cur + 1) % userAllClothes.length; // Correctly access array length

    setSelectedClothesMine(userAllClothes[next]);
  };

  // 내 옷 등록하기에서 왼쪽 화살표 누르기
  const handlePriorSelectedClothesMine = () => {
    if (!userAllClothes || userAllClothes.length === 0) return; // Prevent errors on empty array

    const cur = userAllClothes.indexOf(selectedClothesMine); // Use indexOf for arrays
    const prior = (cur - 1 + userAllClothes.length) % userAllClothes.length; // Correctly access array length

    setSelectedClothesMine(userAllClothes[prior]);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'info':
        return (
          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap="70px"
          >
            <Flex
              direction="column"
              alignItems="flex-start"
              gap="20px"
              alignSelf="stretch"
            >
              {/* Party Image or Placeholder */}
              <Box
                width="100%"
                height="270px"
                bg="gray.200"
                borderRadius="20px"
                overflow="hidden" // Ensure the image doesn't overflow the box
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {image ? (
                  <Image
                    src={image} // Party image URL
                    alt={`${name} 이미지`}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <Text color="gray.500" fontSize="lg">
                    이미지 없음
                  </Text>
                )}
              </Box>
              <Flex
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
                gap="15px"
                alignSelf="stretch"
              >
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  gap="2px"
                  alignSelf="stretch"
                >
                  <Text
                    alignSelf="stretch"
                    color="var(--21-purple-dark, #411461)"
                    fontSize="16px"
                    fontWeight="600"
                    lineHeight="normal"
                  >
                    {/* distance 값이 파티 db에 없음. 프런트에서 직접 계산해야 함. 수정 요함 */}
                    {/* {partyDetails.distance !== null &&
                    partyDetails.distance !== undefined
                      ? partyDetails.distance < 1
                        ? `내 위치로부터 ・ ${(partyDetails.distance * 1000).toFixed(0)}m`
                        : `내 위치로부터 ・ ${partyDetails.distance.toFixed(2)}km`
                      : '거리 정보를 확인할 수 없습니다'} */}
                    내 위치로부터 ・ 6.2km {/* hard coding */}
                  </Text>
                  <Text
                    alignSelf="stretch"
                    fontSize="32px"
                    fontWeight="800"
                    lineHeight="normal"
                  >
                    {name}
                  </Text>
                  <Flex direction="row" alignItems="center" gap="2px">
                    <IconifyIcon
                      icon={
                        isFavorite
                          ? 'ant-design:star-filled'
                          : 'ant-design:star-outlined'
                      }
                      style={{ width: '25px', height: '25px', color: 'black' }}
                      onClick={() => setIsFavorite(!isFavorite)}
                    />
                    <Text
                      color="black"
                      textAlign="center"
                      fontSize="18px"
                      fontStyle="normal"
                      fontWeight="500"
                      lineHeight="normal"
                    >
                      {partyDetails.likes}
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  direction="column"
                  alignItems="flex-start"
                  gap="5px"
                  alignSelf="stretch"
                >
                  <Flex direction="row" alignItems="center" gap="10px">
                    <IconifyIcon
                      icon="uis:calender"
                      style={{
                        color: '#7D7D7D',
                        fontSize: '18px',
                      }}
                    />
                    <Text
                      color="#7D7D7D"
                      fontWeight="500"
                      fontSize="16px"
                      fontStyle="normal"
                      lineHeight="normal"
                    >
                      {`${startDate.getMonth() + 1}월 ${startDate.getDate()}일 (${['일', '월', '화', '수', '목', '금', '토'][startDate.getDay()]})`}
                    </Text>
                  </Flex>
                  <Flex direction="row" alignItems="center" gap="10px">
                    <IconifyIcon
                      icon="mdi:clock"
                      style={{
                        color: '#7D7D7D',
                        fontSize: '18px',
                      }}
                    />
                    <Text
                      color="#7D7D7D"
                      fontWeight="500"
                      fontSize="16px"
                      fontStyle="normal"
                      lineHeight="normal"
                    >
                      {formatTime(startDate)}
                    </Text>
                  </Flex>
                  <Flex direction="row" alignItems="center" gap="10px">
                    <IconifyIcon
                      icon="ic:round-location-on"
                      style={{
                        color: '#7D7D7D',
                        fontSize: '18px',
                      }}
                    />
                    <Text
                      color="#7D7D7D"
                      fontWeight="500"
                      fontSize="16px"
                      fontStyle="normal"
                      lineHeight="normal"
                    >
                      {partyDetails.address}
                    </Text>
                  </Flex>
                  <Flex direction="row" alignItems="center" gap="10px">
                    <IconifyIcon
                      icon="jam:crown-f"
                      style={{
                        color: '#7D7D7D',
                        fontSize: '18px',
                      }}
                    />
                    <Text
                      color="#7D7D7D"
                      fontWeight="500"
                      fontSize="16px"
                      fontStyle="normal"
                      lineHeight="normal"
                    >
                      {partyDetails.host[1]}님이 호스트
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex direction="column" alignItems="flex-start" gap="12px">
              <Button
                w="200px"
                h="fit-content"
                py="13px"
                px="25px"
                justifyContent="center"
                alignItems="center"
                borderRadius="25px"
                backgroundColor="var(--lightlight-Gray, #E8E8E8)"
                boxShadow="0px 2px 4px 2px rgba(0, 0, 0, 0.25)"
                backdropFilter="blur(25px)"
                onClick={() => {
                  setCurrentView('all-clothes');
                }}
              >
                <Text
                  h="fit-content"
                  color="black"
                  fontSize="20px"
                  fontStyle="normal"
                  fontWeight="500"
                  lineHeight="normal"
                >
                  등록된 옷 보기
                </Text>
              </Button>
              <Button
                w="200px"
                h="fit-content"
                py="13px"
                px="25px"
                justifyContent="center"
                alignItems="center"
                borderRadius="25px"
                backgroundColor="var(--21-purple, #7C31B4)"
                boxShadow="0px 2px 4px 2px rgba(0, 0, 0, 0.25)"
                backdropFilter="blur(25px)"
                onClick={() => {
                  setCurrentView('register-mine');
                }}
              >
                <Text
                  h="fit-content"
                  color="white"
                  fontSize="20px"
                  fontStyle="normal"
                  fontWeight="700"
                  lineHeight="normal"
                >
                  내 옷 등록하기
                </Text>
              </Button>
            </Flex>
          </Flex>
        );
      case 'all-clothes':
        return (
          <Flex direction="column" gap="12px" overflow="visible">
            <Text
              color="black"
              fontFamily="SUIT"
              fontSize="32px"
              fontWeight="800"
            >
              {name}
            </Text>
            {/* 등록된 모든 옷 바둑판 배열 */}
            <Text
              color="var(--21-purple-dark, #411461)"
              fontFamily="SUIT"
              fontSize="20px"
              fontWeight="700"
            >
              파티에 등록된 옷
            </Text>
            {selectedClothesAll == null ? (
              /* default: no clothes clicked */
              partyAllClothes.length === 0 ? (
                <Text
                  alignItems="center"
                  alignSelf="stretch"
                  textAlign="center"
                  fontFamily="SUIT"
                  fontSize="20px"
                  fontWeight="700"
                  color="#7D7D7D"
                  pt="80px"
                >
                  아직 파티에 등록된 옷이 없어요
                </Text>
              ) : (
                <Flex direction="column" overflowY="auto" m="-10px">
                  <Grid
                    templateColumns="repeat(3, 1fr)"
                    //   columnGap="20px"
                    rowGap="20px"
                    justifyItems="center"
                    mb="50px"
                    mt="12px"
                  >
                    {partyAllClothes.map((clothes) => (
                      <Box
                        key={clothes.id}
                        width="100px"
                        height="100px"
                        borderRadius="20px"
                        overflow="hidden"
                        filter="drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1))"
                        onClick={() => setSelectedClothesAll(clothes)}
                      >
                        <Image
                          src={clothes.image}
                          alt={`Clothes ${clothes.id}`}
                          objectFit="cover"
                          width="100%"
                          height="100%"
                        />
                      </Box>
                    ))}
                  </Grid>
                </Flex>
              )
            ) : (
              /* when specific clothes clicked */
              <Flex direction="column" gap="60px" alignItems="center">
                <Flex
                  direction="column"
                  gap="25px"
                  alignItems="center"
                  alignSelf="stretch"
                >
                  <ClothingPost
                    userId={user.id}
                    post={selectedClothesAll}
                    hasLikeButton={true}
                  />
                  {/* <Box
                    h="350px"
                    alignSelf="stretch"
                    boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
                    backgroundColor="gray.500"
                  >
                    <ClothingPost
                      userId={user.id}
                      post={selectedClothesAll}
                      hasLikeButton={true}
                    />
                  </Box> */}
                  {/* L-R control button */}
                  <Flex
                    w="110px"
                    h="50px"
                    py="8px"
                    px="10px"
                    justifyContent="space-between"
                    alignItems="center"
                    borderRadius="25px"
                    background="white"
                    boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
                  >
                    <IconifyIcon
                      icon={'bx:left-arrow'}
                      style={{
                        width: '30px',
                        height: '30px',
                        color: '#7C31B4',
                      }}
                      onClick={handlePriorSelectedClothesAll}
                    />
                    <IconifyIcon
                      icon={'bx:right-arrow'}
                      style={{
                        width: '30px',
                        height: '30px',
                        color: '#7C31B4',
                      }}
                      onClick={handleNextSelectedClothesAll}
                    />
                  </Flex>
                </Flex>
              </Flex>
            )}
          </Flex>
        );
      case 'register-mine':
        return (
          <Flex direction="column" gap="12px" overflow="visible">
            <Text
              color="black"
              fontFamily="SUIT"
              fontSize="32px"
              fontWeight="800"
            >
              {name}
            </Text>
            <Text
              color="var(--21-purple-dark, #411461)"
              fontFamily="SUIT"
              fontSize="20px"
              fontWeight="700"
            >
              내 옷 등록하기
            </Text>
            {selectedClothesMine == null ? (
              /* default: no clothes clicked */
              userAllClothes.length === 0 ? (
                <Text
                  alignItems="center"
                  alignSelf="stretch"
                  textAlign="center"
                  fontFamily="SUIT"
                  fontSize="20px"
                  fontWeight="700"
                  color="#7D7D7D"
                  pt="80px"
                >
                  아직 내 옷장에 넣어둔 옷이 없어요
                </Text>
              ) : (
                <Flex direction="column" overflowY="auto" m="-10px">
                  <Grid
                    templateColumns="repeat(3, 1fr)"
                    //   columnGap="20px"
                    rowGap="20px"
                    justifyItems="center"
                    mb="50px"
                    mt="12px"
                  >
                    {userAllClothes.map((clothes) => (
                      <Box
                        key={clothes.id}
                        width="100px"
                        height="100px"
                        borderRadius="20px"
                        overflow="hidden"
                        filter="drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1))"
                        onClick={() => setSelectedClothesMine(clothes)}
                      >
                        <Image
                          src={clothes.image}
                          alt={`Clothes ${clothes.id}`}
                          objectFit="cover"
                          width="100%"
                          height="100%"
                        />
                      </Box>
                    ))}
                  </Grid>
                </Flex>
              )
            ) : (
              /* when specific clothes clicked */
              <Flex direction="column" gap="60px" alignItems="center">
                <Flex
                  direction="column"
                  gap="25px"
                  alignItems="center"
                  alignSelf="stretch"
                >
                  <ClothingPost
                    userId={user.id}
                    post={selectedClothesMine}
                    hasLikeButton={false}
                  />
                  {/* <Box
                    h="350px"
                    alignSelf="stretch"
                    boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
                    backgroundColor="gray.500"
                  >
                    <Text color="black">{selectedClothesMine.name}</Text>
                  </Box> */}
                  {/* L-R control button */}
                  <Flex
                    w="110px"
                    h="50px"
                    py="8px"
                    px="10px"
                    justifyContent="space-between"
                    alignItems="center"
                    borderRadius="25px"
                    background="white"
                    boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
                  >
                    <IconifyIcon
                      icon={'bx:left-arrow'}
                      style={{
                        width: '30px',
                        height: '30px',
                        color: '#7C31B4',
                      }}
                      onClick={handlePriorSelectedClothesMine}
                    />
                    <IconifyIcon
                      icon={'bx:right-arrow'}
                      style={{
                        width: '30px',
                        height: '30px',
                        color: '#7C31B4',
                      }}
                      onClick={handleNextSelectedClothesMine}
                    />
                  </Flex>
                </Flex>

                <Button
                  onClick={onOpen}
                  w="200px"
                  h="50px"
                  px="52px"
                  py="12px"
                  justifyContent="center"
                  alignItems="center"
                  borderRadius="25px"
                  background="var(--21-purple, #7C31B4)"
                  boxShadow="0px 2px 4px 2px rgba(0, 0, 0, 0.25)"
                  backdropFilter="blur(25px)"
                >
                  <Text
                    color="white"
                    textAlign="center"
                    fontFamily="SUIT"
                    fontSize="20px"
                    fontStyle="normal"
                    fontWeight="700"
                    lineHeight="normal"
                  >
                    등록하기
                  </Text>
                </Button>
                <AlertDialog
                  motionPreset="slideInBottom"
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                  isOpen={isOpen}
                  isCentered
                >
                  <AlertDialogOverlay />

                  <AlertDialogContent
                    width="350px"
                    // height="250px"
                    borderRadius="40px"
                  >
                    <AlertDialogBody>
                      <Box position="relative" mt={3}>
                        <Flex justify="center" align="center">
                          <IconifyIcon
                            icon={'mdi:ticket-outline'}
                            style={{
                              width: '60px',
                              height: '60px',
                              color: '#7C31B4',
                            }}
                          />
                          <Text
                            position="absolute"
                            fontWeight={800}
                            fontSize="20px"
                            color="#7C31B4"
                            fontFamily="SUIT"
                          >
                            +1
                          </Text>
                        </Flex>
                      </Box>

                      <Flex
                        mt={1}
                        alignItems="center"
                        direction="column"
                        fontFamily="SUIT"
                        textAlign="center"
                        whiteSpace="normal"
                        wordWrap="break-word"
                        mb={3}
                      >
                        <Text fontWeight="400" fontSize="24px">
                          <span style={{ fontWeight: 700, color: '#411461' }}>
                            {selectedClothesMine.name}
                          </span>
                          을(를) 등록했어요!
                        </Text>
                        <Text mt={2} fontWeight="300" fontSize="20px">
                          <span style={{ fontWeight: 600 }}>{name} </span>옷
                          목록에서
                        </Text>
                        <Text fontWeight="300" fontSize="20px">
                          확인할 수 있어요.
                        </Text>
                      </Flex>
                    </AlertDialogBody>
                    <AlertDialogFooter
                      display="flex"
                      justifyContent="center"
                      bg="#E8E8E8"
                      borderRadius="0 0 40px 40px"
                    >
                      <Button
                        ref={cancelRef}
                        onClick={onClose}
                        fontWeight="700"
                        fontSize="20px"
                        fontFamily="SUIT"
                        bg="transparent"
                      >
                        완료하기
                      </Button>
                      <Button
                        ml={6}
                        fontWeight="700"
                        fontSize="20px"
                        color="#7C31B4"
                        fontFamily="SUIT"
                        bg="transparent"
                      >
                        <IconifyIcon
                          icon={'ic:outline-share'}
                          style={{
                            width: '25px',
                            height: '25px',
                            color: '#7C31B4',
                          }}
                        />
                        <Box width={'3px'}></Box>
                        공유하기
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </Flex>
            )}
          </Flex>
        );
      default:
        return null;
    }
  };

  return (
    <Flex
      direction="column"
      height="100vh"
      bg="var(--background-silver, #FAF9FF)"
      p="36px"
      overflow="visible" // for the sake of grid item shadows (패딩 때문에 안 잘리도록)
    >
      {/* chevron-left: go back header */}
      <Flex w="100%" pb="20px">
        <IconifyIcon
          icon="icon-park-outline:left"
          style={{
            color: '#000',
            fontSize: '40px',
            marginLeft: '-15px',
          }}
          onClick={() => {
            if (currentView === 'info') {
              navigate(-1);
            } else if (currentView === 'register-mine') {
              if (selectedClothesMine == null) {
                setCurrentView('info');
              } else {
                setSelectedClothesMine(null);
              }
            } else if (currentView === 'all-clothes') {
              if (selectedClothesAll == null) {
                setCurrentView('info');
              } else {
                setSelectedClothesAll(null);
              }
            }
          }}
        />
      </Flex>

      {/* Conditionally render view */}
      {renderContent()}
    </Flex>
  );
}

export default PartyDetailPage;
