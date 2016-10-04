using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SA.WebServices.Models.Reports;
using SA.WebServices.Models.auth;

namespace SA.WebServices.Controllers
{
    public class ReportsController : ApiController
    {
        static IReportsRepository repository = new ReportsRepository();

        [HttpGet(), ActionName("getreport")]
        public saCommonReportData GetReport(saReportParams param)
        {
            try
            {
                if (AuthHelper.VerifyToken(param.token))
                {
                    return repository.GetReport(param);
                }
                else
                {
                    //not verified
                    return null;
                }

            }
            catch (Exception)
            {
                throw;
            }
        }

        [HttpGet(), ActionName("getavailablereports")]
        public IEnumerable<saReport> GetReports(string token, int custID, int reportID)
        {
            try
            {
                if (AuthHelper.VerifyToken(token))
                {
                    return repository.GetReports();
                }
                else
                {
                    //not verified
                    return null;
                }

            }
            catch (Exception)
            {
                throw;
            }
        }



    }
}