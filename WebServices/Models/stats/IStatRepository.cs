using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SA.WebServices.Models.Reports;

namespace SA.WebServices.Models.Stats
{
    interface IStatRepository
    {
        IEnumerable<saStat> GetAggregateStats();
        saCommonReportData GetCustomerStats();
        saCommonReportData GetCustomerLoadStats();
        saCommonReportData GetCustomerReportStats(int custID);
    }
}
