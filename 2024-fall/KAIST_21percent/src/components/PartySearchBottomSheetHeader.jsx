import React from 'react';
import { Box, Text, Flex, Spacer } from '@chakra-ui/react';

function PartySearchBottomSheetHeader() {
  return (
    <Box
      // h="80px"
      borderTopRadius="30px"
      position="relative"
      pt="4" // 16px
      pb="1" // 4px
    >
      <Flex direction="column">
        <Box
          w="32px"
          h="4px"
          borderRadius="2px"
          bg="gray.300"
          mx="auto" // Center the handle
        />
        <Flex
          direction="row"
          px="32px"
          pt="32px"
          pb="10px"
          alignContent="center"
        >
          <Text fontSize="2xl" fontWeight="bold">
            내게 가까운 파티들
          </Text>
          <Spacer />
          {/* <Text fontSize="md" color="#7C31B4" alignSelf="center">
            거리순
          </Text> */}
        </Flex>
      </Flex>
    </Box>
  );
}

export default PartySearchBottomSheetHeader;
