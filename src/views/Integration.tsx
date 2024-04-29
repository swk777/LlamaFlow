import { Group, Code, ScrollArea, rem, Flex } from "@mantine/core";
import {
  IconNotes,
  IconCalendarStats,
  IconGauge,
  IconPresentationAnalytics,
  IconFileAnalytics,
  IconAdjustments,
  IconLock,
} from "@tabler/icons-react";
// import { UserButton } from '../UserButton/UserButton';
// import { LinksGroup } from '../NavbarLinksGroup/NavbarLinksGroup';
// import { Logo } from './Logo';
import classes from "./Integration.module.css";
import { LinksGroup } from "./components/LinksGroup";
import { Outlet, useLocation, useParams } from "react-router-dom";
import IntegrationConfig from "./IntegrationConfig";

const mockdata = [
  { label: "Dashboard", icon: IconGauge },
  {
    label: "AI Models",
    icon: IconNotes,
    initiallyOpened: true,
    links: [
      { label: "OpenAI", link: "/integration/OpenAI" },
      { label: "Ollama", link: "/integration/Ollama" },
    ],
  },
  // {
  //   label: "Releases",
  //   icon: IconCalendarStats,
  //   links: [
  //     { label: "Upcoming releases", link: "/" },
  //     { label: "Previous releases", link: "/" },
  //     { label: "Releases schedule", link: "/" },
  //   ],
  // },
  // { label: "Analytics", icon: IconPresentationAnalytics },
  // { label: "Contracts", icon: IconFileAnalytics },
  // { label: "Settings", icon: IconAdjustments },
  // {
  //   label: "Security",
  //   icon: IconLock,
  //   links: [
  //     { label: "Enable 2FA", link: "/" },
  //     { label: "Change password", link: "/" },
  //     { label: "Recovery codes", link: "/" },
  //   ],
  // },
];

export function Integration() {
  const location = useLocation();
  const { integrationId } = useParams();
  const links = mockdata.map((item) => (
    <LinksGroup {...item} key={item.label} />
  ));
  console.log(location);
  return (
    <Flex direction={"row"}>
      <nav className="w-44 border-r px-3">
        <ScrollArea className={classes.links}>
          <div className={classes.linksInner}>{links}</div>
        </ScrollArea>

        <div className={classes.footer}>{/* <UserButton /> */}</div>
      </nav>
      <Flex className="flex-1">
        <IntegrationConfig id={integrationId} />
      </Flex>
    </Flex>
  );
}
