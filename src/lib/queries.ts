"use server";

import { clerkClient, currentUser } from "@clerk/nextjs";
import { db } from "./db";
import { Lane, Prisma, Tag, Ticket, User } from "@prisma/client";
import { v4 } from "uuid";
import {
  CreateFunnelFormSchema,
  CreateMediaType,
  UpsertFunnelPage,
} from "./types";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const getAuthUserDetails = async () => {
  const user = await currentUser();
  if (!user) return;
  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      SidebarOption: true,
    },
  });

  return userData;
};

export const upsertUser = async (newUser?: Partial<User>) => {
  const user = await currentUser();
  if (!user) return;
  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: { ...newUser },
    create: {
      id: user.id,
      email: newUser?.email || user.emailAddresses[0].emailAddress,
      avatarUrl: newUser?.avatarUrl || user.imageUrl,
      customerId: newUser?.customerId || "",
      name: newUser?.name || `${user.firstName} ${user.lastName}`,
      SidebarOption: {
        create: [
          {
            name: "Dashboard",
            icon: "category",
            link: `/profile/${user.id}`,
          },
          {
            name: "Launchpad",
            icon: "clipboardIcon",
            link: `/profile/${user.id}/launchpad`,
          },
          {
            name: "Billing",
            icon: "payment",
            link: `/profile/${user.id}/billing`,
          },
          {
            name: "Settings",
            icon: "settings",
            link: `/profile/${user.id}/settings`,
          },
          {
            name: "Funnels",
            icon: "pipelines",
            link: `/profile/${user.id}/funnels`,
          },
          {
            name: "Media",
            icon: "database",
            link: `/profile/${user.id}/media`,
          },
        ],
      },
    },
  });

  return userData;
};

export const updateUser = async (user: Partial<User>) => {
  const response = await db.user.update({
    where: { email: user.email },
    data: { ...user },
  });

  return response;
};

export const getUserDetails = async (userId: string) => {
  const response = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  return response;
};

export const deleteUser = async (userId: string) => {
  await clerkClient.users.updateUserMetadata(userId, {
    privateMetadata: {
      role: undefined,
    },
  });
  const deletedUser = await db.user.delete({ where: { id: userId } });

  return deletedUser;
};

export const getUser = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};

export const getMedia = async (userId: string) => {
  const mediaFile = await db.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      Media: true,
    },
  });
  return mediaFile;
};

export const createMedia = async (
  userId: string,
  mediaFiles: CreateMediaType
) => {
  const type = mediaFiles.link.split(".").pop();
  const response = await db.media.create({
    data: {
      link: mediaFiles.link,
      name: mediaFiles.name,
      userId: userId,
      type: type,
    },
  });
  return response;
};

export const deleteMedia = async (mediaId: string) => {
  const response = await db.media.delete({
    where: {
      id: mediaId,
    },
  });
  return response;
};

export const getPipelineDetails = async (pipelineId: string) => {
  const response = await db.pipeline.findUnique({
    where: {
      id: pipelineId,
    },
  });
  return response;
};

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
  const response = await db.lane.findMany({
    where: {
      pipelineId,
    },
    orderBy: { order: "asc" },
    include: {
      Tickets: {
        orderBy: { order: "asc" },
        include: {
          Tags: true,
        },
      },
    },
  });
  return response;
};

export const upsertFunnel = async (
  userId: string,
  funnel: z.infer<typeof CreateFunnelFormSchema> & { liveProducts: string },
  funnelId: string
) => {
  const response = await db.funnel.upsert({
    where: { id: funnelId },
    update: funnel,
    create: {
      ...funnel,
      id: funnelId || v4(),
      userId: userId,
    },
  });
  return response;
};

export const upsertPipeline = async (
  pipeline: Prisma.PipelineUncheckedCreateWithoutLaneInput
) => {
  const response = await db.pipeline.upsert({
    where: { id: pipeline.id || v4() },
    update: pipeline,
    create: pipeline,
  });
  return response;
};

export const deletePipeline = async (pipelineId: string) => {
  const response = await db.pipeline.delete({
    where: { id: pipelineId },
  });
  return response;
};

