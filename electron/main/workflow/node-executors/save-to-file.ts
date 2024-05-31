import { jsPDF } from 'jspdf';
import fs from 'node:fs';
import { NodeletExecuteContext } from '../type';

enum FileType {
	txt = 'txt',
	pdf = 'pdf',
	md = 'md',
}
export async function saveToFile({ nodeInputs, nodeConfig, setGlobalContext }: NodeletExecuteContext) {
	const { output } = nodeInputs as { output: string };
	const { fileType, fileName, folderPath } = nodeConfig;
	switch (fileType) {
		case FileType.txt:
		case FileType.md: {
			fs.writeFile(`${folderPath}/${fileName}.${fileType}`, output, (err) => {
				if (err) {
					console.log('An error ocurred creating the file ' + err.message);
				} else {
					console.log('The file has been succesfully saved');
				}
			});
			break;
		}
		case FileType.pdf: {
			const doc = new jsPDF();
			doc.text(output, 10, 10);
			doc.save(`${folderPath}/${fileName}.pdf`);
			break;
		}
	}
}
