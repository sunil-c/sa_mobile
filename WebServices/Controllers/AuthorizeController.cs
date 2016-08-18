using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using SA.WebServices.Models.auth;

namespace SA.WebServices.Controllers
{
    public class AuthorizeController : ApiController
    {
        [HttpPost(), ActionName("login")]
        public saAuthResult Login(saAuthParams creds)
        {
            //saAuthResult result = new saAuthResult();
            //result.verficationStatus = 100;
            //result.verficiationDescription = "Ok";
            //result.token = "123456789012345678901234";
            //return result;
            return AuthHelper.Login(creds);
        }
        [HttpPost(), ActionName("logout")]
        public int Logout(string token)
        {
            //delete token from database
            return AuthHelper.Logout(token);
        }
        [HttpPost(), ActionName("verify")]
        public Boolean VerifyToken(string token)
        {
            return AuthHelper.VerifyToken(token);
        }
    }
}
