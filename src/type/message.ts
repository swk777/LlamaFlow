export enum MessageRole {
  System = "system",
  Assistant = "assistant",
  User = "user",
}
export interface Message {
  id: string;
  createDate: string;
  role: MessageRole;
  content: string;
}
