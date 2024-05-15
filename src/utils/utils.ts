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
	const { config = {} } = integration;
	const { configDefinitions } = integration;
	return configDefinitions.every((configDefinition) => {
		if (!configDefinition.required || configDefinition.defaultValue) return true;
		return !config[configDefinition.fieldName];
	});
};
export function getRandomColor(id: string) {
	let hash = 0;
	for (let i = 0; i < id.length; i++) {
		hash = id.charCodeAt(i) + ((hash << 5) - hash);
	}

	// 将哈希值转换为颜色的HSL表示形式
	const hue = hash % 360; // 360度的色环中选择色调
	const saturation = 10 + (hash % 20); // 选择10%到30%之间的饱和度
	const lightness = 50 + (hash % 30); // 选择50%到80%之间的亮度

	// 返回HSL颜色字符串
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
