import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton, rem } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './LinksGroup.module.css';

interface LinksGroupProps {
	icon: React.FC<any>;
	label: string;
	initiallyOpened?: boolean;
	links?: { label: string; link: string; bold?: boolean }[];
	style?: React.CSSProperties;
}

export function LinksGroup({ icon: Icon, label, initiallyOpened, links }: LinksGroupProps) {
	const hasLinks = Array.isArray(links);
	const [opened, setOpened] = useState(initiallyOpened || false);
	const navigate = useNavigate();
	const items = (hasLinks ? links : []).map((link) => (
		<Text<'a'>
			component="a"
			className="cursor-pointer text-left max-w-44 block border-l mx-8 font-medium py-2 pl-6 truncate text-gray-500 text-sm hover:text-gray-700"
			key={link.label}
			onClick={() => navigate(link.link)}
			fw={link.bold ? 600 : 400}
		>
			{link.label}
		</Text>
	));

	return (
		<>
			<UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
				<Group justify="space-between" gap={0}>
					<Box style={{ display: 'flex', alignItems: 'center' }}>
						<ThemeIcon variant="light" size={30}>
							<Icon style={{ width: rem(18), height: rem(18) }} />
						</ThemeIcon>
						<Box ml="md">{label}</Box>
					</Box>
					{hasLinks && (
						<IconChevronRight
							className={classes.chevron}
							stroke={1.5}
							style={{
								width: rem(16),
								height: rem(16),
								transform: opened ? 'rotate(-90deg)' : 'none',
							}}
						/>
					)}
				</Group>
			</UnstyledButton>
			{hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
		</>
	);
}
