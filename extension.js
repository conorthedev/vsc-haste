// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// The module 'hastebin-gen' contains the Hastebin API in Node
// Import the module and reference it with the alias haste in your code below
const haste = require('hastebin-gen')

// The module 'copy-paste' contains the API for copying and pasting
// Import the module and reference it with the alias ncp in your code below
const ncp = require("copy-paste");

const psty = require('../vsc-haste/api/psty')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('vsc-haste active!');

	/**
	 * Fired when the user wants to upload the entire current file
	 */
	let uploadFile = vscode.commands.registerCommand('extension.vsc-haste.upload-file', function () {
		const configuration = vscode.workspace.getConfiguration();
		const code = vscode.window.activeTextEditor.document.getText()
		var currentValue = configuration.get('vsc-haste.host');

		if (currentValue == null) {
			vscode.workspace.getConfiguration().update('vsc-haste.host', "https://hasteb.in", vscode.ConfigurationTarget.Global);
			currentValue = "https://hasteb.in"
		} else {
			if (currentValue == "https://psty.io") {
				vscode.window.showInformationMessage(`Uploading selected code to ${currentValue}`);

				psty(code).then(out => {
					ncp.copy(out, function () {
						vscode.window.showInformationMessage(`URL: ${out} - Copied to clipboard!`);
					})
				});
			} else {
				vscode.window.showInformationMessage(`Uploading selected code to hasteb.in`);

				haste(code, { url: currentValue, extension: "txt" }).then(out => {
					ncp.copy(out, function () {
						vscode.window.showInformationMessage(`URL: ${out} - Copied to clipboard!`);
					})
				})
			}
		}
	});

	/**
	 * Fired when the user wants to upload a selection of the current file
	 */
	let uploadSelection = vscode.commands.registerCommand('extension.vsc-haste.upload-file-select', function () {
		const configuration = vscode.workspace.getConfiguration();
		const code = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection)
		var currentValue = configuration.get('vsc-haste.host');

		if (currentValue == null) {
			vscode.workspace.getConfiguration().update('vsc-haste.host', "https://hasteb.in", vscode.ConfigurationTarget.Global);
			currentValue = "https://hasteb.in"
		} else {
			if (currentValue == "https://psty.io") {
				vscode.window.showInformationMessage(`Uploading ${vscode.window.activeTextEditor.document.fileName} to ${currentValue}`);

				psty(code).then(out => {
					ncp.copy(out, function () {
						vscode.window.showInformationMessage(`URL: ${out} - Copied to clipboard!`);
					})
				});
			} else {
				vscode.window.showInformationMessage(`Uploading ${vscode.window.activeTextEditor.document.fileName} to ${currentValue}`);

				haste(code, { url: currentValue, extension: "txt" }).then(out => {
					ncp.copy(out, function () {
						vscode.window.showInformationMessage(`Uploaded ${vscode.window.activeTextEditor.document.fileName} to ${currentValue}`);
					})
				})
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
