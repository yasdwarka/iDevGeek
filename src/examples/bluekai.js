 //TO BE TESTED
 window.optiCustomerId = localStorage["customerId"] || "N/A";
 //Profile attributes
 window["optimizely"] = window["optimizely"] || [];
 window.optimizely.push({
   type: 'addListener',
   filter: {
     type: 'lifecycle',
     name: 'originsSynced'
   },
   handler: function profileUpdates(event) {
     //Do things like loginCount here
     //User ID storage
     var userID = window.optimizely.get("visitor")["custom"];
     userID = (typeof userID !== "undefined") ? userID["20123404751"] : "N/A";
     userID = (userID !== "N/A") ? userID.value : "N/A";
     localStorage.setItem('customerId', userID);
     window.optiCustomerId=userID;
     //Login count
     var loginCount = window.optimizely.get("visitor")["custom"];
     loginCount = (typeof loginCount !== "undefined") ? loginCount["20193954084"] : 0;
     console.log(loginCount);
     if(window.location.href.indexOf("my.paysafecard.com") > -1 && !window.sessionStorage.loggedIn){
       window.optimizely.push({
         "type": "user",
         "attributes": {
           "psc_login_frequency": (typeof loginCount.value !== "undefined") ? (loginCount.value + 1) : 0
         }
       });
       window.sessionStorage.setItem("loggedIn",true); 
     }else {
         window.optimizely.push({
         "type": "user",
         "attributes": {
           "psc_login_frequency": (typeof loginCount !== "undefined") ? (typeof loginCount.value !== "undefined" ? (loginCount.value) : 0): 0
         }
       });
      }; 
   } 
 });
 
 
 // If user attributes don't sync across origins, either ask David or use these resources:
 // https://help.optimizely.com/Measure_success%3A_Track_visitor_behaviors/improve-custom-attribute-persistence-using-browser-cookies
 // https://gist.github.com/anonymous/eb7c91960307a1df733bcbc48fe751cd
 
 /*Sequential targeting*/
 window.optiFirstExposedToExperiment = function (experiment_id) {
   return optiGetTimestampForEvent("paysafecard__exposed_to_campaign", false, experiment_id);
 };
 
 window.optiLastOccuranceOfEvent = function (event_name) {
   return optiGetTimestampForEvent(event_name);
 };
 
 window.optiGetTimestampForEvent = function (event_name,most_recent,experiment_id) {
   // Build the filter
   var filter = [];
 
   // Add the event name
   filter.push({
     field: ["name"],
     value: event_name
   });
 
   // Add the tag search if necessary
   if (experiment_id) {
     filter.push({
       field: ["tags", "experimentId"],
       value: experiment_id
     });
   }
 
   var behavior = window["optimizely"].get("behavior");
 
   var result = behavior.query({
     version: "0.2",
     filter: filter,
     sort: [
       {
         field: ["time"],
         direction: most_recent ? "descending" : "ascending"
       }
     ],
     reduce: {
       aggregator: "nth",
       n: 0
     }
   });
 
   if (!result) return null;
 
   var timestamp = result.time;
 
   return timestamp;
   
 };
 
 
 //The Bluekai code below is not used in the Skrill/Neteller project. Keep here.
 
 /*
 ###########################################################
 ### ORACLE BLUEKAI : OPTIMIZELY X : JSON Return handler ###
 ###########################################################
 Author : roshan.gonsalkorale@oracle.com
 Notes:
 - Will call BlueKai JSON Return tag asynchronously if not already loaded (http://tags.bluekai.com/site/XXXXX?ret=js&limit=1)
 - Sends data via window["optimizely"].push() (https://developers.optimizely.com/x/solutions/javascript/reference/index.html#function_setuser)
 - Will send each category ID and campaign ID as "bluekai_category_XXXXXX" or "bluekai_campaign_XXXXXX" (e.g. "bluekai_category_123456")
 - In Optimizely you will need to build audiences based on these custom attributes (https://help.optimizely.com/Target_Your_Visitors/Custom_Attributes%3A_Capture_visitor_data_through_the_API_in_Optimizely_X)
 - Code can be cut and pasted in "Settings > Javascript" in Optimizely X
 - For debugging, add 'bk_optimizely_logger=true' as a query-string parameter in the URL
 */
 
 // CONFIG : EDIT THIS PART
 
 // Create object to store functions
 window.bk_optimizely_integration = {};
 window.bk_optimizely_integration.functions = {};
 window.bk_optimizely_integration.data = {};
 window.bk_optimizely_integration.bluekai_jsonreturn_id = "89374"; //Found in container snippet in BK account
 window.bk_optimizely_integration.wait_in_ms = 5000; // How long to wait before asking BlueKai for the latest categories and firing data to Optimizely (default 5000ms)
 
 /* 
 ##########################################################################################
 DO NOT EDIT BELOW THIS LINE
 ##########################################################################################
 */
 
 // FUNCTION : Logger
 bk_optimizely_integration.functions.logger = function(message,attribute_object) {
     if(document.location.href.indexOf('bk_optimizely_logger=true') > -1){    
         //session cookie
         document.cookie = "bk_optimizely_logger=" + "true" +
         ";path=/;domain=" + document.domain + ";expires=";
     }
     if (document.cookie.indexOf('bk_optimizely_logger=true') > -1) {  
         if(typeof attribute_object === "undefined"){
             console.log(message);
         } else {
             for (varName in attribute_object){
                 console.log(message + varName + "=" + attribute_object[varName]);
             }
         }
     }
 };
 
 // FUNCTION : Parse BlueKai data and send to OPTIMIZELY
 bk_optimizely_integration.functions.parseBkResults = function() {
     // Parse BlueKai Campaign Results
     window.bk_optimizely_integration.data.bluekai_category_ids = [];
     window.bk_optimizely_integration.data.bluekai_campaign_ids = [];
     if (typeof(bk_results) != "undefined") {
         if (typeof(bk_results.campaigns[0]) != "undefined") {          
             bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : 'bk_results' object found");
             for (var i = 0; i < bk_results.campaigns.length; i++) {               
                 window.bk_optimizely_integration.data.bluekai_campaign_ids.push(bk_results.campaigns[i].campaign);                
                 for (var j = 0; j < bk_results.campaigns[i].categories.length; j++) {                    
                     if (typeof(bk_results.campaigns[i].categories[j].categoryID) != "undefined") {                        
                         window.bk_optimizely_integration.data.bluekai_category_ids.push(bk_results.campaigns[i].categories[j].categoryID);
                     }
                 }
             }
             bk_optimizely_integration.functions.sendOptimizely(); // Send data to Optimizely            
         } else {
             bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : No campaigns object");
         }
     } else {
         bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : No 'bk_results' object");
     }
 };
 bk_optimizely_integration.functions.sendOptimizely = function() {  
     // Parse BlueKai Campaign Results
     if (window["optimizely"] && typeof window["optimizely"].push === "function") {
     // Create Attributes object
     var bk_opt_attributes = {};
     // Shorten var names
     var bk_campaigns_ids = window.bk_optimizely_integration.data.bluekai_campaign_ids;
     var bk_category_ids = window.bk_optimizely_integration.data.bluekai_category_ids;    
     if(bk_campaigns_ids.length > bk_category_ids.length){
         var bk_array_length = bk_campaigns_ids.length;
     } else {var bk_array_length = bk_category_ids.length;}   
     for (var i = 0; i < bk_array_length; i++) {        
         if(bk_campaigns_ids[i]){
             bk_opt_attributes['bluekai_campaign_' + bk_campaigns_ids[i]] = "true";
         }
         if(bk_category_ids[i]){
             bk_opt_attributes['bluekai_category_' + bk_category_ids[i]] = "true";
         }
     }
     window["optimizely"].push({
         "type": "user",
         "attributes": bk_opt_attributes
     });
     bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : Sending Campaign/Category IDs to Optimizely");
     bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : 'window['optimizely'].push({'type': 'user','attributes': SEE ATTRIBUTES BELOW});'");
     bk_optimizely_integration.functions.logger(bk_opt_attributes);    
     bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : Attribute Sent : ",bk_opt_attributes);    
     bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : Data Sent");
     bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : Please see https://developers.optimizely.com/x/solutions/javascript/reference/index.html#function_setuser for details on this API call");
 
     } else {
         bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : optimizely.window.push() doesn't exist");
     }
 };
 
 // FUNCTION : Call BlueKai
 bk_optimizely_integration.functions.callBlueKai = function(bluekai_jsonreturn_id) {
     // Check if JSON return tag already there
     if ((document.head && document.head.innerHTML.indexOf(bluekai_jsonreturn_id + '?ret=js') > -1) || (document.body && document.body.innerHTML.indexOf(bluekai_jsonreturn_id + '?ret=js') > -1)) {
         bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : JSON Return tag found");
         bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : Parsing 'bk_results' directly");
         bk_optimizely_integration.functions.parseBkResults(); // Parse results (don't call JSON ret tag)        
     } else {
         bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : JSON Return tag NOT found");
         bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : Waiting " + window.bk_optimizely_integration.wait_in_ms + "ms before calling JSON Return Tag");
         setTimeout(function(){        
         bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : Calling JSON Return tag");
         var bk_json_ret = document.createElement("script");
         bk_json_ret.type = "text/javascript";
         bk_json_ret.onload = function() {
             bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : JSON Return tag loaded");
             bk_optimizely_integration.functions.logger("BLUEKAI OPTIMIZELY : Parsing 'bk_results'");
             bk_optimizely_integration.functions.parseBkResults(); // Parse results
         };
         bk_json_ret.src = "//tags.bluekai.com/site/" + bluekai_jsonreturn_id + "?ret=js&limit=1&integration=optimizely";
         document.head.appendChild(bk_json_ret);              
         }, 
         window.bk_optimizely_integration.wait_in_ms);    
     }
 };
 
 // RUN CODE
 bk_optimizely_integration.functions.callBlueKai(window.bk_optimizely_integration.bluekai_jsonreturn_id);
 
 