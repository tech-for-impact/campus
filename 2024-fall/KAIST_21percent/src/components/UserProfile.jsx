import React, { useState, useEffect } from 'react';
import { Box, Text, HStack, Button, useToast, Spinner } from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';

function UserProfile({ id, user: initialUser }) {
  const [user, setUser] = useState(initialUser || null);
  const toast = useToast();

  useEffect(() => {
    if (!initialUser && id) {
      // Fetch user data from the API if not provided directly
      fetch(`http://68.183.225.136:3000/user/` + id)
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          console.error('Error fetching user:', error); // 에러 상세 출력
          toast({
            title: 'Failed to load user',
            description: `Error: ${error.message}`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        });
    }
  }, [id, initialUser, toast]);

  if (!user) {
    return (
      <Box textAlign="center" py={1}>
        <Spinner size="lg" speed="0.8s" />
      </Box>
    );
  }

  return (
    <Box overflow="hidden" boxShadow="sm">
      <HStack spacing={3} align="center" mb={3}>
        <Button
          as="div"
          backgroundImage={user.profile_picture}
          backgroundSize="cover"
          backgroundPosition="center"
          borderRadius="50%"
          padding="0"
          lineHeight="0"
          w="30px"
          h="30px"
          minWidth="0" // 최소 너비 제거
          minHeight="0" // 최소 높이 제거
          _hover={{ opacity: 0.8 }}
        />
        <Text fontSize="md" fontWeight="bold">
          {user.username}
        </Text>
      </HStack>
    </Box>
  );
}

export default UserProfile;
