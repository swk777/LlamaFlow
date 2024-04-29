export async function executeUserInput({
  nodeId,
  globalContext,
  setNodeContext,
  setGlobalContext,
}) {
  console.log(
    `executing node ${nodeId}, current message: ${globalContext?.currentMessage}`
  );
  setNodeContext(nodeId, {
    outputs: { query: globalContext?.currentMessage },
  });
  setGlobalContext({
    ...globalContext,
    messages: globalContext.messages.concat([globalContext?.currentMessage]),
  });
}
