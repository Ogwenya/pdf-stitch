import { notifications } from "@mantine/notifications";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { readBinaryFile } from "@tauri-apps/api/fs";

const useDocumentStore = create(
  persist(
    (set) => ({
      pdfFile: null,
      pdfBytes: null,
      isStateUpdating: false,
      setPdfFile: async (file) => {
        if (file && file.toLowerCase().endsWith(".pdf")) {
          set({ isStateUpdating: true });
          set({ pdfFile: file });

          // Read the contents of the file as binary data
          const fileContent = await readBinaryFile(file);

          // Create a Blob from the file content
          const blob = new Blob([fileContent], { type: "application/pdf" });

          // Use FileReader to convert the Blob to a data URL
          const fileReader = new FileReader();

          fileReader.onload = () => {
            const pdfDataUrl = fileReader.result;
            set({ pdfBytes: pdfDataUrl });
          };

          fileReader.readAsDataURL(blob);
          set({ isStateUpdating: false });
        } else {
          notifications.show({
            color: "red",
            title: "File Selection Error",
            message: "Please select a PDF file.",
            // classNames: notification_classes,
            autoClose: false,
          });
        }
      },
      clearState: () =>
        set({ pdfFile: null, pdfBytes: null, isStateUpdating: false }),
    }),
    {
      name: "pdf-stitch",
    }
  )
);

export default useDocumentStore;
