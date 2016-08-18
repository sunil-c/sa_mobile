using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public IEnumerable<saCustomerStat> GetCustomerStats()
        {
            List<saCustomerStat> list = new List<saCustomerStat>();

            list.Add(new saCustomerStat { custID = 1, custName="Waxie", logins=123, reports=222, dataVolume=1194876, lastLoadDate="1/1/2016" });
            list.Add(new saCustomerStat { custID = 2, custName = "HP Products", logins = 115, reports = 200, dataVolume = 1104527, lastLoadDate = "2/1/2016" });

            return list;
        }



        public IEnumerable<saCustomerStat> GetCustomerReportStats(int custID)
        {
            List<saCustomerStat> list = new List<saCustomerStat>();

            List<saCustomerReportStat> reportStats = new List<saCustomerReportStat>();
            reportStats.Add(new saCustomerReportStat { reportID = 1, reportName = "Ranking", numRuns = 123 });
            reportStats.Add(new saCustomerReportStat { reportID = 2, reportName = "P&L", numRuns = 98 });
            reportStats.Add(new saCustomerReportStat { reportID = 3, reportName = "Trend Graph", numRuns = 71 });
            reportStats.Add(new saCustomerReportStat { reportID = 4, reportName = "Matrix", numRuns = 55 });
            reportStats.Add(new saCustomerReportStat { reportID = 5, reportName = "Customer Potential", numRuns = 33 });

            list.Add(new saCustomerStat { custID = custID, reportStats = reportStats });

            return list;
        }

        public IEnumerable<saCustomerStat> GetCustomerLoadStats()
        {
            List<saCustomerStat> list = new List<saCustomerStat>();

            list.Add(new saCustomerStat { custID = 1, custName = "Waxie", dataVolume = 1194876, lastLoadDate = "1/1/2016", linesLoaded=1269, loadStatus="Success" });
            list.Add(new saCustomerStat { custID = 2, custName = "HP Products", dataVolume = 1104527, lastLoadDate = "2/1/2016", linesLoaded=5344, loadStatus="Success" });

            return list;

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