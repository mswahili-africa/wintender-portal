// 📁 components/tenders/PrivateTenderButton.tsx
import { useState } from "react";
import { IconCrown } from "@tabler/icons-react";
import Button from "@/components/button/Button";
import PrivateTenderRequestModal from "./privateTenderRequestModal";
import Tooltip from "@/components/tooltip/Tooltip";
import { useTranslation } from "react-i18next";

export default function PrivateTenderButton({ bidder, onSuccess }: any) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Tooltip content={t("difm-new-request-button-tooltip")}>
        <Button
          label={t("difm-new-request-button")}
          icon={<IconCrown size={18} />}
          theme="primary"
          size="md"
          onClick={() => setOpen(true)}
        />
      </Tooltip>
      <PrivateTenderRequestModal
        open={open}
        setOpen={setOpen}
        onSuccess={onSuccess}
        bidder={bidder}
      />
    </>
  );
}
