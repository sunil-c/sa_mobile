using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SA.WebServices.Models.Stats;
using SA.WebServices.Models.auth;
using SA.WebServices.Models.Reports;

namespace SA.WebServices.Controllers
{
    public class StatController : ApiController
    {
        static IStatRepository repository = new StatRepository();

        [HttpGet(), ActionName("getaggregatestats")]
        public IEnumerable<saStat> GetAggregateStats(string token)
        {
            try
            {
                if (AuthHelper.VerifyToken(token))
                {
                    return repository.GetAggregateStats();
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

        [HttpGet(), ActionName("getstats")]
        public saCommonReportData GetStats(string token, int level, int custID)
        {
            saCommonReportData data;

            try
            {
                if (AuthHelper.VerifyToken(token))
                {
                    switch (level)
                    {
                        case 0:
                            data = repository.GetCustomerStats();
                            break;
                        case 1:
                            data = repository.GetCustomerReportStats(custID);
                            break;
                        case 2:
                            data = repository.GetCustomerLoadStats();
                            break;
                        default:
                            data = repository.GetCustomerStats();
                            break;
                    }

                    return data;
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