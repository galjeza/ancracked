// LoadingSpinner.js
import React, {useEffect, useState} from 'react';
import {Text} from 'ink';

const spinnerFrames = ['-', '\\', '|', '/'];

export default function LoadingSpinner() {
	const [frameIndex, setFrameIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setFrameIndex(
				currentFrameIndex => (currentFrameIndex + 1) % spinnerFrames.length,
			);
		}, 100); // Change the frame every 100 ms

		return () => clearInterval(timer); // Cleanup on unmount
	}, []);

	return <Text>{spinnerFrames[frameIndex]} Nalagam...</Text>;
}
