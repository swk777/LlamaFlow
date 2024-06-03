import fs from 'node:fs';
import path from 'node:path';
function readExtensions(extensionsDir) {
	const extensions = [];

	fs.readdirSync(extensionsDir).forEach((folder) => {
		const extensionPath = path.join(extensionsDir, folder);
		if (fs.lstatSync(extensionPath).isDirectory()) {
			const mainJsPath = path.join(extensionPath, 'main.js');
			const configJsonPath = path.join(extensionPath, 'config.json');

			if (fs.existsSync(mainJsPath) && fs.existsSync(configJsonPath)) {
				const configContent = fs.readFileSync(configJsonPath, 'utf8');
				let config;
				try {
					config = JSON.parse(configContent);
				} catch (error) {
					console.error(`Error parsing JSON in ${configJsonPath}:`, error);
					config = null;
				}

				extensions.push({
					extensionFolderName: folder,
					codePath: mainJsPath,
					config: config,
				});
			}
		}
	});

	return extensions;
}
const refreshNodelets = (extensions, db) => {
	// 遍历所有扩展
	for (const extension of extensions) {
		const { codePath, config } = extension;
		const extensionId = config.id;
		const nodeletIndex = db.data.nodelets.findIndex((nodelet) => nodelet.id === extensionId);
		if (nodeletIndex === -1) {
			db.data.nodelets.push({ ...extension.config, codePath });
		} else {
			db.data.nodelets[nodeletIndex] = { ...extension.config, codePath };
		}
	}
};
export function refreshExtension(db) {
	const workspacePath = globalThis.workspacePath;
	const extensionPath = workspacePath + '/extensions';
	const extensions = readExtensions(extensionPath);
	refreshNodelets(extensions, db);
	db.data.extensions = extensions;
}
