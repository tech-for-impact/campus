import { Box, Button, Flex, Grid, Icon, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BackIcon = (props) => (
  <Icon
    width="11px"
    height="20px"
    viewBox="0 0 11 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10 19L1 10L10 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

function LikedClothesPage() {
  const [likedClothes, setLikedClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedClothes = async () => {
      try {
        const userId = '1'; // 실제 사용자 ID로 대체 필요

        // 사용자 데이터 가져오기
        const userResponse = await axios.get(
          `http://68.183.225.136:3000/user/${userId}`
        );
        const likedClothIds = userResponse.data.liked_clothes;

        if (likedClothIds && likedClothIds.length > 0) {
          // 옷 데이터 병렬로 가져오기
          const clothPromises = likedClothIds.map((clothId) =>
            axios.get(`http://68.183.225.136:3000/cloth/${clothId}`)
          );

          const clothesResponses = await Promise.all(clothPromises);
          const clothes = clothesResponses.map((res) => res.data);
          setLikedClothes(clothes);
        } else {
          setLikedClothes([]);
        }
      } catch (error) {
        console.error('좋아요 한 옷을 가져오는 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedClothes();
  }, []);

  // 옷 아이템 클릭 시 상세 페이지로 이동
  const handleClothClick = (cloth) => {
    navigate('/cloth', { state: { ...cloth } });
  };

  // 커스텀 헤더 컴포넌트
  const CustomHeader = () => (
    <Flex align="center" mb="10px" mt="40px" ml="30px">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        color="#000000"
        left="0"
        padding="0"
      >
        <BackIcon />
      </Button>

      <Text textAlign="center" fontSize="24px" fontWeight="700">
        좋아요 한 옷
      </Text>
    </Flex>
  );

  return (
    <Flex
      direction="column"
      height="100vh"
      overflowY="auto"
      pb={100}
      bg="var(--background-silver, #FAF9FF)"
    >
      {/* 상단 커스텀 헤더 */}
      <CustomHeader />

      {/* 메인 콘텐츠 */}
      <Flex
        direction="column"
        px="32px"
        flex="1"
        width="100%"
        maxWidth="800px"
        mx="auto"
        overflowY="auto"
        py="20px"
      >
        {loading ? (
          <Text textAlign="center" fontSize="18px" color="gray.500">
            로딩 중...
          </Text>
        ) : likedClothes.length > 0 ? (
          <Grid
            templateColumns="repeat(auto-fill, minmax(90px, 1fr))"
            gap="10px"
          >
            {likedClothes.map((cloth) => (
              <Box
                key={cloth.id}
                width="90px"
                height="90px"
                borderRadius="20px"
                overflow="hidden"
                filter="drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1))"
                cursor="pointer"
                onClick={() => handleClothClick(cloth)}
                bg="#FFF" // 배경색 추가
                boxShadow="md" // 그림자 추가
                _hover={{ boxShadow: 'lg' }} // 호버 시 그림자 변경
              >
                {cloth.image ? (
                  <Image
                    src={cloth.image}
                    alt={`Cloth ${cloth.id}`}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <Text color="gray.500" textAlign="center" mt="30%">
                    이미지 없음
                  </Text>
                )}
              </Box>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" mt="50px">
            <Text fontSize="18px" color="gray.500">
              좋아요 한 옷이 없습니다.
            </Text>
          </Box>
        )}
      </Flex>
    </Flex>
  );
}

export default LikedClothesPage;
