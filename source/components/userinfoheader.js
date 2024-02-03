// UserInfoHeader.js
import React from 'react';
import {Box, Text} from 'ink';
import chalk from 'chalk';

export default function UserInfoHeader({email, password, credits, pause}) {
	return (
		<Box flexDirection="column">
			<Text>Email: {chalk.blue(email)}</Text>
			<Text>Geslo: {chalk.red(password)}</Text>
			<Text>Krediti: {chalk.yellow(credits.toString())}</Text>
			<Text>Pavza: {chalk.magenta(pause.toString() + ' min')}</Text>
		</Box>
	);
}
