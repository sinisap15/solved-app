import React, {useEffect, useRef} from "react";
import jspreadsheet from "jspreadsheet-ce";

export default function PivotTable({ pivotData }) {
    const pivotRef = useRef(null);
    const pivotInstance = useRef(null);

    useEffect(() => {
        if (!pivotRef.current || pivotData.length === 0) return;

        // Destroy the previous worksheet instance
        if (pivotInstance.current?.worksheets?.[0]) {
            pivotInstance.current.worksheets[0].destroy();
            pivotInstance.current = null;
        }

        pivotRef.current.innerHTML = "";

        pivotInstance.current = jspreadsheet(pivotRef.current, {
            worksheets: [
                {
                    data: pivotData.slice(1),
                    columns: pivotData[0].map((h) => ({ title: h, type: "text" })),
                    tableOverflow: true,
                    tableHeight: "400px",
                    freezeColumns: 1,
                },
            ],
        });
    }, [pivotData]);

    return (
        <div>
            <h3>Pivot Table</h3>
            <div ref={pivotRef}></div>
        </div>
    );
}
