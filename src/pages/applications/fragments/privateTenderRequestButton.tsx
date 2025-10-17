// 📁 components/tenders/PrivateTenderButton.tsx
import { useState } from "react";
import { IconCrown } from "@tabler/icons-react";
import Button from "@/components/button/Button";
import PrivateTenderRequestModal from "./privateTenderRequestModal";

export default function PrivateTenderButton({ bidder, onSuccess }: any) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        label="Request"
        icon={<IconCrown size={18} />}
        theme="primary"
        size="md"
        onClick={() => setOpen(true)}
      />
      <PrivateTenderRequestModal
        open={open}
        setOpen={setOpen}
        onSuccess={onSuccess}
        bidder={bidder}
      />
    </>
  );
}
