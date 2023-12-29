// UserInfoHeader.js
import React from 'react';
import {Box, Text} from 'ink';
import chalk from 'chalk';

export default function UserInfoHeader({email, password, credits, pause}) {
	return (
		<Box flexDirection="column" borderColor="green" borderStyle="single">
			<Text>Email: {chalk.blue(email)}</Text>
			<Text>Password: {chalk.red(password)}</Text>
			<Text>Credits: {chalk.yellow(credits.toString())}</Text>
			<Text>Pause: {chalk.magenta(pause.toString() + ' min')}</Text>
		</Box>
	);
}
