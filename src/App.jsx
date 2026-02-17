import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import "./App.css";

export default function App() {
  const [files, setFiles] = useState({
    "index.html": { name: "index.html", language: "html", value: "<h1>Hello</h1>" },
    "style.css": { name: "style.css", language: "css", value: "body{background:red}" },
    "script.js": { name: "script.js", language: "javascript", value: "console.log('hi')" },
  });

  const [fileName, setFileName] = useState("index.html");
  const [theme, setTheme] = useState("vs-dark");

  const editorRef = useRef(null);
  const file = files[fileName];

  function onMount(editor) {
    editorRef.current = editor;
  }

  function updateValue(value) {
    setFiles({
      ...files,
      [fileName]: { ...file, value }
    });
  }

  function addFile() {
    const name = prompt("File name?");
    if (!name) return;

    setFiles({
      ...files,
      [name]: { name, language: "html", value: "" }
    });

    setFileName(name);
  }

  function renameFile() {
    const newName = prompt("New name:");
    if (!newName) return;

    const newFiles = { ...files };
    newFiles[newName] = { ...newFiles[fileName], name: newName };
    delete newFiles[fileName];

    setFiles(newFiles);
    setFileName(newName);
  }

  function saveFile() {
    const blob = new Blob([file.value], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = file.name;
    a.click();
  }

  function runCode() {
    const html = files["index.html"]?.value || "";
    const css = files["style.css"]?.value || "";
    const js = files["script.js"]?.value || "";

    const win = window.open();
    win.document.write(`
      <style>${css}</style>
      ${html}
      <script>${js}<\/script>
    `);
  }
  return (
    <div style={{
  backgroundColor: theme === "light" ? "#c5c5c5" : "#1e1e1e",
 height: "100vh"}} >
            
      {/* toolbar */}
      <div id="toolpar"  style={{ padding: 10, backgroundColor: theme === "light" ? "#ffffff" : "#1e1e1e" }}>
        <h3>SUPER Text Editor</h3>
        {Object.keys(files).map(name => (
          <button style={{ backgroundColor: theme === "light" ? "#efefef" : "#2d2d30", transition: "ease-in"}} key={name} onClick={() => setFileName(name)}>
            {name}
          </button>
          
        ))}
        
  
        <button onClick={addFile} style={{ backgroundColor: theme === "light" ? "#efefef" : "#2d2d30"}} >+ File</button>
        <button onClick={renameFile} style={{ backgroundColor: theme === "light" ? "#efefef" : "#2d2d30"}}>Rename</button>
        <button onClick={saveFile}style={{ backgroundColor: theme === "light" ? "#efefef" : "#2d2d30"}}>Save</button>
        <button onClick={runCode}style={{ backgroundColor: theme === "light" ? "#efefef" : "#2d2d30"}}>Run ▶</button>

        <select onChange={e => setTheme(e.target.value)} style={{ backgroundColor: theme === "light" ? "#c1c1c1" : "#2d2d30"}}>
          <option value="vs-dark">Dark</option>
          <option value="light">Light</option>
                  </select>
      </div>
      <hr></hr>
      {/* editor */}
      <Editor
        height="90%"
        theme={theme}
        path={file.name}
        language={file.language}
        value={file.value}
        onMount={onMount}
        onChange={updateValue}
      />
    </div>
  );



}
