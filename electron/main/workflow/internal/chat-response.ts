export async function executeChatResponse({
  nodeInputs,
  globalContext,
  setGlobalContext,
}) {
  const { output } = nodeInputs;
  setGlobalContext({
    ...globalContext,
    latestMessage: output,
    messages: globalContext.messages.concat([output]),
  });
}
