import { getFunnels } from "@/lib/queries";
import React from "react";
import FunnelsDataTable from "./data-table";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import FunnelForm from "@/components/forms/funnel-form";
import BlurPage from "@/components/global/blur-page";

const Funnels = async ({ params }: { params: { userId: string } }) => {
  const funnels = await getFunnels(params.userId);
  if (!funnels) return null;

  return (
    <BlurPage>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={<FunnelForm userId={params.userId}></FunnelForm>}
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  );
};

export default Funnels;
