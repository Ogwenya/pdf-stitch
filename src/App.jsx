// import reactLogo from "./assets/react.svg";
import { useEffect } from "react";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { relaunch } from "@tauri-apps/api/process";
import { notifications } from "@mantine/notifications";
import {
  Button,
  ColorSchemeScript,
  MantineProvider,
  Text,
} from "@mantine/core";
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

  // Updater integration
  function startInstall(newVersion) {
    notifications.show({
      title: `Installing update v${newVersion}`,
      message: "Will relaunch afterwards",
      autoClose: false,
    });
    installUpdate().then(relaunch);
  }

  const checkForUpdates = () => {
    checkUpdate().then(({ shouldUpdate, manifest }) => {
      if (shouldUpdate) {
        const { version: newVersion, body: releaseNotes } = manifest;
        notifications.show({
          title: "Update available",
          color: "teal",
          message: (
            <>
              <Text>New version: v{newVersion}</Text>
              <Button
                color={"teal"}
                style={{ width: "100%" }}
                onClick={() => startInstall(newVersion)}
              >
                Install update and relaunch
              </Button>
            </>
          ),
          autoClose: false,
        });
      }
    });
  };

  useEffect(() => {
    if (window.__TAURI__ !== undefined) {
      checkForUpdates();

      // Check for updates every 1 hour
      const interval = setInterval(() => {
        checkForUpdates();
      }, 60 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, []);

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
