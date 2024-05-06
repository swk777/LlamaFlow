export async function executeChatResponse({
  nodeInputs,
  globalContext,
  setGlobalContext,
}) {
  const { output } = nodeInputs;
  console.log("output");
  console.log(output);
  setGlobalContext({
    ...globalContext,
    latestMessage: output,
    messages: globalContext.messages.concat([output]),
  });
}
