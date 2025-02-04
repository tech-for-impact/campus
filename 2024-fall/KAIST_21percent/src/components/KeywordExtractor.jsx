import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Image,
  Text,
  VStack,
  Tag,
  TagLabel,
} from '@chakra-ui/react';
import OpenAI from 'openai';
import { storage } from '@/utils/firebaseConfig'; // Firebase 설정 가져오기
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function KeywordExtractor() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // URL 형태의 이미지 저장
  const [clothingName, setClothingName] = useState('');
  const [clothingStory, setClothingStory] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 파일 선택 핸들러
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
    if (!selectedImage || !clothingName || !clothingStory) {
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
      setImageUrl(uploadedImageUrl);

      // OpenAI 인스턴스 생성
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true, // 브라우저에서 실행 허용
      });

      // OpenAI API 호출
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // 이미지와 텍스트를 함께 처리할 수 있는 모델 사용
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `I have a clothing item named "${clothingName}". Here is the story: "${clothingStory}". Please provide 5 Korean adjectives that best describe this clothing item, focusing on its texture, unique characteristics, and descriptive features. The adjectives should evoke emotional feeling or interest, making people want to buy or cherish this item. Provide only 5 Korean adjective keywords, separated by commas, that are related to the clothing's texture, specific qualities, and descriptive imagery.
`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: uploadedImageUrl, // 업로드된 이미지 URL 사용
                },
              },
            ],
          },
        ],
      });

      const description = completion.choices[0].message.content;
      const keywordsArray = description.split(',').map((kw) => kw.trim());
      console.log(description);
      console.log(keywordsArray);
      setKeywords(keywordsArray);
    } catch (error) {
      console.error('키워드 추출 실패:', error);
      alert('키워드 추출에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box textAlign="center" p={4}>
      <VStack spacing={4}>
        {/* 이미지 선택 */}
        <Input type="file" accept="image/*" onChange={handleImageChange} />

        {/* 옷 이름 입력 */}
        <Input
          placeholder="옷의 별명"
          value={clothingName}
          onChange={(e) => setClothingName(e.target.value)}
          mt={4}
        />

        {/* 옷 이야기 입력 */}
        <Input
          placeholder="내 옷 속 이야기"
          value={clothingStory}
          onChange={(e) => setClothingStory(e.target.value)}
          mt={4}
        />

        {/* 선택한 이미지 미리보기 */}
        {selectedImage && (
          <Image
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            boxSize="200px"
            objectFit="cover"
            mt={4}
          />
        )}

        {/* 키워드 추출 버튼 */}
        <Button
          colorScheme="purple"
          onClick={handleExtractKeywords}
          isLoading={isLoading}
        >
          키워드 추출하기
        </Button>

        {/* 키워드 결과 */}
        {keywords.length > 0 && (
          <Box mt={4} p={4} borderWidth={1} borderRadius="md" w="100%">
            <Text fontWeight="bold">추출된 키워드:</Text>
            <Box mt={2} display="flex" flexWrap="wrap" gap={2}>
              {keywords.map((keyword, index) => (
                <Tag
                  key={index}
                  size="lg"
                  colorScheme="purple"
                  borderRadius="full"
                >
                  <TagLabel>{keyword}</TagLabel>
                </Tag>
              ))}
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default KeywordExtractor;
