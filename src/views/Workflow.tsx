import { Button, Card, Space } from '@mantine/core';
import { File, ListFilter, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import WorkflowList from './WorkflowList';

type Props = {};

export default function Workflow({}: Props) {
	let navigate = useNavigate();
	return (
		<main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<div className="flex items-center mt-3">
				<div className="ml-auto flex items-center gap-2 mt-4">
					<Button variant="outline" size="sm" className="h-7">
						<ListFilter className="h-3.5 w-3.5 mr-1" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
					</Button>
					<Button size="sm" variant="outline" className="h-7 gap-1">
						<File className="h-3.5 w-3.5 mr-1" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap pl-2">Export</span>
					</Button>
					<Button size="sm" className="h-7 gap-1" onClick={() => navigate(`/workflow-edit/${uuidv4()}`)}>
						<PlusCircle className="h-3.5 w-3.5 mr-1" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Workflow</span>
					</Button>
				</div>
			</div>
			<Space h="sm" />
			<Space h="sm" />
			<Card shadow="sm" radius="md" className="px-7 py-4" withBorder>
				<WorkflowList />
				<div className="text-xs text-muted-foreground">
					Showing <strong>1-10</strong> of <strong>32</strong> products
				</div>
			</Card>
		</main>
	);
}
