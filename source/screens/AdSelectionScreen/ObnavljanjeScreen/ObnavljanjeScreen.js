import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {renewAd} from '../../../scraper/renew-ad';

export default function ObnavljanjeScreen({ads, email, password, pause}) {
	const [currentAdIndex, setCurrentAdIndex] = useState(0);
	const [statusMessage, setStatusMessage] = useState(
		'Pripravljam se na obnavljanje oglasov...',
	);
	const [countdown, setCountdown] = useState(0);

	useEffect(() => {
		const processAds = async () => {
			if (ads && ads.length > 0 && currentAdIndex < ads.length) {
				setStatusMessage(
					`Obnavljam oglas ${currentAdIndex + 1}/${ads.length}... `,
				);

				try {
					await renewAd(
						ads[currentAdIndex].id,
						email, // Use the email passed as a prop
						password, // Use the password passed as a prop
					);
					console.log(`Finished processing ad: ${ads[currentAdIndex].name}`);
					// Start the countdown for the pause
					setCountdown(pause * 60); // Convert minutes to seconds for the countdown
				} catch (error) {
					console.error(
						`Error processing ad: ${ads[currentAdIndex].name}`,
						error,
					);
					// If there's an error, proceed to the next ad without waiting
					setCountdown(0); // Reset the countdown to skip the pause
				}
			} else if (currentAdIndex >= ads.length) {
				setStatusMessage('Vsi oglasi so bili obnovljeni.');
			}
		};

		if (countdown > 0) {
			// Display the countdown message
			setStatusMessage(`Naslednji oglas se obnovi čez ${countdown} sekund...`);
			const timer = setTimeout(() => {
				setCountdown(countdown - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else if (countdown === 0 && currentAdIndex < ads.length) {
			// Proceed to process the next ad when the countdown is over
			processAds();
		}
	}, [ads, currentAdIndex, countdown, email, password, pause]);

	return (
		<Box flexDirection="column">
			<Text>{statusMessage}</Text>
		</Box>
	);
}
