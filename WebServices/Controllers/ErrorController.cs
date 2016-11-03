using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace SA.WebServices.Controllers
{
    public class ErrorController : ApiController
    {
        [HttpPost(), ActionName("logerror")]
        public int LogError(ErrorParms parms)
        {
            //call the error repository to store error data
            return 0;
        }
    }

    public class ErrorParms
    {
        //msg: msg, url: url, line: line, col: col, error: error
        public string msg;
        public string url;
        public int line;
        public int col;
        public string error;
    }
}
