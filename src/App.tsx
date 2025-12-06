import { useState } from "react";

function App() {
  const [template, setTemplate] = useState("<h1>Hola {{nombre}}</h1>");
  const [jsonData, setJsonData] = useState('{ "nombre": "Juan" }');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generatePDF = async () => {
    try {
      const data = JSON.parse(jsonData);

      const res = await fetch("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template, data }),
      });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (e) {
      alert("Error generando PDF: " + e);
    }
  };

  const loadTemplateFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setTemplate(reader.result as string);
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const blob = new Blob([template], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla.html";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto" }}>
      <h1>📝 PDF Generator MVP</h1>

      {/* ====================  SECCION PLANTILLA  ==================== */}
      <section style={{ marginBottom: 40 }}>
        <h2>1. Plantilla HTML</h2>

        <input
          type="file"
          accept=".html,.htm,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) loadTemplateFromFile(file);
          }}
          style={{ marginBottom: 10 }}
        />

        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          style={{ width: "100%", height: 200 }}
        />

        <button onClick={downloadTemplate} style={{ marginTop: 10, padding: 8 }}>
          Descargar plantilla
        </button>
      </section>

      {/* ====================  SECCION JSON ==================== */}
      <section style={{ marginBottom: 40 }}>
        <h2>2. Datos (JSON)</h2>
        <textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          style={{ width: "100%", height: 150 }}
        />
      </section>

      {/* ====================  BOTON GENERAR ==================== */}
      <button onClick={generatePDF} style={{ marginTop: 10, padding: "12px 20px", fontSize: 16 }}>
        Generar PDF
      </button>

      {/* ====================  RESULTADO ==================== */}
      <section style={{ marginTop: 40 }}>
        <h2>3. Resultado</h2>

        {pdfUrl && (
          <iframe
            src={pdfUrl}
            style={{ width: "100%", height: 600, border: "1px solid #ccc" }}
          />
        )}
      </section>
    </div>
  );
}

export default App;


