import { Flex, Stack, Tooltip, UnstyledButton, rem } from '@mantine/core';
import { IconAdjustments, IconDatabase, IconDeviceDesktopAnalytics, IconHome2, IconMessage } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import classes from './NavBar.module.css';

interface NavbarLinkProps {
	icon: typeof IconHome2;
	label: string;
	active?: boolean;
	onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
	return (
		<Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
			<UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
				<Icon style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
			</UnstyledButton>
		</Tooltip>
	);
}

const Links = [
	{ icon: IconDeviceDesktopAnalytics, label: 'Workflow', link: '/' },
	{ icon: IconMessage, label: 'Conversation', link: '/chat/new' },
	{
		icon: IconDatabase,
		label: 'Knowledge Base',
		link: '/knowledgeBaseBoard',
	},
	{ icon: IconAdjustments, label: 'Integration', link: '/integration' },
];

export default function NavBar() {
	const navigate = useNavigate();
	const location = useLocation();

	const links = Links.map((link) => (
		<NavbarLink {...link} key={link.label} active={location.pathname === link.link} onClick={() => navigate(link.link)} />
	));

	return (
		<Flex className="w-20 pt-10 pb-3 shrink-0" justify={'center'} align={'start'}>
			<Stack justify="center" gap={3}>
				{links}
			</Stack>
		</Flex>
	);
}
