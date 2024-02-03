import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const configFilePath = path.join(__dirname, 'config.json');

export function checkOrCreateConfig() {
	if (!fs.existsSync(configFilePath)) {
		const defaultConfig = {
			email: 'user@example.com',
			password: 'password123',
			pause: 60,
			brokerId: 1,
		};
		fs.writeFileSync(configFilePath, JSON.stringify(defaultConfig, null, 2));
	}
}

export function readConfig() {
	const data = fs.readFileSync(configFilePath);
	return JSON.parse(data);
}

export function updateConfig(newConfig) {
	fs.writeFileSync(configFilePath, JSON.stringify(newConfig, null, 2));
}

export async function fetchUserData(email) {
	const response = await fetch(
		`https://avtonet-server.onrender.com/user?email=${encodeURIComponent(
			email,
		)}`,
	);
	if (!response.ok) {
		throw new Error(`Error fetching user: ${response.statusText}`);
	}
	const userData = await response.json();
	return userData;
}

export async function decreaseCredit(email) {
	console.log('Decreasing credit for', email);
	const response = await fetch(
		`https://avtonet-server.onrender.com/decrementCredit?email=${encodeURIComponent(
			email,
		)}`,
		{method: 'GET'},
	);
	if (!response.ok) {
		throw new Error(`Error decreasing credit: ${response.statusText}`);
	}
}
