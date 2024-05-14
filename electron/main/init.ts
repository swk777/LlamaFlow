import { DefaultData } from '@/constants/initialData';
import { JSONFilePreset } from 'lowdb/node';
import { addDocuments, createKnowledgeBase } from './knowledgeBase';
import { chat, newConversation } from './workflow/chat';

export function initStorage(ipcMain, workspacePath) {
	globalThis.workspacePath = workspacePath;
	JSONFilePreset(`${workspacePath}/storage.json`, DefaultData)
		.then((db) => {
			ipcMain.on('add-workflow', async (event, post) => {
				await db.read();
				db.data.workflows.push(post);
				await db.write();
			});
			ipcMain.handle('get-nodelets', async () => {
				await db.read();
				return db.data.nodelets;
			});

			ipcMain.handle('get-workflows', async () => {
				await db.read();
				return db.data.workflows;
			});
			ipcMain.handle('get-settings', async () => {
				await db.read();
				return db.data.settings;
			});

			ipcMain.handle('get-knowledgeBases', async () => {
				await db.read();
				return db.data.knowledgeBases;
			});
			ipcMain.handle('get-integrations', async () => {
				await db.read();
				return db.data.integrations;
			});
			ipcMain.handle('get-conversations', async () => {
				await db.read();
				return db.data.conversations;
			});
			ipcMain.handle('add-knowledgeBase', async (event, post) => {
				await db.read();
				const newKnowledgeBase = createKnowledgeBase(db, post);
				await db.write();
				return newKnowledgeBase;
			});
			ipcMain.handle('add-documents', async (event, post) => {
				await db.read();
				const { files, id } = post;
				await addDocuments(files, id, db);
				await db.write();
			});
			ipcMain.handle('get-conversation', async (event, post) => {
				await db.read();
				return db.data.conversations[post.id];
			});

			ipcMain.handle('save-workflows', async (event, post) => {
				await db.read();
				const { workflowIdx, workflow } = post;
				await db.update(({ workflows }) => (workflows[workflowIdx] = workflow));
				await db.read();
				return db.data.workflows;
			});
			ipcMain.handle('save-integrations', async (event, post) => {
				await db.read();
				const { integrationIdx, integration } = post;
				await db.update(({ integrations }) => (integrations[integrationIdx] = integration));
				await db.read();
				return db.data.integrations;
			});
			ipcMain.handle('chat', async (event, post) => {
				await db.read();
				const { sessionId, workflowId, query, workflow } = post;
				const conversation = await chat(sessionId, workflowId, query, workflow, db);
				return conversation?.globalContext.messages;
			});
			ipcMain.handle('new-conversation', async (event, post) => {
				await db.read();
				const { workflowId, query = '' } = post;
				return await newConversation(workflowId, query, db);
			});
			ipcMain.handle('save-settings', async (event, post) => {
				await db.read();
				const { setting } = post;
				db.data.settings = { ...db.data.settings, ...setting };
				await db.write();
			});
		})
		.catch(console.log);
}
