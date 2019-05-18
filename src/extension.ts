// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate({ subscriptions }: vscode.ExtensionContext) {

	let lastChangedFile: string = "";

	// When a file changes get the name from `filepath`
	const thing = vscode.workspace.onDidChangeTextDocument((filepath) => {
		// if enabled is not defined or false then don't do anything...
		const isEnabled: boolean | undefined = vscode.workspace.getConfiguration().get("whatFile.enabled");
		if (!isEnabled) {
			return;
		}
		// Get file name
		const splitFilePath = filepath.document.fileName.split("\\");
		const fileName = splitFilePath[splitFilePath.length-1];
		// If we're not equal to what was stored last time save name of the file.
		if (fileName !== lastChangedFile) {
			lastChangedFile = fileName;
			const fileLocation: string | undefined = vscode.workspace.getConfiguration().get("whatFile.fileLocation");
			if (fileLocation) {
				fs.writeFile(fileLocation, lastChangedFile, (err) => {
					if (err) {
						console.log(fileLocation);
						vscode.window.showInformationMessage(`Invalid file location: '${fileLocation}'`);
					}
				});
			} else {
				vscode.window.showInformationMessage("No file location...");
			}
		}
	});

	subscriptions.push(thing);
}

// this method is called when your extension is deactivated
export function deactivate() {}
