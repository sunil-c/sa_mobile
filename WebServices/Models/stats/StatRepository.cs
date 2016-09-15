using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SA.WebServices.Models.Reports;

namespace SA.WebServices.Models.Stats
{
    public class StatRepository : IStatRepository
    {
        public IEnumerable<saCustomer> GetCustomers()
        {

            try
            {
                List<saCustomer> list = new List<saCustomer>();

                list.Add(new saCustomer { custID = 1, custName = "Waxie" });
                list.Add(new saCustomer { custID = 2, custName = "HP Products" });
                list.Add(new saCustomer { custID = 3, custName = "PJP" });
                list.Add(new saCustomer { custID = 4, custName = "Hantover" });
                list.Add(new saCustomer { custID = 5, custName = "Oakland Packaging" });

                return list;
            }
            catch (Exception)
            {

                throw;
            }
        }

        public saCommonReportData GetCustomerStats()
        {

            int numCols = 6, numRows = 2;
            saCommonReportData rd;
            saRowValues rv;

            //instantiate the common report data object
            rd = new saCommonReportData(numRows, numCols);
            //set up the header info
            rd.columns.colMap = new string[] { "custID", "custName", "dataVolume", "lastLoadDate", "logins", "reports" };
            rd.columns.names = new string[] { "custID", "Client", "Volume", "Last Load", "Logins", "Reports" };
            rd.columns.hdrAttr = new string[] { "hide", "text-left info", "text-right info", "text-left info", "text-right info", "text-right info" };
            rd.columns.cellAttr = new string[] { "hide", "text-left", "text-right", "text-left", "text-right", "text-right" };
            //add the rows
            //new row
            rv = new saRowValues(numCols);
            rv.values = new string[] { "1", "Waxie", "1194876", "1/1/2016", "1269", "222" };
            rd.rows.Add(rv);
            //new row
            rv = new saRowValues(numCols);
            rv.values = new string[] { "2", "HP Products", "1104527", "2/1/2016", "789", "223" };
            rd.rows.Add(rv);

            return rd;
        }



        public saCommonReportData GetCustomerReportStats(int custID)
        {

            int numCols = 3, numRows = 5;
            saCommonReportData rd;
            saRowValues rv;

            //instantiate the common report data object
            rd = new saCommonReportData(numRows, numCols);
            //set up the header info
            rd.columns.colMap = new string[] { "reportID", "reportName", "numRuns"};
            rd.columns.names = new string[] { "reportID", "Report", "# Runs"};
            rd.columns.hdrAttr = new string[] { "hide", "text-left info", "text-right info" };
            rd.columns.cellAttr = new string[] { "hide", "text-left", "text-right"};
            //add the rows
            //new row
            rv = new saRowValues(numCols);
            rv.values = new string[] { "1", "Ranking", "1194876", "123" };
            rd.rows.Add(rv);
            //new row
            rv = new saRowValues(numCols);
            rv.values = new string[] { "2", "P&L", "1104527", "89" };
            rd.rows.Add(rv);
            //new row
            rv = new saRowValues(numCols);
            rv.values = new string[] { "3", "Trend Graph", "71" };
            rd.rows.Add(rv);
            //new row
            rv = new saRowValues(numCols);
            rv.values = new string[] { "4", "Matrix", "55" };
            rd.rows.Add(rv);
            //new row
            rv = new saRowValues(numCols);
            rv.values = new string[] { "5", "Customer Potential", "33" };
            rd.rows.Add(rv);

            return rd;
        }


        public saCommonReportData GetCustomerLoadStats()
        {
            int numCols = 6, numRows = 2;
            saCommonReportData rd;
            saRowValues rv;

            //instantiate the common report data object
            rd = new saCommonReportData(numRows, numCols);
            //set up the header info
            rd.columns.colMap = new string[] { "custID", "custName", "dataVolume", "lastLoadDate", "linesLoaded", "loadStatus" };
            rd.columns.names = new string[] { "custID", "Client", "Volume", "Last Load", "Num Lines", "Load Status" };
            rd.columns.hdrAttr = new string[] { "hide", "text-left info", "text-right info", "text-left info", "text-right info", "text-left info" };
            rd.columns.cellAttr = new string[] { "hide", "text-left", "text-right", "text-left", "text-right", "text-left" };
            //add the rows
            //new row
            rv = new saRowValues(numCols);
            rv.values = new string[] { "1", "Waxie", "1194876", "1/1/2016", "1269", "success" };
            rd.rows.Add(rv);
            //new row
            rv = new saRowValues(numCols);
            rv.values = new string[] { "2", "HP Products", "1104527", "2/1/2016", "5344", "success" };
            rd.rows.Add(rv);

            return rd;

        }

        public IEnumerable<saStat> GetAggregateStats()
        {
            //return high level stats
            try
            {
                List<saStat> list = new List<saStat>();
                list.Add(new saStat { statID = 1, statName = "Logins", statValue = 43, statDescription = "The number of logins across all instance of Order Reporter", route="companyStats" });
                list.Add(new saStat { statID = 2, statName = "Reports", statValue = 287, statDescription = "The number of reports run across all instance of Order Reporter", route="companyReports" });
                list.Add(new saStat { statID = 3, statName = "Data Load Stats", statValue = 897635556, statDescription = "The number of data records across all instance of Order Reporter", route="loadStats" });

                return list;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }

}