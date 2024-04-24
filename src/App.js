import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const App = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);  // This controls which page is shown in the viewer
  const [pageSelections, setPageSelections] = useState([]); // This stores the selection state for each dropdown
  const [file, setFile] = useState(null);
  const [scale, setScale] = useState(1.0);  // Controls zoom level

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageSelections(Array(numPages).fill(1));  // Initialize all dropdowns to page 1
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file));
    } else {
      setFile(null); // Clear file if input is cleared
    }
  };

  const handleDropdownChange = (event, index) => {
    const newSelections = [...pageSelections];
    newSelections[index] = parseInt(event.target.value, 10);
    setPageSelections(newSelections);
    setPageNumber(newSelections[index]); // Update the viewer to reflect the most recent dropdown interaction
  };

  const nextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
  };

  const previousPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };

  const styles = {
    tableContainerStyle: { flex: 1, overflowY: 'auto', padding: '20px' },
    tableStyle: { width: '100%', borderCollapse: 'collapse', border: '2px solid blue', backgroundColor: 'lightblue' },
    thStyle: { background: 'blue', color: 'white', padding: '10px', textAlign: 'left' },
    tdStyle: { padding: '10px', borderBottom: '1px solid #ddd' },
    documentContainerStyle: { flex: 2, padding: '20px', textAlign: 'center', border: '3px solid darkblue', height: '80vh', overflow: 'auto' },
    buttonStyle: { cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', padding: '10px 15px', margin: '5px', fontSize: '16px', display: 'inline-block' },
    buttonContainerStyle: { textAlign: 'center', padding: '10px', marginTop: '20px' }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={styles.tableContainerStyle}>
        <input
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          id="file"
          style={{ display: 'none' }}
        />
        <label htmlFor="file" style={{...styles.buttonStyle, backgroundColor: '#28a745', display: 'block', marginBottom: '20px'}}>Choose File</label>
        <table style={styles.tableStyle}>
          <thead>
            <tr>
              <th style={styles.thStyle}>ID</th>
              <th style={styles.thStyle}>Title</th>
              <th style={styles.thStyle}>Navigate</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: numPages || 0 }).map((_, index) => (
              <tr key={index}>
                <td style={styles.tdStyle}>{index + 1}</td>
                <td style={styles.tdStyle}>{`Section ${index + 1}`}</td>
                <td style={styles.tdStyle}>
                  <select 
                    onChange={(e) => handleDropdownChange(e, index)}
                    value={pageSelections[index]}
                    style={styles.buttonStyle}
                  >
                    {Array.from({ length: numPages }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Page {i + 1}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={styles.documentContainerStyle}>
        {file && (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              renderInteractiveForms={false}
            />
          </Document>
        )}
      </div>
      <div style={styles.buttonContainerStyle}>
        <button style={styles.buttonStyle} onClick={previousPage} disabled={pageNumber === 1}>Previous</button>
        <button style={styles.buttonStyle} onClick={nextPage} disabled={pageNumber === numPages}>Next</button>
        <button style={styles.buttonStyle} onClick={() => setScale(scale * 1.1)}>Zoom In</button>
        <button style={styles.buttonStyle} onClick={() => setScale(Math.max(1, scale / 1.1))}>Zoom Out</button>
        <p>Page {pageNumber} of {numPages}</p>
      </div>
    </div>
  );
};

export default App;

