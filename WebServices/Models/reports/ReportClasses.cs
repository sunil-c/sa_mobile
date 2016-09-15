using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SA.WebServices.Models.Reports
{
    public class saReport
    {
        public int reportID;
        public string reportName;
        public bool hasRoute;
        public string route;
    }

    public class saCommonReportData
    {
        public saColumnHeaderInfo columns;
        public List<saRowValues> rows;

        public saCommonReportData(int numRows, int numColumns)
        {
            columns = new saColumnHeaderInfo(numColumns);
            rows = new List<saRowValues>();
        }
    }

    public class saColumnHeaderInfo
    {
        public string[] names;
        public string[] colMap;
        public string[] colID;
        public string[] hdrAttr;
        public string[] cellAttr;

        public saColumnHeaderInfo(int numColumns)
        {
            //init the arrays to the number of columns
            names = new string[numColumns];
            colMap = new string[numColumns];
            colID = new string[numColumns];
            hdrAttr = new string[numColumns];
            cellAttr = new string[numColumns];

        }
    }

    public class saRowValues
    {
        public string[] values;

        public saRowValues(int numColumns)
        {
            //init the array to the number of columns
            values = new string[numColumns];
        }
    }
}
/* example return data structure
    [
      {
        "columns": {
          "names":    [ "id", "Name", "Current", "Prior", "Variance" ],
          "colMap":  [ "id", "name", "current", "prior", "variance" ],
          "colID":    [ ],
          "hdrAttr":  [ "hide", "text-left info", "text-right info", "text-right info", "text-right info" ],
          "cellAttr": [ "hide", "text-left", "text-right", "text-right", "text-right" ]
        },
        "rows": [
          {"values": [ "12345", "Item #12345", "$1123.87", "$612.99", "12.34%" ]},
          {"values": ["63346", "Item #12345", "$1,123.87", "$612.99", "12.34%"]},
          {"values": ["71397", "Item #21762", "$923.87", "$416.07", "14.33%"]},
          {"values": ["77748", "Item #45332", "$1,567.33", "$564.66", "12.99%"]},
          {"values": ["89341", "Item #15366", "$1,345.33", "$676.67", "23.44%"]}
        ]
      }
    ]
 */
