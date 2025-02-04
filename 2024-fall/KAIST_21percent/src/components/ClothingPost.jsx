import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Image,
  Heading,
  VStack,
  HStack,
  Button,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import UserProfile from './UserProfile';
import axios from 'axios';

const dummyUser = {
  id: 'admin',
  username: 'admin',
  profile_picture: '/images/profile.jpg',
};

function ClothingPost({ userId, id, post: initialPost, hasLikeButton }) {
  const [post, setPost] = useState(initialPost || null);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [userLikes, setUserLikes] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialPost);
  const [party, setParty] = useState('');
  const toast = useToast();
  const maxTags = 20; // 태그의 최대 개수

  const getUserLikes = async () => {
    try {
      const response = await axios.get(
        'http://68.183.225.136:3000/cloth/like/' + post.id
      ); // API 호출
      setLikes(response.data.likes);
      setUserLikes(response.data.liked_users.includes(userId));
      //console.log('getuserlikes');
      //console.log(response.data.liked_users)
      //console.log(userId)
      //console.log(userLikes);
    } catch (error) {
      console.error('Error fetching post:', error); // 에러 상세 출력
      setParty('좋아요 정보를 불러오는데 실패했습니다.');
    }
  };

  // Update `post` whenever `initialPost` changes
  useEffect(() => {
    setPost(initialPost);
  }, [initialPost]);

  useEffect(() => {
    if (!initialPost && id) {
      // Fetch post data from the API if not provided directly
      setIsLoading(true);
      const fetchPost = async () => {
        try {
          const response = await axios.get(
            'http://68.183.225.136:3000/cloth/' + id
          ); // API 호출
          setPost(response.data);
          setLikes(response.data.likes);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching post:', error); // 에러 상세 출력
          toast({
            title: 'Failed to load post',
            description: `Error: ${error.message}`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setIsLoading(false);
        }
      };
      fetchPost();
    }
    if (post != null) {
      const getPartyName = async () => {
        try {
          const response = await axios.get(
            'http://68.183.225.136:3000/party/' + post.party
          ); // API 호출
          setParty(response.data.name);
        } catch (error) {
          console.error('Error fetching post:', error); // 에러 상세 출력
          setParty('파티 정보를 불러오는데 실패했습니다.');
        }
      };
      getPartyName();
      getUserLikes();
    }
    if (userLikes !== undefined) {
      getUserLikes();
    }
  }, [post, userLikes]);

  const toggleLikes = () => {
    const fetchPost = async () => {
      try {
        //console.log('http://68.183.225.136:3000/cloth/like/'+userId+'/'+post.id);
        const response = await axios.get(
          'http://68.183.225.136:3000/cloth/like/' + userId + '/' + post.id
        ); // API 호출
        setLikes(response.data.likes);
        setUserLikes(response.data.liked_users.includes(userId));
      } catch (error) {
        console.error('Error fetching post:', error); // 에러 상세 출력
      }
    };
    fetchPost();
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Post not found</Text>
      </Box>
    );
  }

  const getTagString = (list) => {
    return list.map((item) => `#${item}`).join(' ');
  };

  return (
    <Flex
      borderRadius="20px 20px 20px 20px"
      overflow="hidden"
      flexDirection="column"
      position="relative"
      boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)" // box-shadow 추가
      bg="var(--background-silver, #FFFFFF)"
    >
      {/* 사용자 프로필 */}

      <Box mt="10px" ml="16px">
        <UserProfile id={post.owner} />
      </Box>

      {/* 옷 사진 */}
      <Image
        src={post.image}
        alt={post.name}
        maxH="240px"
        objectFit="cover"
        borderRadius="md"
      />

      <Flex direction="column" mt="11px" mb="11px" ml="13px" mr="13px">
        {/* 좋아요 버튼 */}
        {hasLikeButton && (
          <Flex direction="row" justifyContent="space-between" width="100%">
            <HStack spacing="0" align="center" minH="24px">
              {userLikes && (
                <IconButton
                  w="24px"
                  minH="24px"
                  h="24px"
                  minW="24px"
                  aria-label="Like"
                  icon={<FaHeart boxsize="24px" />}
                  variant="ghost"
                  color={userLikes ? '#411461' : 'gray'}
                  mr="0px"
                  justifyContent="center"
                  onClick={() => {
                    toggleLikes();
                  }}
                  _hover={{ bg: 'transparent' }}
                  _focus={{ bg: 'transparent' }}
                  _active={{ bg: 'transparent' }}
                />
              )}
              {!userLikes && (
                <IconButton
                  w="24px"
                  minH="24px"
                  h="24px"
                  minW="24px"
                  aria-label="Like"
                  icon={<FaRegHeart boxsize="24px" />}
                  variant="ghost"
                  color={userLikes ? '#411461' : 'gray'}
                  mr="0px"
                  justifyContent="center"
                  onClick={() => {
                    toggleLikes();
                  }}
                  _hover={{ bg: 'transparent' }}
                  _focus={{ bg: 'transparent' }}
                  _active={{ bg: 'transparent' }}
                />
              )}
              <Text>{likes}</Text>
            </HStack>
            <Text
              color="var(--subtitle-Gray, #7D7D7D)"
              textAlign="right"
              fontFamily="SUIT"
              fontSize="12px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="normal"
            >
              {post.size}
            </Text>
          </Flex>
        )}

        {hasLikeButton && (
          <Flex direction="row" alignItems="center">
            <Text
              color="var(--21-purple-dark, #411461)"
              fontFamily="SUIT"
              fontSize="20px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="normal"
              mr="8px"
            >
              {post.name}
            </Text>
            <Text
              color="var(--subtitle-Gray, #7D7D7D)"
              textAlign="center"
              fontFamily="SUIT"
              fontSize="14px"
              fontStyle="normal"
              fontWeight="500"
              lineHeight="normal"
            >
              {party}
            </Text>
          </Flex>
        )}

        {!hasLikeButton && (
          <Flex
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Text
              color="var(--21-purple-dark, #411461)"
              fontFamily="SUIT"
              fontSize="20px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="normal"
              mr="8px"
            >
              {post.name}
            </Text>
            <Text
              color="var(--subtitle-Gray, #7D7D7D)"
              textAlign="right"
              fontFamily="SUIT"
              fontSize="12px"
              fontStyle="normal"
              fontWeight="700"
              lineHeight="normal"
            >
              {post.size}
            </Text>
          </Flex>
        )}

        <Text
          color="#000"
          fontFamily="SUIT"
          fontSize="14px"
          fontStyle="normal"
          fontWeight="400"
          lineHeight="normal"
          mt="3px"
        >
          {post.description}
        </Text>
        <Text
          color="var(--subtitle-Gray, #7D7D7D)"
          fontFamily="SUIT"
          fontSize="14px"
          fontStyle="normal"
          fontWeight="400"
          lineHeight="normal"
          mt="3px"
        >
          {getTagString(post.tags)}
        </Text>
        <Text
          color="var(--21-purple, #7C31B4)"
          fontFamily="SUIT"
          fontSize="11px"
          fontStyle="normal"
          fontWeight="700"
          lineHeight="normal"
          mt="3px"
        >
          {new Date(post.upload_date).getFullYear()}년{' '}
          {new Date(post.upload_date).getMonth()}월{' '}
          {new Date(post.upload_date).getDate()}일
        </Text>
      </Flex>
    </Flex>
  );
}

export default ClothingPost;
