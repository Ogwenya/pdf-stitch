import { Box, Paper } from "@mantine/core";
import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);

const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

const DragArea = () => {
  const lg_layout = pages.map((page, index) => ({
    i: index.toString(),
    x: (index % 6) * 2,
    y: Math.floor(index / 6) * 2,
    w: 2,
    h: 3,
  }));

  const md_layout = pages.map((page, index) => ({
    i: index.toString(),
    x: (index % 4) * 2,
    y: Math.floor(index / 4) * 2,
    w: 2,
    h: 3,
  }));

  const sm_layout = pages.map((page, index) => ({
    i: index.toString(),
    x: (index % 2) * 2,
    y: Math.floor(index / 2) * 2,
    w: 2,
    h: 3,
  }));

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: lg_layout, md: md_layout, sm: sm_layout }}
      // layout={md_layout}
      cols={{ lg: 12, md: 8, sm: 4, xs: 1 }}
      breakpoints={{ lg: 1200, md: 996, sm: 768 }}
      rowHeight={100}
      width={1200}
    >
      {pages.map((page, index) => (
        <Paper withBorder key={index}>
          {index}
          {/* Render your PDF page here */}
        </Paper>
      ))}
    </ResponsiveGridLayout>
  );
};

export default DragArea;
