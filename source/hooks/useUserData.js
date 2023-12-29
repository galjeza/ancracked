import React from 'react';
import {fetchUserData} from '../utils.js';

export default function useUserData(initialConfig) {
	const [email, setEmail] = React.useState(initialConfig.email);
	const [password, setPassword] = React.useState(initialConfig.password);
	const [credits, setCredits] = React.useState(25); // Example starting value
	const [pause, setPause] = React.useState(initialConfig.pause);

	React.useEffect(() => {
		fetchUserData(initialConfig.email)
			.then(userData => {
				setCredits(userData.credits);
				// ... handle other user data ...
			})
			.catch(error => {
				console.error('Failed to fetch user data:', error.message);
				// ... handle error ...
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
	};
}
