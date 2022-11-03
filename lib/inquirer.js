const inquirer = require('inquirer');
const env = require('./env');
const clc = require('cli-color');

module.exports = {
	askNameOfPresentation: () => {
		const questions = [
			{
				name: 'presentationName',
				type: 'input',
				message: 'Enter the name of your presentation: \n',
				validate: function(value){
					if (value.length){
						return true;
					} else {
						return 'Please enter the name of the presentation \n'
					}
				}
			}
		];
		return inquirer.prompt(questions).then((answers)=>{
			console.log(clc.magentaBright('The presentation name you entered is:'));
			console.log(clc.bgMagentaBright.whiteBright(answers.presentationName)+'\n');
			env.createEnvFile(answers);
		});
	},
	askAboutEngage: () =>{
		const questions = [
			{
				name: 'engageMeeting',
				type: 'confirm',
				message: 'Will this presentation be used with Engage Meeting? \n',
				default: true
			}
		];
		return inquirer.prompt(questions).then((answers)=>{
			env.createEnvFile(answers);
		});
	},
	askDevice: () => {
		const questions = [
			{
				name: 'device',
				type: 'list',
				choices: ['Windows', 'iPad', 'Both'],
				message: 'Which device is this presentation being used on?\n',
				validate: function(value){
					if (value.length){
						return true;
					} else {
						return 'Please select which device is being used.\n'
					}
				}
			},
			{
				name: "globalAssetsName",
				type: "input",
				message: "What would you like to name the global asset folder?\n"+clc.whiteBright.bgGreenBright('In order to avoid issues within Veeva, the name of this folder should be unique.  You can do something like, global-assets-NAMEOFPRESENTATION or global-assets-PRODUCT-PRESENTATIONNAME or global-assets-PRODUCT-YEAR.  This will hold all presentation assets that are used globally for this specific presentation.')+'\n',
				when(answers) {
					return answers.device === 'iPad';
				},
				validate: function(value){
					if (value.length){
						return true;
					} else {
						return 'Please enter a name for the global assets.\n'
					}
				}
			}
		];
		return inquirer.prompt(questions).then((answers)=>{
			console.log(clc.magentaBright('The device you entered is:'));
			console.log(clc.bgMagentaBright.whiteBright(answers.device)+'\n');
			if (answers.globalAssetsName){
				console.log(clc.magentaBright('The global-assets name you entered is:'));
				console.log(clc.bgMagentaBright.whiteBright(answers.globalAssetsName)+'\n');
				// set sharedResource to true
				answers.sharedResource = true;
			} else {
				answers.sharedResource = false;
				answers.globalAssetsName = '';
			}
			env.createEnvFile(answers);
		});
	},
	askNameOfProduct: () => {
		const questions = [
			{
				name: 'product',
				type: 'input',
				message: 'What product is this for? \n'+ clc.whiteBright.bgGreenBright('This should be the name of the product as it looks within Veeva Vault. There should be no spaces and it is case sensitive.')+'\n',
				validate: function(value){
					if (value.length){
						return true;
					} else {
						return 'Please enter the product name \n'
					}
				}
			},
		];
		return inquirer.prompt(questions).then((answers)=>{
			console.log(clc.magentaBright('The product you entered is:'));
			console.log(clc.bgMagentaBright.whiteBright(answers.product)+'\n');
			env.createEnvFile(answers);
		});
	},
	askAboutSlides: () => {
		const nameValues = [];
		const titleValues = [];
		const PDFnameValues = [];
		const PDFtitleValues = [];
		const valueObj = {
			"slideNames":"",
			"slideTitles":"",
			"pdfNames":"",
			"pdfTitles":""
		}
		const questions = [
			{
				name: 'slideName',
				type: 'input',
				message: 'Please enter the name of the slide.\n'+clc.whiteBright.bgGreenBright('This is the name of the file itself, not the name shown within Veeva.  It should not include any spaces, if spaces are needed, use dashes or underscores.')+'\n',
				validate: function(value){
					if (value.length){
						return true;
					} else {
						return 'Please enter the name of the slide. \n'
					}
				}
			},
			{
				name: 'slideTitle',
				type: 'input',
				message: 'Please enter the title of the slide.\n'+clc.whiteBright.bgGreenBright('This is the name that will be shown within the Veeva application when looking at the swimlane. It can contain spaces.')+'\n',
				validate: function(value){
					if (value.length){
						return true;
					} else {
						return 'Please enter the title of the slide. \n'
					}
				}
			},
			{
				name: 'isPDF',
				type: 'confirm',
				message: 'Is this slide a PDF slide?',
				validate: function(value){
					if (value){
						return true;
					} else {
						return 'Is this slide a PDF slide? \n'
					}
				}
			},
			{
				name: 'moreSlides',
				type: 'confirm',
				message: 'Do you have any more slides?',
				default: true
			}
		];
		function ask(){
			inquirer.prompt(questions).then((answers)=>{
				if(answers.isPDF){
					PDFnameValues.push(answers.slideName);
					PDFtitleValues.push(answers.slideTitle);
				} else {
					nameValues.push(answers.slideName);
					titleValues.push(answers.slideTitle);
				}

				if(answers.moreSlides){
					ask();
				} else {
					let nameVals = nameValues.join(',');
					let titleVals = titleValues.join(',');
					let PDFnameVals = PDFnameValues.join(',');
					let PDFtitleVals = PDFtitleValues.join(',');
					valueObj.slideNames = nameVals;
					valueObj.slideTitles = titleVals;
					valueObj.pdfNames = PDFnameVals;
					valueObj.pdfTitles = PDFtitleVals;
					console.log(clc.magentaBright('\nThe slide names and titles you\'ve entered are: \n')+clc.bgMagentaBright.whiteBright(JSON.stringify(valueObj))+'\n');
					env.createEnvFile(valueObj);
				}
			});
		}
		return inquirer.prompt({
			name: 'usingSlides',
			type: 'confirm',
			message: 'Do you have the final, approved names for each slide in the presentation?\n',
			default: false
		}).then((answers)=>{
			if(answers.usingSlides){
				ask();
			} else {
				console.log(clc.redBright('In order to proceed with the project setup, you must have the names of the slides for this presentation.  If the slide names are not final and you still wish to continue, know that you will need to manually update the slide names throughout the entire project later when you have the final slide names.')+'\n')
			}
		});
	}
};