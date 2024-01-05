import { create } from "zustand";
import { persist } from "zustand/middleware";
import { readBinaryFile } from "@tauri-apps/api/fs";
import { PDFDocument } from "pdf-lib";

const useDocumentStore = create(
  persist(
    (set, get) => ({
      pdfFile: null,
      pdfBytes: null,
      pageOrder: [],
      isStateUpdating: false,
      setPageOrder: async (order) => set({ pageOrder: order }),
      setPdfFile: async (file) => {
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
      },
      mergePdfFile: async (file) => {
        set({ isStateUpdating: true });

        const { pdfBytes: currentPdfBytes, pageOrder: currentPageOrder } =
          get();

        // Read the contents of the new file as binary data
        const fileContent = await readBinaryFile(file);

        // Create a Blob from the new file content
        const blob = new Blob([fileContent], { type: "application/pdf" });

        // Use FileReader to convert the Blob to a data URL
        const fileReader = new FileReader();

        fileReader.onload = async () => {
          const uploaded_pdf_bytes = fileReader.result;
          const existing_pdf_doc = await PDFDocument.load(currentPdfBytes);
          const uploaded_pdf_doc = await PDFDocument.load(uploaded_pdf_bytes);
          const uploaded_pdf_doc_pages = uploaded_pdf_doc.getPages();

          const new_pdf_doc = await PDFDocument.create();

          // add eisting pdf pages to the new document
          await currentPageOrder.map(async (pageIndex) => {
            const currentPage = pageIndex - 1;
            const [updatedPage] = await new_pdf_doc.copyPages(
              existing_pdf_doc,
              [currentPage]
            );
            new_pdf_doc.addPage(updatedPage);
          });

          // add the new uploaded pdf pages to the new document
          uploaded_pdf_doc_pages.map(async (page, pageIndex) => {
            // const currentPage = pageIndex + 1;
            const [updatedPage] = await new_pdf_doc.copyPages(
              uploaded_pdf_doc,
              [pageIndex]
            );
            new_pdf_doc.addPage(updatedPage);
          });

          // save the new pdf document as bytes
          const new_pdf_bytes = await new_pdf_doc.save({
            addDefaultPage: false,
          });

          // Create a Blob from the new_pdf_bytes
          const blob = new Blob([new_pdf_bytes], { type: "application/pdf" });

          // Use FileReader to convert the Blob to a data URL
          const reader = new FileReader();

          reader.onload = () => {
            const pdfDataUrl = reader.result;
            set({ pdfBytes: pdfDataUrl });
          };

          reader.readAsDataURL(blob);
        };

        fileReader.readAsDataURL(blob);
        set({ isStateUpdating: false });
      },
      clearState: () =>
        set({
          pdfFile: null,
          pdfBytes: null,
          isStateUpdating: false,
          pageOrder: [],
        }),
    }),
    {
      name: "pdf-stitch",
    }
  )
);

export default useDocumentStore;
