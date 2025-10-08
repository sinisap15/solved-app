import React from "react";
import Grouping from "./Grouping/Grouping";
import Aggregation from "./Aggregation/Aggregation";
import "./Controls.css";

export default function Controls({ groupCols, setGroupCols, aggCol, setAggCol }) {
    return (
        <div className="controls">
            <Grouping groupCols={groupCols} setGroupCols={setGroupCols} />
            <Aggregation aggCol={aggCol} setAggCol={setAggCol} />
        </div>
    );
}
