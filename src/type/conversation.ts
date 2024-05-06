export interface Conversation {
  sessionId: string;
  createDate: string;
  updateDate: string;
  workflowId: string;
  nodeContext: {
    [id: string]: any;
  };
  globalContext: any;
}
