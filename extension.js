const vscode = require('vscode');
const haste = require('hastebin-gen')
const ncp = require("copy-paste");
const psty = require('@conorthedev/ptsy-node');
const path = require('path')
const detect = require('language-detect')

const extension = vscode.extensions.getExtension('ConorTheDev.vsc-haste')

/**
 * Upload code to psty / a haste based host
 * @param {String} host 
 * @param {String} code 
 * @param {Array} data 
 */
function upload(host, code, data = {}, filename) {
	if (host == "https://psty.io") {
		var ext = detect.filename(filename).toLowerCase()

		psty(code, data['theme'], `${ext}`).then(out => {
			ncp.copy(out, function () {
				console.log(`${extension.packageJSON.displayName}: URL: ${out} - Copied to clipboard!`)
				vscode.window.showInformationMessage(`URL: ${out} - Copied to clipboard!`);
			})
		}).catch(error => {
			vscode.window.showErrorMessage(`Failed to upload selected code to ${host} - Error: ${error}`);
		});
	} else {
		var ext = path.extname(filename).replace('.', '')

		if (ext == null) {
			ext = "txt"
		}

		haste(code, { url: host, extension: `${ext}` }).then(out => {
			ncp.copy(out, function () {
				console.log(`${extension.packageJSON.displayName}: URL: ${out} - Copied to clipboard!`)
				vscode.window.showInformationMessage(`URL: ${out} - Copied to clipboard!`);
			})
		}).catch(error => {
			vscode.window.showErrorMessage(`Failed to upload selected code to ${host} - Error: ${error}`);
		});
	}
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log(`${extension.packageJSON.displayName}: Loaded ${extension.packageJSON.publisher}.${extension.packageJSON.displayName} v${extension.packageJSON.version}`)

	let uploadFile = vscode.commands.registerCommand('extension.vsc-haste.upload-file', function () {
		const configuration = vscode.workspace.getConfiguration();
		const code = vscode.window.activeTextEditor.document.getText()
		const filename = path.basename(vscode.window.activeTextEditor.document.fileName)

		var host = configuration.get('vsc-haste.host');
		var theme = configuration.get('vsc-haste.psty.theme');

		if (theme == null) {
			vscode.workspace.getConfiguration().update('vsc-haste.psty.theme', "default", vscode.ConfigurationTarget.Global);
			theme = "default"
		}

		if (host == null) {
			vscode.workspace.getConfiguration().update('vsc-haste.host', "https://hasteb.in", vscode.ConfigurationTarget.Global);
			currentValue = "https://hasteb.in"
		}


		if (code == "") {
			vscode.window.showErrorMessage(`This file is empty! Put some code in this file and try again`);
			return;
		}

		vscode.window.showInformationMessage(`Uploading ${filename} to ${host}`);
		upload(host, code, { 'theme': theme }, filename)
	});

	let uploadSelection = vscode.commands.registerCommand('extension.vsc-haste.upload-file-select', function () {
		const configuration = vscode.workspace.getConfiguration();
		const code = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection)
		const filename = path.basename(vscode.window.activeTextEditor.document.fileName)

		var host = configuration.get('vsc-haste.host');
		var theme = configuration.get('vsc-haste.psty.theme');

		if (theme == null) {
			vscode.workspace.getConfiguration().update('vsc-haste.psty.theme', "default", vscode.ConfigurationTarget.Global);
			theme = "default"
		}

		if (host == null) {
			vscode.workspace.getConfiguration().update('vsc-haste.host', "https://hasteb.in", vscode.ConfigurationTarget.Global);
			currentValue = "https://hasteb.in"
		}

		if (code == "") {
			vscode.window.showErrorMessage(`You have selected no code! Select some code and try again`);
			return;
		}

		vscode.window.showInformationMessage(`Uploading selected code in ${filename} to ${host}`);
		upload(host, code, { 'theme': theme }, filename)
	});

	context.subscriptions.push(uploadFile);
	context.subscriptions.push(uploadSelection);
}

exports.activate = activate;

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
