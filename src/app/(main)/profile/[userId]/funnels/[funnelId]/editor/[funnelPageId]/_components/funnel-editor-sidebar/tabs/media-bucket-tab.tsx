import MediaComponent from "@/components/media";
import { getMedia } from "@/lib/queries";
import { GetMediaFiles } from "@/lib/types";
import React, { useEffect, useState } from "react";

type Props = {
  userId: string;
};

const MediaBucketTab = ({ userId }: Props) => {
  const [data, setData] = useState<GetMediaFiles>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMedia(userId);
      setData(response);
    };
    fetchData();
  }, [userId]);

  return (
    <div className="h-[900px] overflow-auto p-4">
      <MediaComponent data={data} userId={userId} />
    </div>
  );
};

export default MediaBucketTab;
