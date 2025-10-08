import React, {useEffect, useRef} from "react";
import jspreadsheet from "jspreadsheet-ce";

export default function RawDataSheet({ data }) {
    const rawRef = useRef(null);
    const instance = useRef(null);

    useEffect(() => {
        if (!rawRef.current) return;

        // Destroy the previous worksheet instance
        if (instance.current?.worksheets?.[0]) {
            instance.current.worksheets[0].destroy();
            instance.current = null;
        }

        rawRef.current.innerHTML = "";

        instance.current = jspreadsheet(rawRef.current, {
            worksheets: [
                {
                    data: data.slice(1),
                    columns: data[0].map((h) => ({ title: h, type: "text" })),
                    tableOverflow: true,
                    tableHeight: "300px",
                },
            ],
        });
    }, [data]);

    return (
        <div style={{ marginBottom: 40 }}>
            <h3>Raw Data Sheet</h3>
            <div ref={rawRef}></div>
        </div>
    );
}
