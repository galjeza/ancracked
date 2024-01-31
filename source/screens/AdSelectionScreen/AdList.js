// AdsList.js
import React from 'react';
import {Box, Text} from 'ink';

export default function AdList({ads, onToggleSelection, highlightedAdIndex}) {
	return (
		<Box flexDirection="column" marginTop={1}>
			{ads.map((ad, index) => (
				<Box key={ad.IDoglasa}>
					<Text
						onPress={() => onToggleSelection(index)}
						color={
							index === highlightedAdIndex
								? 'blue'
								: ad.isSelected
								? 'green'
								: 'white'
						}
					>
						{ad.isSelected ? '[x] ' : '[ ] '} {ad.name}
					</Text>
				</Box>
			))}
		</Box>
	);
}
