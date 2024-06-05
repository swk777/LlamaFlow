import { AppContext } from '@/context/AppContext';
import { SimpleGrid } from '@mantine/core';
import { useContext } from 'react';
import { TemplateCard } from './components/TemplateCard';

type Props = {};

export default function Templates({}: Props) {
	const { templates } = useContext(AppContext);
	return (
		<>
			<SimpleGrid
				cols={{ base: 2, sm: 3, lg: 5 }}
				spacing={{ base: 10, sm: 'xl' }}
				verticalSpacing={{ base: 'md', sm: 'xl' }}
				className="px-8 py-8"
			>
				{templates.map((template) => (
					<TemplateCard template={template} key={template.id} />
				))}
			</SimpleGrid>
		</>
	);
}
