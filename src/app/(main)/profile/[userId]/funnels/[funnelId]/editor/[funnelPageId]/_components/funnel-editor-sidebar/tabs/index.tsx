import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Plus, SettingsIcon, SquareStackIcon } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

type Props = {};

const TabList = (props: Props) => {
  return (
    <TooltipProvider>
      <TabsList className=" flex items-center flex-col justify-evenly w-full bg-transparent h-fit gap-4 ">
        <Tooltip>
          <TooltipTrigger>
            <TabsTrigger
              value="Settings"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <SettingsIcon />
            </TabsTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </TooltipTrigger>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <TabsTrigger
              value="Components"
              className="data-[state=active]:bg-muted w-10 h-10 p-0"
            >
              <Plus />
            </TabsTrigger>
            <TooltipContent>
              <p>Components</p>
            </TooltipContent>
          </TooltipTrigger>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <TabsTrigger
              value="Layers"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <SquareStackIcon />
            </TabsTrigger>
            <TooltipContent>
              <p>Layers</p>
            </TooltipContent>
          </TooltipTrigger>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <TabsTrigger
              value="Media"
              className="w-10 h-10 p-0 data-[state=active]:bg-muted"
            >
              <Database />
            </TabsTrigger>
            <TooltipContent>
              <p>Media</p>
            </TooltipContent>
          </TooltipTrigger>
        </Tooltip>
      </TabsList>
    </TooltipProvider>
  );
};

export default TabList;
