import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/utils/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  Box,
  Button,
  Input,
  Flex,
  Text,
  IconButton,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { Image } from '@chakra-ui/react';
import { useUser, createNewUserWithIncrementedId } from '../utils/UserContext';

function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { user } = userCredential;

      // Check if user already exists in Firestore
      const userDocRef = doc(db, 'User', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user in Firestore
        const newUser = await createNewUserWithIncrementedId(user, username);
        setUser(newUser);
      }

      console.log('User signed up and saved to Firestore db!');

      navigate('/'); // 회원가입 후 홈으로 리다이렉션
    } catch (error) {
      let message = '회원가입에 실패했습니다.';
      if (error.code === 'auth/weak-password') {
        message = '비밀번호는 최소 6자리여야 합니다.';
      } else if (error.code === 'auth/email-already-in-use') {
        message = '이미 사용 중인 이메일입니다.';
      }
      alert(message);
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      bg="var(--background-silver, #FAF9FF)"
    >
      <Box mb={8} textAlign="center">
        <Image
          src="/images/landing_logo.png"
          alt="21% Party Logo"
          width="147px"
          height="98px"
          mb={4}
        />
        <Text fontSize="xl" fontWeight="semibold" color="purple.700">
          모두의 지속가능한 옷장
        </Text>
      </Box>
      <Box
        width="90%"
        maxW="400px"
        bg="white"
        p={8}
        borderRadius="md"
        boxShadow="xl"
      >
        <Input
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb={4}
          bg="gray.100"
          focusBorderColor="purple.500"
        />
        <Input
          placeholder="닉네임"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          mb={4}
          bg="gray.100"
          focusBorderColor="purple.500"
        />
        <InputGroup size="md" mb={4}>
          <Input
            pr="4.5rem"
            type={showPassword ? 'text' : 'password'}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            bg="gray.100"
            focusBorderColor="purple.500"
          />
          <InputRightElement width="4.5rem">
            <IconButton
              h="1.75rem"
              size="sm"
              icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
              onClick={() => setShowPassword(!showPassword)}
              variant="ghost"
              _hover={{ bg: 'transparent' }}
            />
          </InputRightElement>
        </InputGroup>
        <InputGroup size="md" mb={4}>
          <Input
            pr="4.5rem"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            bg="gray.100"
            focusBorderColor="purple.500"
          />
          <InputRightElement width="4.5rem">
            <IconButton
              h="1.75rem"
              size="sm"
              icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              variant="ghost"
              _hover={{ bg: 'transparent' }}
            />
          </InputRightElement>
        </InputGroup>
        <Button
          // colorScheme="purple"
          background="var(--21-purple-dark, #411461)"
          width="100%"
          mt={4}
          onClick={handleSignup}
          size="lg"
          fontWeight="bold"
          color="var(--background-silver, #FAF9FF)"
        >
          회원가입
        </Button>
        <Text mt={4} textAlign="center" color="gray.600">
          이미 계정이 있으신가요?{' '}
          <Button
            variant="link"
            color="var(--21-purple-dark, #411461)"
            onClick={() => navigate('/login')}
          >
            로그인
          </Button>
        </Text>
      </Box>
    </Flex>
  );
}

export default Signup;
