// import reactLogo from "./assets/react.svg";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import useDocumentStore from "./hooks/documentStore";
import Layout from "./components/layout/Layout";
import DragArea from "./components/DragArea";
import LoadingDocument from "./components/LoadingDocument";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

function App() {
  const { isStateUpdating } = useDocumentStore();
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider defaultColorScheme="dark">
        <Notifications position="bottom-right" />
        <Layout>{isStateUpdating ? <LoadingDocument /> : <DragArea />}</Layout>
      </MantineProvider>
    </>
  );
}

export default App;
