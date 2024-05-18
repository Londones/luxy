import React from "react";
import { getMedia } from "@/lib/queries";
import BlurPage from "@/components/global/blur-page";
import MediaComponent from "@/components/media";
type Props = {
  params: { userId: string };
};

const MediaPage = async ({ params }: Props) => {
  const data = await getMedia(params.userId);
  return (
    <BlurPage>
      <MediaComponent data={data} userId={params.userId} />
    </BlurPage>
  );
};

export default MediaPage;
