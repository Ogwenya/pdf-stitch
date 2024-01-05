import { AppShell } from "@mantine/core";
import AppHeader from "./AppHeader";

const Layout = ({ children }) => {
  return (
    <AppShell header={{ height: 50 }}>
      <AppShell.Header p={"xs"} pos={"sticky"} top={0} w={"100%"} h={"100%"}>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Main px={"lg"} mih={"100%"} py={0}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
