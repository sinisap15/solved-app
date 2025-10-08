// src/components/Controls/Aggregation/Aggregation.jsx
import React from "react";
import { aggregateColumns } from "../../../data/aggregateColumns";
import "./Aggregation.css";

export default function Aggregation({ aggCol, setAggCol }) {
    return (
        <div className="aggregation">
            <label>Aggregate column:</label>
            <select value={aggCol} onChange={(e) => setAggCol(e.target.value)}>
                {aggregateColumns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                ))}
            </select>
        </div>
    );
}
