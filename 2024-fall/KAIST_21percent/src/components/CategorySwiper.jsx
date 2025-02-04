import { Box, Text } from '@chakra-ui/react';
import { React, useState } from 'react';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

function CategorySwiper({ items, setSelectedCategory }) {
  const [category, setCategory] = useState('');
  const categorySelected = (newCategory) => {
    console.log(newCategory);
    if (category == newCategory) {
      console.log(1);
      setSelectedCategory('');
      setCategory('');
    } else {
      console.log(2);
      setSelectedCategory(newCategory);
      setCategory(newCategory);
    }
  };
  return (
    <Box mt={0}>
      <Text fontSize="24px" fontWeight="bold" style={{ color: 'black' }}>
        카테고리로 보기
      </Text>
      <Swiper spaceBetween={20} slidesPerView="auto">
        {items.map((item) => (
          <SwiperSlide key={item.id} style={{ width: '120px', flexShrink: 0 }}>
            <Box mt={2}></Box>
            <Box
              width="120px"
              height="120px"
              borderRadius="20px"
              bg="var(--Backgrounds-Primary, #FFF)"
              boxShadow="0px 0px 10px 1px rgba(0, 0, 0, 0.10)"
              overflow="hidden"
              textAlign="center"
              onClick={() => {
                categorySelected(item.type);
              }}
              border={item.type === category ? '2px solid #411461' : 'none'}
            >
              <Box mt={1.5}></Box>

              <Box
                bg={`url(/images/${item.image})`}
                backgroundPosition="center"
                backgroundSize="contain"
                backgroundRepeat="no-repeat"
                width="100%"
                height="80px"
              />
              <Text
                mt={0}
                color="var(--21-purple-dark, #411461)"
                textAlign="center"
                fontFamily="SUIT"
                fontSize="16px"
                fontStyle="normal"
                fontWeight="700"
                lineHeight="normal"
              >
                {item.name}
              </Text>
            </Box>
            <Box mt={2}></Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default CategorySwiper;
