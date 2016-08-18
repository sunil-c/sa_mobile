using System.Collections.Generic;

namespace SA.WebServices.Models.Stats
{
    /// <summary>
    /// saStatType is used to display the top level stats such as:
    /// Logins, Reports, Records, 
    /// </summary>

    public class saCustomer
    {
        public int custID;
        public string custName;
    }

    public class saStat
    {
        public int statID;
        public string statName;
        public int statValue;
        public string statDescription;
        public string route;
    }

    public class saCustomerStat
    {
        public int custID;
        public string custName;
        public int logins;
        public int reports;
        public int dataVolume;
        public string lastLoadDate;
        public string loadStatus;
        public int linesLoaded;
        public List<saCustomerReportStat> reportStats;

        public saCustomerStat()
        {
            reportStats = new List<saCustomerReportStat>();
        }
    }

    public class saCustomerReportStat
    {
        public int reportID;
        public string reportName;
        public int numRuns;
    }


}
