// src/utils/pivotUtils.js
import { useState, useEffect } from "react";

export function computePivotData(data, groupCols, aggCol) {
    const [pivotData, setPivotData] = useState([]);

    useEffect(() => {
        if (!data || data.length === 0) {
            setPivotData([]);
            return;
        }

        const cols = data[0]; // headers
        const dataRows = data.slice(1).map((row) => {
            const obj = {};
            cols.forEach((c, i) => (obj[c] = row[i]));
            return obj;
        });

        // Group rows
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
                    const rowData = groupCols.map((_, i) => (i === level ? key : parentKeys[i]));
                    rowData.push(sum);
                    result.push(rowData);
                } else {
                    recurse(group[key], level + 1, [...parentKeys, key]);
                }
            }
        }

        recurse(grouped);
        setPivotData([[...groupCols, aggCol], ...result]);
    }, [data, groupCols, aggCol]);

    return pivotData;
}
