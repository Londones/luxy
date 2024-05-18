import FunnelEditor from "@/app/(main)/profile/[userId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor";
import { getDomainContent } from "@/lib/queries";
import EditorProvider from "@/providers/editor/editor-provider";
import { notFound } from "next/navigation";
import React from "react";

const Page = async ({
  params,
}: {
  params: { domain: string; path: string };
}) => {
  const domainData = await getDomainContent(params.domain.slice(0, -1));
  const pageData = domainData?.FunnelPages.find(
    (page) => page.pathName === params.path
  );

  if (!pageData || !domainData) return notFound();

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
