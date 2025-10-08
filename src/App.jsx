import React, { useState, useEffect, useRef } from "react";
import jSuites from "jsuites"; // Required dependency
import "jspreadsheet-ce/dist/jspreadsheet.css";
import "jsuites/dist/jsuites.css";
import { PivotTable } from "./components/index.js";
import { RawDataSheet } from "./components/index.js";
import { sampleData } from "./data/sampleData.js";
import { computePivotData } from "./utils/pivotUtils.js";
import Controls from "./components/Controls/Controls";
import "./App.css";

export default function App() {
    const [data, _setData] = useState(sampleData);
    const [groupCols, setGroupCols] = useState(["Year", "Region"]);
    const [aggCol, setAggCol] = useState("Sales");

    const pivotData = computePivotData(data, groupCols, aggCol);

    return (
        <div className="app-container">
            <h2>Pivot Table Prototype</h2>

            <Controls
                groupCols={groupCols}
                setGroupCols={setGroupCols}
                aggCol={aggCol}
                setAggCol={setAggCol}
            />

            <div className="spreadsheet-container">
               <RawDataSheet data={data} />
            </div>
            <div className="spreadsheet-container">
                <PivotTable pivotData={pivotData} />
            </div>
        </div>
    );
}