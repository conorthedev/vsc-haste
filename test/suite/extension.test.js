const { before } = require('mocha');
const vscode = require('vscode');
const fs = require('fs')
const path = require('path')

suite('vsc-haste tests', () => {
	before(() => {
		vscode.window.showInformationMessage('Starting vsc-haste tests...');
	});

	test('Upload example file to Haste', (done) => {
		// Generate a file
		const newFile = vscode.Uri.parse('untitled:' + 'testatestsdsfsdjsdf.txt');
		vscode.workspace.openTextDocument(newFile).then(document => {
			const edit = new vscode.WorkspaceEdit();
			edit.insert(newFile, new vscode.Position(0, 0), "Hello world!");
			return vscode.workspace.applyEdit(edit).then(success => {
				if (success) {
					vscode.window.showTextDocument(document);
					try {
						// Run the upload-file command
						vscode.commands.executeCommand('extension.vsc-haste.upload-file').then(() => {
							done()
						})
					} catch (err) {
						done(new Error(err))
					}
				} else {
					vscode.window.showInformationMessage('Error!');
					done(new Error("Error whilst creating new file"))
				}
			});
		});
	});
});
