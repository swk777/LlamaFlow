export const buildDefaultConfig = (nodelet: Nodelet) => {
  const defaultConfig = {};
  nodelet.configDefinitions.forEach((configDefinition) => {
    if (configDefinition.defaultValue !== undefined) {
      defaultConfig[configDefinition.fieldName] = configDefinition.defaultValue;
    }
  });
  return defaultConfig;
};
export const checkIntegration = (nodelet, integrations) => {
  const integration = integrations.find((intn) => intn.id === nodelet.id);
  console.log(integration);
  const { config = {} } = integration;
  const { configDefinitions } = integration;
  return configDefinitions.every((configDefinition) => {
    if (!configDefinition.required || configDefinition.defaultValue)
      return true;
    return !config[configDefinition.fieldName];
  });
};
