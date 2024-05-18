"use client";
import { Media } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Copy, MoreHorizontal, Trash } from "lucide-react";
import Image from "next/image";
import { deleteMedia } from "@/lib/queries";
import { toast } from "../ui/use-toast";

type Props = { file: Media };

const MediaCard = ({ file }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const PreviewComponent = (type?: string) => {
    switch (type) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
      case "svg":
        return (
          <Image
            src={file.link}
            alt="preview image"
            fill
            className="object-cover rounded-lg"
          />
        );
      case "mp4":
        return (
          <video
            src={file.link}
            className="object-cover rounded-lg"
            controls
          ></video>
        );
      default:
        return (
          <div className="flex justify-center items-center h-full w-full bg-slate-900 rounded-lg">
            <p className="text-white">Preview Not Available</p>
          </div>
        );
    }
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <article className="border w-full rounded-lg bg-slate-900">
          <div className="relative w-full h-40">
            {PreviewComponent(file.type ?? undefined)}
          </div>
          <p className="opacity-0 h-0 w-0">{file.name}</p>
          <div className="p-4 relative">
            <p className="text-muted-foreground">
              {file.createdAt.toLocaleDateString()}
            </p>
            <p>{file.name}</p>
            <div className="absolute top-4 right-4 p-[1px] cursor-pointer ">
              <DropdownMenuTrigger>
                <MoreHorizontal />
              </DropdownMenuTrigger>
            </div>
          </div>

          <DropdownMenuContent>
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-2"
              onClick={() => {
                navigator.clipboard.writeText(file.link);
                toast({ title: "Copied To Clipboard" });
              }}
            >
              <Copy size={15} /> Copy File Link
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2">
                <Trash size={15} /> Delete File
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </article>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Are you sure you want to delete this file? All subaccount using this
            file will no longer have access to it!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-red-500 hover:text-white"
            onClick={async () => {
              setLoading(true);
              const response = await deleteMedia(file.id);
              toast({
                title: "Deleted File",
                description: "Successfully deleted the file",
              });
              setLoading(false);
              router.refresh();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MediaCard;