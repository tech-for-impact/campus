import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useEffect, useState } from 'react';
import 'swiper/css'; // Swiper 기본 스타일
import CategorySwiper from '../components/CategorySwiper';
import Header from '../components/Layout/Header';
import ClothingPost from '../components/ClothingPost';
import { catagoryData } from '../data/categoryData';
import axios from 'axios';

const CLOTHING_ITEMS = {
  1: [
    {
      id: 1,
      userid: 'name1',
      userprofile: '/images/profile.jpg',
      name: '옷 1',
      image: '/images/register4.jpg',
      description: '옷 설명 1',
      likes: 0,
    },
    {
      id: 2,
      userid: 'name2',
      userprofile: '/images/sample_profile_image.png',
      name: '옷 2',
      image: '/images/register4.jpg',
      description: '옷 설명 2',
      likes: 0,
    },
  ],
  2: [
    {
      id: 3,
      userid: 'name3',
      userprofile: '/images/sample_profile_image.png',
      name: '옷 3',
      image: '/images/sample_image.png',
      description: '옷 설명 3',
      likes: 0,
    },
    {
      id: 4,
      userid: 'name4',
      userprofile: '/images/sample_profile_image.png',
      name: '옷 4',
      image: '/images/sample_image.png',
      description: '옷 설명 4',
      likes: 0,
    },
  ],
  3: [
    {
      id: 5,
      userid: 'name5',
      userprofile: '/images/sample_profile_image.png',
      name: '옷 5',
      image: '/images/sample_image.png',
      description: '옷 설명 5',
      likes: 0,
    },
  ],
  4: [
    {
      id: 6,
      userid: 'name6',
      userprofile: '/images/sample_profile_image.png',
      name: '옷 6',
      image: '/images/sample_image.png',
      description: '옷 설명 6',
      likes: 0,
    },
  ],
};

const dummyPost = {
  id: '1',
  type: 'tops',
  tags: ['test1', 'test2'],
  duration: [2, 'y'],
  image:
    'https://storage.googleapis.com/again-server-5156a.appspot.com/cloth/cloth1.jpg?GoogleAccessId=firebase-adminsdk-snbum%40again-server-5156a.iam.gserviceaccount.com&Expires=16731014400&Signature=YqI8oD3titl4iBtvOxYSdL74nNnQYfuR97wkeF%2B10E50UX3G5U2MtTFPt%2BFIxGlFylVp60h3JBD5OzTCe8YL2TsU9VzUN1LT1uMCyQGLdTEpdN94PZFJ%2FGmPWPHmZ8ZI82qaoq0Jg1FsIx7vHOAEQacdFGPOC%2BoEZrmgMSva0SJ8IvhsyXCvsW7AgTcPUk6TBoLotrcysC1ZrvJmfZlg%2B%2BV8kIBjQ4JgZlZjLB4crgWwXNE9Zkw3Wj8cNdhhOBwUWNJ6EYrlF0h5ETILtfEPDggn6Dtd1lgmPN82VvRMfOdX6%2Bbnx8Z4hA0A9a0G%2FncEVZRhdiZfO7DZJO61vEk5WA%3D%3D',
  name: '광인의 천옷',
  size: '170cm 60kg · 사이즈 적당함',
  height: 180,
  weight: 70,
  likes: 0,
  description:
    '힙하고 멋있어 보여서 작년에 망설임 없이 구매했는데 친구들이 자꾸 한문 선생님 같다고 놀려서 못 입겠어요',
  upload_date: '2024-11-11T08:09:46+09:00',
  liked_users: [],
  owner: '1',
  party: '1',
};

function ClothingSearch() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [postList, setPostList] = useState([]);
  const [userId, setUserId] = useState('');
  const maxPostLength = 5;

  useEffect(() => {
    // 여기에 userId 받아와야함
    setUserId('1');
    const fetchPost = async () => {
      try {
        const response = await axios.get('http://68.183.225.136:3000/cloth/'); // API 호출
        setPostList(response.data);
      } catch (error) {
        console.error('Error fetching post:', error); // 에러 상세 출력
        toast({
          title: 'Failed to load post',
          description: `Error: ${error.message}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchPost();
  });

  return (
    <Flex
      direction="column"
      position="relative"
      bg="var(--background-silver, #FAF9FF)"
    >
      <Header id="Clothing-Search" title="옷 보기" />
      <Flex
        direction="column"
        bg="var(--background-silver, #FAF9FF)"
        ml="25px"
        mb="10px"
        overflow="auto"
      >
        {/* 카테고리 선택 */}
        <CategorySwiper
          items={catagoryData}
          setSelectedCategory={setSelectedCategory}
        />
        {/* 옷 스토리 게시판 */}
        <Box mt={4}>
          <Text
            color="var(--Labels-Primary, #000)"
            fontFamily="SUIT"
            fontSize="24px"
            fontStyle="normal"
            fontWeight="700"
            lineHeight="normal"
          >
            옷 스토리 게시판
          </Text>
          <Text
            color="var(--subtitle-Gray, #7D7D7D)"
            fontFamily="SUIT"
            fontSize="14px"
            fontStyle="normal"
            fontWeight="500"
            lineHeight="normal"
          >
            새 주인 찾아요, 내 이야기를 들어봐!
          </Text>
        </Box>
      </Flex>
      {/* 옷 스토리 게시글이 완성되면, 종스크롤 형태로 이곳에 배치 */}
      <Box p={0}>
        {' '}
        {/* padding을 0으로 설정하여 적용되지 않도록 합니다. */}
        <VStack spacing={6}>
          {postList
            .filter((item) =>
              selectedCategory == '' ? true : item.type == selectedCategory
            )
            .slice(
              0,
              postList.length > maxPostLength ? maxPostLength : postList.length
            )
            .map((item) => (
              <Box key={item.id} w="100%">
                {/* <ClothingPost post={dummyPost} hasLikeButton={false} /> */}
                <ClothingPost
                  userId={userId}
                  post={item}
                  hasLikeButton={true}
                />
              </Box>
            ))}
        </VStack>
      </Box>
      <Box minH="120px" />
      {/* 하단의 navigation bar로 인해 내용이 잘려서 빈 공백을 추가함 */}
    </Flex>
  );
}

export default ClothingSearch;
