import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '@/utils/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useUser, createNewUserWithIncrementedId } from '../utils/UserContext';
import {
  Box,
  Button,
  Input,
  Flex,
  Text,
  IconButton,
  InputGroup,
  InputRightElement,
  Divider,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { Image } from '@chakra-ui/react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false); // Track when user is fully loaded

  const {
    user,
    setUser,
    fetchUserRegisteredClothes,
    fetchUserUnregisteredClothes,
  } = useUser();

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const { user } = response;

      // Reference to Firestore document for the user
      const userDocRef = doc(db, 'User', user.uid);

      // Fetch user document from Firestore
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // Return existing user data
        console.log('User document found:', userDoc.data());
        // Set user context and navigate
        setUser({ ...userDoc.data() });

        navigate('/home'); // 로그인 후 홈으로 리다이렉션
      } else {
        // User is authenticated but no Firestore data exists (shouldn't happen in this flow)
        throw new Error(
          'User data not found in Firestore. Please contact support.'
        );
      }
    } catch (error) {
      let message = '로그인에 실패했습니다.';
      if (error.code === 'auth/user-not-found') {
        message = '해당 사용자가 존재하지 않습니다.';
      } else if (error.code === 'auth/wrong-password') {
        message = '비밀번호가 잘못되었습니다.';
      }
      alert(message);
      console.log(error);
    } finally {
      setUserLoaded(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id && userLoaded) {
      // Fetch user's clothes only if the user is loaded
      fetchUserRegisteredClothes(user.id);
      fetchUserUnregisteredClothes(user.id);
    }
  }, [user, userLoaded]); // This runs after the user is loaded and the user state is updated

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);

    try {
      const response = await signInWithPopup(auth, provider);
      const { user } = response;

      // Check if user already exists in Firestore
      const userDocRef = doc(db, 'User', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Create new user in Firestore
        const newUser = await createNewUserWithIncrementedId(user);
        setUser(newUser);
      }

      console.log('구글 로그인 성공!');

      // Set user context and navigate
      const updatedUser = (await getDoc(userDocRef)).data();
      setUser({ ...updatedUser });
      navigate('/home'); // 성공 시 홈으로 이동
    } catch (error) {
      console.error('구글 로그인 오류:', error);
      alert('구글 로그인에 실패했습니다. ' + (error.message || ''));
    } finally {
      setLoading(false);
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
        <Button
          // colorScheme="purple"
          background="var(--21-purple-dark, #411461)"
          width="100%"
          mt={4}
          onClick={handleLogin}
          size="lg"
          fontWeight="bold"
          color="var(--background-silver, #FAF9FF);"
        >
          로그인
        </Button>
        <Text mt={4} textAlign="center" color="gray.600">
          아직 계정이 없으신가요?{' '}
          <Button
            variant="link"
            color="var(--21-purple-dark, #411461)"
            onClick={() => navigate('/signup')}
          >
            회원가입
          </Button>
        </Text>
        <Divider my={6} />
        <Text mb={2} textAlign="center" color="gray.500">
          SNS 계정으로 간편 로그인
        </Text>
        <Button
          colorScheme="gray"
          width="100%"
          onClick={handleGoogleLogin}
          variant="outline"
          leftIcon={
            <Image
              src="/images/google_logo.png"
              alt="Google Logo"
              width="20px"
            />
          }
        >
          Google 로그인
        </Button>
      </Box>
    </Flex>
  );
}

export default Login;
