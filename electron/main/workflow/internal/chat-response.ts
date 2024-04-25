export async function executeChatResponse(
  node,
  nodeInputs,
  globalContext,
  setNodeContext,
  setGlobalContext
) {
  const { output } = nodeInputs;
  setGlobalContext({
    ...globalContext,
    latestMessage: output,
    messages: globalContext.messages.concat([output]),
  });
}
