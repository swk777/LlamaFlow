import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconDots,
  IconDotsVertical,
  IconEdit,
  IconPencil,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { AppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

type Props = {};

export default function WorkflowList({}: Props) {
  const { workflows } = useContext(AppContext);
  const navigate = useNavigate();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-center">Category</TableHead>
          {/* <TableHead>Price</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Total Sales
                      </TableHead> */}
          <TableHead className="hidden md:table-cell text-center">
            Last modified
          </TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(workflows || []).map(({ id, name, category, lastModified }, idx) => (
          <TableRow key={id}>
            <TableCell
              className="font-medium hidden sm:table-cell w-1/15"
              height={50}
            >
              {idx + 1}.
            </TableCell>
            <TableCell className="font-medium w-1/3 text-left">
              {name}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{category}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {lastModified}
            </TableCell>
            <TableCell>
              <div className="flex flex-row justify-between">
                <IconPlayerPlay
                  size={16}
                  className="text-primary cursor-pointer"
                  onClick={() => navigate("/chat/1")}
                />
                <IconPencil
                  size={16}
                  onClick={() => {
                    navigate(`/workflow-edit/${id}`);
                  }}
                  className="text-primary cursor-pointer"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconDotsVertical size={16} className="cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
