using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SA.WebServices.Models.Stats
{
    interface IStatRepository
    {
        IEnumerable<saStat> GetAggregateStats();
        IEnumerable<saCustomerStat> GetCustomerStats();
        IEnumerable<saCustomerStat> GetCustomerLoadStats();
        IEnumerable<saCustomerStat> GetCustomerReportStats(int custID);
    }
}
