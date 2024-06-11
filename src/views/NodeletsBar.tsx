import { INodelet, NodeletCategory } from '@/type/nodelet';
import { SegmentedControl } from '@mantine/core';
import { useState } from 'react';
import Nodelet from './Nodelet';

type Props = { nodelets: INodelet[] };

export default function NodeletsBar({ nodelets }: Props) {
	const [value, setValue] = useState<NodeletCategory>(NodeletCategory.Input);
	return (
		<aside className="w-38  flex flex-col ">
			<SegmentedControl
				value={value}
				onChange={(v: NodeletCategory) => setValue(v)}
				className="mx-1 my-3"
				data={Object.values(NodeletCategory).map((category) => ({
					value: category,
					label: category,
				}))}
			/>
			{nodelets
				.filter((nodelet) => nodelet.category === value)
				.map((nodelet) => (
					<Nodelet nodelet={nodelet} key={nodelet.id} />
				))}
		</aside>
	);
}
