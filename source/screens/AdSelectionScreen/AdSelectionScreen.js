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
			<Text color="yellow">Izberite oglase ki jih želite obnoviti.</Text>
			<Text color="yellow">Press 'a' to deselect all ads.</Text>
			<AdList
				ads={ads}
				onToggleSelection={toggleSelection}
				highlightedAdIndex={highlightedAdIndex}
			/>
		</Box>
	);
}
