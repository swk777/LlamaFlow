import React, { useContext, useEffect, useState } from "react";

import {
  IconDots,
  IconDotsVertical,
  IconEdit,
  IconPencil,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { AppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Badge, Table } from "@mantine/core";

type Props = {};

export default function WorkflowList({}: Props) {
  const { workflows } = useContext(AppContext);
  const navigate = useNavigate();
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className="hidden w-[100px] sm:table-cell">
            <span className="sr-only">Image</span>
          </Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th className="text-center">Category</Table.Th>
          {/* <TableHead>Price</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Total Sales
                      </TableHead> */}
          <Table.Th className="hidden md:table-cell text-center">
            Last modified
          </Table.Th>
          <Table.Th>
            <span className="sr-only">Actions</span>
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {(workflows || []).map(({ id, name, category, lastModified }, idx) => (
          <Table.Tr key={id}>
            <Table.Td
              className="font-medium hidden sm:table-cell w-1/15"
              height={50}
            >
              {idx + 1}.
            </Table.Td>
            <Table.Td className="font-medium w-1/3 text-left">{name}</Table.Td>
            <Table.Td>
              <Badge variant="outline">{category}</Badge>
            </Table.Td>
            <Table.Td className="hidden md:table-cell">{lastModified}</Table.Td>
            <Table.Td>
              <div className="flex flex-row justify-between">
                <IconPlayerPlay
                  size={16}
                  className="text-primary cursor-pointer"
                  // onClick={() => navigate("/chat/1")}
                />
                <IconPencil
                  size={16}
                  onClick={() => {
                    navigate(`/workflow-edit/${id}`);
                  }}
                  className="text-primary cursor-pointer"
                />
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconDotsVertical size={16} className="cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu> */}
              </div>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
