import { SettingItem } from "./fragments/SettingItem";
import { useMutation } from "@tanstack/react-query";
import usePopup from "@/hooks/usePopup";
import Button from "@/components/button/Button";
import { SettingSection } from "./fragments/SettingSection";
import toast from "react-hot-toast";
import { createBackup, deleteLogs } from "@/services/settingsService";
import { IconCloudUpload, IconSend2, IconTrash } from "@tabler/icons-react";

export const BackupSettings = () => {
  const {showConfirmation,closePopup}=usePopup();

  const backupMutation = useMutation({
    mutationFn: createBackup,
    onSuccess: (data) => {
      toast.success(data.message || "Backup created successfully");
    },
    onError: (error:any) => {
      toast.error(error.response.data.message || "Failed to create backup");
      console.log(error)
    }
  })
  const deleteLogsMutation = useMutation({
    mutationFn: deleteLogs,
    onSuccess: (data) => {
      toast.success(data.message || "Logs deleted successfully");
    },
    onError: (error:any) => {
      toast.error(error.response.data.message || "Failed to delete logs");
      console.log(error)
    }
  })

  const performBackup = () => {
    showConfirmation(
      {
        title: "Confirm Backup",
        onCancel() {
          closePopup();
        },
        message: "Are you sure you want to perform a backup?",
        theme:"warning",
        onConfirm() {
          backupMutation.mutate();
        },
      }
    )
  }

  // delete logs
  const deleteLogsSubmit = () => {
    showConfirmation(
      {
        title: "Confirm Report",
        onCancel() {
          closePopup();
        },
        message: "Are you sure you want to delete logs?",
        theme:"warning",
        onConfirm() {
          deleteLogsMutation.mutate();
        },
      }
    )
  }
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Backup  */}
      <SettingSection
        title="Backup Settings"
        description="Manage database and system backups"
      >
        <SettingItem
          title="Database Backup"
          description="Manually create a backup of your database."
        >
          <Button
            size="sm"
            theme="info"
            label="Backup Now"
            icon={<IconCloudUpload size={20}/>}
            disabled={backupMutation.isPending}
            loading={backupMutation.isPending}
            onClick={performBackup}
          />
        </SettingItem>

        {/* <SettingItem
          title="Automatic Backups"
          description="Enable daily automatic backups."
        >
          <Button
            type="button"
            size="sm"
            theme="secondary"
            label="Configure"
          />
        </SettingItem> */}
        <SettingItem
          title="Delete System Logs"
          description="Delete all system logs."
        >
          <Button
            size="sm"
            theme="danger"
            label="Delete logs"
            icon={<IconTrash size={20}/>}
            disabled={deleteLogsMutation.isPending}
            loading={deleteLogsMutation.isPending}
            onClick={deleteLogsSubmit}
          />
        </SettingItem>
      </SettingSection>

      <SettingSection
        title="Export & Recovery"
        description="Download or restore previous backups"
      >
        <SettingItem
          title="Send System Report"
          description="Send the latest System report."
        >
          <Button
            size="sm"
            theme="info"
            icon={<IconSend2 size={20}/>}
            label="Send Report"
            disabled={true}
          />
        </SettingItem>
      </SettingSection>
    </div>
  );
};