import React from 'react';
import {Text} from 'ink';
import {Box} from 'ink';
import {useInput} from 'ink';
import chalk from 'chalk';
import {updateConfig} from './utils.js';
import {fetchActiveAds} from './scraper/get-active-ads.js';
import useUserData from './hooks/useUserData.js';
import UserInfoHeader from './components/userinfoheader.js';
import MainMenu from './components/mainmenu.js';
import LoadingSpinner from './components/loader.js';
import AdSelectionScreen from './screens/AdSelectionScreen/AdSelectionScreen.js';

const Screen = {
	MAIN_MENU: 'mainMenu',
	CHANGING_EMAIL: 'adSelection',
};

export default function App({initialConfig}) {
	const {email, credits, password, pause, setEmail, setPassword, setPause} =
		useUserData(initialConfig);
	const [isChangingEmail, setIsChangingEmail] = React.useState(false);
	const [isChangingPassword, setIsChangingPassword] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const [isChangingPause, setIsChangingPause] = React.useState(false);
	const [tempEmail, setTempEmail] = React.useState('');
	const [tempPassword, setTempPassword] = React.useState('');
	const [tempPause, setTempPause] = React.useState('');
	const [isMainMenu, setIsMainMenu] = React.useState(true);
	const [zazeniSelectedIndex, setZazeniSelectedIndex] = React.useState(0);
	const [activeAds, setActiveAds] = React.useState([]);
	const [loading, setIsLoading] = React.useState(false);
	const [currentScreen, setCurrentScreen] = React.useState(Screen.MAIN_MENU);
	const [highlightedAdIndex, setHighlightedAdIndex] = React.useState(0);

	const toggleAdSelection = index => {
		setActiveAds(ads =>
			ads.map((ad, adIndex) => {
				if (adIndex === index) {
					return {...ad, isSelected: !ad.isSelected};
				}
				return ad;
			}),
		);
	};

	const options = [
		'Zaženi',
		'Posodobi email',
		'Posodobi geslo',
		'Posodobi pavzo',
		'Izhod',
		'Pomoč',
	];

	const zazeniOptions = ['Obnovi vse oglase', 'Obnovi samo izbrane oglase'];

	const handleMainMenuSelect = index => {
		setSelectedIndex(index); // Update the selected index state

		switch (options[index]) {
			case 'Zaženi':
				setIsMainMenu(false);
				setIsLoading(true);
				fetchActiveAds('16364')
					.then(ads => {
						setActiveAds(ads);
						setIsLoading(false);
						setCurrentScreen(Screen.AD_SELECTION);
					})
					.catch(error => {
						console.error('Error fetching ads:', error);
					});
				break;

			case 'Posodobi email':
				setIsChangingEmail(true);
				break;

			case 'Posodobi geslo':
				setIsChangingPassword(true);
				break;

			case 'Posodobi pavzo':
				setIsChangingPause(true);
				break;

			case 'Izhod':
				process.exit();
				break;

			case 'Pomoč':
				// Handle the 'Pomoč' option
				break;

			// Add additional cases as needed
		}
	};

	useInput((input, key) => {
		if (currentScreen === Screen.AD_SELECTION) {
			if (key.upArrow) {
				setHighlightedAdIndex(prevIndex => Math.max(prevIndex - 1, 0));
			} else if (key.downArrow) {
				setHighlightedAdIndex(prevIndex =>
					Math.min(prevIndex + 1, activeAds.length - 1),
				);
			} else if (key.space) {
				toggleAdSelection(highlightedAdIndex);
			} else if (key.return) {
				setCurrentScreen(Screen.MAIN_MENU);
			} else if (key.a) {
				setActiveAds(ads =>
					ads.map((ad, adIndex) => {
						return {...ad, isSelected: true};
					}),
				);
			}
			return; // Prevent further input handling in this screen
		}

		if (key.backspace) {
			setTempEmail(prevState => {
				return prevState.slice(0, -1);
			});
			setTempPassword(current => current.slice(0, -1));
			setTempPause(current => current.slice(0, -1));
		}
		if (key.upArrow) {
			setSelectedIndex(prev => (prev <= 0 ? 0 : prev - 1));
		}

		if (key.downArrow) {
			setSelectedIndex(prev =>
				prev >= options.length - 1 ? options.length - 1 : prev + 1,
			);
		}

		if (key.escape) {
			process.exit(); // Exit on Escape key
		}

		if (isChangingEmail) {
			if (key.return) {
				setEmail(tempEmail);
				updateConfig({...initialConfig, email: tempEmail});
				setIsChangingEmail(false);
				setTempEmail('');
			} else {
				setTempEmail(current => current + input);
			}
			return;
		}

		if (isChangingPassword) {
			if (key.return) {
				setPassword(tempPassword);
				updateConfig({...initialConfig, password: tempPassword});
				setIsChangingPassword(false);
				setTempPassword('');
			} else {
				setTempPassword(current => current + input);
			}
			return;
		}

		if (isChangingPause) {
			if (key.return) {
				setPause(parseInt(tempPause));
				updateConfig({...initialConfig, pause: parseInt(tempPause)});
				setIsChangingPause(false);
				setTempPause('');
			} else if (!isNaN(parseInt(input))) {
				setTempPause(current => current + input);
			}
			return;
		}

		if (isMainMenu) {
			if (key.return) {
				handleMainMenuSelect(selectedIndex);
			}
		}
	});

	let screenComponent = null;
	switch (currentScreen) {
		case Screen.MAIN_MENU:
			screenComponent = (
				<MainMenu
					options={options}
					selectedIndex={selectedIndex}
					onSelect={handleMainMenuSelect}
				/>
			);
			break;

		case Screen.AD_SELECTION:
			screenComponent = (
				<AdSelectionScreen
					ads={activeAds}
					onToggleSelection={toggleAdSelection}
					highlightedAdIndex={highlightedAdIndex}
				/>
			);
			break;
		// ... other cases
	}

	return (
		<Box
			flexDirection="column"
			padding={1}
			borderStyle="round"
			borderColor="cyan"
		>
			<Box justifyContent="center" marginBottom={1}>
				<Text color="greenBright">AvtonetBot</Text>
			</Box>
			<UserInfoHeader
				email={email}
				password={password}
				credits={credits}
				pause={pause}
			/>

			{loading ? (
				<LoadingSpinner />
			) : (
				<>
					{screenComponent}
					{isChangingEmail && (
						<Text color="yellow">
							Vnesite nov email naslov in pritisnite Enter:{' '}
							{chalk.blue(tempEmail)}
						</Text>
					)}
					{isChangingPassword && (
						<Text color="yellow">
							Vnesite novo geslo in pritisnite Enter: {chalk.blue(tempPassword)}
						</Text>
					)}
					{isChangingPause && (
						<Text color="yellow">
							Vnesite novo dolžino pavze (v minutah) In pritisnite Enter:{' '}
							{chalk.blue(tempPause) + ' min'}
						</Text>
					)}
				</>
			)}
		</Box>
	);
}
