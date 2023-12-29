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
import { notifications } from "@mantine/notifications";
import { open } from "@tauri-apps/api/dialog";
import { exit } from "@tauri-apps/api/process";
import { IconChevronDown, IconMoon, IconSun } from "../../icons/Icons";
import useDocumentStore from "../../hooks/documentStore";
import "../../AppHeader.module.css";

const AppHeader = () => {
  const { setPdfFile, clearState } = useDocumentStore();
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
          message: "You did not select PDF file.",
          // classNames: notification_classes,
          autoClose: false,
        });
      } else {
        // user selected a single file

        await setPdfFile(selected);
      }
    }
  };

  const clear_state = async () => {
    await clearState();
  };

  const close_application = async () => {
    await exit();
  };

  return (
    <div className="header">
      <Box px={"sm"}>
        <div className="inner">
          <Flex justify={"space-between"}>
            <Group>
              {/* save button */}
              <Menu
                trigger="hover"
                transitionProps={{ exitDuration: 0 }}
                withinPortal
              >
                <Menu.Target>
                  <div className="links">
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
                  <Menu.Item>Save</Menu.Item>
                </Menu.Dropdown>
              </Menu>

              {/* application dropdown */}
              <Menu
                trigger="hover"
                transitionProps={{ exitDuration: 0 }}
                withinPortal
              >
                <Menu.Target>
                  <div className="link">
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
