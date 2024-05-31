function execute(context) {
  const { setNodeContext, nodeConfig, nodeInputs } = context;
  const { input } = nodeInputs;
  console.log(nodeConfig, input);
  setNodeContext &&
    setNodeContext({
      outputs: { output: (nodeConfig?.text || "") + "abc" + input },
    });
  return;
}
//# sourceMappingURL=main.js.map
