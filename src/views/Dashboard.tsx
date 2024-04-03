// import Image from "next/image";
// import Link from "next/link";
import { Outlet } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavBar from "./NavBar";

export function Dashboard() {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col bg-muted/40 flex-1">
        <NavBar />
        <div className="flex flex-col sm:gap-4 sm:pt-4 sm:pl-14 sm:pt-6 min-h-screen">
          <Outlet />
        </div>
      </div>
    </TooltipProvider>
  );
}
