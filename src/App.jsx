import React, { useState } from "react";
import { CSVReader } from "react-papaparse";
import { Button } from "@/components/ui/button.jsx";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table.jsx";
import { Input } from "@/components/ui/input.jsx";
import { saveAs } from "file-saver";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleOnDrop = (data) => {
    const headers = data[0].data;
    const rows = data.slice(1).map((row) => row.data);
    setHeaders(headers);
    setData(rows);
  };

  const handleOnError = (err) => {
    console.error(err);
  };

  const handleAddRow = () => {
    setData([...data, Array(headers.length).fill("")]);
  };

  const handleRemoveRow = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  const handleInputChange = (e, rowIndex, colIndex) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = e.target.value;
    setData(newData);
  };

  const handleDownload = () => {
    const csvContent = [
      headers.join(","),
      ...data.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "edited_data.csv");
  };

  return (
    <div className="App">
      <CSVReader onDrop={handleOnDrop} onError={handleOnError} addRemoveButton>
        <span>Drop CSV file here or click to upload.</span>
      </CSVReader>
      {data.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <TableCell key={colIndex}>
                      <Input
                        value={cell}
                        onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="destructive" onClick={() => handleRemoveRow(rowIndex)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleAddRow}>Add Row</Button>
          <Button onClick={handleDownload}>Download CSV</Button>
        </>
      )}
    </div>
  );
}

export default App;