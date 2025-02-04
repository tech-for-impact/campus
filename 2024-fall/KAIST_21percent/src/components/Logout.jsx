import React from 'react';
import { useUser } from '../utils/UserContext';
import { auth } from '@/utils/firebaseConfig';
import { signOut } from 'firebase/auth';
import { Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();

      navigate('/login');
      console.log('로그아웃되었습니다.');
    } catch (error) {
      console.error('로그아웃에 실패했습니다:', error);
    }
  };

  return (
    <Text
      mt="50px"
      ml="20px"
      mb="30px"
      color="var(--subtitle-Gray, #7D7D7D)"
      fontFamily="SUIT"
      fontSize="12px"
      fontWeight="700"
      textDecoration="underline"
      cursor="pointer"
      onClick={handleLogout}
    >
      로그아웃 하기
    </Text>
  );
}

export default Logout;
