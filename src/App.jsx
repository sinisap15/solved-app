import React, { useState, useEffect, useRef } from "react";
import { Spreadsheet, Worksheet } from "@jspreadsheet-ce/react";

import "jsuites/dist/jsuites.css";
import "jspreadsheet-ce/dist/jspreadsheet.css";

const sampleData = [
    ["Year", "Month", "Region", "Category", "Sales"],
    [2023, "Jan", "North", "Fruit", 100],
    [2023, "Feb", "North", "Vegetables", 150],
    [2023, "Jun", "South", "Fruit", 120],
    [2023, "Jan", "South", "Vegetables", 180],
    [2024, "Aug", "North", "Fruit", 110],
    [2024, "Sep", "North", "Vegetables", 160],
    [2024, "Dec", "South", "Fruit", 130],
    [2024, "Dec", "South", "Vegetables", 190],
    [2023, "Mar", "East", "Fruit", 140],
    [2023, "Apr", "East", "Vegetables", 170],
    [2023, "May", "West", "Fruit", 115],
    [2023, "Jul", "West", "Vegetables", 165],
    [2024, "Jan", "East", "Fruit", 125],
    [2024, "Feb", "North", "Vegetables", 135],
    [2024, "Mar", "West", "Fruit", 175],
    [2024, "Apr", "South", "Vegetables", 155],
    [2024, "May", "East", "Fruit", 145],
    [2024, "Jun", "West", "Vegetables", 185],
    [2024, "Jul", "North", "Fruit", 190],
    [2024, "Oct", "South", "Vegetables", 200],
];


export default function App() {
    const [data, _setData] = useState(sampleData);
    const [pivotData, setPivotData] = useState([]);
    const [groupCols, setGroupCols] = useState(["Year", "Region"]);
    const [aggCol, setAggCol] = useState("Sales");

    const rawSpreadsheetRef = useRef(null); // For any future API calls on the raw data
    const spreadsheetRef = useRef(null); // For any future API calls on the spreadsheet

    const cols = sampleData[0];

    // Compute pivot data when dependencies change
    useEffect(() => {
        const dataRows = data.slice(1).map((row) => {
            let obj = {};
            cols.forEach((c, i) => (obj[c] = row[i]));
            return obj;
        });

        // Grouping logic
        const grouped = dataRows.reduce((acc, obj) => {
            let pointer = acc;
            groupCols.forEach((key, idx) => {
                const val = obj[key];
                if (!pointer[val]) pointer[val] = idx === groupCols.length - 1 ? [] : {};
                pointer = pointer[val];
            });
            pointer.push(obj);
            return acc;
        }, {});

        let result = [];

        function recurse(group, level = 0, parentKeys = []) {
            for (let key in group) {
                if (Array.isArray(group[key])) {
                    const sum = group[key].reduce((acc, row) => acc + row[aggCol], 0);
                    let rowData = [];
                    for (let i = 0; i < groupCols.length; i++) {
                        rowData.push(i === level ? key : parentKeys[i]);
                    }
                    rowData.push(sum);
                    result.push(rowData);
                } else {
                    recurse(group[key], level + 1, [...parentKeys, key]);
                }
            }
        }
        recurse(grouped);

        setPivotData([ [...groupCols, aggCol], ...result ]);
    }, [groupCols, aggCol, data, cols]);

    console.log("Data: ", data);
    console.log("Pivot Data:", pivotData);

    return (
        <div style={{padding: 20}}>
            <h2>Pivot Table Prototype with Jspreadsheet</h2>

            {/* Grouping Controls */}
            <div style={{marginBottom: 10}}>
                <label>Group columns (two): </label>
                <select value={groupCols[0]} onChange={(e) => setGroupCols([e.target.value, groupCols[1]])}>
                    {cols.slice(0, -1).map((col, index) => (
                        <option key={`group1-${index}`} value={col}>
                            {col}
                        </option>
                    ))}
                </select>
                <select value={groupCols[1]} onChange={(e) => setGroupCols([groupCols[0], e.target.value])}>
                    {cols.slice(0, -1).map((col, index) => (
                        <option key={`group2-${index}`} value={col}>
                            {col}
                        </option>
                    ))}
                </select>
            </div>

            {/* Aggregation Control */}
            <div style={{marginBottom: 20}}>
                <label>Aggregate column: </label>
                <select value={aggCol} onChange={(e) => setAggCol(e.target.value)}>
                    {cols.map((col, index) => (
                        <option key={`agg-${index}`} value={col}>
                            {col}
                        </option>
                    ))}
                </select>
            </div>


            <h3>Raw Data Sheet</h3>
            <Spreadsheet ref={rawSpreadsheetRef}>
                <Worksheet data={data.slice(1)}
                           columns={data[0].map(h => ({title: h, type: "text"}))}
                           minDimensions={[20, 4]}/>
            </Spreadsheet>

            {/* Pivot Result Sheet */}
            <h3>Pivot Table Worksheet</h3>
            <Spreadsheet ref={spreadsheetRef} style={{height: 400, border: '1px solid black'}}>
                <Worksheet data={pivotData.slice(1)}
                           columns={pivotData.map(h => ({title: h, type: "text"}))}
                           minDimensions={[3, 5]}/>
            </Spreadsheet>
            <pre>{JSON.stringify(pivotData, null, 2)}</pre>
        </div>
    );
}
