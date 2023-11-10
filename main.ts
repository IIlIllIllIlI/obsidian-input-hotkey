import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class InputHotkey extends Plugin {
	settings: MyPluginSettings;

	inputModeOn : boolean = false;
	hasTyped : boolean = false;
	tmpStr : String = "";

	async onload() {
		await this.loadSettings();

		// const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		// if (view) {
		// 	const cursor = view.editor.getCursor();
		// 	view.editor.
		// }


		const ribbonIconEl = this.addRibbonIcon('keyboard', 'Input Hotkey', (evt: MouseEvent) => {
			if (this.inputModeOn) {
				new Notice('Input mode turned off!');
			} else {
				new Notice('Input mode turned on!');
			}
			this.inputModeOn = !this.inputModeOn
			
		});
		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "toggle-input-hotkey",
			name: "toggle input hotkey On/Off",
			callback: () => {
				if (this.inputModeOn) {
					new Notice('Input mode turned off!');
				} else {
					new Notice('Input mode turned on!');
				}
				this.inputModeOn = !this.inputModeOn
			},
		});

		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });



		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });

		
		
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click！！！！！', evt);
		// 	new Notice("click!!!");
		// });

		// keydown keypress keyup
		this.registerDomEvent(document, 'keyup', (evt: KeyboardEvent) => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (view) {
				if (this.inputModeOn && this.hasTyped) {

					this.tmpStr = this.tmpStr.slice(0, -3);
					this.tmpStr += "\`";
					view.editor.replaceSelection(" " + this.tmpStr + " ");  //可自定义的 wrapper TODO

					// this.inputModeOn = false;
					// this.hasTyped = false;
					// this.tmpStr = "";
				}
			}
		}, true);

		this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (view) {
				// const cursor = view.editor.getCursor();
			
				// TODO   Obsidian 的内置快捷键(command) 优先级更高   先触发内置快捷键效果再出发这里定义的效果
				if (this.inputModeOn) {
					evt.preventDefault();  // 阻挡输入
					evt.stopPropagation();

					// if (evt.key === "Control" || evt.key === "Shift" || evt.key === "Alt") {
					// 	return;
					// }

					// if (evt.ctrlKey &&evt.key === "a") {
					// 	evt.preventDefault();  // 阻挡输入
					// 	view.editor.replaceSelection(" ctrl + a ");
						
					// 	return false;
					// }

					// if (evt.metaKey) {
					// 	evt.preventDefault();  // 阻挡输入
					// 	return;
					// }

					if (this.hasTyped) {
						return;
					}
					
					this.tmpStr += "\`";
					if (evt.ctrlKey) {
						this.tmpStr += "Ctrl + ";
					} 

					if (evt.shiftKey) {
						this.tmpStr += "Shift + ";
					}

					if (evt.altKey) {
						this.tmpStr += "Alt + ";
					}

					if (evt.key !== "Control" && evt.key !== "Shift" && evt.key !== "Alt") {
						this.tmpStr += evt.key;
					}
					
	
					
					this.hasTyped = true;
				}
			}
			
		}, true);	// true means use capture phase of event


		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}