export default async function ({ addon, console, msg }) {
  function makeStyle() {
    let style = document.createElement("style");
    style.textContent = `
    .blocklyText {
        fill: #fff;
        font-family: "Helvetica Neue", Helvetica, sans-serif;
        font-size: 12pt;
        font-weight: 500;
    }
    .blocklyNonEditableText>text, .blocklyEditableText>text {
        fill: #575E75;
    }
    .blocklyDropdownText {
        fill: #fff !important;
    }
    `;
    for (let userstyle of document.querySelectorAll(".scratch-addons-style[data-addons*='editor-theme3']")) {
      if (userstyle.disabled) continue;
      style.textContent += userstyle.textContent;
    }
    return style;
  }

  function setCSSVars(element) {
    for (let property of document.documentElement.style) {
      if (property.startsWith("--editorTheme3-"))
        element.style.setProperty(property, document.documentElement.style.getPropertyValue(property));
    }
  }

  let exSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  exSVG.setAttribute("xmlns:html", "http://www.w3.org/1999/xhtml");
  exSVG.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
  exSVG.setAttribute("version", "1.1");

  // blocks-media as base64 for svg inline image
  let blocksMedia = new Map();
  blocksMedia.set(
    "repeat.svg",
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIxLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9InJlcGVhdCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyNCAyNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNDRjhCMTc7fQoJLnN0MXtmaWxsOiNGRkZGRkY7fQo8L3N0eWxlPgo8dGl0bGU+cmVwZWF0PC90aXRsZT4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTIzLjMsMTFjLTAuMywwLjYtMC45LDEtMS41LDFoLTEuNmMtMC4xLDEuMy0wLjUsMi41LTEuMSwzLjZjLTAuOSwxLjctMi4zLDMuMi00LjEsNC4xCgljLTEuNywwLjktMy42LDEuMi01LjUsMC45Yy0xLjgtMC4zLTMuNS0xLjEtNC45LTIuM2MtMC43LTAuNy0wLjctMS45LDAtMi42YzAuNi0wLjYsMS42LTAuNywyLjMtMC4ySDdjMC45LDAuNiwxLjksMC45LDIuOSwwLjkKCXMxLjktMC4zLDIuNy0wLjljMS4xLTAuOCwxLjgtMi4xLDEuOC0zLjVoLTEuNWMtMC45LDAtMS43LTAuNy0xLjctMS43YzAtMC40LDAuMi0wLjksMC41LTEuMmw0LjQtNC40YzAuNy0wLjYsMS43LTAuNiwyLjQsMEwyMyw5LjIKCUMyMy41LDkuNywyMy42LDEwLjQsMjMuMywxMXoiLz4KPHBhdGggY2xhc3M9InN0MSIgZD0iTTIxLjgsMTFoLTIuNmMwLDEuNS0wLjMsMi45LTEsNC4yYy0wLjgsMS42LTIuMSwyLjgtMy43LDMuNmMtMS41LDAuOC0zLjMsMS4xLTQuOSwwLjhjLTEuNi0wLjItMy4yLTEtNC40LTIuMQoJYy0wLjQtMC4zLTAuNC0wLjktMC4xLTEuMmMwLjMtMC40LDAuOS0wLjQsMS4yLTAuMWwwLDBjMSwwLjcsMi4yLDEuMSwzLjQsMS4xczIuMy0wLjMsMy4zLTFjMC45LTAuNiwxLjYtMS41LDItMi42CgljMC4zLTAuOSwwLjQtMS44LDAuMi0yLjhoLTIuNGMtMC40LDAtMC43LTAuMy0wLjctMC43YzAtMC4yLDAuMS0wLjMsMC4yLTAuNGw0LjQtNC40YzAuMy0wLjMsMC43LTAuMywwLjksMEwyMiw5LjgKCWMwLjMsMC4zLDAuNCwwLjYsMC4zLDAuOVMyMiwxMSwyMS44LDExeiIvPgo8L3N2Zz4K"
  );
  blocksMedia.set(
    "green-flag.svg",
    "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2Ni44NzYyMSIgaGVpZ2h0PSI4NS45NTQwMyIgdmlld0JveD0iMCwwLDY2Ljg3NjIxLDg1Ljk1NDAzIj48ZGVmcz48bGluZWFyR3JhZGllbnQgeDE9IjIzOC45NTIyNiIgeTE9IjE0MS45MzI3IiB4Mj0iMjM4Ljk1MjI2IiB5Mj0iMTkwLjQwODc5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzM4MzY1NyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzIzMTQxZSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSIyMzguOTUyMjYiIHkxPSIxNDEuOTMyNyIgeDI9IjIzOC45NTIyNiIgeTI9IjE5MC40MDg3OSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0yIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxYzE4MmEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwYzBhMTIiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMjA3Ljg1Mjg1IiB5MT0iMTQxLjk2NzQ5IiB4Mj0iMjA3Ljg1Mjg1IiB5Mj0iMjIzLjQyMTUzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTMiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzFjMTgyYSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDUuMzU0MDEsLTEzOS43MTc0OSkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2Utd2lkdGg9IjQuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjI3LjAxMzYzLDE0Mi4xMzMzOWMxMS44MzI5NCwxLjE2NzU2IDE1LjQ4Nzk0LDYuOTkxMzYgMjMuNTU2OTcsNy4yOTkzNWM4LjA2OTAzLDAuMzA3OTcgMTkuNDA5NjIsLTQuMTQ3MzYgMTkuNDA5NjIsLTQuMTQ3MzZsLTAuMTY1ODksMzguNjUzMzRjMCwwIC01LjcyMzM5LDYuNTExMTkgLTE2LjU4OTQyLDYuNDY5ODdjLTEwLjg2NjA0LC0wLjA0MTMxIC0xOS43NzU3OCwtNi4xODE2NCAtMjcuMDQwNzUsLTYuNjM1NzZjLTcuMjY0OTYsLTAuNDU0MTMgLTE4LjI1OTg0LDMuODA0MDggLTE4LjI1OTg0LDMuODA0MDhsMC4zMzE3OSwtNDIuMzAzMDFjMCwwIDYuOTI0NTgsLTQuMzA4MDcgMTguNzU3NTIsLTMuMTQwNXoiIGZpbGw9InVybCgjY29sb3ItMSkiIHN0cm9rZT0idXJsKCNjb2xvci0yKSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMDcuNjA0MDEsMTQxLjk2NzQ5bDAuNDk3NjgsODEuNDU0MDMiIGZpbGwtb3BhY2l0eT0iMCIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJ1cmwoI2NvbG9yLTMpIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6MzQuNjQ1OTkyODkyNzM3ODQ6NDAuMjgyNTA4MjU0MzM2MjItLT4="
  );
  blocksMedia.set(
    "blue-flag.svg",
    "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2Ni44NzYyMSIgaGVpZ2h0PSI4NS45NTQwMyIgdmlld0JveD0iMCwwLDY2Ljg3NjIxLDg1Ljk1NDAzIj48ZGVmcz48bGluZWFyR3JhZGllbnQgeDE9IjIzOC45NTIyNiIgeTE9IjE0MS45MzI3IiB4Mj0iMjM4Ljk1MjI2IiB5Mj0iMTkwLjQwODc5IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTEiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzM4MzY1NyIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzIzMTQxZSIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IHgxPSIyMzguOTUyMjYiIHkxPSIxNDEuOTMyNyIgeDI9IjIzOC45NTIyNiIgeTI9IjE5MC40MDg3OSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0yIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMxYzE4MmEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwYzBhMTIiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCB4MT0iMjA3Ljg1Mjg1IiB5MT0iMTQxLjk2NzQ5IiB4Mj0iMjA3Ljg1Mjg1IiB5Mj0iMjIzLjQyMTUzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImNvbG9yLTMiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iIzFjMTgyYSIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMDUuMzU0MDEsLTEzOS43MTc0OSkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2Utd2lkdGg9IjQuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjI3LjAxMzYzLDE0Mi4xMzMzOWMxMS44MzI5NCwxLjE2NzU2IDE1LjQ4Nzk0LDYuOTkxMzYgMjMuNTU2OTcsNy4yOTkzNWM4LjA2OTAzLDAuMzA3OTcgMTkuNDA5NjIsLTQuMTQ3MzYgMTkuNDA5NjIsLTQuMTQ3MzZsLTAuMTY1ODksMzguNjUzMzRjMCwwIC01LjcyMzM5LDYuNTExMTkgLTE2LjU4OTQyLDYuNDY5ODdjLTEwLjg2NjA0LC0wLjA0MTMxIC0xOS43NzU3OCwtNi4xODE2NCAtMjcuMDQwNzUsLTYuNjM1NzZjLTcuMjY0OTYsLTAuNDU0MTMgLTE4LjI1OTg0LDMuODA0MDggLTE4LjI1OTg0LDMuODA0MDhsMC4zMzE3OSwtNDIuMzAzMDFjMCwwIDYuOTI0NTgsLTQuMzA4MDcgMTguNzU3NTIsLTMuMTQwNXoiIGZpbGw9InVybCgjY29sb3ItMSkiIHN0cm9rZT0idXJsKCNjb2xvci0yKSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yMDcuNjA0MDEsMTQxLjk2NzQ5bDAuNDk3NjgsODEuNDU0MDMiIGZpbGwtb3BhY2l0eT0iMCIgZmlsbD0iIzAwMDAwMCIgc3Ryb2tlPSJ1cmwoI2NvbG9yLTMpIiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6MzQuNjQ1OTkyODkyNzM3ODQ6NDAuMjgyNTA4MjU0MzM2MjItLT4="
  );
  blocksMedia.set(
    "control_stop.svg",
    "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI4MC40ODE0NSIgaGVpZ2h0PSI4MC40ODE0NSIgdmlld0JveD0iMCwwLDgwLjQ4MTQ1LDgwLjQ4MTQ1Ij48ZGVmcz48bGluZWFyR3JhZGllbnQgeDE9IjI0MC4wMDAwMSIgeTE9IjE0MS4yNTkyOCIgeDI9IjI0MC4wMDAwMSIgeTI9IjIxOC43NDA3MyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZjI0ODQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNjNDAwNTYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTk5Ljc1OTI4LC0xMzkuNzU5MjgpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGw9InVybCgjY29sb3ItMSkiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSIjNzgwMDM0IiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjIzLjk1MzA3LDIxOC43NDA3M2wtMjIuNjkzNzksLTIyLjY5Mzc5di0zMi4wOTM4N2wyMi42OTM3OSwtMjIuNjkzNzloMzIuMDkzODdsMjIuNjkzNzksMjIuNjkzNzl2MzIuMDkzODdsLTIyLjY5Mzc5LDIyLjY5Mzc5eiIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjQwLjI0MDcxNzE0NTE0OTM1OjQwLjI0MDcxNzE0NTE0OTI5LS0+"
  );
  blocksMedia.set(
    "rotate-left.svg",
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIGlkPSJyb3RhdGUtY2xvY2t3aXNlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHN0eWxlPi5jbHMtMXtmaWxsOiMzZDc5Y2M7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PHRpdGxlPnJvdGF0ZS1jbG9ja3dpc2U8L3RpdGxlPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTIwLjM0LDE4LjIxYTEwLjI0LDEwLjI0LDAsMCwxLTguMSw0LjIyLDIuMjYsMi4yNiwwLDAsMS0uMTYtNC41MmgwYTUuNTgsNS41OCwwLDAsMCw0LjI1LTIuNTMsNS4wNiw1LjA2LDAsMCwwLC41NC00LjYyQTQuMjUsNC4yNSwwLDAsMCwxNS41NSw5YTQuMzEsNC4zMSwwLDAsMC0yLS44QTQuODIsNC44MiwwLDAsMCwxMC40LDlsMS4xMiwxLjQxQTEuNTksMS41OSwwLDAsMSwxMC4zNiwxM0gyLjY3YTEuNTYsMS41NiwwLDAsMS0xLjI2LS42M0ExLjU0LDEuNTQsMCwwLDEsMS4xMywxMUwyLjg1LDMuNTdBMS41OSwxLjU5LDAsMCwxLDQuMzgsMi40LDEuNTcsMS41NywwLDAsMSw1LjYyLDNMNi43LDQuMzVhMTAuNjYsMTAuNjYsMCwwLDEsNy43Mi0xLjY4QTkuODgsOS44OCwwLDAsMSwxOSw0LjgxLDkuNjEsOS42MSwwLDAsMSwyMS44Myw5LDEwLjA4LDEwLjA4LDAsMCwxLDIwLjM0LDE4LjIxWiIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE5LjU2LDE3LjY1YTkuMjksOS4yOSwwLDAsMS03LjM1LDMuODMsMS4zMSwxLjMxLDAsMCwxLS4wOC0yLjYyLDYuNTMsNi41MywwLDAsMCw1LTIuOTIsNi4wNSw2LjA1LDAsMCwwLC42Ny01LjUxLDUuMzIsNS4zMiwwLDAsMC0xLjY0LTIuMTYsNS4yMSw1LjIxLDAsMCwwLTIuNDgtMUE1Ljg2LDUuODYsMCwwLDAsOSw4Ljg0TDEwLjc0LDExYS41OS41OSwwLDAsMS0uNDMsMUgyLjdhLjYuNiwwLDAsMS0uNi0uNzVMMy44MSwzLjgzYS41OS41OSwwLDAsMSwxLS4yMWwxLjY3LDIuMWE5LjcxLDkuNzEsMCwwLDEsNy43NS0yLjA3LDguODQsOC44NCwwLDAsMSw0LjEyLDEuOTIsOC42OCw4LjY4LDAsMCwxLDIuNTQsMy43MkE5LjE0LDkuMTQsMCwwLDEsMTkuNTYsMTcuNjVaIi8+PC9zdmc+"
  );
  blocksMedia.set(
    "rotate-right.svg",
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIGlkPSJyb3RhdGUtY291bnRlci1jbG9ja3dpc2UiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6IzNkNzljYzt9LmNscy0ye2ZpbGw6I2ZmZjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPnJvdGF0ZS1jb3VudGVyLWNsb2Nrd2lzZTwvdGl0bGU+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjIuNjgsMTIuMmExLjYsMS42LDAsMCwxLTEuMjcuNjNIMTMuNzJhMS41OSwxLjU5LDAsMCwxLTEuMTYtMi41OGwxLjEyLTEuNDFhNC44Miw0LjgyLDAsMCwwLTMuMTQtLjc3LDQuMzEsNC4zMSwwLDAsMC0yLC44LDQuMjUsNC4yNSwwLDAsMC0xLjM0LDEuNzMsNS4wNiw1LjA2LDAsMCwwLC41NCw0LjYyQTUuNTgsNS41OCwwLDAsMCwxMiwxNy43NGgwYTIuMjYsMi4yNiwwLDAsMS0uMTYsNC41MkExMC4yNSwxMC4yNSwwLDAsMSwzLjc0LDE4LDEwLjE0LDEwLjE0LDAsMCwxLDIuMjUsOC43OCw5LjcsOS43LDAsMCwxLDUuMDgsNC42NCw5LjkyLDkuOTIsMCwwLDEsOS42NiwyLjVhMTAuNjYsMTAuNjYsMCwwLDEsNy43MiwxLjY4bDEuMDgtMS4zNWExLjU3LDEuNTcsMCwwLDEsMS4yNC0uNiwxLjYsMS42LDAsMCwxLDEuNTQsMS4yMWwxLjcsNy4zN0ExLjU3LDEuNTcsMCwwLDEsMjIuNjgsMTIuMloiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0yMS4zOCwxMS44M0gxMy43N2EuNTkuNTksMCwwLDEtLjQzLTFsMS43NS0yLjE5YTUuOSw1LjksMCwwLDAtNC43LTEuNTgsNS4wNyw1LjA3LDAsMCwwLTQuMTEsMy4xN0E2LDYsMCwwLDAsNywxNS43N2E2LjUxLDYuNTEsMCwwLDAsNSwyLjkyLDEuMzEsMS4zMSwwLDAsMS0uMDgsMi42Miw5LjMsOS4zLDAsMCwxLTcuMzUtMy44MkE5LjE2LDkuMTYsMCwwLDEsMy4xNyw5LjEyLDguNTEsOC41MSwwLDAsMSw1LjcxLDUuNCw4Ljc2LDguNzYsMCwwLDEsOS44MiwzLjQ4YTkuNzEsOS43MSwwLDAsMSw3Ljc1LDIuMDdsMS42Ny0yLjFhLjU5LjU5LDAsMCwxLDEsLjIxTDIyLDExLjA4QS41OS41OSwwLDAsMSwyMS4zOCwxMS44M1oiLz48L3N2Zz4="
  );
  blocksMedia.set(
    "dropdown-arrow.svg",
    "data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMi43MSIgaGVpZ2h0PSI4Ljc5IiB2aWV3Qm94PSIwIDAgMTIuNzEgOC43OSI+PHRpdGxlPmRyb3Bkb3duLWFycm93PC90aXRsZT48ZyBvcGFjaXR5PSIwLjEiPjxwYXRoIGQ9Ik0xMi43MSwyLjQ0QTIuNDEsMi40MSwwLDAsMSwxMiw0LjE2TDguMDgsOC4wOGEyLjQ1LDIuNDUsMCwwLDEtMy40NSwwTDAuNzIsNC4xNkEyLjQyLDIuNDIsMCwwLDEsMCwyLjQ0LDIuNDgsMi40OCwwLDAsMSwuNzEuNzFDMSwwLjQ3LDEuNDMsMCw2LjM2LDBTMTEuNzUsMC40NiwxMiwuNzFBMi40NCwyLjQ0LDAsMCwxLDEyLjcxLDIuNDRaIiBmaWxsPSIjMjMxZjIwIi8+PC9nPjxwYXRoIGQ9Ik02LjM2LDcuNzlhMS40MywxLjQzLDAsMCwxLTEtLjQyTDEuNDIsMy40NWExLjQ0LDEuNDQsMCwwLDEsMC0yYzAuNTYtLjU2LDkuMzEtMC41Niw5Ljg3LDBhMS40NCwxLjQ0LDAsMCwxLDAsMkw3LjM3LDcuMzdBMS40MywxLjQzLDAsMCwxLDYuMzYsNy43OVoiIGZpbGw9IiNmZmYiLz48L3N2Zz4="
  );

  addon.tab.createBlockContextMenu(
    (items) => {
      if (addon.self.disabled) return items;
      let svgchild = document.querySelector("svg.blocklySvg g.blocklyBlockCanvas");

      const pasteItemIndex = items.findIndex((obj) => obj._isDevtoolsFirstItem);
      const insertBeforeIndex =
        pasteItemIndex !== -1
          ? // If "paste" button exists, add own items before it
            pasteItemIndex
          : // If there's no such button, insert at end
            items.length;

      items.splice(
        insertBeforeIndex,
        0,
        {
          enabled: !!svgchild?.childNodes?.length,
          text: msg("export_all_to_SVG"),
          callback: () => {
            exportBlock(false);
          },
          separator: true,
        },
        {
          enabled: !!svgchild?.childNodes?.length,
          text: msg("export_all_to_PNG"),
          callback: () => {
            exportBlock(true);
          },
          separator: false,
        }
      );

      return items;
    },
    { workspace: true }
  );
  addon.tab.createBlockContextMenu(
    (items, block) => {
      if (addon.self.disabled) return items;
      const makeSpaceItemIndex = items.findIndex((obj) => obj._isDevtoolsFirstItem);
      const insertBeforeIndex =
        makeSpaceItemIndex !== -1
          ? // If "make space" button exists, add own items before it
            makeSpaceItemIndex
          : // If there's no such button, insert at end
            items.length;

      items.splice(
        insertBeforeIndex,
        0,
        {
          enabled: true,
          text: msg("export_selected_to_SVG"),
          callback: () => {
            exportBlock(false, block);
          },
          separator: true,
        },
        {
          enabled: true,
          text: msg("export_selected_to_PNG"),
          callback: () => {
            exportBlock(true, block);
          },
          separator: false,
        }
      );

      return items;
    },
    { blocks: true }
  );

  function exportBlock(isExportPNG, block) {
    let svg;
    if (block) {
      svg = selectedBlocks(isExportPNG, block);
    } else {
      svg = allBlocks(isExportPNG);
    }
    // resolve nbsp whitespace
    svg.querySelectorAll("text").forEach((text) => {
      text.innerHTML = text.innerHTML.replace(/&nbsp;/g, " ");
    });
    // resolve image path
    let scratchURL = window.location.origin;

    svg.querySelectorAll("image").forEach((item) => {
      let builtinSvgData = blocksMedia.get(
        item.getAttribute("xlink:href").substring(item.getAttribute("xlink:href").lastIndexOf("/") + 1)
      );
      if (builtinSvgData) {
        // replace svg file path (official) to inline svg
        item.setAttribute("xlink:href", builtinSvgData);
      } else if (item.getAttribute("xlink:href").indexOf("/static/") === 0) {
        // replace link path for third party website
        item.setAttribute("xlink:href", scratchURL + item.getAttribute("xlink:href").slice(0));
      } else if (item.getAttribute("xlink:href").indexOf("./static/") === 0) {
        item.setAttribute("xlink:href", scratchURL + item.getAttribute("xlink:href").slice(1));
      } else if (item.getAttribute("xlink:href").indexOf("static/") === 0) {
        item.setAttribute("xlink:href", scratchURL + "/" + item.getAttribute("xlink:href"));
      }
    });
    if (!isExportPNG) {
      exportData(new XMLSerializer().serializeToString(svg));
    } else {
      exportPNG(svg);
    }
  }

  function selectedBlocks(isExportPNG, block) {
    let svg = exSVG.cloneNode();

    let svgchild = block.svgGroup_;
    svgchild = svgchild.cloneNode(true);
    let dataShapes = svgchild.getAttribute("data-shapes");
    svgchild.setAttribute(
      "transform",
      `translate(0,${dataShapes === "hat" ? "18" : "0"}) ${isExportPNG ? "scale(2)" : ""}`
    );
    setCSSVars(svg);
    svg.append(makeStyle());
    svg.append(svgchild);
    return svg;
  }

  function allBlocks(isExportPNG) {
    let svg = exSVG.cloneNode();

    let svgchild = document.querySelector("svg.blocklySvg g.blocklyBlockCanvas");
    svgchild = svgchild.cloneNode(true);

    let xArr = [];
    let yArr = [];

    svgchild.childNodes.forEach((g) => {
      let x = g.getAttribute("transform").match(/translate\((.*?),(.*?)\)/)[1] || 0;
      let y = g.getAttribute("transform").match(/translate\((.*?),(.*?)\)/)[2] || 0;
      xArr.push(x * (isExportPNG ? 2 : 1));
      yArr.push(y * (isExportPNG ? 2 : 1));
      g.style.display = ""; // because of TW scratch-blocks changes
    });

    svgchild.setAttribute(
      "transform",
      `translate(${-Math.min(...xArr)},${-Math.min(...yArr) + 18 * (isExportPNG ? 2 : 1)}) ${
        isExportPNG ? "scale(2)" : ""
      }`
    );
    setCSSVars(svg);
    svg.append(makeStyle());
    svg.append(svgchild);
    return svg;
  }

  function exportData(text) {
    const saveLink = document.createElement("a");
    document.body.appendChild(saveLink);

    const data = new Blob([text], { type: "text" });
    const url = window.URL.createObjectURL(data);
    saveLink.href = url;

    // File name: project-DATE-TIME
    const date = new Date();
    const timestamp = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;
    saveLink.download = `block_${timestamp}.svg`;
    saveLink.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(saveLink);
  }

  function exportPNG(svg) {
    const serializer = new XMLSerializer();

    const iframe = document.createElement("iframe");
    // iframe.style.display = "none"
    document.body.append(iframe);
    iframe.contentDocument.write(serializer.serializeToString(svg));
    let { width, height } = iframe.contentDocument.body.querySelector("svg g").getBoundingClientRect();
    height = height + 20 * 2; //  hat block height restore
    svg.setAttribute("width", width + "px");
    svg.setAttribute("height", height + "px");

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    let img = document.createElement("img");

    img.setAttribute(
      "src",
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(serializer.serializeToString(svg))))
    );
    img.onload = function () {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      // Now is done
      let dataURL = canvas.toDataURL("image/png");
      let link = document.createElement("a");
      const date = new Date();
      const timestamp = `${date.toLocaleDateString()}-${date.toLocaleTimeString()}`;

      link.download = `block_${timestamp}.png`;
      link.href = dataURL;
      link.click();
      iframe.remove();
    };
  }
}
