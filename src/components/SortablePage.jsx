import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Paper } from "@mantine/core";
import { Page } from "react-pdf";

const SortablePage = ({ page_number }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: page_number });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    cursor: "grab",
  };

  return (
    <Paper
      withBorder
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Page pageNumber={page_number} className={"single_pdf_page"} />
    </Paper>
  );
};

export default SortablePage;
