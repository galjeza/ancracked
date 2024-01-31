// MainMenu.js
import React from 'react';
import {Box, Text} from 'ink';
import chalk from 'chalk';

export default function MainMenu({options, selectedIndex, onSelect}) {
	const getEmojiForOption = option => {
		switch (option) {
			case 'Zaženi':
				return '🏃';
			case 'Posodobi email':
				return '📧';
			case 'Posodobi geslo':
				return '🔑';
			case 'Posodobi pavzo':
				return '⏸️';
			case 'Izhod':
				return '🚪';
			case 'Pomoč':
				return '❓';
			default:
				return '';
		}
	};

	return (
		<Box flexDirection="column" marginTop={1}>
			{options.map((option, index) => (
				<Text
					key={option}
					color={selectedIndex === index ? 'green' : 'white'}
					onPress={() => onSelect(index)}
				>
					{getEmojiForOption(option)}
					{option}
				</Text>
			))}
		</Box>
	);
}
