const { before } = require('mocha');
const vscode = require('vscode');
const fs = require('fs')

suite('vsc-haste tests', () => {
	before(() => {
		vscode.window.showInformationMessage('Starting vsc-haste tests...');
	});

	test('Upload example file to Haste', (done) => {
		// Generate a file
		var content = "this is a test";
		fs.writeFileSync("test.txt", content, 'utf8');

		// Open the file
		var openPath = vscode.Uri.file("test.txt");
		vscode.workspace.openTextDocument(openPath).then(doc => {
			// Show the file
			vscode.window.showTextDocument(doc);
		});

		try {
			// Run the upload-file command
			vscode.commands.executeCommand('extension.vsc-haste.upload-file').then(function (out) {
				done()
			})
		} catch (err) {
			done(new Error(err))
		}
	});
});
