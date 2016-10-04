using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SA.WebServices.Models.Filters
{
    interface IFiltersRepository
    {
        IEnumerable<string> GetFilterNames();

    }
}
