const inquirer = require('./inquirer');
const env = require('./env');
const fs = require('fs');
const clear = require('clear');
const clc = require('cli-color');

const run = async() => {
	await inquirer.askNameOfPresentation();
	await inquirer.askAboutEngage();
	await inquirer.askDevice();
	await inquirer.askNameOfProduct();
	await inquirer.askAboutSlides();
};
clear();
console.log(
	clc.bgBlueBright.whiteBright('The following prompts will ask you questions about your presentation and set up the proper files, folders and gulpfile structure needed for your presentation.  \nIf you have any questions, please contact Kelly Mersereau.\n')
);
run();