export interface Conversation {
  sessionId: string;
  createDate: string;
  updateDate: string;
  nodeContext: {
    [id: string]: any;
  };
  globalContext: any;
}
