import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

function ClothingSwiper({ items }) {
  return (
    <Box mt={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={2}>
        새로 등록된 옷이에요
      </Text>
      <Swiper spaceBetween={20} slidesPerView="auto">
        {items.map((item) => (
          <SwiperSlide key={item.id} style={{ width: '150px' }}>
            <Box mt={2}></Box>
            <Box
              bg="white"
              borderRadius="20px"
              boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
              overflow="hidden"
              textAlign="center"
            >
              <Box
                bg={`url(${`/images/${item.image}`}) lightgray`}
                backgroundPosition="center"
                backgroundSize="cover"
                backgroundRepeat="no-repeat"
                width="100%"
                height="150px"
                borderRadius="20px 20px 0px 0px"
              />
              <Box mt={1.5}></Box>
              <Text
                style={{
                  color: 'var(--21-purple-dark, #411461)',
                  textAlign: 'center',
                  fontFamily: 'SUIT',
                  fontSize: '16px',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  lineHeight: 'normal',
                  marginBottom: '-4px',
                }}
              >
                {item.name}
              </Text>

              <Box mt={1}></Box>

              <Text
                style={{
                  color: 'var(--subtitle-Gray, #7D7D7D)',
                  textAlign: 'center',
                  fontFamily: 'SUIT',
                  fontSize: '10px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: 'normal',
                  marginBottom: '8px',
                }}
              >
                {item.foot
                  ? `신발 사이즈 ${item.foot}`
                  : item.height && item.weight
                    ? `${item.height} ${item.weight} · 사이즈 ${item.size}`
                    : '사이즈 비공개'}
              </Text>
              {/* 'weight, height' 데이터가 있을시 "키 몸무게 ˑ 사이즈 __함", 'foot' 데이터가 있을시 "신발 사이즈 __mm", 아무것도 없을시 '사이즈 비공개 */}
            </Box>
            <Box mt={2}></Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default ClothingSwiper;
