const vscode = require('vscode');
const haste = require('hastebin-gen')
const ncp = require("copy-paste");
const psty = require('@conorthedev/ptsy-node');
const path = require('path')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('vsc-haste active!');

	let uploadFile = vscode.commands.registerCommand('extension.vsc-haste.upload-file', function () {
		const configuration = vscode.workspace.getConfiguration();
		const code = vscode.window.activeTextEditor.document.getText()
		var currentValue = configuration.get('vsc-haste.host');

		if (currentValue == null) {
			vscode.workspace.getConfiguration().update('vsc-haste.host', "https://hasteb.in", vscode.ConfigurationTarget.Global);
			currentValue = "https://hasteb.in"
		} else {
			if (currentValue == "https://psty.io") {
				vscode.window.showInformationMessage(`Uploading ${path.basename(vscode.window.activeTextEditor.document.fileName)} to ${currentValue}`);

				psty(code).then(out => {
					ncp.copy(out, function () {
						console.log(`URL: ${out} - Copied to clipboard!`)
						vscode.window.showInformationMessage(`URL: ${out} - Copied to clipboard!`);
					})
				}).catch(error => {
					// Handle error
					vscode.window.showErrorMessage(`Failed to upload ${path.basename(vscode.window.activeTextEditor.document.fileName)}to ${currentValue} - Error: ${error}`);
				});
			} else {
				vscode.window.showInformationMessage(`Uploading ${path.basename(vscode.window.activeTextEditor.document.fileName)} to ${currentValue}`);

				haste(code, { url: currentValue, extension: "txt" }).then(out => {
					ncp.copy(out, function () {
						console.log(`URL: ${out} - Copied to clipboard!`)
						vscode.window.showInformationMessage(`URL: ${out} - Copied to clipboard!`);
					})
				}).catch(error => {
					// Handle error
					vscode.window.showErrorMessage(`Failed to upload ${path.basename(vscode.window.activeTextEditor.document.fileName)}to ${currentValue} - Error: ${error}`);
				});
			}
		}
	});

	let uploadSelection = vscode.commands.registerCommand('extension.vsc-haste.upload-file-select', function () {
		const configuration = vscode.workspace.getConfiguration();
		const code = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection)
		var currentValue = configuration.get('vsc-haste.host');

		if (currentValue == null) {
			vscode.workspace.getConfiguration().update('vsc-haste.host', "https://hasteb.in", vscode.ConfigurationTarget.Global);
			currentValue = "https://hasteb.in"
		} else {
			if (currentValue == "https://psty.io") {
				const code = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection)
				vscode.window.showInformationMessage(`Uploading selected code to ${currentValue}`);

				psty(code).then(out => {
					ncp.copy(out, function () {
						console.log(`URL: ${out} - Copied to clipboard!`)
						vscode.window.showInformationMessage(`URL: ${out} - Copied to clipboard!`);
					})
				}).catch(error => {
					// Handle error
					vscode.window.showErrorMessage(`Failed to upload selected code to ${currentValue} - Error: ${error}`);
				});
			} else {
				const code = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection)
				vscode.window.showInformationMessage(`Uploading selected code to ${currentValue}`);

				haste(code, { url: currentValue, extension: "txt" }).then(out => {
					ncp.copy(out, function () {
						console.log(`URL: ${out} - Copied to clipboard!`)
						vscode.window.showInformationMessage(`URL: ${out} - Copied to clipboard!`);
					})
				}).catch(error => {
					// Handle error
					vscode.window.showErrorMessage(`Failed to upload selected code to ${currentValue} - Error: ${error}`);
				});
			}
		}
	});

	context.subscriptions.push(uploadFile);
	context.subscriptions.push(uploadSelection);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
