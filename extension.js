const vscode = require('vscode');
const haste = require('hastebin-gen')
const ncp = require("copy-paste");
const psty = require('@conorthedev/ptsy-node');
const path = require('path')
const detect = require('language-detect')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let uploadFile = vscode.commands.registerCommand('extension.vsc-haste.upload-file', function () {
		const configuration = vscode.workspace.getConfiguration();
		const code = vscode.window.activeTextEditor.document.getText()
		var currentValue = configuration.get('vsc-haste.host');
		var currentTheme = configuration.get('vsc-haste.psty.theme');

		if (currentTheme == null) {
			vscode.workspace.getConfiguration().update('vsc-haste.psty.theme', "default", vscode.ConfigurationTarget.Global);
			currentTheme = "default"
		}

		if (currentValue == null) {
			vscode.workspace.getConfiguration().update('vsc-haste.host', "https://hasteb.in", vscode.ConfigurationTarget.Global);
			currentValue = "https://hasteb.in"
		} else {
			if (currentValue == "https://psty.io") {
				vscode.window.showInformationMessage(`Uploading ${path.basename(vscode.window.activeTextEditor.document.fileName)} to ${currentValue}`);
				var ext = detect.filename(vscode.window.activeTextEditor.document.fileName).toLowerCase()

				psty(code, currentTheme, `${ext}`).then(out => {
					ncp.copy(out, function () {
						vscode.window.showInformationMessage(`URL: ${out} - Copied to clipboard!`);
					})
				}).catch(error => {
					vscode.window.showErrorMessage(`Failed to upload ${path.basename(vscode.window.activeTextEditor.document.fileName)}to ${currentValue} - Error: ${error}`);
				});
			} else {
				vscode.window.showInformationMessage(`Uploading ${path.basename(vscode.window.activeTextEditor.document.fileName)} to ${currentValue}`);
				var ext = path.extname(path.basename(vscode.window.activeTextEditor.document.fileName)).replace('.', '')

				if (ext == null) {
					ext = "txt"
				}

				haste(code, { url: currentValue, extension: `${ext}` }).then(out => {
					ncp.copy(out, function () {
						console.log(`URL: ${out} - Copied to clipboard!`)
						vscode.window.showInformationMessage(`URL: ${out} - Copied to clipboard!`);
					})
				}).catch(error => {
					vscode.window.showErrorMessage(`Failed to upload ${path.basename(vscode.window.activeTextEditor.document.fileName)}to ${currentValue} - Error: ${error}`);
				});
			}
		}
	});

	let uploadSelection = vscode.commands.registerCommand('extension.vsc-haste.upload-file-select', function () {
		const configuration = vscode.workspace.getConfiguration();
		const code = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection)

		var currentValue = configuration.get('vsc-haste.host');
		var currentTheme = configuration.get('vsc-haste.psty.theme');

		if (currentTheme == null) {
			vscode.workspace.getConfiguration().update('vsc-haste.psty.theme', "default", vscode.ConfigurationTarget.Global);
			currentTheme = "default"
		}

		if (currentValue == null) {
			vscode.workspace.getConfiguration().update('vsc-haste.host', "https://hasteb.in", vscode.ConfigurationTarget.Global);
			currentValue = "https://hasteb.in"
		} else {
			if (currentValue == "https://psty.io") {
				vscode.window.showInformationMessage(`Uploading selected code to ${currentValue}`);
				var ext = detect.filename(vscode.window.activeTextEditor.document.fileName).toLowerCase()

				psty(code, currentTheme, `${ext}`).then(out => {
					ncp.copy(out, function () {
						console.log(`URL: ${out} - Copied to clipboard!`)
						vscode.window.showInformationMessage(`URL: ${out} - Copied to clipboard!`);
					})
				}).catch(error => {
					vscode.window.showErrorMessage(`Failed to upload selected code to ${currentValue} - Error: ${error}`);
				});
			} else {
				vscode.window.showInformationMessage(`Uploading selected code to ${currentValue}`);
				var ext = path.extname(path.basename(vscode.window.activeTextEditor.document.fileName)).replace('.', '')

				if (ext == null) {
					ext = "txt"
				}

				haste(code, { url: currentValue, extension: `${ext}` }).then(out => {
					ncp.copy(out, function () {
						console.log(`URL: ${out} - Copied to clipboard!`)
						vscode.window.showInformationMessage(`URL: ${out} - Copied to clipboard!`);
					})
				}).catch(error => {
					vscode.window.showErrorMessage(`Failed to upload selected code to ${currentValue} - Error: ${error}`);
				});
			}
		}
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
