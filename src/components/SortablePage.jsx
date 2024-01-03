import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ActionIcon, Flex, Paper } from "@mantine/core";
import { Page } from "react-pdf";
import { IconX } from "../icons/Icons";

const SortablePage = ({ page_number, pageOrder, setPageOrder }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: page_number });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    cursor: "grab",
  };

  const deletePage = async (page_number) => {
    const new_page_order = pageOrder.filter(
      (element) => element !== page_number
    );
    await setPageOrder(new_page_order);
  };

  return (
    <div>
      <Flex justify={"end"}>
        <ActionIcon
          variant="light"
          aria-label="Delete"
          size={"sm"}
          onClick={() => deletePage(page_number)}
        >
          <IconX />
        </ActionIcon>
      </Flex>
      <Paper
        withBorder
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <Page pageNumber={page_number} className={"single_pdf_page"} />
      </Paper>
    </div>
  );
};

export default SortablePage;
