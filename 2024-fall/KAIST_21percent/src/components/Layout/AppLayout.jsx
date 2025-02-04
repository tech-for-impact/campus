import PrivateRoute from '@/components/PrivateRoute';
import ClothingSearch from '@/pages/ClothingSearch';
import Home from '@/pages/Home';
import LandingPage from '@/pages/LandingPage';
import LikedClothesPage from '@/pages/LikedClothesPage';
import LikedPartiesPage from '@/pages/LikedPartiesPage';
import Login from '@/pages/Login';
import MyClothes from '@/pages/MyClothes';
import PartySearch from '@/pages/PartySearch';
import Signup from '@/pages/Signup';
import { Box, Button, Flex, IconButton, Text } from '@chakra-ui/react';
import { Icon as IconifyIcon } from '@iconify/react';
import { React, useState } from 'react';
import {
  Link,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  matchPath,
} from 'react-router-dom';
import PutClothes from '../../pages/PutClothes';
import KeywordExtractor from '../KeywordExtractor';
import PartyDetailPage from '../../pages/PartyDetailPage';

function AppLayout() {
  return (
    <>
      <Router>
        {/* 전체 레이아웃을 Flex로 */}
        <Flex direction="column" height="100vh">
          {/* 페이지별로 헤더와 바디를 관리하게 됨 */}
          <Box flex="1" overflow="auto">
            <Routes>
              {/* 작업 중 testing 용도 */}
              <Route path="/testing" element={<Text>testing</Text>} />
              {/* 랜딩 페이지 - 앱 시작 시 로드 */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/test" element={<KeywordExtractor />} />
              {/* 로그인 및 회원가입 페이지는 보호되지 않음 */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* 보호된 페이지 */}
              <Route
                path="/home"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/party"
                element={
                  <PrivateRoute>
                    <PartySearch />
                  </PrivateRoute>
                }
              />
              <Route
                path="/party/:partyId"
                element={
                  <PrivateRoute>
                    <PartyDetailPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/clothes"
                element={
                  <PrivateRoute>
                    <ClothingSearch />
                  </PrivateRoute>
                }
              />
              <Route
                path="/my-clothes"
                element={
                  <PrivateRoute>
                    <MyClothes />
                  </PrivateRoute>
                }
              />
              <Route path="/put-clothes" element={<PutClothes />} />

              <Route
                path="/liked-parties"
                element={
                  <PrivateRoute>
                    <LikedPartiesPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/liked-clothes"
                element={
                  <PrivateRoute>
                    <LikedClothesPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Box>
          <NavBarAndButton />
        </Flex>
      </Router>
    </>
  );
}

function NavBarAndButton() {
  const [selectedPage, setSelectedPage] = useState(1);
  const location = useLocation();
  const hiddenPaths = [
    '/',
    '/login',
    '/signup',
    '/put-clothes',
    '/liked-parties',
    '/liked-clothes',
  ];

  // Check if the current path matches any hidden path or pattern
  const isHidden =
    hiddenPaths.includes(location.pathname) ||
    matchPath('/party/:partyId/*', location.pathname);

  if (isHidden) {
    return null;
  }

  return (
    <>
      {/* 하단 네비게이션 바 */}
      <Flex
        as="nav"
        position="fixed"
        bottom="0"
        left="0"
        width="100%"
        height="85px"
        bg="#FFF"
        borderTop="1px solid #E8E8E8"
        justifyContent="space-around"
        filter="drop-shadow(0px -1px 8px rgba(0, 0, 0, 0.08))"
        padding="10px"
        shrink={0}
        zIndex="10"
      >
        <Link to="/home">
          <Button
            aria-label="홈"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="50px"
            height="51px"
            gap="4px"
            shrink={0}
            variant="ghost"
            _hover={{ backgroundColor: 'transparent' }}
            _active={{ backgroundColor: 'transparent', boxShadow: 'none' }}
            onClick={() => {
              setSelectedPage(1);
            }}
          >
            {selectedPage == 1 && (
              <IconifyIcon
                icon="bxs:home"
                style={{ fontSize: '30px' }}
                color="#411461"
              />
            )}
            {selectedPage != 1 && (
              <IconifyIcon icon="bx:home" style={{ fontSize: '30px' }} />
            )}
            <Text
              color="#000"
              fontFamily="'SUIT', sans-serif"
              fontSize="14px"
              fontWeight="500"
            >
              홈
            </Text>
          </Button>
        </Link>
        <Link to="/party">
          <Button
            aria-label="파티 찾기"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="50px"
            height="51px"
            gap="4px"
            shrink={0}
            variant="ghost"
            _hover={{ backgroundColor: 'transparent' }}
            _active={{ backgroundColor: 'transparent', boxShadow: 'none' }}
            onClick={() => {
              setSelectedPage(2);
            }}
          >
            {selectedPage == 2 && (
              <IconifyIcon
                icon="bxs:party"
                style={{ fontSize: '30px' }}
                color="#411461"
              />
            )}
            {selectedPage != 2 && (
              <IconifyIcon icon="bx:party" style={{ fontSize: '30px' }} />
            )}
            <Text
              color="#000"
              fontFamily="'SUIT', sans-serif"
              fontSize="14px"
              fontWeight="500"
            >
              파티 찾기
            </Text>
          </Button>
        </Link>
        <Link to="/put-clothes">
          <Box width="80px" height="51px">
            <Box height="34px"></Box>
            <Text
              color="#000"
              fontFamily="'SUIT', sans-serif"
              fontSize="14px"
              fontWeight="500"
              textAlign="center"
            >
              옷 넣어두기
            </Text>
          </Box>
        </Link>
        <Link to="/clothes">
          <Button
            aria-label="옷 보기"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="50px"
            height="51px"
            gap="1px"
            shrink={0}
            variant="ghost"
            _hover={{ backgroundColor: 'transparent' }}
            _active={{ backgroundColor: 'transparent', boxShadow: 'none' }}
            onClick={() => {
              setSelectedPage(3);
            }}
          >
            {selectedPage == 3 && (
              <IconifyIcon
                icon="lsicon:clothes-filled"
                style={{ fontSize: '33px' }}
                color="#411461"
              />
            )}
            {selectedPage != 3 && (
              <IconifyIcon
                icon="lsicon:clothes-outline"
                style={{ fontSize: '33px' }}
              />
            )}
            <Text
              color="#000"
              fontFamily="'SUIT', sans-serif"
              fontSize="14px"
              fontWeight="500"
            >
              옷 보기
            </Text>
          </Button>
        </Link>
        <Link to="/my-clothes">
          <Button
            aria-label="내 옷장"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="50px"
            height="51px"
            gap="4px"
            shrink={0}
            variant="ghost"
            _hover={{ backgroundColor: 'transparent' }}
            _active={{ backgroundColor: 'transparent', boxShadow: 'none' }}
            onClick={() => {
              setSelectedPage(4);
            }}
          >
            {selectedPage == 4 && (
              <IconifyIcon
                icon="streamline:closet-solid"
                style={{ fontSize: '30px' }}
                color="#411461"
              />
            )}
            {selectedPage != 4 && (
              <IconifyIcon
                icon="streamline:closet"
                style={{ fontSize: '30px' }}
              />
            )}

            <Text
              color="#000"
              fontFamily="'SUIT', sans-serif"
              fontSize="14px"
              fontWeight="500"
            >
              내 옷장
            </Text>
          </Button>
        </Link>
      </Flex>

      {/* 중앙에 고정된 등록 버튼 */}
      <Link to="/put-clothes">
        <IconButton
          aria-label="옷 넣어두기"
          icon={
            <IconifyIcon
              icon="icon-park-outline:hanger"
              style={{ fontSize: '40px', color: 'white' }}
            />
          }
          backgroundColor="#411461"
          position="fixed"
          bottom="43px"
          left="50%"
          transform="translateX(-50%)"
          borderRadius="full"
          width="70px"
          height="70px"
          zIndex="20"
          _hover={{ backgroundColor: '#411461' }}
          _active={{ backgroundColor: '#411461', boxShadow: 'none' }}
        />
      </Link>
    </>
  );
}

export default AppLayout;
