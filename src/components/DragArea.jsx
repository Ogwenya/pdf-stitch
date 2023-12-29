import { useState } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Document, pdfjs } from "react-pdf";
import { Box, SimpleGrid } from "@mantine/core";
import useDocumentStore from "../hooks/documentStore";
import SortablePage from "./SortablePage";
import NoDocument from "./NoDocument";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const DragArea = () => {
  const { pdfBytes, pageOrder, setPageOrder } = useDocumentStore();

  if (!pdfBytes) {
    return <NoDocument />;
  }

  function numberToArray(number) {
    // Check if the provided input is a positive integer
    if (Number.isInteger(number) && number > 0) {
      // Initialize an empty array to store the result
      var resultArray = [];

      // Use a loop to generate numbers from 1 to the provided number
      for (let i = 1; i <= number; i++) {
        resultArray.push(i);
      }

      return resultArray;
    }
  }

  async function onDocumentLoadSuccess({ numPages }) {
    await setPageOrder(numberToArray(numPages));
  }

  const onDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id === over.id) {
      return;
    }

    const oldIndex = await pageOrder.findIndex((page) => page === active.id);
    const newIndex = await pageOrder.findIndex((page) => page === over.id);

    await setPageOrder(arrayMove(pageOrder, oldIndex, newIndex));
  };

  return (
    <Box my={"lg"} px={"lg"}>
      <Document file={pdfBytes} onLoadSuccess={onDocumentLoadSuccess}>
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext
            items={pageOrder}
            strategy={verticalListSortingStrategy}
          >
            <SimpleGrid
              cols={{ base: 2, sm: 3, md: 4, lg: 6 }}
              style={{ overflow: "hidden" }}
            >
              {pageOrder.map((page) => (
                <SortablePage key={page} page_number={page} />
              ))}
            </SimpleGrid>
          </SortableContext>
        </DndContext>
      </Document>
    </Box>
  );
};

export default DragArea;
