using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SA.WebServices.Models.Reports;

namespace SA.WebServices.Models.Reports
{
    public class ReportsRepository : IReportsRepository
    {
        public saCommonReportData GetReport(saReportParams param)
        {
            saCommonReportData rd = null;
            saRowValues rv;

            //returns the data for the selected report in the common report format
            switch (param.selectedInt)
            {
                case 100:
                    /*
                data.push({ "custID": "100", "custName": "Customer 100", "salesVar": "$1234.56", "gmVar": "$234.65", "gmPctVar": "5.8%" });
                data.push({ "custID": "200", "custName": "Customer 200", "salesVar": "$2234.56", "gmVar": "$334.65", "gmPctVar": "6.8%" });
                data.push({ "custID": "300", "custName": "Customer 300", "salesVar": "$3234.56", "gmVar": "$434.65", "gmPctVar": "7.8%" });
                     */
                    rd = new saCommonReportData(3, 5);
                    //set up the header info
                    rd.columns.colMap = new string[] { "custID", "custName", "salesVar", "gmVar", "gmPctVar" };
                    rd.columns.names = new string[] { "custID", "Customer", "Sales Var", "GM var", "GM Pct Var" };
                    rd.columns.hdrAttr = new string[] { "hide", "text-left info", "text-right info", "text-right info", "text-right info" };
                    rd.columns.cellAttr = new string[] { "hide", "text-left", "text-right", "text-right", "text-right" };
                    //add the rows
                    //new row
                    rv = new saRowValues(5);
                    rv.values = new string[] { "1", "Customer 100", "$1234.56", "$234.65", "5.8%" };
                    rd.rows.Add(rv);
                    //new row
                    rv = new saRowValues(5);
                    rv.values = new string[] { "2", "Customer 200", "$2134.77", "$534.88", "7.4%" };
                    rd.rows.Add(rv);
                    //new row
                    rv = new saRowValues(5);
                    rv.values = new string[] { "3", "Customer 300", "$1734.29", "$334.00", "6.7%" };
                    rd.rows.Add(rv);

                    break;
                case 200:
                    /* 
                data.push({ "custID": "100", "custName": "Customer 100", "salesVar": "$1234.56", "gmVar": "$234.65", "gmPctVar": "5.8%" });
                data.push({ "custID": "200", "custName": "Customer 200", "salesVar": "$2234.56", "gmVar": "$334.65", "gmPctVar": "6.8%" });
                data.push({ "custID": "300", "custName": "Customer 300", "salesVar": "$3234.56", "gmVar": "$434.65", "gmPctVar": "7.8%" });
                     */
                    rd = new saCommonReportData(3, 5);
                    //set up the header info
                    rd.columns.colMap = new string[] { "custID", "custName", "salesVar", "gmVar", "gmPctVar" };
                    rd.columns.names = new string[] { "custID", "Customer", "Sales Var", "GM var", "GM Pct Var" };
                    rd.columns.hdrAttr = new string[] { "hide", "text-left info", "text-right info", "text-right info", "text-right info" };
                    rd.columns.cellAttr = new string[] { "hide", "text-left", "text-right", "text-right", "text-right" };
                    //add the rows
                    //new row
                    rv = new saRowValues(5);
                    rv.values = new string[] { "1", "Customer 100", "$7234.56", "$4234.65", "15.8%" };
                    rd.rows.Add(rv);
                    //new row
                    rv = new saRowValues(5);
                    rv.values = new string[] { "2", "Customer 200", "$3134.77", "$1534.88", "27.4%" };
                    rd.rows.Add(rv);
                    //new row
                    rv = new saRowValues(5);
                    rv.values = new string[] { "3", "Customer 300", "$4734.29", "$2334.00", "26.7%" };
                    rd.rows.Add(rv);

                    break;
                case 300:

                    /* 
                data.push({ "repID": "100", "repName": "John Smith", "rows": [{ "name": "Sales", "curr": "$1234.56", "prior": "$1234.56", "var": "$1234.56" }, { "name": "GM", "curr": "$1234.56", "prior": "$1234.56", "var": "$1234.56" }, { "name": "GM%", "curr": "12.66%", "prior": "1.66%", "var": "1.00%" }] });
                data.push({ "repID": "100", "repName": "Jane Doe", "rows": [{ "name": "Sales", "curr": "$2234.56", "prior": "$1234.56", "var": "$1234.56" }, { "name": "GM", "curr": "$1234.56", "prior": "$1234.56", "var": "$1234.56" }, { "name": "GM%", "curr": "12.66%", "prior": "1.66%", "var": "1.00%" }] });
                data.push({ "repID": "100", "repName": "Frank Jones", "rows": [{ "name": "Sales", "curr": "$3234.56", "prior": "$1234.56", "var": "$1234.56" }, { "name": "GM", "curr": "$1234.56", "prior": "$1234.56", "var": "$1234.56" }, { "name": "GM%", "curr": "12.66%", "prior": "1.66%", "var": "1.00%" }] });                     
                     */
                    rd = new saCommonReportData(3, 5);
                    //set up the header info
                    rd.columns.colMap = new string[] { "custID", "custName", "salesVar", "gmVar", "gmPctVar" };
                    rd.columns.names = new string[] { "custID", "Customer", "Sales Var", "GM var", "GM Pct Var" };
                    rd.columns.hdrAttr = new string[] { "hide", "text-left info", "text-right info", "text-right info", "text-right info" };
                    rd.columns.cellAttr = new string[] { "hide", "text-left", "text-right", "text-right", "text-right" };
                    //add the rows
                    //new row
                    rv = new saRowValues(5);
                    rv.values = new string[] { "1", "Customer 100", "$7234.56", "$4234.65", "15.8%" };
                    rd.rows.Add(rv);
                    //new row
                    rv = new saRowValues(5);
                    rv.values = new string[] { "2", "Customer 200", "$3134.77", "$1534.88", "27.4%" };
                    rd.rows.Add(rv);
                    //new row
                    rv = new saRowValues(5);
                    rv.values = new string[] { "3", "Customer 300", "$4734.29", "$2334.00", "26.7%" };
                    rd.rows.Add(rv);
                    break;
                case 400:
                    break;
                default:
                    break;
            }

            return rd;
        }

        public IEnumerable<saReport> GetReports()
        {
            //returns the list of available reports

            try
            {
                List<saReport> list = new List<saReport>();

                list.Add(new saReport { reportID = 1, reportName = "Growing Customers", hasRoute=false, route="" });
                list.Add(new saReport { reportID = 2, reportName = "Declining Accounts", hasRoute = false, route = "" });
                list.Add(new saReport { reportID = 3, reportName = "Team Performance", hasRoute = false, route = "" });
                list.Add(new saReport { reportID = 4, reportName = "New Customers", hasRoute = false, route = "" });
                list.Add(new saReport { reportID = 5, reportName = "Late Ordering", hasRoute = false, route = "" });
                list.Add(new saReport { reportID = 6, reportName = "Trends", hasRoute = true, route = "chart" });
                list.Add(new saReport { reportID = 7, reportName = "Customer Potential", hasRoute = true, route = "potential" });
                list.Add(new saReport { reportID = 8, reportName = "Customer Profile", hasRoute = true, route = "profile" });

                return list;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}