import fs from 'fs';
import path from 'path';
import {setupBrowser} from './utils/browser-utils.js';
import {saveList, generateAdHash, downloadImage, wait} from './utils/utils.js';
import {AVTONETEDITPREFIX, AVTONET_IMAGES_PREFIX} from './utils/constants.js';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const loginToAvtonet = async (browser, email, password) => {
	const page = await browser.newPage();
	await page.goto('https://www.avto.net/_2016mojavtonet/');
	await wait(5);
	await page.waitForSelector('input[name=enaslov]');
	await page.type('input[name=enaslov]', email);
	await page.type('input[name=geslo]', password);
	await page.$$eval('input[type=checkbox]', checks =>
		checks.forEach(check => check.click()),
	);

	await wait(5);
	//await page.$eval('button[type=submit]', button => button.click());
	await page.waitForSelector(
		"a[href='https://www.avto.net/_2016mojavtonet/logout.asp']",
	);
	console.log('Logged in');
};

const getCarData = async (browser, adId) => {
	const page = await browser.newPage();
	const editUrl = `${AVTONETEDITPREFIX}${adId}`;
	console.log(`Navigating to ${editUrl}`);
	await page.goto(`${AVTONETEDITPREFIX}${adId}`);
	await page.waitForSelector('button[name=ADVIEW]');
	const carData = await page.$$eval('input', inputs =>
		inputs.map(input => ({
			name: input.name,
			value: input.value,
		})),
	);

	await page.goto(`${AVTONET_IMAGES_PREFIX}${adId}`);
	const images = await page.$$eval('img', imgs => imgs.map(img => img.src));
	let adImages = images.filter(img => img.includes('images.avto.net'));
	adImages = adImages.map(img => img.replace('_160', ''));
	carData.push({name: 'images', value: adImages});

	const hash = generateAdHash(carData);
	const imagesAlreadyDownloaded = await fs.existsSync(`./data/${hash}`);
	if (!imagesAlreadyDownloaded) {
		await fs.mkdirSync(`./data/${hash}`);
		console.log('Downloading images...');
		for (const [index, image] of adImages.entries()) {
			await downloadImage(
				image,
				path.join(__dirname, `../data/${hash}/${index}.jpg`),
			);
		}
	} else {
		console.log('Images already downloaded.');
	}

	return carData;
};

const createNewAd = async (browser, carData) => {
	const newAdPage = await browser.newPage();
	// go to the new ad page
	await newAdPage.goto(
		'https://www.avto.net/_2016mojavtonet/ad_select_rubric_icons.asp?SID=10000',
	);
	await newAdPage.waitForSelector('select[name=znamka]');
	await newAdPage.select(
		'select[name=znamka]',
		carData.find(data => data.name === 'znamka').value,
	);
	await newAdPage.select(
		'select[name=model]',
		carData.find(data => data.name === 'model').value,
	);
	await newAdPage.select('select[name=oblika]', '0');

	await newAdPage.select('select[name="mesec"]', '6');
	try {
		await newAdPage.select(
			'select[name="leto"]',
			carData.find(data => data.name === 'letoReg').value,
		);
	} catch (e) {
		console.log(carData.find(data => data.name === 'letoReg').value);
		console.log(e);
		await newAdPage.select('select[name="leto"]', 'NOVO vozilo');
	}

	const fuelElement = await newAdPage.waitForXPath(
		`//*[contains(text(),'${
			carData.find(data => data.name === 'gorivo').value
		}')]`,
	);
	await fuelElement.click();

	await wait(1);

	await page.click('input[name="potrdi"]');
	await page.waitForSelector('.supurl');
	await page.click('.supurl');
};

export const renewAd = async (adId, email, password) => {
	const browser = await setupBrowser();
	await loginToAvtonet(browser, email, password);
	const carData = await getCarData(browser, adId);

	await createNewAd(browser, carData);
	await wait(1000);

	await saveList(carData, `./data/${adId}.json`);
};

const renewAds = async (adIds, email, password) => {
	console.log(`Renewing ${adIds.length} ads`);
	const browser = await setupBrowser();
	await loginToAvtonet(browser, email, password);
	for (const adId of adIds) {
		await renewAd(browser, adId, email, password);
	}
	await browser.close();
};
