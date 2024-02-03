// AdSelectionScreen.js
import React from 'react';
import {Box, Text} from 'ink';
import AdList from './AdList.js';

export default function AdSelectionScreen({
	ads,
	toggleSelection,
	highlightedAdIndex,
}) {
	return (
		<Box flexDirection="column">
			<Text color="blue">Izberite oglase ki jih želite obnoviti. </Text>
			<Text color="yellow">
				S puščicama gor in dol se premikate po oglasih.
			</Text>
			<Text color="yellow">Pritisnite "Space" da izberete oglas. </Text>
			<Text color="green">Pritisnite "a" da izberete vse avtomobile.</Text>
			<Text color="green">Pritisnite "Enter" za zagon.</Text>
			<AdList
				ads={ads}
				onToggleSelection={toggleSelection}
				highlightedAdIndex={highlightedAdIndex}
			/>
		</Box>
	);
}
