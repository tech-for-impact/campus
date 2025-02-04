import { auth } from '@/utils/firebaseConfig';
import { Box, Button, Flex, Image, Input, Text } from '@chakra-ui/react';
import { Icon as IconifyIcon } from '@iconify/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../utils/UserContext';

function Header({ id, title, subtitle }) {
  const [isSearchButtonExpanded, setIsSearchButtonExpanded] = useState(false);
  const [isSearchBoxExpanded, setIsSearchBoxExpanded] = useState(false);
  const [isTitleExpanded, setIsTitleExpanded] = useState(false);
  const [searchBoxInputValue, setSearchBoxInputValue] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(
    'var(--background-silver, #FAF9FF)'
  );

  // user context에 모든 유저 정보
  const { user } = useUser();

  const [textColor, setTextColor] = useState('var(--21-purple-dark, #411461)');
  const [ticketCount, setTicketCount] = useState(user.tickets); // 티켓 개수 상태 추가

  const navigate = useNavigate(); // 로그아웃 후 리다이렉션을 위해 추가

  // boxShadow 상태 추가
  const [boxShadow, setBoxShadow] = useState(
    '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
  );

  const handleSearchButtonClick = () => {
    // 검색 버튼이 눌림: 검색 버튼은 비활성화, 검색창을 표시
    setIsTitleExpanded(false);
    setIsSearchBoxExpanded(true);
  };

  const handleSearchBoxBlur = () => {
    if (searchBoxInputValue.trim() === '') {
      // 검색창 입력이 끝남: 아무것도 입력하지 않은 경우는 검색창 비활성화 후 버튼 표시
      setIsTitleExpanded(true);
      setIsSearchBoxExpanded(false);
    }
  };

  useEffect(() => {
    switch (id) {
      case 'Home':
        setIsTitleExpanded(true);
        setBackgroundColor('var(--background-silver, #411461)');
        setTextColor('var(--Backgrounds-Primary, #FFF)');
        break;
      case 'Party-Search':
        setIsTitleExpanded(true);
        setIsSearchButtonExpanded(true);
        break;
      case 'Clothing-Search':
        setIsTitleExpanded(true);
        setBackgroundColor('var(--background-silver, #FAF9FF)');
        // Clothing-Search일 때 boxShadow를 표시 X
        setBoxShadow('none');
        break;
      case 'MyClothes':
        setIsTitleExpanded(true);
        setBackgroundColor('var(--background-silver, #FAF9FF)');
        // MyClothes일 때 boxShadow를 표시 X
        setBoxShadow('none');
        break;
      default:
        setIsTitleExpanded(true);
    }
  }, [id, navigate]);

  return (
    <Box
      zIndex="2"
      bg="transparent"
      // boxShadow 상태를 적용
      boxShadow={boxShadow}
      background={backgroundColor}
      borderBottomRadius="xl"
      borderRadius="0px 0px 30px 30px"
      backdropFilter="blur(25px)"
      position="relative"
    >
      <Flex
        flexDirection="column"
        mt="25px"
        mb="25px"
        ml="25px"
        mr="25px"
        justifyContent="space-between"
      >
        {/* 티켓 아이콘과 숫자 */}
        <Flex justifyContent="space-between" alignItems="center" mb="19px">
          <Image
            w="39px"
            h="26px"
            src="/images/logo.png"
            alt="logo"
            //onClick={handleLogout}  // Logout component 생성됨
          />

          <Flex alignItems="center" gap="4px">
            <IconifyIcon
              style={{ color: 'gray' }}
              icon="mdi:ticket-outline"
              width="25px"
              height="25px"
            />
            <Text
              fontSize="16px"
              fontStyle="normal"
              fontFamily="suit"
              fontWeight="600"
              color="gray.500"
            >
              {ticketCount}
            </Text>
          </Flex>
        </Flex>

        <div>
          {isTitleExpanded && (
            <Flex justifyContent="space-between" alignItems="center">
              <Text
                fontSize="32px"
                fontFamily="suit"
                fontStyle="normal"
                fontWeight="800"
                lineHeight="normal"
                color={textColor}
                mt={id === 'Home' ? '20px' : '0px'}
              >
                {title}
              </Text>

              {/* 검색 버튼 */}
              {isSearchButtonExpanded && (
                <Button
                  width="40px"
                  height="40px"
                  padding="5px"
                  justifyContent="center"
                  alignItems="center"
                  gap="10px"
                  shrink="0"
                  borderRadius="12px"
                  border="1px solid"
                  borderColor="var(--lightlight-Gray, #E8E8E8)"
                  background="var(--background-silver, #FAF9FF)"
                  boxShadow="0px 0px 5px 1px rgba(0, 0, 0, 0.10)"
                  onClick={handleSearchButtonClick}
                >
                  <IconifyIcon
                    icon="ph:magnifying-glass-bold"
                    width="30px"
                    height="30px"
                    shrink="0"
                  />
                </Button>
              )}
            </Flex>
          )}
        </div>

        {/* 서브타이틀 */}
        {subtitle}

        {/* 검색 바 */}

        <div>
          {isSearchBoxExpanded && (
            <Flex
              alignItems="center"
              borderRadius="full"
              boxShadow="sm"
              bg="#FFFFFF"
              paddingX="4"
              paddingY="2"
              onChange={(e) => setSearchBoxInputValue(e.target.value)}
              onBlur={handleSearchBoxBlur}
            >
              <Input
                variant="unstyled"
                placeholder="파티 이름 또는 위치를 검색하세요"
                _placeholder={{ color: '#707070' }}
                bg="#FFFFFF"
                fontSize="md"
                fontFamily="suit"
              />
              <Button w="25px" h="25px" p="0" bg="#FFFFFF">
                <IconifyIcon
                  icon="ph:magnifying-glass-bold"
                  width="25px"
                  height="25px"
                  _hover={{ bg: 'transparent', cursor: 'default' }}
                  _active={{
                    bg: 'transparent',
                    transform: 'none',
                    transition: 'none',
                  }}
                  _focus={{ boxShadow: 'none' }}
                  shrink="0"
                />
              </Button>
            </Flex>
          )}
        </div>
      </Flex>
    </Box>
  );
}

export default Header;
