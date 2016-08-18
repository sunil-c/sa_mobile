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

                list.Add(new saReport { reportID = 1, reportName = "Growing Customers" });
                list.Add(new saReport { reportID = 2, reportName = "Declining Accounts" });
                list.Add(new saReport { reportID = 3, reportName = "Team Performance" });
                list.Add(new saReport { reportID = 4, reportName = "New Customers" });
                list.Add(new saReport { reportID = 5, reportName = "Late Ordering" });

                return list;
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}