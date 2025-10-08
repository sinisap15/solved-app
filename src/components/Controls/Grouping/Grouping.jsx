import React from "react";
import { groupColumns } from "../../../data/groupColumns";
import "./Grouping.css";

export default function Grouping({ groupCols, setGroupCols }) {
    return (
        <div className="grouping">
            <label>Group by:</label>
            <select value={groupCols[0]} onChange={(e) => setGroupCols([e.target.value, groupCols[1]])}>
                {groupColumns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                ))}
            </select>

            <select value={groupCols[1]} onChange={(e) => setGroupCols([groupCols[0], e.target.value])}>
                {groupColumns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                ))}
            </select>
        </div>
    );
}
