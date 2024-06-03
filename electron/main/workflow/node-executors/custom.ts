import fs from 'node:fs';
import vm from 'node:vm';
import { NodeletExecuteContext } from '../type';

export function executeCustom(context: NodeletExecuteContext) {
	// 用户的代码字符串
	const userCode = fs.readFileSync(context.nodelet?.codePath, 'utf8');

	// 创建一个沙箱环境
	const sandbox = { execute: null };
	vm.createContext(sandbox);
	// 将用户代码载入沙箱环境
	const script = new vm.Script(userCode);
	script.runInContext(sandbox);
	sandbox.execute(context);
}
