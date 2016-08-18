namespace SA.WebServices.Models.auth
{
    public class saAuthParams
    {
        public string userName;
        public string password;
    }

    public class saAuthResult
    {
        public int verficationStatus;
        public string verficiationDescription;
        public string token;
    }

    public static class  AuthHelper{
        public static saAuthResult Login(saAuthParams creds)
        {
            saAuthResult result = new saAuthResult();
            result.verficationStatus = 100;
            result.verficiationDescription = "Ok";
            result.token = "123456789012345678901234";

            return result;
        }
        public static int Logout(string token)
        {
            return 0;
        }
        public static bool VerifyToken(string token)
        {
            return true;
        }
    }

}