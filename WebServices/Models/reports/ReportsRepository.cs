using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SA.WebServices.Models.Reports
{
    public class ReportsRepository : IReportsRepository
    {
        public IEnumerable<saReport> GetReports()
        {
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