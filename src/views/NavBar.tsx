import { useState } from "react";
import {
  Center,
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  Container,
  Flex,
} from "@mantine/core";
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
} from "@tabler/icons-react";
import classes from "./NavBar.module.css";
import { useNavigate } from "react-router-dom";

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home", link: "/" },
  { icon: IconGauge, label: "Dashboard", link: "/integration" },
  {
    icon: IconDeviceDesktopAnalytics,
    label: "Analytics",
    link: "/knowledgeBaseBoard",
  },
  { icon: IconCalendarStats, label: "Releases", link: "/chat/new" },
  { icon: IconUser, label: "Account" },
  { icon: IconFingerprint, label: "Security" },
  { icon: IconSettings, label: "Settings" },
];

export default function NavBar() {
  const [active, setActive] = useState(2);
  const navigate = useNavigate();

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index);
        navigate(link.link);
      }}
    />
  ));

  return (
    <Flex
      className="w-20 pt-10 pb-3 shrink-0"
      justify={"center"}
      align={"start"}
    >
      <Stack justify="center" gap={3}>
        {links}
      </Stack>
    </Flex>
  );
}
