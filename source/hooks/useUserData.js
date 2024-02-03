import React from 'react';
import {fetchUserData} from '../utils.js';

export default function useUserData(initialConfig) {
	const [email, setEmail] = React.useState(initialConfig.email);
	const [password, setPassword] = React.useState(initialConfig.password);
	const [credits, setCredits] = React.useState(25); // Example starting value
	const [brokerId, setBrokerId] = React.useState(0);
	const [pause, setPause] = React.useState(initialConfig.pause);

	React.useEffect(() => {
		fetchUserData(initialConfig.email)
			.then(userData => {
				console.log('Fetched user data:', userData);
				setCredits(userData.credits);
				setBrokerId(userData.brokerId);
			})
			.catch(error => {
				console.error('Failed to fetch user data:', error.message);
			});
	}, [email]); // Empty dependency array to run only on mount

	return {
		email,
		setEmail,
		password,
		setPassword,
		credits,
		setCredits,
		pause,
		setPause,
		brokerId,
	};
}
