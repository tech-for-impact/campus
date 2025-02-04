import React, { useState } from 'react';
import {
  Button,
  Flex,
  Icon,
  Image,
  Input,
  Select,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
} from '@chakra-ui/react';
import axios from 'axios'; // axios 임포트

import { useNavigate } from 'react-router-dom';
import OpenAI from 'openai';
import { storage } from '@/utils/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useUser } from '../utils/UserContext';

// 커스텀 BackIcon
const BackIcon = (props) => (
  <Icon
    width="11px"
    height="20px"
    viewBox="0 0 11 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10 19L1 10L10 1"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Icon>
);

function PutClothes() {
  const navigate = useNavigate();
  const [story, setStory] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [nickname, setNickname] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [fitSize, setFitSize] = useState('');

  const { user, userRegisteredClothes, userUnRegisteredClothes } = useUser(); // 등록된/안된 옷 따로 보관

  // 이미지 선택 핸들러
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // 이미지 업로드 함수 (Firebase Storage 사용)
  const uploadImageToCloud = async (file) => {
    try {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      return null;
    }
  };

  // 키워드 추출 요청 핸들러
  const handleExtractKeywords = async () => {
    if (!selectedImage || !nickname || !story) {
      alert('이미지, 옷 이름, 옷 이야기를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

      if (!apiKey) {
        throw new Error('OpenAI API 키가 설정되지 않았습니다.');
      }

      // Firebase에 이미지를 업로드하고 URL을 얻음
      const uploadedImageUrl = await uploadImageToCloud(selectedImage);
      if (!uploadedImageUrl) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      // OpenAI 인스턴스 생성
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true, // 브라우저에서 실행 허용
      });

      // OpenAI API 호출
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `I have a clothing item named "${nickname}". Here is the story: "${story}". Provide only 5 Korean adjective keywords related to the clothing's texture, specific qualities, and descriptive imagery. Only respond with the 5 Korean adjectives separated by commas. Do not provide any other explanation or context.`,
          },
          {
            role: 'user',
            content: `Here is the image of the clothing item: ${uploadedImageUrl}`,
          },
        ],
      });

      const description = completion.choices[0].message.content;
      const keywordsArray = description.split(',').map((kw) => kw.trim());
      setKeywords(keywordsArray);
    } catch (error) {
      console.error('키워드 추출 실패:', error);
      alert('키워드 추출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 프로필 사이즈 가져오기
  const handleProfileSizeClick = () => {
    setHeight('180');
    setWeight('70');
  };

  // 태그 클릭 시 "내 옷의 이야기"에 추가
  const handleTagClick = (keyword) => {
    if (!story.includes(keyword)) {
      setStory((prev) => (prev ? `${prev} ${keyword}` : keyword));
    }
  };

  // 옷 등록 API 호출 (완료하기 버튼 클릭 시)
  const handleSubmit = async () => {
    if (!selectedImage || !nickname || !story || !category || !size) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      // Firebase에 이미지를 업로드하고 URL을 얻음
      const uploadedImageUrl = await uploadImageToCloud(selectedImage);
      if (!uploadedImageUrl) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      // FormData 생성
      const formData = new FormData();
      formData.append('file', selectedImage); // 이미지 파일 추가
      formData.append(
        'jsonData',
        JSON.stringify({
          name: nickname,
          height:
            category === 'top' || category === 'bottom' ? parseInt(height) : 0,
          weight:
            category === 'top' || category === 'bottom' ? parseInt(weight) : 0,
          length: category === 'shoes' ? parseInt(fitSize) : 0,
          size: size,
          tags: keywords,
          type: category,
          party: '', // 파티 ID를 선택적으로 넣을 수 있습니다.
          owner: user?.id,
          description: story,
        })
      );

      // API 호출
      const response = await axios.post(
        // 'http://localhost:3000/cloth/upload',
        'http://68.183.225.136:3000/cloth/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        alert('옷이 성공적으로 등록되었습니다!');
        navigate('/home'); // 홈 페이지로 이동
      } else {
        alert('옷 등록에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('옷 등록 오류:', error);
      alert('옷 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      bg="var(--background-silver, #FAF9FF)"
      minHeight="100vh"
      width="100%"
    >
      {/* 상단 헤더 */}
      <Flex mb="55px" mt="45px" ml="30px" alignSelf="flex-start">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          color="#000000"
          left="0"
          padding="0"
        >
          <BackIcon />
        </Button>
        <Text textAlign="center" fontSize="24px" fontWeight="700">
          옷 넣어두기
        </Text>
      </Flex>

      {/* 이미지 업로드 */}
      <Flex
        justify="center"
        align="center"
        bg="#FFFFFF"
        borderRadius="20px"
        height="180px"
        width="180px"
        mb="55px"
        flexShrink={0}
        boxShadow="0px 2px 4px 1px rgba(0, 0, 0, 0.10)"
        style={{ backdropFilter: 'blur(25px)' }}
        onClick={() => document.getElementById('imageInput').click()}
      >
        {selectedImage ? (
          <Image
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            height="100%" // 높이와 너비를 컨테이너에 맞게 설정
            width="100%"
            objectFit="cover"
            borderRadius="20px"
          />
        ) : (
          <Image
            src="/camera.png"
            alt="Camera Icon"
            boxSize="60px"
            objectFit="cover"
          />
        )}
        <Input
          id="imageInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
      </Flex>

      {/* 메인 콘텐츠 */}
      <Flex
        direction="column"
        px="32px"
        flex="1"
        width="100%"
        maxWidth="600px"
        overflowY="auto"
        paddingBottom="20px"
      >
        {/* 옷 별명 */}
        <Flex
          mb="50px"
          flexDirection={{ base: 'column', sm: 'row' }}
          alignItems="center"
          width="100%"
          minHeight="72px"
        >
          <Text
            fontFamily="SUIT"
            fontSize="20px"
            fontWeight="700"
            color="var(--21-purple-dark, #411461)"
            mb={{ base: '10px', sm: '0' }}
            mr={{ base: '0', sm: '30px' }}
            width={{ base: '100%', sm: 'auto' }}
          >
            옷 별명
          </Text>
          <Input
            placeholder="내 옷만의 별명을 지어주세요"
            borderRadius="12px"
            bg="#FFFFFF"
            fontSize="14px"
            height="32px"
            width={{ base: '100%', sm: 'auto' }}
            flex="1"
            boxShadow="0px 2px 4px 1px rgba(0, 0, 0, 0.10)"
            backdropFilter="blur(25px)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </Flex>

        {/* 내 옷의 이야기 */}
        <Text
          fontFamily="SUIT"
          fontSize="20px"
          fontWeight="700"
          color="var(--21-purple-dark, #411461)"
          mb="10px"
        >
          내 옷의 이야기
        </Text>
        <Textarea
          placeholder="이 옷은 어떤 추억을 담고 있나요?"
          mb="31px"
          bg="#FFFFFF"
          borderRadius="25px"
          fontSize="14px"
          border="none"
          resize="none"
          boxShadow="0px 2px 4px 1px rgba(0, 0, 0, 0.10)"
          backdropFilter="blur(25px)"
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
        <Button
          variant="outline"
          color="var(--21-purple, #7C31B4)"
          borderColor="var(--21-purple, #7C31B4)"
          mb="31px"
          bg="#FFFFFF"
          borderRadius="25px"
          fontSize="14px"
          onClick={handleExtractKeywords}
          isLoading={isLoading}
        >
          키워드 추출하기
        </Button>

        {/* 키워드 태그 */}
        {keywords.length > 0 && (
          <Flex
            padding="15px"
            alignItems="flex-start"
            alignContent="flex-start"
            gap="10px"
            flexWrap="wrap"
            borderRadius="25px"
            border="1px solid var(--21-purple, #7C31B4)"
            bg="#FFFFFF"
            boxShadow="0px 2px 4px 1px rgba(0, 0, 0, 0.10)"
            backdropFilter="blur(25px)"
            mb="31px"
          >
            {keywords.map((keyword, index) => (
              <Tag
                size="sm"
                key={index}
                borderRadius="15px"
                variant="solid"
                colorScheme="purple"
                bg="var(--lightlight-Gray, #f0f0f0)"
                display="flex"
                padding="5px 8px"
                alignItems="center"
                gap="10px"
                color="#000000"
                cursor="pointer"
                onClick={() => handleTagClick(keyword)}
              >
                <TagLabel>{keyword}</TagLabel>
                <TagCloseButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setKeywords(keywords.filter((_, i) => i !== index));
                  }}
                />
              </Tag>
            ))}
          </Flex>
        )}

        {/* 카테고리 */}
        <Flex
          mb="24px"
          flexDirection={{ base: 'column', sm: 'row' }}
          alignItems="center"
          width="100%"
        >
          <Text
            fontFamily="SUIT"
            fontSize="20px"
            fontWeight="700"
            color="var(--21-purple-dark, #411461)"
            mb={{ base: '10px', sm: '0' }}
            mr={{ base: '0', sm: '30px' }}
            width={{ base: '100%', sm: 'auto' }}
          >
            카테고리
          </Text>
          <Select
            placeholder="카테고리를 선택하세요"
            borderRadius="25px"
            fontSize="14px"
            height="32px"
            width={{ base: '100%', sm: 'auto' }}
            flex="1"
            bg="#FFFFFF"
            boxShadow="0px 2px 4px 1px rgba(0, 0, 0, 0.10)"
            backdropFilter="blur(25px)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="top">상의</option>
            <option value="bottom">하의</option>
            <option value="outer">아우터</option>
            <option value="accessory">액세서리</option>
          </Select>
        </Flex>

        {/* 옷 사이즈 */}
        <Flex
          mb="24px"
          flexDirection={{ base: 'column', sm: 'row' }}
          alignItems="center"
          width="100%"
        >
          <Text
            fontFamily="SUIT"
            fontSize="20px"
            fontWeight="700"
            color="var(--21-purple-dark, #411461)"
            mb={{ base: '10px', sm: '0' }}
            mr={{ base: '0', sm: '30px' }}
            width={{ base: '100%', sm: 'auto' }}
          >
            옷 사이즈
          </Text>
          <Select
            placeholder="사이즈를 선택하세요"
            borderRadius="25px"
            fontSize="14px"
            height="32px"
            width={{ base: '100%', sm: 'auto' }}
            flex="1"
            bg="#FFFFFF"
            boxShadow="0px 2px 4px 1px rgba(0, 0, 0, 0.10)"
            backdropFilter="blur(25px)"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="small">S</option>
            <option value="medium">M</option>
            <option value="large">L</option>
            <option value="extra-large">XL</option>
          </Select>
        </Flex>

        {/* 사이즈 리뷰 */}
        <Flex
          mb="15px"
          flexDirection={{ base: 'column', sm: 'row' }}
          alignItems="flex-start"
          width="100%"
        >
          <Text
            fontFamily="SUIT"
            fontSize="20px"
            fontWeight="700"
            color="var(--21-purple-dark, #411461)"
            mb={{ base: '10px', sm: '0' }}
            mr={{ base: '0', sm: '30px' }}
            width={{ base: '100%', sm: 'auto' }}
          >
            사이즈 리뷰
          </Text>

          <Flex
            direction="column"
            width={{ base: '100%', sm: 'auto' }}
            flex="1"
          >
            <Flex
              alignItems="center"
              borderRadius="25px"
              bg="#FFF"
              mb="10px"
              boxShadow="0px 2px 4px 1px rgba(0, 0, 0, 0.10)"
              backdropFilter="blur(25px)"
              width="100%"
            >
              <Text
                fontFamily="SUIT"
                fontSize="14px"
                fontWeight="700"
                color="#411461"
                ml="16px"
                mr="5px"
                width="70px"
              >
                키:
              </Text>
              <Input
                type="number"
                placeholder="키를 입력하세요 (단위: cm)"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                borderRadius="25px"
                bg="#FFF"
                fontSize="14px"
                height="32px"
                border="none"
                flex="1"
                _focus={{
                  outline: 'none',
                  boxShadow: '0px 2px 4px 1px rgba(0, 0, 0, 0.15)',
                }}
              />
            </Flex>

            <Flex
              alignItems="center"
              borderRadius="25px"
              bg="#FFF"
              boxShadow="0px 2px 4px 1px rgba(0, 0, 0, 0.10)"
              backdropFilter="blur(25px)"
              width="100%"
            >
              <Text
                fontFamily="SUIT"
                fontSize="14px"
                fontWeight="700"
                color="#411461"
                ml="16px"
                mr="5px"
                width="70px"
              >
                몸무게:
              </Text>
              <Input
                type="number"
                placeholder="몸무게를 입력하세요 (단위: kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                borderRadius="25px"
                bg="#FFF"
                fontSize="14px"
                height="32px"
                border="none"
                flex="1"
                _focus={{
                  outline: 'none',
                  boxShadow: '0px 2px 4px 1px rgba(0, 0, 0, 0.15)',
                }}
              />
            </Flex>
          </Flex>
        </Flex>

        <Text
          mb="31px"
          color="var(--subtitle-Gray, #7D7D7D)"
          textAlign="right"
          fontFamily="SUIT"
          fontSize="12px"
          fontWeight="700"
          textDecoration="underline"
          cursor="pointer"
          onClick={handleProfileSizeClick}
        >
          프로필 사이즈 가져오기
        </Text>

        {/* 체감 사이즈 */}
        <Flex
          mb="24px"
          flexDirection={{ base: 'column', sm: 'row' }}
          alignItems="center"
          width="100%"
        >
          <Text
            fontFamily="SUIT"
            fontSize="20px"
            fontWeight="700"
            color="var(--21-purple-dark, #411461)"
            mb={{ base: '10px', sm: '0' }}
            mr={{ base: '0', sm: '30px' }}
            width={{ base: '100%', sm: 'auto' }}
          >
            체감 사이즈
          </Text>
          <Select
            placeholder="체감 사이즈를 선택하세요"
            borderRadius="25px"
            fontSize="14px"
            height="32px"
            width={{ base: '100%', sm: 'auto' }}
            flex="1"
            bg="#FFFFFF"
            boxShadow="0px 2px 4px 1px rgba(0, 0, 0, 0.10)"
            backdropFilter="blur(25px)"
            value={fitSize}
            onChange={(e) => setFitSize(e.target.value)}
          >
            <option value="small">작음</option>
            <option value="fit">딱 맞음</option>
            <option value="large">큼</option>
          </Select>
        </Flex>

        {/* 하단 버튼 */}
        <Flex justify="flex-end" width="100%" mt="55px" mb="50px" gap="15px">
          <Button
            onClick={() => navigate(-1)}
            width="124px"
            height="50px"
            flexShrink={0}
            borderRadius="25px"
            bg="var(--lightlight-Gray, #E8E8E8)"
            color="#000000"
            fontSize="20px"
            fontWeight="700"
            boxShadow="0px 2px 4px 1px rgba(0, 0, 0, 0.25)"
            backdropFilter="blur(25px)"
          >
            취소하기
          </Button>

          <Button
            width="124px"
            height="50px"
            flexShrink={0}
            borderRadius="25px"
            bg="var(--21-purple, #7C31B4)"
            color="#FFFFFF"
            fontSize="20px"
            fontWeight="700"
            boxShadow="0px 2px 4px 1px rgba(0, 0, 0, 0.25)"
            backdropFilter="blur(25px)"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            완료하기
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default PutClothes;
