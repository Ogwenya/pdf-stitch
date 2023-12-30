import { Container, Title, Kbd, List, rem, ThemeIcon } from "@mantine/core";
import classes from "../NoDocument.module.css";
import { IconCircleCheck } from "../icons/Icons";

const NoDocument = () => {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>No Document Selected</Title>

          <List
            spacing="xs"
            size="sm"
            center
            icon={
              <ThemeIcon
                variant="transparent"
                size={24}
                c="light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))"
                radius="xl"
                p={2}
              >
                <IconCircleCheck style={{ width: rem(16), height: rem(16) }} />
              </ThemeIcon>
            }
            w={"fit-content"}
            mt={"lg"}
            mx={"auto"}
          >
            <List.Item>
              Click <Kbd>File</Kbd> then <Kbd>Open</Kbd> to open a pdf document
              and perform opertions.
            </List.Item>
            <List.Item>
              Click <Kbd>File</Kbd> then <Kbd>Save</Kbd> to save a pdf document
              after performing opertions.
            </List.Item>
            <List.Item>
              Click <Kbd>Application</Kbd> then <Kbd>Reset</Kbd> to reset the
              application and remove the selected document.
            </List.Item>
            <List.Item>
              Click <Kbd>Application</Kbd> then <Kbd>Quit</Kbd> to exit the
              apllication.
            </List.Item>
          </List>
        </div>
      </div>
    </Container>
  );
};

export default NoDocument;
