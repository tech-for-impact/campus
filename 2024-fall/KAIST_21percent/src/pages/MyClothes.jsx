// src/pages/MyClothes.jsx
import {
  Avatar,
  Box,
  Link as ChakraLink,
  Flex,
  Grid,
  Image,
  Text,
} from '@chakra-ui/react';
import axios from 'axios'; // axios 임포트
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 임포트
import Header from '../components/Layout/Header';
import Logout from '../components/Logout';
import { useUser } from '../utils/UserContext';

function MyClothes() {
  const maxItems = 12;

  const { user, userRegisteredClothes, userUnregisteredClothes } = useUser();
  //const [userData, setUserData] = useState(null); // 사용자 데이터 상태 추가

  const navigate = useNavigate(); // useNavigate 훅 초기화

  /* const registeredClothes = [
    '/images/register1.jpg',
    '/images/register2.jpg',
    '/images/register3.jpg',
    '/images/register4.jpg',
    '/images/register5.jpg',
    '/images/register6.jpg',
  ];

  const notregisteredClothes = [
    '/images/notregister1.jpg',
    '/images/notregister2.jpg',
    '/images/notregister3.jpg',
    '/images/notregister4.jpg',
    '/images/notregister5.jpg',
    '/images/notregister1.jpg',
    '/images/notregister2.jpg',
    '/images/notregister3.jpg',
    '/images/notregister4.jpg',
    '/images/notregister5.jpg',
    '/images/notregister1.jpg',
    '/images/notregister2.jpg',
    '/images/notregister3.jpg',
    '/images/notregister4.jpg',
    '/images/notregister5.jpg',
  ]; */

  const displayRegisteredClothes =
    userRegisteredClothes.length > maxItems
      ? userRegisteredClothes.slice(0, maxItems - 1)
      : userRegisteredClothes;

  const displaynotregisteredClothes =
    userUnregisteredClothes.length > maxItems
      ? userUnregisteredClothes.slice(0, maxItems - 1)
      : userUnregisteredClothes;

  /* useEffect(() => {
    // 사용자 데이터 가져오기 함수
    const fetchUserData = async () => {
      try {
        // 사용자 ID를 임의로 '1'로 지정
        const userId = '1';

        const response = await axios.get(
          `http://68.183.225.136:3000/user/${userId}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchUserData();
  }, []); */

  return (
    <Flex
      direction="column"
      height="100vh"
      overflowY="auto"
      pb={100}
      bg="var(--background-silver, #FAF9FF)"
    >
      {/* 상단 헤더 */}
      <Header id="MyClothes" title="내 옷장" />

      {/* 프로필 섹션 */}
      <Flex align="center" mb="33px" ml="25px">
        <Avatar
          size="lg"
          src={user ? user.profile_picture : '/images/loading_user.jpg'}
          width="84px"
          height="86.4px"
          flexShrink={0}
        />
        <Box ml="15px" flex="1">
          <Flex align="center">
            <Text
              fontFamily="SUIT"
              color="var(--Labels-Primary, #000)"
              fontSize="24px"
              fontWeight="700"
            >
              {user ? user.username : '로딩 중...'}
            </Text>
          </Flex>

          <Text
            fontFamily="SUIT"
            color="var(--Labels-Primary, #000)"
            fontSize="16px"
            fontWeight="500"
            mb="5px"
            width="262px"
          >
            {user ? user.description : '로딩 중...'}
          </Text>
          {/* 좋아요와 즐겨찾기 아이콘 */}
          <Flex align="center" gap="3px">
            <Image src="/heart_outline.svg" w="20px" h="20px" />
            <ChakraLink as={Link} to="/liked-clothes">
              <Text
                fontFamily="SUIT"
                color="var(--Labels-Primary, #000)"
                fontSize="14px"
                fontWeight="400"
                mr="16px"
              >
                좋아요 한 옷
              </Text>
            </ChakraLink>
            <Image src="/star_outline.svg" w="20px" h="20px" />
            {/* 즐겨찾기 한 파티를 클릭하면 LikedPartiesPage로 이동 */}
            <ChakraLink as={Link} to="/liked-parties">
              <Text
                fontFamily="SUIT"
                color="var(--Labels-Primary, #000)"
                fontSize="14px"
                fontWeight="400"
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
              >
                즐겨찾기 한 파티
              </Text>
            </ChakraLink>
          </Flex>
        </Box>
      </Flex>

      {/* 파티에 등록한 옷 바둑판 배열 */}
      <Text
        ml="25px"
        color="var(--Labels-Primary, #000)"
        fontFamily="SUIT"
        fontSize="24px"
        fontWeight="700"
        mb="-5px"
      >
        파티에 등록한 옷
      </Text>
      <Text
        ml="25px"
        color="var(--subtitle-Gray, #7D7D7D)"
        fontFamily="SUIT"
        fontSize="14px"
        fontWeight="500"
        mb="15px"
      >
        새 주인을 기다리는 중이에요
      </Text>
      <Grid
        templateColumns="repeat(auto-fill, minmax(90px, 1fr))"
        ml="20px"
        mr="20px"
        columnGap="10px"
        rowGap="10px"
        justifyItems="center"
        mb="33px"
      >
        {displayRegisteredClothes.map((clothes) => (
          <Box
            key={clothes.id}
            width="90px"
            height="90px"
            borderRadius="20px"
            overflow="hidden"
            filter="drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1))"
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
        {userRegisteredClothes.length > maxItems && (
          <Box
            key="view-all-registered"
            width="90px"
            height="90px"
            borderRadius="20px"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor="#FAF9FF"
            onClick={() => {
              // 전체보기 동작
              navigate('/registered-clothes'); // 예시: 전체 등록된 옷 페이지로 이동
            }}
            cursor="pointer"
          >
            <Text
              fontFamily="SUIT"
              color="var(--subtitle-Gray, #7D7D7D)"
              fontSize="14px"
              fontWeight="400"
            >
              전체 보기
            </Text>
          </Box>
        )}
      </Grid>

      {/* 아직 파티에 등록하지 않은 옷 바둑판 배열 */}
      <Text
        ml="25px"
        color="var(--Labels-Primary, #000)"
        fontFamily="SUIT"
        fontSize="24px"
        fontWeight="700"
        mb="-5px"
      >
        옷장에 넣어둔 옷
      </Text>
      <Text
        ml="25px"
        color="var(--subtitle-Gray, #7D7D7D)"
        fontFamily="SUIT"
        fontSize="14px"
        fontWeight="500"
        mb="15px"
      >
        아직 파티에 등록하지 않았어요
      </Text>
      <Grid
        templateColumns="repeat(auto-fill, minmax(90px, 1fr))"
        ml="20px"
        mr="20px"
        columnGap="10px"
        rowGap="10px"
        justifyItems="center"
        mb="33px"
      >
        {displaynotregisteredClothes.map((clothes) => (
          <Box
            key={clothes.id}
            width="90px"
            height="90px"
            borderRadius="20px"
            overflow="hidden"
            filter="drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1))"
          >
            <Image
              src={clothes.image}
              alt={`notregistered Clothes ${clothes.id}`}
              objectFit="cover"
              width="100%"
              height="100%"
            />
          </Box>
        ))}
        {userUnregisteredClothes.length > maxItems && (
          <Box
            key="view-all-notregestered"
            width="90px"
            height="90px"
            borderRadius="20px"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor="#FAF9FF"
            onClick={() => {
              // 전체보기 동작
              navigate('/not-registered-clothes'); // 예시: 전체 교환받은 옷 페이지로 이동
            }}
            cursor="pointer"
          >
            <Text
              fontFamily="SUIT"
              color="var(--subtitle-Gray, #7D7D7D)"
              fontSize="14px"
              fontWeight="400"
            >
              전체 보기
            </Text>
          </Box>
        )}
      </Grid>

      {/* 로그아웃 링크 추가 */}
      <Logout />
    </Flex>
  );
}

export default MyClothes;
