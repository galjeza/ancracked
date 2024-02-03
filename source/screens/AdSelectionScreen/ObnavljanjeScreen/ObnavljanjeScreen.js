import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {renewAd} from '../../../scraper/renew-ad.js';
import {decreaseCredit} from '../../../utils.js';

export default function ObnavljanjeScreen({
	ads,
	email,
	password,
	pause,
	setCredits,
}) {
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

				// BUG dvakrat se klice

				try {
					//await renewAd(ads[currentAdIndex].adId, email, password);
					await decreaseCredit(email);
					setCredits(prevstate => {
						return prevstate - 1;
					});
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
