import { React, useEffect, useState } from 'react';
import { Box, IconButton, Image, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import PartySearchBottomSheetHeader from './PartySearchBottomSheetHeader';
import PartyListItem from '../components/PartyListItem';
import { useNavigate } from 'react-router-dom';
import {
  useBottomSheet,
  MAX_Y,
  MIN_Y,
  BOTTOM_SHEET_HEIGHT,
} from '../hooks/useBottomSheet';
import { Icon as IconifyIcon } from '@iconify/react';

const MotionBox = motion.create(Box);

function PartySearchBottomSheet({
  isExpanded,
  setIsExpanded,
  selectedParty,
  setSelectedParty,
  handlePartyClick,
  clearSelection,
  goToCurrentLocation,
  partyList,
}) {
  const { sheetRef, contentRef } = useBottomSheet(setIsExpanded, selectedParty);

  const navigate = useNavigate(); // to navigate when a party is clicked

  useEffect(() => {
    setSelectedParty(selectedParty);
    console.log('Selected Party:', selectedParty); // Debugging line
  }, [selectedParty, setSelectedParty]);

  // State to dynamically handle MAX_Y and BOTTOM_SHEET_HEIGHT
  // because window.innerHeight keeps giving wrong values at initial mounting!!!
  const [maxY, setMaxY] = useState(MAX_Y);
  const [bottomSheetH, setBottomSheetH] = useState(BOTTOM_SHEET_HEIGHT);

  useEffect(() => {
    // Recalculate maxY on mount
    setMaxY(window.innerHeight - 400);
    setBottomSheetH(window.innerHeight - MIN_Y);

    // Optional: Handle window resize dynamically
    const handleResize = () => {
      setMaxY(window.innerHeight - 400);
      setBottomSheetH(window.innerHeight - MIN_Y);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!sheetRef.current) {
      console.log('sheetRef is null or undefined during effect');
      return;
    }

    /* console.log('Effect running: isExpanded =', isExpanded);
    console.log('sheetRef:', sheetRef.current);
    console.log('MAX_Y:', MAX_Y);
    console.log('maxY:', maxY); */

    if (isExpanded) {
      // Move sheet to expanded position
      sheetRef.current.style.setProperty(
        'transform',
        `translateY(${MIN_Y - maxY}px)`
      );
    } else {
      // Move sheet to collapsed position
      sheetRef.current.style.setProperty('transform', 'translateY(0)');
    }
  }, [sheetRef, isExpanded, maxY]); // Run whenever isExpanded changes

  return (
    <>
      {!isExpanded && (
        <Button
          w="50px"
          h="50px"
          alignContent="center"
          justifyContent="center"
          position="absolute"
          bottom="calc(40vh + 21px)"
          zIndex="8"
          borderRadius="full"
          boxShadow="md"
          onClick={goToCurrentLocation}
          bg="white"
          aria-label="현재 위치로 이동"
          m="20px"
          p="0px"
        >
          <IconifyIcon
            icon={'lsicon:map-location-filled'}
            style={{ color: '#7C31B4' }}
            width="30px"
            height="30px"
          />
        </Button>
      )}
      <MotionBox
        ref={sheetRef}
        display="flex"
        flexDirection="column"
        position="fixed"
        zIndex="9"
        top={maxY}
        left="0"
        right="0"
        borderTopRadius="30px"
        bg="var(--background-silver, #FAF9FF)"
        boxShadow="0px -10px 70px 0px rgba(0, 0, 0, 0.25)"
        h={`${bottomSheetH}px`}
        style={{
          transform: `translateY(${maxY}px)`,
        }}
        // transition="transform 5s ease-out"
      >
        <>
          <PartySearchBottomSheetHeader />
          <Box
            ref={contentRef}
            overflow="auto"
            sx={{
              WebkitOverflowScrolling: 'touch', // For smooth scrolling on iOS
              padding: '0 32px', // Optional padding for inner content
              paddingBottom: '100px',
            }}
            flex="1" // To take up remaining space within the MotionBox
          >
            {partyList.map((party) => (
              <PartyListItem
                key={party.id}
                onPartyClick={() => {
                  navigate(`/party/${party.id}`);
                }} // to party page
                party={party}
              />
            ))}
          </Box>
        </>
      </MotionBox>
    </>
  );
}

export default PartySearchBottomSheet;
