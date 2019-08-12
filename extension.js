const vscode = require("vscode");
const haste = require("hastebin-gen");
const ncp = require("copy-paste");
const psty = require("@conorthedev/ptsy-node");
const path = require("path");
const detect = require("language-detect");

const extension = vscode.extensions.getExtension("ConorTheDev.vsc-haste");

/**
 * Upload code to psty / a haste based host
 * @param {string} host
 * @param {string} code
 * @param {string} fileName
 * @param {string} theme
 */
async function upload(host, code, fileName, theme) {
	let uploadPromise = undefined;

	if (host === "https://psty.io") {
		uploadPromise = psty(code, theme, detect.filename(fileName).toLowerCase());
	} else {
		const ext = path.extname(fileName).replace(".", "") || "txt";
		uploadPromise = haste(code, { url: host, extension: ext });
	}

	let url;

	try {
		url = await uploadPromise;
	} catch (err) {
		vscode.window.showErrorMessage(`Failed to upload code to ${host} - Error: ${err}`);
		console.error(err);
		return;
	}

	ncp.copy(url, function(err) {
		if (err) {
			vscode.window.showErrorMessage(`Failed to copy URL to clipboard - Error: ${err}`);
			console.error(err);
			return;
		}

		vscode.window.showInformationMessage(`URL: ${url} - Copied to clipboard!`);
		console.log(`${extension.packageJSON.displayName}: URL: ${url} - Copied to clipboard!`);
	});
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log(`${extension.packageJSON.displayName}: Loaded ${extension.packageJSON.publisher}.${extension.packageJSON.displayName} v${extension.packageJSON.version}`);

	const uploadFile = vscode.commands.registerCommand("extension.vsc-haste.upload-file", function () {
		const configuration = vscode.workspace.getConfiguration();
		const code = vscode.window.activeTextEditor.document.getText().trim();
		const fileName = path.basename(vscode.window.activeTextEditor.document.fileName);
		const host = configuration.get("vsc-haste.host") || "https://hasteb.in";
		const theme = configuration.get("vsc-haste.psty.theme") || "default";

		if (code.length === 0) {
			vscode.window.showErrorMessage("This file is empty! Put some code in this file and try again");
			return;
		}

		vscode.window.showInformationMessage(`Uploading ${fileName} to ${host}`);
		upload(host, code, fileName, theme);
	});

	const uploadSelection = vscode.commands.registerCommand("extension.vsc-haste.upload-file-select", function () {
		const configuration = vscode.workspace.getConfiguration();
		const code = vscode.window.activeTextEditor.document.getText(vscode.window.activeTextEditor.selection).trim();
		const fileName = path.basename(vscode.window.activeTextEditor.document.fileName);
		const host = configuration.get("vsc-haste.host") || "https://hasteb.in";
		const theme = configuration.get("vsc-haste.psty.theme") || "default";

		if (code.length === 0) {
			vscode.window.showErrorMessage("You have selected no code! Select some code and try again");
			return;
		}

		vscode.window.showInformationMessage(`Uploading selected code in ${fileName} to ${host}`);
		upload(host, code, fileName, theme);
	});

	context.subscriptions.push(uploadFile, uploadSelection);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
