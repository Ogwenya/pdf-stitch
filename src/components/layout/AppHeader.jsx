import { open } from "@tauri-apps/api/dialog";
import { exit } from "@tauri-apps/api/process";
import { exists, writeBinaryFile, createDir } from "@tauri-apps/api/fs";
import { desktopDir } from "@tauri-apps/api/path";
import { PDFDocument } from "pdf-lib";
import { notifications } from "@mantine/notifications";
import {
  Menu,
  Group,
  Center,
  Text,
  Flex,
  useMantineColorScheme,
  useComputedColorScheme,
  ActionIcon,
  Box,
} from "@mantine/core";
import { IconChevronDown, IconMoon, IconSun } from "../../icons/Icons";
import useDocumentStore from "../../hooks/documentStore";

const AppHeader = () => {
  const { pdfBytes, pdfFile, pageOrder, setPdfFile, clearState } =
    useDocumentStore();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  const selectDocument = async () => {
    if (window.__TAURI__ !== undefined) {
      const selected = await open({
        filters: [
          {
            name: "Document",
            extensions: ["pdf"],
          },
        ],
      });
      if (selected === null) {
        // user cancelled the selection
        notifications.show({
          color: "red",
          title: "Selection Error",
          message: "You did not select a PDF file.",
          autoClose: false,
        });
      } else {
        // user selected a file
        await setPdfFile(selected);
      }
    }
  };

  const clear_state = async () => {
    notifications.clean();

    await clearState();
  };

  const close_application = async () => {
    await clearState();
    await exit();
  };

  const reorderPDF = async () => {
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Create a new PDF document with reordered pages
    const newPdfDoc = await PDFDocument.create();

    console.log({ pageOrder });

    // Reorder the pages based on the new order
    await pageOrder.map(async (pageIndex) => {
      const currentPage = pageIndex - 1;
      const [updatedPage] = await newPdfDoc.copyPages(pdfDoc, [currentPage]);
      newPdfDoc.addPage(updatedPage);
    });

    const newPdfBytes = await newPdfDoc.save({ addDefaultPage: false });
    return newPdfBytes;
  };

  const savePDF = async () => {
    try {
      // remove existing notifications
      notifications.clean();

      const desktopPath = await desktopDir();
      const results_folder = `${desktopPath}pdf-stitch`;
      let fileName = pdfFile.split("/").pop();
      let file_path = `${results_folder}/${fileName}`;

      // create the results folder if it does not exist
      if (!(await exists(results_folder))) {
        await createDir(results_folder, {
          recursive: true,
        });
      }

      // if filename exists, add timestamp to it to make it unique
      if (await exists(file_path)) {
        const date = new Date();
        const timestamp =
          date.getFullYear() +
          ("0" + (date.getMonth() + 1)).slice(-2) +
          ("0" + date.getDate()).slice(-2) +
          ("0" + date.getHours()).slice(-2) +
          ("0" + date.getMinutes()).slice(-2) +
          ("0" + date.getSeconds()).slice(-2);

        const filename_without_extension = await fileName.slice(0, -4);
        fileName = `${filename_without_extension}-${timestamp}.pdf`;
        file_path = `${results_folder}/${fileName}`;
      }

      const newPdfBytes = await reorderPDF();
      const response = await writeBinaryFile(file_path, newPdfBytes);

      notifications.show({
        color: "green",
        title: "File Operation Success",
        message: (
          <>
            <Text>File saved to:</Text>
            <Text fw={700}>{file_path}</Text>
          </>
        ),
        autoClose: false,
      });
    } catch (error) {
      notifications.show({
        color: "red",
        title: "File Operation Error",
        message: error.message,
        autoClose: false,
      });
    }
  };

  return (
    <div>
      <Box px={"sm"}>
        <div>
          <Flex justify={"space-between"}>
            <Group>
              {/* save button */}
              <Menu
                trigger="hover"
                transitionProps={{ exitDuration: 0 }}
                withinPortal
              >
                <Menu.Target>
                  <div className="cursor_pointer">
                    <Center>
                      <Text fz={"sm"}>File</Text>
                      <Text fz={"sm"} h={22} w={15}>
                        <IconChevronDown />
                      </Text>
                    </Center>
                  </div>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={selectDocument}>Open</Menu.Item>
                  {pdfBytes && pageOrder && pageOrder.length > 0 && (
                    <Menu.Item onClick={savePDF}>Save</Menu.Item>
                  )}
                </Menu.Dropdown>
              </Menu>

              {/* application dropdown */}
              <Menu
                trigger="hover"
                transitionProps={{ exitDuration: 0 }}
                withinPortal
              >
                <Menu.Target>
                  <div className="cursor_pointer">
                    <Center>
                      <Text fz={"sm"}>Application</Text>
                      <Text fz={"sm"} h={22} w={15}>
                        <IconChevronDown />
                      </Text>
                    </Center>
                  </div>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item onClick={clear_state}>Reset</Menu.Item>
                  <Menu.Item onClick={close_application}>Quit</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>

            {/* ################################## */}
            {/* ########## THEME TOGGLE ########## */}
            {/* ################################## */}
            <ActionIcon
              onClick={() =>
                setColorScheme(
                  computedColorScheme === "light" ? "dark" : "light"
                )
              }
              variant="transparent"
              color={computedColorScheme === "light" ? "blue.6" : "yellow.4"}
            >
              {computedColorScheme === "light" ? (
                <IconMoon stroke={1.5} />
              ) : (
                <IconSun stroke={1.5} />
              )}
            </ActionIcon>
          </Flex>
        </div>
      </Box>
    </div>
  );
};

export default AppHeader;
