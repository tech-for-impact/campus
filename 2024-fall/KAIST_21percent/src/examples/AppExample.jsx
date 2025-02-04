import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig'; // Firestore 설정 불러오기
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react'; // Chakra UI 컴포넌트 추가

function AppExample() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'messages'));
        querySnapshot.forEach((doc) => {
          console.log(doc.data()); // 데이터를 콘솔에 출력
          setMessage(doc.data().text); // 'text' 필드를 가져오기
        });
      } catch (error) {
        console.error('Error fetching messages:', error); // 에러 확인
      }
    };

    fetchMessage();
  }, []);

  return (
    <VStack spacing={4} align="center" mt={10}>
      <Heading>Firestore에서 가져온 메시지</Heading>
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
        <Text fontSize="xl">{message || '메시지를 불러오는 중...'}</Text>
      </Box>
      <Button colorScheme="blue" onClick={() => window.location.reload()}>
        다시 불러오기
      </Button>
    </VStack>
  );
}

export default AppExample;
