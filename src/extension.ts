// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from "path"
import { workspace, ExtensionContext } from "vscode"

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
} from "vscode-languageclient/node"

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(_context: ExtensionContext) {
	const lspBinaryPath = String(
		workspace.getConfiguration().get("mcfunction-lsp.lspBinaryPath")
	)
	const defaultPackFormat = String(
		workspace.getConfiguration().get("mcfunction-lsp.defaultPackFormat")
	)
	const isVerbose = Boolean(
		workspace.getConfiguration().get("mcfunction-lsp.isVerbose")
	)

	let serverOptions: ServerOptions = {
		command: lspBinaryPath,
		args: [
			"--default-pack-format",
			defaultPackFormat,
			isVerbose ? "--verbose" : "",
		],
		transport: TransportKind.stdio,
	}

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: "file", language: "mcfunction" }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
		},
	}

	// Create the language client and start the client.
	const client = new LanguageClient(
		"mcfunctionServerLanguage",
		"MCFunction Server Language",
		serverOptions,
		clientOptions
	)

	// Start the client. This will also launch the server
	client.start()
}

// This method is called when your extension is deactivated
export function deactivate() {}
