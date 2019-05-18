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
		const fileLocation: string | undefined = vscode.workspace.getConfiguration().get("whatFile.fileLocation");

		if (!isEnabled) {
			return;
		} else if (!fileLocation) {
			vscode.window.showInformationMessage("No file location in settings: Set `whatFile.fileLocation`");
			return;
		}

		// Get the file name in the settings
		const splitFilePathConfig = fileLocation.split("\\");
		const fileNameConfig = splitFilePathConfig[splitFilePathConfig.length-1];
		// Get file name
		const splitFilePath = filepath.document.fileName.split("\\");
		const fileName = splitFilePath[splitFilePath.length-1];

		// Fix bug where if the file (the one being written) is open
		// in vscode it would set its self as it was detected as a modification
		if (fileNameConfig === fileName) {
			return;
		}
		
		// If we're not equal to what was stored last time save name of the file.
		if (fileName !== lastChangedFile) {
			lastChangedFile = fileName;
			fs.writeFile(fileLocation, lastChangedFile, (err) => {
				if (err) {
					vscode.window.showInformationMessage(`Invalid file location: '${fileLocation}'`);
				}
			});
		}
	});

	subscriptions.push(thing);
}

// this method is called when your extension is deactivated
export function deactivate() {}
