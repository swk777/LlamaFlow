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
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

const getIntegrationsLinksData = (integrations) => [
  {
    label: "AI Models",
    icon: IconNotes,
    initiallyOpened: true,
    links: integrations.map((integration) => ({
      label: integration.label,
      link: `/integration/${integration.id}`,
    })),
  },
];

export function Integration() {
  const location = useLocation();
  const { integrationId } = useParams();
  const { integrations } = useContext(AppContext);
  const links = getIntegrationsLinksData(integrations).map((item) => (
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
