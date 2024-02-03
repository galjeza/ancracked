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
			<Text color="yellow">
				Izberite oglase ki jih želite obnoviti, ter ENTER da začnete z
				obnavljanjem.
			</Text>
			<Text color="yellow">Pritisnite "a" da izberete vse avtomobile.</Text>
			<AdList
				ads={ads}
				onToggleSelection={toggleSelection}
				highlightedAdIndex={highlightedAdIndex}
			/>
		</Box>
	);
}
