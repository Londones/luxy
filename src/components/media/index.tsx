import { GetMediaFiles } from "@/lib/types";
import { FolderSearch, Upload } from "lucide-react";
import React from "react";
import MediaUploadButton from "./upload-button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import MediaCard from "./media-card";

type Props = {
  data: GetMediaFiles;
  userId: string;
};

const MediaComponent = ({ data, userId }: Props) => {
  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl">Media Bucket</h1>
        <MediaUploadButton userId={userId} />
      </div>
      <Command className="bg-transparent">
        <CommandInput placeholder="Search for file name..." />
        <CommandList className="!h-full pb-40  max-w-full">
          <CommandEmpty>No Media files</CommandEmpty>
          <CommandGroup heading="Media Files" className="my-2">
            <div className="flex flex-wrap gap-4 pt-4">
              {data?.Media.map((file) => (
                <CommandItem
                  key={file.id}
                  className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                >
                  <MediaCard file={file} />
                </CommandItem>
              ))}
              {!data?.Media.length && (
                <div className="flex items-center justify-center w-full flex-col">
                  <FolderSearch
                    size={200}
                    className="dark:text-muted text-slate-300"
                  />
                  <p className="text-muted-foreground">
                    Empty! no files to show.
                  </p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default MediaComponent;
