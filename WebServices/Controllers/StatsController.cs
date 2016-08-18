using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SA.WebServices.Models.Stats;
using SA.WebServices.Models.auth;

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

        [HttpGet(), ActionName("getcustomerstats")]
        public IEnumerable<saCustomerStat> GetStats(string token, int level, int custID)
        {
            IEnumerable<saCustomerStat> list;

            try
            {
                if (AuthHelper.VerifyToken(token))
                {
                    switch (level)
                    {
                        case 0:
                            list = repository.GetCustomerStats();
                            break;
                        case 1:
                            list = repository.GetCustomerReportStats(custID);
                            break;
                        case 2:
                            list = repository.GetCustomerLoadStats();
                            break;
                        default:
                            list = repository.GetCustomerStats();
                            break;
                    }

                    return list;
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