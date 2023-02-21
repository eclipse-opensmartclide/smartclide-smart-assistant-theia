/*******************************************************************************
 * Copyright (C) 2021-2022 AIR Institute
 * 
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 * 
 * SPDX-License-Identifier: EPL-2.0
 ******************************************************************************/

import * as vscode from 'vscode';
import { AICodeCompletion } from './AICodeCompletion';

export function activate(context: vscode.ExtensionContext) {
	const provider1 = vscode.languages.registerCompletionItemProvider('java', {
		async provideCompletionItems(
			document: vscode.TextDocument,
			position: vscode.Position,
			token: vscode.CancellationToken,
			context: vscode.CompletionContext
		): Promise<vscode.CompletionItem[] | vscode.CompletionList> {


			const linePrefix = document
				.lineAt(position)
				.text.substr(0, position.character);
			if (!linePrefix.startsWith("import") && linePrefix.includes('http')) {
				if (linePrefix.endsWith(".")) {
					//Search Discovered URLs from OSS repos
					const path = require('path');
					const file_t = path.join(__dirname, '../src/data/data.txt');
					const fs = require('fs');
					const items = fs.readFileSync(file_t).toString().split("\n");
					let suggested_url = [];
					//extract http from user query
					const regex = /https/g;
					const http_start = linePrefix.search(regex);
					console.log('accurated:', linePrefix.search(regex));
					const http_substring = linePrefix.substr(http_start, 20);

					console.log(http_substring);
					let i: any = 0;
					for (i in items) {
						if (items[i].includes(http_substring)) {
							suggested_url.push(items[i]);
						}
					}
					const completionItems: vscode.CompletionItem[] = [];
					let max_sugg = 10;
					if (suggested_url.length < max_sugg) {
						max_sugg = suggested_url.length;
					}
					for (let i = 0; i < max_sugg; i++) {
						//remove user search query from URL
						const sugg_url = suggested_url[i].replace(http_substring, "");
						const serviceCompletion = new vscode.CompletionItem(
							sugg_url
						);
						completionItems.push(serviceCompletion);
					}
					suggested_url = [];
					return completionItems;
				}

			}

			const AICompletionOBJ = new AICodeCompletion("");
			const suggested_codel_lines = await AICompletionOBJ.getSuggestions(linePrefix);

			const completionItems: vscode.CompletionItem[] = [];
			if (linePrefix.endsWith(".")) {
				for (let i = 0; i < suggested_codel_lines.length; i++) {
					const sugg_code = suggested_codel_lines[i].replace(linePrefix, "").replace(" ;", ";");
					const codeCompletion = new vscode.CompletionItem(
						sugg_code
					);
					completionItems.push(codeCompletion);
				}
			}
			return completionItems;
		}
	}, ".");
	context.subscriptions.push(provider1);
}
