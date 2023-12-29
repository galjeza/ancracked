// MainMenu.js
import React from 'react';
import {Box, Text} from 'ink';
import chalk from 'chalk';

export default function MainMenu({options, selectedIndex, onSelect}) {
	return (
		<Box flexDirection="column" marginTop={1}>
			{options.map((option, index) => (
				<Text
					key={option}
					color={selectedIndex === index ? 'green' : 'white'}
					onPress={() => onSelect(index)}
				>
					{option}
				</Text>
			))}
		</Box>
	);
}
