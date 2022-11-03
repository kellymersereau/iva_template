const fs = require('fs');
const os = require('os');

module.exports = {
	createEnvFile: function(value){
		for(const key in value){
			this.setEnvValue(key, value[key]);
		}
	},
	setEnvValue: function(key,value){
		const ENV_VARS = fs.readFileSync("./.env", "utf8").split(os.EOL);
		// Find the env we want based on the key
		const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
			return line.match(new RegExp(key));
		}));
		// replace the key/value with the new value
		if (/\s/.test(value)){
			ENV_VARS.splice(target, 1, `${key}="${value}"`);
		} else {
			ENV_VARS.splice(target, 1, `${key}=${value}`);
		}

		// write everything back to the file system
		fs.writeFileSync("./.env", ENV_VARS.join(os.EOL));
	}
}