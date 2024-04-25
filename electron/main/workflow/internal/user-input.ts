export async function executeUserInput(
  node,
  nodeInputs,
  globalContext,
  setNodeContext,
  setGlobalContext
) {
  console.log(
    `executing node ${node.id}, current message: ${globalContext?.currentMessage}`
  );
  setNodeContext(node.id, {
    outputs: { query: globalContext?.currentMessage },
  });
  setGlobalContext({
    ...globalContext,
    messages: globalContext.messages.concat([globalContext?.currentMessage]),
  });
}
