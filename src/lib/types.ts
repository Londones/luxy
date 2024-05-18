import { Prisma, Ticket, Tag, User, Lane } from "@prisma/client";
import {
  _getTicketWithAllRelations,
  getAuthUserDetails,
  getFunnels,
  getMedia,
  getPipelineDetails,
  getTicketsWithTags,
} from "./queries";
import { z } from "zod";
import Stripe from "stripe";

export type NotificationWithUser =
  | ({
      User: {
        id: string;
        name: string;
        avatarUrl: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        agencyId: string | null;
      };
    } & Notification)[]
  | undefined;

export type AuthUserWithSidebarOptions = Prisma.PromiseReturnType<
  typeof getAuthUserDetails
>;

export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>;

export type CreateMediaType = Prisma.MediaCreateWithoutUserInput;

export type TicketAndTags = Ticket & {
  Tags: Tag[];
  Assigned: User | null;
};

export type LaneDetail = Lane & {
  Tickets: TicketAndTags[];
};

export const CreatePipelineFormSchema = z.object({
  name: z.string().min(1),
});

export const CreateFunnelFormSchema = z.object({
  name: z.string().min(1),
  subDomainName: z.string().min(1),
  favicon: z.string().optional(),
  description: z.string().optional(),
});

export type PipelineDetailsWithLanesCardsTagsTickets = Prisma.PromiseReturnType<
  typeof getPipelineDetails
>;

export const LaneFormSchema = z.object({
  name: z.string().min(1),
});

export type TicketWithTags = Prisma.PromiseReturnType<
  typeof getTicketsWithTags
>;

export type TicketDetails = Prisma.PromiseReturnType<
  typeof _getTicketWithAllRelations
>;

const currencyNumberRegex = /^\d+(\.\d{1,2})?$/;

export const TicketFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: "Value must be a valid price",
  }),
});

export const ContactUserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
});

export type Address = {
  city: string;
  country: string;
  line1: string;
  postal_code: string;
  state: string;
};

export type ShippingInfo = {
  address: Address;
  name: string;
};

export type StripeCustomerType = {
  email: string;
  name: string;
};

export type PricesList = Stripe.ApiList<Stripe.Price>;

export type FunnelsForSubAccount = Prisma.PromiseReturnType<
  typeof getFunnels
>[0];

export type UpsertFunnelPage = Prisma.FunnelPageCreateWithoutFunnelInput;

export const FunnelPageSchema = z.object({
  name: z.string().min(1),
  pathName: z.string().optional(),
});
