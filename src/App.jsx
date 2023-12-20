import { useState } from "react";
// import reactLogo from "./assets/react.svg";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { invoke } from "@tauri-apps/api/tauri";
import "@mantine/core/styles.css";
import Layout from "./components/layout/Layout";

function App() {
  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <>
      <ColorSchemeScript defaultColorScheme="dark" />
      <MantineProvider defaultColorScheme="dark">
        <Layout>
          <p>home</p>
        </Layout>
      </MantineProvider>
    </>
  );
}

export default App;
