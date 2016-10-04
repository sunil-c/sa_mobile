using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SA.WebServices.Models.Filters
{
    public class saFilters
    {
        public List<string> GetFilterNames(int reportID)
        {
            List<string> filterNames = new List<string>();
            try
            {
                //call the the database to get the filters for the reportID
                filterNames.Add("Sales Organization");
                filterNames.Add("Time");

                //return the list of names
                return filterNames;
            }
            catch (Exception)
            {
                throw;
            }

        }
        public List<int> GetFilterIDs(int reportID)
        {
            List<int> filterIDs = new List<int>();
            try
            {
                //call the the database to get the filters for the reportID
                filterIDs.Add(1000); //time
                filterIDs.Add(1100); //sales org

                //return the list
                return filterIDs;
            }
            catch (Exception)
            {
                throw;
            }

        }
        public List<saFilter> GetFilters(int reportID)
        {
            List<saFilter> filters = new List<saFilter>();
            try
            {
                //call the db to get the filters for the reportID

                //mockup
                if (reportID == 100)
                {
                    //sales org
                    saFilter saf = new saFilter(1000);
                    filters.Add(saf);
                    //time
                    saf = new saFilter(1001);
                    filters.Add(saf);

                }
                else if(reportID == 200)
                {
                    //sales org
                    saFilter saf = new saFilter(1000);
                    filters.Add(saf);
                    //time
                    saf = new saFilter(1001);
                    filters.Add(saf);
                }

                //populate the filters list

                //return the filter list
                return filters;
            }
            catch (Exception)
            {
                throw;
            }

        }
        public List<saFilterSection> GetFilterSections(int reportID)
        {
            List<saFilterSection> sections = new List<saFilterSection>();
            try
            {
                //call database to get the filter sections

                //populate the sections list

                //return them
                return sections;
            }
            catch (Exception)
            {
                throw;
            }

        }
    }

    public class saFilterSection
    {
        public string name;
        public int id;
        public int ordinal;
    }

    public class saFilter
    {
        public int filterID;
        public string displayName;
        public int sectionID;
        public int ordinal;
        public bool show;
        public bool basicFilter;
        public string addlInfo;

        public List<string> defaultSelections; //list of pipe delimited strings "axisID|displayName"
        
        public saFilter(int filterID)
        {
            //get the details
            GetFilterDetails(filterID);
            GetFilterOptions(filterID);
        }
        private void GetFilterDetails(int filterID)
        {
            //call databse and fill in the properties

            //mockup
            List<string> defaultSelections = new List<string>();
            this.filterID = filterID;
            this.displayName = (filterID == 1000) ? "Time" : "Sales Org";
            this.sectionID = 100;
            this.ordinal = (filterID == 1000) ? 100 : 200;
            this.basicFilter = true;
            this.show = true;
            this.defaultSelections = null;
            this.addlInfo = "";
        }

        public List<saFilterOption> GetFilterOptions(int filterID)
        {
            List<saFilterOption> options = new List<saFilterOption>();

            try
            {
                //call the database to get filter options

                //populate the list

                //return list

                //mockup
                if (filterID == 1000)
                {

                }
                else
                {

                }
                return options;
            }
            catch (Exception)
            {

                throw;
            }

        }
    }

    public class saFilterOption
    {
        public int id;
        public string name;
        public int parent;
        public int level;
    }
}