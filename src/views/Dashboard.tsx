// import Image from "next/image";
// import Link from "next/link";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Divider } from "@mantine/core";

export function Dashboard() {
  return (
    <div className="flex min-h-screen flex-row bg-muted/40 flex-1">
      <NavBar />
      <Divider orientation="vertical" />
      <div className="flex flex-col h-screen flex-1">
        <Outlet />
      </div>
    </div>
  );
}
