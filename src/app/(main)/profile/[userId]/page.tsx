import BlurPage from "@/components/global/blur-page";
import React from "react";

const Page = ({ params }: { params: { userId: string } }) => {
  return <BlurPage>{params.userId}</BlurPage>;
};

export default Page;
