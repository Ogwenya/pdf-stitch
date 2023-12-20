import { AppShell } from "@mantine/core";
import AppHeader from "./AppHeader";

const Layout = ({ children }) => {
  return (
    <AppShell>
      <AppShell.Header p={"xs"} pos={"sticky"} top={0} w={"100%"}>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Main px={"lg"}>{children}</AppShell.Main>
    </AppShell>
  );
};

export default Layout;
