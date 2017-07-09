/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();
    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter)
        regexp = new RegExp(seriesFilter, 'i');

    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
			"color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1935543733762217, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [0.37525, 500, 1500, "Create patient"], "isController": false}, {"data": [1.0, 500, 1500, "Get Roles"], "isController": false}, {"data": [1.0, 500, 1500, "BeanShell Write Users to CSV"], "isController": false}, {"data": [2.5E-4, 500, 1500, "Post Procedure"], "isController": false}, {"data": [1.0, 500, 1500, "Create User"], "isController": false}, {"data": [1.0, 500, 1500, "JDBC Update User"], "isController": false}, {"data": [1.0, 500, 1500, "BeanShell clean newUsers.csv"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "Login to application"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8062, 0, 0.0, 3233.390845943936, 5526.7, 6226.699999999999, 8048.989999999997, 6.119597056945955, 10.647073605100777, 7.822522795963966, 1, 11250], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average response time", "90th pct", "95th pct", "99th pct", "Throughput", "Received KB/sec", "Sent KB/sec", "Min", "Max"], "items": [{"data": ["Create patient", 4000, 0, 0.0, 1319.4462499999993, 1718.0, 1824.0, 2382.8399999999965, 3.0542814535630867, 1.1244766679621911, 3.9247494308060173, 420, 3358], "isController": false}, {"data": ["Get Roles", 1, 0, 0.0, 186.0, 186.0, 186.0, 186.0, 5.376344086021506, 4.263272849462366, 3.8957493279569895, 186, 186], "isController": false}, {"data": ["BeanShell Write Users to CSV", 20, 0, 0.0, 1.9000000000000006, 2.900000000000002, 3.9499999999999993, 4.0, 4.930966469428008, 0.0, 0.0, 1, 4], "isController": false}, {"data": ["Post Procedure", 4000, 0, 0.0, 5196.341999999996, 6239.9000000000015, 7052.95, 9601.899999999998, 3.0587260100295626, 9.593701598050522, 3.9337785340902665, 388, 11250], "isController": false}, {"data": ["Create User", 20, 0, 0.0, 205.35, 233.20000000000005, 248.29999999999998, 249.0, 4.094165813715455, 1.4033712896622315, 4.17373016888434, 171, 249], "isController": false}, {"data": ["JDBC Update User", 20, 0, 0.0, 5.25, 11.800000000000004, 13.899999999999999, 14.0, 4.916420845624385, 0.052813114552605706, 0.0, 3, 14], "isController": false}, {"data": ["BeanShell clean newUsers.csv", 1, 0, 0.0, 8.0, 8.0, 8.0, 8.0, 125.0, 0.0, 0.0, 8, 8], "isController": false}, {"data": ["Login to application", 21, 0, 0.0, 5731.142857142858, 7755.6, 7909.8, 7925.0, 1.4121444422029454, 470.5290366947414, 3.49923403772443, 1182, 7925], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Percentile 1
            case 5:
            // Percentile 2
            case 6:
            // Percentile 3
            case 7:
            // Throughput
            case 8:
            // Kbytes/s
            case 9:
            // Sent Kbytes/s
            case 10:
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0);
    
    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);
    
        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8062, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": true}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);
    
});