export const updateLanesOrder = async (lanes: Lane[]) => {
  try {
    const updateTrans = lanes.map((lane) => {
      return db.lane.update({
        where: { id: lane.id },
        data: { order: lane.order },
      });
    });
    await db.$transaction(updateTrans);
    console.log("Updated");
  } catch (error) {
    console.error(error, "Error update lanes order");
  }
};

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  try {
    const updateTrans = tickets.map((ticket) => {
      return db.ticket.update({
        where: { id: ticket.id },
        data: { order: ticket.order, laneId: ticket.laneId },
      });
    });
    await db.$transaction(updateTrans);
    console.log("Updated");
  } catch (error) {
    console.error(error, "Error update tickets order");
  }
};

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
  let order: number;
  if (!lane.order) {
    const lanes = await db.lane.findMany({
      where: {
        pipelineId: lane.pipelineId,
      },
    });
    order = lanes.length;
  } else {
    order = lane.order;
  }

  const response = await db.lane.upsert({
    where: { id: lane.id || v4() },
    update: lane,
    create: {
      ...lane,
      order,
    },
  });
  return response;
};

export const deleteLane = async (laneId: string) => {
  const response = await db.lane.delete({
    where: { id: laneId },
  });
  return response;
};

export const getTicketsWithTags = async (pipelineId: string) => {
  const response = await db.ticket.findMany({
    where: {
      Lane: {
        pipelineId,
      },
    },
    include: {
      Tags: true,
    },
  });
  return response;
};

export const _getTicketWithAllRelations = async (laneId: string) => {
  const response = await db.ticket.findMany({
    where: {
      laneId,
    },
    include: {
      Tags: true,
      Lane: true,
    },
  });
  return response;
};

export const upsertTicket = async (
  ticket: Prisma.TicketUncheckedCreateInput,
  tags: Tag[]
) => {
  let order: number;
  if (!ticket.order) {
    const tickets = await db.ticket.findMany({
      where: {
        laneId: ticket.laneId,
      },
    });
    order = tickets.length;
  } else {
    order = ticket.order;
  }
  const response = await db.ticket.upsert({
    where: { id: ticket.id || v4() },
    update: { ...ticket, Tags: { set: tags } },
    create: {
      ...ticket,
      order,
      Tags: {
        connect: tags,
      },
    },
    include: {
      Tags: true,
      Lane: true,
    },
  });
  return response;
};

export const deleteTag = async (tagId: string) => {
  const response = await db.tag.delete({
    where: { id: tagId },
  });
  return response;
};

export const upsertTag = async (userId: string, tag: Tag) => {
  const response = await db.tag.upsert({
    where: { id: tag.id || v4(), userId: userId },
    update: tag,
    create: {
      ...tag,
      userId: userId,
    },
  });
  return response;
};

export const getUserTags = async (userId: string) => {
  const response = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: { Tags: true },
  });
  return response;
};

export const deleteTicket = async (ticketId: string) => {
  const response = await db.ticket.delete({
    where: { id: ticketId },
  });
  return response;
};

export const getFunnels = async (userId: string) => {
  const response = await db.funnel.findMany({
    where: {
      userId: userId,
    },
    include: { FunnelPages: true },
  });
  return response;
};

export const getFunnel = async (funnelId: string) => {
  const response = await db.funnel.findUnique({
    where: {
      id: funnelId,
    },
    include: {
      FunnelPages: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });
  return response;
};

export const updateFunnelProducts = async (
  products: string,
  funnelId: string
) => {
  const data = await db.funnel.update({
    where: {
      id: funnelId,
    },
    data: {
      liveProducts: products,
    },
  });
  return data;
};

export const upsertFunnelPage = async (
  userId: string,
  funnelPage: UpsertFunnelPage,
  funnelId: string
) => {
  if (!userId || !funnelId) return;
  const response = await db.funnelPage.upsert({
    where: { id: funnelPage.id || "" },
    update: { ...funnelPage },
    create: {
      ...funnelPage,
      content: funnelPage.content
        ? funnelPage.content
        : JSON.stringify([
            {
              content: [],
              id: "__body",
              name: "Body",
              styles: { backgroundColor: "white" },
              type: "__body",
            },
          ]),
      funnelId,
    },
  });

  revalidatePath(`/profile/${userId}/funnels/${funnelId}`, "page");
  return response;
};

export const deleteFunnelePage = async (funnelPageId: string) => {
  const response = await db.funnelPage.delete({
    where: { id: funnelPageId },
  });
  return response;
};

export const getFunnelPageDetails = async (funnelPageId: string) => {
  const response = await db.funnelPage.findUnique({
    where: { id: funnelPageId },
  });
  return response;
};

export const getDomainContent = async (subDomainName: string) => {
  const response = await db.funnel.findUnique({
    where: { subDomainName },
    include: { FunnelPages: true },
  });
  return response;
};
