export default class ExecutionError extends Error {
	id: string;
	constructor(id, message) {
		super(message);
		this.name = 'ExecutionError';
		this.id = id;
		this.message = message;
	}
}
