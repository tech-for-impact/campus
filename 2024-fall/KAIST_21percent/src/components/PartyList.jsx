/* 
-------- NOT USING THIS FILE ANYMORE -----------
-------- DID NOT DELETE IT JUST IN CASE CONFLICT REFERENCE IS NEEDED -------

import { React, useState } from 'react';
import { Box, Text, Flex, Image } from '@chakra-ui/react';
import PartyListItem from './PartyListItem';

function PartyList({ onPartyClick, isExpanded, partyListData }) {
  const [favorites, setFavorites] = useState([]);

  const handleToggleFavorite = (partyId) => {
    setFavorites(
      (prevFavorites) =>
        prevFavorites.includes(partyId)
          ? prevFavorites.filter((id) => id !== partyId) // Remove if already favorite
          : [...prevFavorites, partyId] // Add if not favorite
    );
  };

  return (
    <Box px={4} pt={0}>
      <Flex justifyContent="space-between" alignItems="center" mb={4} px={2}>
        <Text fontSize="2xl" fontWeight="bold">
          내게 가까운 파티들
        </Text>
        <Text fontSize="md" color="purple.500">
          거리순 ▼
        </Text>
      </Flex>


      <Box
        overflowY="auto"
        maxHeight={isExpanded ? 'calc(80vh - 120px)' : 'calc(35vh - 120px)'}
        px={2}
      >
        {partyListData.map((party) => (
          <PartyListItem
            key={party.id}
            onPartyClick={onPartyClick}
            party={party}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.includes(party.id)}
          />
        ))}
      </Box>
    </Box>
  );
}

export default PartyList;
 */
