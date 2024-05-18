import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-provider";
import { notFound } from "next/navigation";
import React from "react";
import FunnelEditor from "../(main)/profile/[userId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";
import { db } from "@/lib/db";

const Page = async ({ params }: { params: { domain: string } }) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1));
  if (!domainData) return notFound();

  const pageData = domainData.FunnelPages.find((page) => !page.pathName);

  if (!pageData) return notFound();

  if (pageData) {
    const data = {
      funnelPageId: pageData.id,
      location: "{longitude:0,latitude:0}",
    };

    const res = await db.visit.create({
      data: data,
    });
  }
  return (
    <EditorProvider
      pageDetails={pageData}
      funnelId={domainData.id}
      userId={domainData.userId}
    >
      <FunnelEditor funnelPageId={pageData.id} liveMode />
    </EditorProvider>
  );
};

export default Page;
