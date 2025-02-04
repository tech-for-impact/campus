import React, { useEffect } from 'react';
import { Flex, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후 자동으로 로그인 페이지로 이동
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      bg="var(--background-silver, #FAF9FF)"
    >
      <Image
        src="/images/landing_logo.png"
        alt="21% Party Logo"
        width="219px"
        height="146px"
      />
    </Flex>
  );
}

export default LandingPage;
