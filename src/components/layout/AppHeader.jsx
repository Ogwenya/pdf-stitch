// import { Box, Group } from "@mantine/core";

import {
  Menu,
  Group,
  Center,
  Container,
  Text,
  Flex,
  useMantineColorScheme,
  useComputedColorScheme,
  ActionIcon,
} from "@mantine/core";
import "../../AppHeader.module.css";
import { IconChevronDown, IconMoon, IconSun } from "../../icons/Icons";

const AppHeader = () => {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <div className="header">
      <Container size="md">
        <div className="inner">
          <Flex justify={"space-between"}>
            <Group>
              {/* save button */}
              <Text className="link" fz={"sm"}>
                Save
              </Text>

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
                  <Menu.Item>Reset</Menu.Item>
                  <Menu.Item>Quit</Menu.Item>
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
      </Container>
    </div>
  );
};

export default AppHeader;
