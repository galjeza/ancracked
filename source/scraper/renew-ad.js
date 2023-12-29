const fs = require('fs');
const path = require('path');
const {setupBrowser} = require('../utils/browser-utils');
const {
	saveList,
	generateAdHash,
	downloadImage,
	wait,
} = require('../utils/utils');
const {
	AVTONETEDITPREFIX,
	AVTONET_IMAGES_PREFIX,
} = require('../utils/constants');

const loginToAvtonet = async (browser, email, password) => {
	const page = await browser.newPage();
	await page.goto('https://www.avto.net/_2016mojavtonet/');
	await page.waitForSelector('input[name=enaslov]');
	await page.type('input[name=enaslov]', email);
	await page.type('input[name=geslo]', password);
	await page.$$eval('input[type=checkbox]', checks =>
		checks.forEach(check => check.click()),
	);

	await page.$eval('button[type=submit]', button => button.click());
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
	// TODO: try just sending a post request
};

const renewAd = async (browser, adId) => {
	const carData = await getCarData(browser, adId);
	// create
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

module.exports = {
	renewAds,
};
