/*
    Author: Mr Donald Odanmen.
    Company: Vegware Limited.
    GENERATOR: Rapid CSS 2011 Editor.
    Type: External JavaScript Document.
    Filename: javascript_doc.js
    Purpose: Site-Wide Client-Side/Browser Scripting for the Customers Sub-System.
*/

    var email_filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;       // Regular Expression Object to filter any entered email address to ensure correctness of format.
    var alphanumeric = /(?:[A-Za-z].*?\d|\d.*?[A-Za-z])/;                                                          // Regular Expression Object to filter any entered input to ensure numbers and alphabets exist.
    var interval, postcode_lookup, current_template, current_layout, layout_path, elements = "", date_time_flag, the_label_template_1 = "", message = new Array(), print_queue = new Array(), batch_label_entries = new Array(), field_collection = new Array(), xmlhttp = new XMLHttpRequest();

    function terminate() {                                                                                         // This function clears all intervals set by the setTimeout functions within the script and also removes any existing session storage objects.
        window.clearTimeout(interval);
        return true;
    }

    function toTitleCase(str) {                                                                                    // This function is responsible for receiving a text string and converting it to a lowercase equivalent with all white spaces replaced with underscores.
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }

    function encoder_1(argument) {                                                                                 // This function is responsible for converting whitespaces to underscores......
        return argument.replace(/\s+/g, "_");
    }

    function decoder_1(argument) {                                                                                 // This function is responsible for converting underscores to whitespaces......
        return argument.replace(/_/g, " ");
    }

    function encoder_2(argument) {                                                                                 // This function is responsible for converting commas to hyphens......
        return argument.replace(/,/g, "-");
    }

    function encoder_3(argument) {
        return encodeURIComponent(argument).replace(/%2C/g, "~");
    }

    function check_postcode(arg) {                                                                                 // This function is responsible for ensuring valid postcodes and would render appropriate error messages, whenever an invalid postcode is detected.
        var postcode = document.getElementById(arg).value;
        var size = postcode.length;
        postcode = postcode.toUpperCase();
        while(postcode.slice(0, 1) == " ") {
          postcode = postcode.substr(1, size - 1);
          size = postcode.length;
        }
        while (postcode.slice(size - 1, size) == " ") {
          postcode = postcode.substr(0, size - 1);
          size = postcode.length;
        }
        document.getElementById(arg).value = postcode;
        if ((size < 6) || (size > 8)) {
            document.getElementById(arg).focus();
            if (document.getElementById(arg).value == "") {
                enable("span#registration_error_messages", "An Empty Postcode is not a valid postcode.");
            }else {
                enable("span#registration_error_messages", postcode + " is not a valid postcode. Wrong Character Length Detected.");
            }
            interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
            return false;
        }else if (!(isNaN(postcode.charAt(0)))) {
            document.getElementById(arg).focus();
            enable("span#registration_error_messages", postcode + " is not a valid postcode. Postcode Cannot Begin with a Number.");
            interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
            return false;
        }else if (isNaN(postcode.charAt(size - 3))) {
            document.getElementById(arg).focus();
            enable("span#registration_error_messages", postcode + " is not a valid postcode. Existing Alphabetical Character in Wrong Position.");
            interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
            return false;
        }else if (!(isNaN(postcode.charAt(size - 2)))) {
            document.getElementById(arg).focus();
            enable("span#registration_error_messages", postcode + " is not a valid postcode. Existing Numerical Character in Wrong Position.");
            interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
            return false;
        }else if (!(isNaN(postcode.charAt(size - 1)))) {
            document.getElementById(arg).focus();
            enable("span#registration_error_messages", postcode + " is not a valid postcode. Existing Numerical Character in Wrong Position.");
            interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
            return false;
        }else if (!(postcode.charAt(size - 4) == " ")) {
            document.getElementById(arg).focus();
            enable("span#registration_error_messages", postcode + " is not a valid postcode. No White Space Detected or White Space in Wrong Position.");
            interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
            return false;
        }
        count1 = postcode.indexOf(" ");
        count2 = postcode.lastIndexOf(" ");
        if (count1 != count2) {
            document.getElementById(arg).focus();
            enable("span#registration_error_messages", postcode + " is not a valid postcode. Postcodes can only contain ONE White/Negative Space.");
            interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
            return false;
        }
        return true;
    }

    function postcode_address_finder() {                                                                                 // This method will validate the Entered Postcode and configure the Postcode API Lookup Web Service Object. Postcodes: AA1 1AA, AA1 1AB, AA1 1AD and AA1 1AE can be tried free of charge....
        var flag = check_postcode("company_postcode");
        if (flag == true) {
            postcode_lookup = CraftyPostcodeCreate();
            postcode_lookup.set("access_token", "e1a65-2c87d-cdf18-00cd3");                                              // Token Key to access Postcode Lookup API Web Service.
            postcode_lookup.set("first_res_line", "----- Please Select Your Contact Address ----");                      // String to display as first line of results list.
            postcode_lookup.set("res_autoselect", "0");                                                                  // Ensures first result would not be selected, once results are detected. 1 (default) indicates otherwise.
            postcode_lookup.set("res_select_on_change", "0");                                                            // User must explicitly click on an address to select it, rather than selecting during scrolling.
            postcode_lookup.set("lookup_timeout", "20000");                                                              // Postcode Lookup API Timeout Period, which specifies the maximum amount of time to spend searching for a particular postcode, before timing out.
            postcode_lookup.set("single_res_autoselect", "0");                                                           // Don't display a drop down menu, if only one address result is detected. Rather, the single result should be auto-selected.
            postcode_lookup.set("result_elem_id", "display_addresses");                                                  // Element responsible for displaying drop-down menu of address(es), as well as any errors, messages or notices.
            postcode_lookup.set("max_width", "300px");                                                                   // Set to limit the width of the results box.
            postcode_lookup.set("hide_result", "1");                                                                     // Set the Results Box to disappear, once an address is selected.
            postcode_lookup.set("debug_mode", "1");                                                                      // Enable debugging, upon the occurrence of any errors.
            postcode_lookup.set("form", "");                                                                             // Since no form element is in use, set id to blank.
            postcode_lookup.set("elem_postcode", "company_postcode");                                                    // Configure element id for Postcode option.
            postcode_lookup.set("elem_street1", "company_contact_address_1");                                            // Configure element id for Street 1 option.
            postcode_lookup.set("elem_street2", "company_contact_address_2");                                            // Configure element id for Street 2 option.
            postcode_lookup.set("elem_street3", "company_contact_address_3");                                            // Configure element id for Street 3 option.
            postcode_lookup.set("elem_town", "company_town_or_city");                                                    // Configure element id for Town option.
            postcode_lookup.set("elem_county", "company_county_or_state");                                               // Configure element id for County option.
            postcode_lookup.doLookup();                                                                                  // Initiate Postcode Lookup API Functionality.
        }else {
            return false;
        }
        return true;
    }

    function enable(id, content) {                                                                                       // This function is responsible for displaying elements and their contents (if any) by simply fading them in and initializing the existing textual element content.
        if (typeof content != "undefined") {
            $(id).html(content);
        }
        $(id).fadeIn("slow");
        return true;
    }

    function disable(id1, id2, id3) {                                                                                    // This function is responsible for removing elements and can remove up to a maximum of 3 elements by fading them out within 350 milliseconds.
		if (typeof id1 != "undefined") {
            $(id1).fadeOut(350);
        }
        if (typeof id2 != "undefined") {
            $(id2).fadeOut(350);
        }
        if (typeof id3 != "undefined") {
            $(id3).fadeOut(350);
        }
        return true;
    }

    function color_palette_initializer() {                                                                               // This function is responsible for initializing the Color Palette Feature.
        ColorPicker.fixIndicators(document.getElementById('slider-indicator'), document.getElementById('picker-indicator'));
        ColorPicker (
            document.getElementById("slider"),
            document.getElementById("picker"),
            function(hex, hsv, rgb, pickerCoordinate, sliderCoordinate) {
                ColorPicker.positionIndicators (document.getElementById("slider-indicator"), document.getElementById("picker-indicator"), sliderCoordinate, pickerCoordinate);
                document.getElementById("hex_color").value = hex;
                document.getElementById("color_shade").style.backgroundColor = hex;
                label_customizer("color_palette", hex);
            }
        );
        return true;
    }

    function color_palette() {                                                                                           // This function activates/deactivates the Color Palette Feature....
        if ((document.getElementById("picker-wrapper").style.display == "none") && (document.getElementById("slider-wrapper").style.display == "none")) {
            document.getElementById("color_shade").style.display = "inline-block";
            document.getElementById("label_hex_color").style.display = "inline-block";
            document.getElementById("hex_color").style.display = "inline-block";
            document.getElementById("slider-wrapper").style.display = "block";
            document.getElementById("picker-wrapper").style.display = "block";
        }else {
            document.getElementById("color_shade").style.display = "none";
            document.getElementById("label_hex_color").style.display = "none";
            document.getElementById("hex_color").style.display = "none";
            document.getElementById("slider-wrapper").style.display = "none";
            document.getElementById("picker-wrapper").style.display = "none";
        }
        return true;
    }

    function loose_focus_preview(arg) {                                                                                  // This function receives the current HTML Element as argument/parameter and ensures it looses focus, when label template layout is currently being previewed.
        if (arg.style.borderStyle == "none") {
            loose_focus(arg);
        }else {
            document.getElementById("required_field").value = arg.id;
            label_customizer("required_field");
        }
        return true;
    }

    function loose_focus(arg) {                                                                                          // This function receives the current HTML Element as argument/parameter and ensures it looses focus.
        arg.blur();
        return true;
    }

    function filter_by_template_layout() {                                                                               // This function filters the list of Saved Labels by Template Layout.
        var template_layouts_list_value = document.getElementById("template_layouts_list").value;
        if (template_layouts_list_value == "show_all") {
            show_labels();
        }else {
            var local_xmlhttp = new XMLHttpRequest();
            local_xmlhttp.open("POST", "middleware/scripts/library_process.php", true);
            local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            local_xmlhttp.send("flag=14&filter_template_layouts=true&template_layouts_list_value="+template_layouts_list_value);
            local_xmlhttp.onreadystatechange = function() {
                if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                    document.getElementById("busy").style.display = "none";
                    $("div#main_container div#content_area div#library_records table#library_records_table tbody").html(local_xmlhttp.responseText);
                }else {
                    document.getElementById("busy").style.display = "inline-block";
                }
            };
        }
        return true;
    }

    function filter_by_label_template() {                                                                                // This function filters the list of Saved Labels by Label Template.
        var label_templates_list_value = document.getElementById("label_templates_list").value;
        if (label_templates_list_value == "show_all") {
            show_labels();
        }else {
            var local_xmlhttp = new XMLHttpRequest();
            local_xmlhttp.open("POST", "middleware/scripts/library_process.php", true);
            local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            local_xmlhttp.send("flag=14&filter_label_templates=true&label_templates_list_value="+label_templates_list_value);
            local_xmlhttp.onreadystatechange = function() {
                if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                    document.getElementById("busy").style.display = "none";
                    $("div#main_container div#content_area div#library_records table#library_records_table tbody").html(local_xmlhttp.responseText);
                }else {
                    document.getElementById("busy").style.display = "inline-block";
                }
            };
        }
        return true;
    }

    function register(arg) {                                                                                             // This function is responsible for managing all User Profile Registration Activities.
        if (arg.id === "register") {
            configure_system_interface();
            document.getElementById("content_area").style.display = "none";
            document.getElementById("registration_form").style.display = "block";
            set_current_menu("Register");
        }else if (arg.id === "submit_registration") {
            var title = document.getElementById("title").value;
            var first_name = toTitleCase(document.getElementById("first_name").value.trim());
            var last_name = toTitleCase(document.getElementById("last_name").value.trim());
            var company_name = toTitleCase(document.getElementById("company_name").value.trim());
            var company_postcode = document.getElementById("company_postcode").value.toUpperCase().trim();
            var company_contact_address_1 = toTitleCase(document.getElementById("company_contact_address_1").value.trim());
            var company_contact_address_2 = toTitleCase(document.getElementById("company_contact_address_2").value.trim());
            var company_contact_address_3 = toTitleCase(document.getElementById("company_contact_address_3").value.trim());
            var company_town_or_city = toTitleCase(document.getElementById("company_town_or_city").value.trim());
            var company_county_or_state = toTitleCase(document.getElementById("company_county_or_state").value.trim());
            var company_country = document.getElementById("company_country").value;
            var registration_email_address = document.getElementById("registration_email_address").value.trim();
            var registration_password = document.getElementById("registration_password").value;
            var confirm_registration_password = document.getElementById("confirm_registration_password").value;
            var work_telephone = encodeURIComponent(document.getElementById("work_telephone").value.trim());
            var mobile_telephone = encodeURIComponent(document.getElementById("mobile_telephone").value.trim());
            var preferred_contact = document.getElementsByName("preferred_contact");
            for (var i = 0; i < preferred_contact.length; i++) {
                if (preferred_contact[i].checked) {
                    preferred_contact = preferred_contact[i].value;
                    break;
                }
            }
            if (document.getElementById("registration_code").value.trim() != "") {
                if ((document.getElementById("registration_code").value.length < 5) || (document.getElementById("registration_code").value.length > 5)) {
                    enable("span#registration_error_messages", "Registration Code MUST Be Exactly 5 Characters.");
                    interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
                    return false;
                }else {
                    var registration_code = document.getElementById("registration_code").value.trim();
                }
            }
            var registration_captcha_code = document.getElementById("registration_captcha_code").value.trim();
            if ((first_name == "") || (last_name == "") || (company_name == "") || (company_postcode == "") || (company_contact_address_1 == "") || (company_town_or_city == "") || (company_county_or_state == "") || (registration_email_address == "") || (registration_password == "") || (confirm_registration_password == "") || (registration_captcha_code == "")) {
                enable("span#registration_error_messages", "All Fields Marked with * Are Mandatory and MUST be Entered!!!");
                interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
                return false;
            }else if ((work_telephone == "") && (mobile_telephone == "")) {
                enable("span#registration_error_messages", "You MUST provide at least One Contact Number!!!");
                interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
                return false;
            }else if ((preferred_contact == "Work") && (work_telephone == "")) {
                enable("span#registration_error_messages", "You MUST provide a Work Contact Number, if Preferred Contact is your Work Telephone.");
                interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
                return false;
            }else if ((preferred_contact == "Mobile") && (mobile_telephone == "")) {
                enable("span#registration_error_messages", "You MUST provide a Mobile Contact Number, if Preferred Contact is your Mobile Telephone.");
                interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
                return false;
            }else {
                xmlhttp.open("POST", "middleware/scripts/captcha_generator.php", true);
                xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlhttp.send("captcha_code="+registration_captcha_code);
                xmlhttp.onreadystatechange = function() {
                    if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                        document.getElementById("registration_busy").style.display = "none";
                        if (xmlhttp.responseText == "false") {
                            enable("span#registration_error_messages", "Please Ensure the Code Entered Matches the Code within the Image above to the right.");
                            interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
                            return false;
                        }else {
                            if (email_filter.test(registration_email_address) == false) {
                                enable("span#registration_error_messages", "Email Address Entered is invalid!!!");
                                interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
                                return false;
                            }else if (registration_email_address.length > 80) {
                                enable("span#registration_error_messages", "Email Address CANNOT be greater than 80 Characters.");
                                interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
                                return false;
                            }else if (registration_password.length < 8) {
                                enable("span#registration_error_messages", "Your Registration Password CANNOT be less than 8 Characters.");
                                interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
                                return false;
                            }else if (alphanumeric.test(registration_password) == false) {
                                enable("span#registration_error_messages", "The Registration Password MUST Consist of both Numbers and Letters.");
                                interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
                                return false;
                            }else if (registration_password != confirm_registration_password) {
                                enable("span#registration_error_messages", "Registration Password MUST BE Same As Confirm Password.");
                                interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
                                return false;
                            }else {
                                var flag = check_postcode("company_postcode");
                                if (flag == true) {
                                    xmlhttp.open("POST", "middleware/scripts/registration_process.php", true);
                                    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                    if (typeof registration_code == "undefined") {
                                        xmlhttp.send("flag=1&title="+title+"&first_name="+first_name+"&last_name="+last_name+"&company_name="+company_name+"&company_postcode="+company_postcode+"&company_contact_address_1="+company_contact_address_1+"&company_contact_address_2="+company_contact_address_2+"&company_contact_address_3="+company_contact_address_3+"&company_town_or_city="+company_town_or_city+"&company_county_or_state="+company_county_or_state+"&company_country="+company_country+"&registration_email_address="+registration_email_address+"&confirm_registration_password="+confirm_registration_password+"&work_telephone="+work_telephone+"&mobile_telephone="+mobile_telephone+"&preferred_contact="+preferred_contact);
                                    }else {
                                        xmlhttp.send("flag=1&title="+title+"&first_name="+first_name+"&last_name="+last_name+"&company_name="+company_name+"&company_postcode="+company_postcode+"&company_contact_address_1="+company_contact_address_1+"&company_contact_address_2="+company_contact_address_2+"&company_contact_address_3="+company_contact_address_3+"&company_town_or_city="+company_town_or_city+"&company_county_or_state="+company_county_or_state+"&company_country="+company_country+"&registration_email_address="+registration_email_address+"&confirm_registration_password="+confirm_registration_password+"&work_telephone="+work_telephone+"&mobile_telephone="+mobile_telephone+"&preferred_contact="+preferred_contact+"&registration_code="+registration_code);
                                    }
                                    xmlhttp.onreadystatechange = function() {
                                        if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                                            document.getElementById("registration_busy").style.display = "none";
                                            if (xmlhttp.responseText === "Matching Record Found") {
                                                enable("span#registration_error_messages", "The Email Address You Have Entered Already Exists. Please Enter a New Email Address.");
                                                interval = window.setTimeout("disable('span#registration_error_messages')", 4000);
                                                return false;
                                            }else if (xmlhttp.responseText === "Failure") {
                                                enable("span#registration_error_messages", "Unknown Registration Code Entered. Unable To Complete Registration Process.");
                                                interval = window.setTimeout("disable('span#registration_error_messages')", 4000);
                                                return false;
                                            }else if (xmlhttp.responseText === "Success") {
                                                enable("span#registration_success_messages", "Registration Process Successfully Completed!");
                                                $("span#registration_success_messages").fadeOut(4000, function() {
                                                    window.location.reload();
                                                });
                                            }
                                        }else {
                                            document.getElementById("registration_busy").style.display = "inline-block";
                                        }
                                    };
                                }else {
                                    return false;
                                }
                            }
                        }
                    }else {
                        document.getElementById("registration_busy").style.display = "inline-block";
                    }
                };
            }
        }
        return true;
    }

    function show_my_account() {                                                                                         // This function is responsible for displaying the User's Registration Account Details.
        xmlhttp.open("POST", "middleware/scripts/registration_process.php", true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send("flag=2");
        xmlhttp.onreadystatechange = function() {
            if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                configure_system_interface();
                enable("div#content_area", xmlhttp.responseText);
            }
        };
        set_current_menu("My Account");
        return true;
    }

    function update_my_account() {                                                                                       // This function is responsible for updating the User's Registration Account Details.
        var title = document.getElementById("title").value;
        var first_name = toTitleCase(document.getElementById("first_name").value.trim());
        var last_name = toTitleCase(document.getElementById("last_name").value.trim());
        var company_name = toTitleCase(document.getElementById("company_name").value.trim());
        var company_postcode = document.getElementById("company_postcode").value.trim();
        var company_contact_address_1 = toTitleCase(document.getElementById("company_contact_address_1").value.trim());
        var company_contact_address_2 = toTitleCase(document.getElementById("company_contact_address_2").value.trim());
        var company_contact_address_3 = toTitleCase(document.getElementById("company_contact_address_3").value.trim());
        var company_town_or_city = toTitleCase(document.getElementById("company_town_or_city").value.trim());
        var company_county_or_state = toTitleCase(document.getElementById("company_county_or_state").value.trim());
        var company_country = document.getElementById("company_country").value;
        var registration_email_address = document.getElementById("registration_email_address").value.trim();
        var work_telephone = encodeURIComponent(document.getElementById("work_telephone").value.trim());
        var mobile_telephone = encodeURIComponent(document.getElementById("mobile_telephone").value.trim());
        var preferred_contact = document.getElementsByName("preferred_contact");
        for (var i = 0; i < preferred_contact.length; i++) {
            if (preferred_contact[i].checked) {
                preferred_contact = preferred_contact[i].value;
                break;
            }
        }
        if ((first_name == "") || (last_name == "") || (company_name == "") || (company_postcode == "") || (company_contact_address_1 == "") || (company_town_or_city == "") || (company_county_or_state == "") || (registration_email_address == "")) {
            enable("span#registration_error_messages", "All Fields Marked with * Are Mandatory and MUST be Entered!!!");
            interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
            return false;
        }else if ((work_telephone == "") && (mobile_telephone == "")) {
            enable("span#registration_error_messages", "You MUST provide at least One Contact Number!!!");
            interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
            return false;
        }else if ((preferred_contact == "Work") && (work_telephone == "")) {
            enable("span#registration_error_messages", "You MUST provide a Work Contact Number, if Preferred Contact is your Work Telephone.");
            interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
            return false;
        }else if ((preferred_contact == "Mobile") && (mobile_telephone == "")) {
            enable("span#registration_error_messages", "You MUST provide a Mobile Contact Number, if Preferred Contact is your Mobile Telephone.");
            interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
            return false;
        }else {
            var flag = check_postcode("company_postcode");
            if (flag == true) {
                var local_xmlhttp = new XMLHttpRequest();
                local_xmlhttp.open("POST", "middleware/scripts/registration_process.php", true);
                local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                local_xmlhttp.send("flag=3&title="+title+"&first_name="+first_name+"&last_name="+last_name+"&company_name="+company_name+"&company_postcode="+company_postcode+"&company_contact_address_1="+company_contact_address_1+"&company_contact_address_2="+company_contact_address_2+"&company_contact_address_3="+company_contact_address_3+"&company_town_or_city="+company_town_or_city+"&company_county_or_state="+company_county_or_state+"&company_country="+company_country+"&registration_email_address="+registration_email_address+"&work_telephone="+work_telephone+"&mobile_telephone="+mobile_telephone+"&preferred_contact="+preferred_contact);
                local_xmlhttp.onreadystatechange = function() {
                    if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                        document.getElementById("busy").style.display = "none";
                        if (local_xmlhttp.responseText == "Matching Email Found") {
                            enable("span#registration_error_messages", "The Email Address Entered Already Exists.");
                            interval = window.setTimeout("disable('span#registration_error_messages')", 3000);
                        }else if (local_xmlhttp.responseText == "Update Successful 1") {
							enable("span#registration_success_messages", "Registration Account Successfully Updated!!!");
                            $("span#registration_success_messages").fadeOut(3000, function() {
                                window.location.replace("middleware/scripts/logout_process.php");
                            });
                        }else if (local_xmlhttp.responseText == "Update Successful 2") {
                            enable("span#registration_success_messages", "Registration Account Successfully Updated!!!");
                            $("span#registration_success_messages").fadeOut(3000, function() {
                                window.location.reload();
                            });
                        }
                    }else {
                        document.getElementById("busy").style.display = "inline-block";
                    }
                };
            }
        }
        return true;
    }

    function update_password() {                                                                                         // This function is responsible for updating the User's Registration Account Password.
        var old_password = document.getElementById("old_password").value;
        var new_password = document.getElementById("new_password").value;
        var confirm_password = document.getElementById("confirm_password").value;
        if ((old_password == "") || (new_password == "") || (confirm_password == "")) {
            enable("span#change_password_error_messages", "All Fields Marked With * MUST Be Entered!");
            interval = window.setTimeout("disable('span#change_password_error_messages')", 3000);
            return false;
        }else if (new_password.length < 8) {
            enable("span#change_password_error_messages", "Password MUST NOT be less than 8 Characters");
            interval = window.setTimeout("disable('span#change_password_error_messages')", 3000);
            return false;
        }else if (alphanumeric.test(new_password) == false) {
            enable("span#change_password_error_messages", "Password MUST consist of both Numbers and Letters");
            interval = window.setTimeout("disable('span#change_password_error_messages')", 3000);
            return false;
        }else if (new_password == old_password) {
            enable("span#change_password_error_messages", "New Password CANNOT BE Same As Old Password");
            interval = window.setTimeout("disable('span#change_password_error_messages')", 3000);
            return false;
        }else if (new_password != confirm_password) {
            enable("span#change_password_error_messages", "New Password MUST BE Same As Confirm Password");
            interval = window.setTimeout("disable('span#change_password_error_messages')", 3000);
            return false;
        }else {
            var local_xmlhttp = new XMLHttpRequest();
            local_xmlhttp.open("POST", "middleware/scripts/registration_process.php", true);
            local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            local_xmlhttp.send("flag=4&confirm_password="+confirm_password+"&old_password="+old_password);
            local_xmlhttp.onreadystatechange = function() {
                if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                    document.getElementById("busy").style.display = "none";
                    if (local_xmlhttp.responseText == "Success") {
                        document.getElementById("old_password").value = "";
                        document.getElementById("new_password").value = "";
                        document.getElementById("confirm_password").value = "";
                        enable("span#change_password_success_messages", "Password Successfully Updated");
                        interval = window.setTimeout("disable('span#change_password_success_messages')", 3000);
                    }else {
                        enable("span#change_password_error_messages", "An Error Occurred. The Current Password is Invalid!");
                        interval = window.setTimeout("disable('span#change_password_error_messages')", 3000);
                    }
                }else {
                    document.getElementById("busy").style.display = "inline-block";
                }
            };
        }
        return true;
    }

    function save_security_question_answer() {                                                                           // This function is responsible for setting a Security Question and Answer for Email Recovery.
        var security_question = toTitleCase(document.getElementById("the_security_question").value);
        var security_answer = toTitleCase(document.getElementById("security_answer").value);
        if ((security_question == "") || (security_answer == "")) {
            enable("span#security_question_error_messages", "All Fields Marked With * MUST Be Entered!");
            interval = window.setTimeout("disable('span#security_question_error_messages')", 3000);
            return false;
        }else {
            var local_xmlhttp = new XMLHttpRequest();
            local_xmlhttp.open("POST", "middleware/scripts/registration_process.php", true);
            local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            local_xmlhttp.send("flag=5&security_question="+security_question+"&security_answer="+security_answer);
            local_xmlhttp.onreadystatechange = function() {
                if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                    document.getElementById("busy").style.display = "none";
                    document.getElementById("the_security_question").value = "";
                    document.getElementById("security_answer").value = "";
                    enable("span#security_question_success_messages", "Security Question &amp; Answer Successfully Updated!");
                    interval = window.setTimeout("disable('span#security_question_success_messages')", 3000);
                }else {
                    document.getElementById("busy").style.display = "inline-block";
                }
            };
        }
        return true;
    }

    function show_security_dialog(arg) {                                                                                 // This function is responsible for showing the Security Dialog Interface
        xmlhttp.open("POST", "middleware/scripts/login_process.php", true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if (arg == "Recovery") {
            xmlhttp.send("flag=2&mode=recovery");
        }else if (arg == "Reset") {
            xmlhttp.send("flag=2&mode=reset");
        }
        xmlhttp.onreadystatechange = function() {
            if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                configure_system_interface();
                document.getElementById("content_area").innerHTML = xmlhttp.responseText;
                document.getElementById("registration_form").style.display = "none";
                document.getElementById("content_area").style.display = "block";
            }
        };
        return true;
    }

    function show_security_question() {                                                                                  // This function is responsible for getting the Security Question.
        var passcode = document.getElementById("passcode").value.trim();
        if (passcode == "") {
            enable("span#security_dialog_error_messages", "Please Enter Your Passcode");
            interval = window.setTimeout("disable('span#security_dialog_error_messages')", 3000);
            return false;
        }else if ((passcode.length < 9) || (passcode.length > 9)) {
            enable("span#security_dialog_error_messages", "Passcode MUST Be Exactly 9 Characters");
            interval = window.setTimeout("disable('span#security_dialog_error_messages')", 3000);
            return false;
        }else if (isNaN(passcode) == true) {
            enable("span#security_dialog_error_messages", "Passcode MUST Be Numerical");
            interval = window.setTimeout("disable('span#security_dialog_error_messages')", 3000);
            return false;
        }else {
            xmlhttp.open("POST", "middleware/scripts/login_process.php", true);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send("flag=3&passcode="+passcode);
            xmlhttp.onreadystatechange = function() {
                if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                    if (xmlhttp.responseText == "Failure") {
                        enable("span#security_dialog_error_messages", "Unable To Retrieve Security Question. Please Check Your Passcode or Set Up Your Security Question");
                        interval = window.setTimeout("disable('span#security_dialog_error_messages')", 3000);
                        return false;
                    }else {
                        document.getElementById("the_security_question").innerHTML = xmlhttp.responseText;
                        document.getElementById("the_security_answer").style.display = "inline-block";
                    }
                }
            };
        }
        return true;
    }

    function recover_email() {                                                                                           // This function is responsible for recovering the User's Registration Email Address.
        var the_security_answer = document.getElementById("the_security_answer").value;
        if (the_security_answer == "") {
            enable("span#security_dialog_error_messages", "Please Enter Your Security Answer");
            interval = window.setTimeout("disable('span#security_dialog_error_messages')", 3000);
            return false;
        }else {
            xmlhttp.open("POST", "middleware/scripts/login_process.php", true);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send("flag=4&security_answer="+the_security_answer);
            xmlhttp.onreadystatechange = function() {
                if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                    if (xmlhttp.responseText == "Failure") {
                        enable("span#security_dialog_error_messages", "Unable To Recover Email Address. Please Check Your Security Answer");
                        interval = window.setTimeout("disable('span#security_dialog_error_messages')", 3000);
                        return false;
                    }else {
                        window.alert("Your Email Address is " + xmlhttp.responseText);
                        window.location.reload();
                    }
                }
            };
        }
        return true;
    }

    function reset_password() {                                                                                          // This function is responsible for resetting the User's Registered Password.
        var the_security_answer = document.getElementById("the_security_answer").value;
        if (the_security_answer == "") {
            enable("span#security_dialog_error_messages", "Please Enter Your Security Answer");
            interval = window.setTimeout("disable('span#security_dialog_error_messages')", 3000);
            return false;
        }else {
            xmlhttp.open("POST", "middleware/scripts/login_process.php", true);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send("flag=5&security_answer="+the_security_answer);
            xmlhttp.onreadystatechange = function() {
                if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                    if (xmlhttp.responseText == "Failure") {
                        enable("span#security_dialog_error_messages", "Unable To Reset Password. Please Check Your Security Answer");
                        interval = window.setTimeout("disable('span#security_dialog_error_messages')", 3000);
                        return false;
                    }else {
                        enable("span#security_dialog_success_messages", "Password Successfully Reset. Check Your Email Address For New Password");
                        $("span#security_dialog_success_messages").fadeOut(3000, function() {
                            window.location.reload();
                        });
                    }
                }
            };
        }
        return true;
    }

    function login() {                                                                                                   // This function is responsible for managing the login procedure. It validates the login email and password and submits to the server upon successful validation.
        document.getElementById("login_email_address").value = document.getElementById("login_email_address").value.trim();
        if ((document.getElementById("login_email_address").value == "") || (document.getElementById("login_password").value == "")) {
            enable("span#login_error_messages", "Email Address or Password Cannot Be Empty");
            interval = window.setTimeout("disable('span#login_error_messages')", 3000);
            return false;
        }else if (email_filter.test(document.getElementById("login_email_address").value) == false) {
            enable("span#login_error_messages", "Email Address Entered is invalid");
            interval = window.setTimeout("disable('span#login_error_messages')", 3000);
            return false;
        }else if (document.getElementById("login_password").value.length < 8) {
            enable("span#login_error_messages", "Password MUST NOT be less than 8 Characters");
            interval = window.setTimeout("disable('span#login_error_messages')", 3000);
            return false;
        }else if (alphanumeric.test(document.getElementById("login_password").value) == false) {
            enable("span#login_error_messages", "Password MUST consist of both Numbers and Letters");
            interval = window.setTimeout("disable('span#login_error_messages')", 3000);
            return false;
        }else {
            var login_email_address = document.getElementById("login_email_address").value;
            var login_password = document.getElementById("login_password").value;
            xmlhttp.open("POST", "middleware/scripts/login_process.php", true);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send("flag=1&login_email_address="+login_email_address+"&login_password="+login_password);
            xmlhttp.onreadystatechange = function() {
                if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                    if (xmlhttp.responseText == "Failure") {
                        enable("span#login_error_messages", "Email Address or Password Does Not Exist. Please Register for an Account.");
                        interval = window.setTimeout("disable('span#login_error_messages')", 3000);
                        return false;
                    }else if (xmlhttp.responseText == "Success") {
                        window.location.reload();
                    }
                }
            };
        }
        return true;
    }

    function logout() {                                                                                                  // This function is responsble for logging currently logged-in users out of their current browsing sessions.
        print_queue = new Array();
        window.location.replace("middleware/scripts/logout_process.php");
        return true;
    }

    function set_current_menu(arg) {                                                                                     // This function is responsible for highlighting the primary menu item the user is currently viewing.
        var primary_menu_items = document.getElementById("primary_nav_menu").getElementsByTagName("li");
        for (var x = 0; x < primary_menu_items.length; x++) {
            if (primary_menu_items[x].getElementsByTagName("a")[0].childNodes[0].nodeValue == arg) {
                primary_menu_items[x].getElementsByTagName("a")[0].style.color = "#FFFFFF";
                primary_menu_items[x].getElementsByTagName("a")[0].style.backgroundColor = "#658D1B";
            }else {
                primary_menu_items[x].getElementsByTagName("a")[0].style.color = "";
                primary_menu_items[x].getElementsByTagName("a")[0].style.backgroundColor = "";
            }
        }
        return true;
    }

    function configure_system_interface() {                                                                              // This function is responsible for configuring the System Interface for the Customers' Sub-System.
        if (window.navigator.platform.match("Win") != null) {
            if (window.navigator.userAgent.match("Chrome") != null) {
                document.getElementById("infographic").style.display = "none";
                document.getElementById("main_container").style.height = "630px";
                document.getElementById("content_area").style.height = "522px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = "585px";
                document.getElementById("Gradient_Background_Fill").style.marginLeft = "-873px";
                document.getElementById("global_nav_menu").style.marginTop = "580px";
            }else if (window.navigator.userAgent.match("Trident") != null) {
                document.getElementById("infographic").style.display = "none";
                document.getElementById("main_container").style.height = "630px";
                document.getElementById("content_area").style.height = "522px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = "585px";
                document.getElementById("Gradient_Background_Fill").style.marginLeft = "-662px";
                document.getElementById("global_nav_menu").style.marginTop = "580px";
            }else if (window.navigator.userAgent.match("Safari") != null) {
                document.getElementById("infographic").style.display = "none";
                document.getElementById("main_container").style.height = "630px";
                document.getElementById("content_area").style.height = "522px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = "585px";
                document.getElementById("Gradient_Background_Fill").style.marginLeft = "-879px";
                document.getElementById("global_nav_menu").style.marginTop = "580px";
            }else if (window.navigator.userAgent.match("Firefox") != null) {
                document.getElementById("infographic").style.display = "none";
                document.getElementById("main_container").style.height = "630px";
                document.getElementById("content_area").style.height = "522px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = "585px";
                document.getElementById("Gradient_Background_Fill").style.marginLeft = "-868px";
                document.getElementById("global_nav_menu").style.marginTop = "580px";
            }
        }else if ((window.navigator.platform.match("Mac") != null) || (window.navigator.platform.match("Linux") != null)) {
            if (window.navigator.userAgent.match("Chrome") != null) {
                document.getElementById("infographic").style.display = "none";
                document.getElementById("main_container").style.height = "630px";
                document.getElementById("content_area").style.height = "522px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = "585px";
                document.getElementById("Gradient_Background_Fill").style.marginLeft = "-903px";
                document.getElementById("global_nav_menu").style.marginTop = "580px";
            }else if (window.navigator.userAgent.match("Safari") != null) {
                document.getElementById("infographic").style.display = "none";
                document.getElementById("main_container").style.height = "630px";
                document.getElementById("content_area").style.height = "522px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = "585px";
                document.getElementById("Gradient_Background_Fill").style.marginLeft = "-897px";
                document.getElementById("global_nav_menu").style.marginTop = "580px";
            }else if (window.navigator.userAgent.match("Firefox") != null) {
                document.getElementById("infographic").style.display = "none";
                document.getElementById("main_container").style.height = "630px";
                document.getElementById("content_area").style.height = "522px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = "585px";
                document.getElementById("Gradient_Background_Fill").style.marginLeft = "-899px";
                document.getElementById("global_nav_menu").style.marginTop = "580px";
            }
        }
        return true;
    }

    function adjust_system_interface_1() {                                                                               // This function is responsible for adjusting/modifying the Templates Module Interface for the Customers' Sub-System.
        if (window.navigator.platform.match("Win") != null) {
            if (window.navigator.userAgent.match("Chrome") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("save_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 202) + "px";
                document.getElementById("existing_labels").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 104) + "px";
                document.getElementById("label_customizer").style.marginTop = document.getElementById("save_label_box").style.marginTop;
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 367) + "px";
            }else if (window.navigator.userAgent.match("Trident") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("save_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 204) + "px";
                document.getElementById("existing_labels").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 103) + "px";
                document.getElementById("label_customizer").style.marginTop = document.getElementById("save_label_box").style.marginTop;
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 367) + "px";
            }else if (window.navigator.userAgent.match("Safari") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("save_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 202) + "px";
                document.getElementById("existing_labels").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 104) + "px";
                document.getElementById("label_customizer").style.marginTop = document.getElementById("save_label_box").style.marginTop;
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 367) + "px";
            }else if (window.navigator.userAgent.match("Firefox") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("save_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 202) + "px";
                document.getElementById("existing_labels").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 104) + "px";
                document.getElementById("label_customizer").style.marginTop = document.getElementById("save_label_box").style.marginTop;
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 367) + "px";
            }
        }else if ((window.navigator.platform.match("Mac") != null) || (window.navigator.platform.match("Linux") != null)) {
            if (window.navigator.userAgent.match("Chrome") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("save_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 202) + "px";
                document.getElementById("existing_labels").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 104) + "px";
                document.getElementById("label_customizer").style.marginTop = document.getElementById("save_label_box").style.marginTop;
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 367) + "px";
            }else if (window.navigator.userAgent.match("Safari") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("save_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 202) + "px";
                document.getElementById("existing_labels").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 104) + "px";
                document.getElementById("label_customizer").style.marginTop = document.getElementById("save_label_box").style.marginTop;
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 367) + "px";
            }else if (window.navigator.userAgent.match("Firefox") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("save_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 202) + "px";
                document.getElementById("existing_labels").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 104) + "px";
                document.getElementById("label_customizer").style.marginTop = document.getElementById("save_label_box").style.marginTop;
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("save_label_box").style.marginTop.substring(0, document.getElementById("save_label_box").style.marginTop.search("px"))) + 367) + "px";
            }
        }
        return true;
    }

    function adjust_system_interface_2() {                                                                               // This function is responsible for adjusting/modifying the Library Interface for the Customers' Sub-System.
        if (window.navigator.platform.match("Win") != null) {
            if (window.navigator.userAgent.match("Chrome") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("update_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 203) + "px";
                document.getElementById("label_customizer").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) - 21) + "px";
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) + 240) + "px";
            }else if (window.navigator.userAgent.match("Trident") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("update_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 203) + "px";
                document.getElementById("label_customizer").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) - 21) + "px";
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) + 240) + "px";
            }else if (window.navigator.userAgent.match("Safari") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("update_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 203) + "px";
                document.getElementById("label_customizer").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) - 21) + "px";
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) + 240) + "px";
            }else if (window.navigator.userAgent.match("Firefox") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("update_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 203) + "px";
                document.getElementById("label_customizer").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) - 22) + "px";
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) + 240) + "px";
            }
        }else if ((window.navigator.platform.match("Mac") != null) || (window.navigator.platform.match("Linux") != null)) {
            if (window.navigator.userAgent.match("Chrome") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("update_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 203) + "px";
                document.getElementById("label_customizer").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) - 21) + "px";
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) + 240) + "px";
            }else if (window.navigator.userAgent.match("Safari") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("update_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 203) + "px";
                document.getElementById("label_customizer").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) - 21) + "px";
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) + 240) + "px";
            }else if (window.navigator.userAgent.match("Firefox") != null) {
                document.getElementById("templates_previewer").style.height = Math.round(parseFloat(document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.substring(0, document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.height.search("mm"))) * 3.77952755905511) + "px";
                document.getElementById("content_area").style.height = (parseInt(document.getElementById("templates_previewer").style.height.substring(0, document.getElementById("templates_previewer").style.height.search("px"))) + 222) + "px";
                document.getElementById("main_container").style.height = (parseInt(document.getElementById("content_area").style.height.substring(0, document.getElementById("content_area").style.height.search("px"))) + 108) + "px";
                document.getElementById("Gradient_Background_Fill").style.marginTop = (parseInt(document.getElementById("main_container").style.height.substring(0, document.getElementById("main_container").style.height.search("px"))) - 45) + "px";
                document.getElementById("global_nav_menu").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 5) + "px";
                document.getElementById("update_label_box").style.marginTop = (parseInt(document.getElementById("Gradient_Background_Fill").style.marginTop.substring(0, document.getElementById("Gradient_Background_Fill").style.marginTop.search("px"))) - 203) + "px";
                document.getElementById("label_customizer").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) - 21) + "px";
                document.getElementById("toggle_instructions").style.marginTop = (parseInt(document.getElementById("update_label_box").style.marginTop.substring(0, document.getElementById("update_label_box").style.marginTop.search("px"))) + 240) + "px";
            }
        }
        return true;
    }

    function show_templates() {                                                                                          // This function is responsible for calling up the Templates Module.
        sessionStorage.removeItem("edit_save_name");
        sessionStorage.removeItem("edit_layout_type");
        xmlhttp.open("POST", "middleware/scripts/templates_process.php", true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send("flag=1");
        xmlhttp.onreadystatechange = function() {
            if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                if (xmlhttp.responseText == "Error") {
                    window.alert("Successful Login Authentication Required To View This Content!!!");
                    return false;
                }else {
                    configure_system_interface();
                    enable("div#content_area", xmlhttp.responseText);
                    color_palette_initializer();
                    set_current_menu("Create");
                }
            }
        };
        return true;
    }

    function show_existing_labels() {                                                                                    // This function is responsible for displaying the list of existing labels available for current user.
        var local_xmlhttp = new XMLHttpRequest();
        local_xmlhttp.open("POST", "middleware/scripts/templates_process.php", true);
        local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        local_xmlhttp.send("flag=7");
        local_xmlhttp.onreadystatechange = function() {
            if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                document.getElementById("busy").style.display = "none";
                document.getElementById("existing_labels").innerHTML = local_xmlhttp.responseText;
            }else {
                document.getElementById("busy").style.display = "inline-block";
            }
        };
        return true;
    }

    function show_library() {                                                                                            // This function is responsible for calling up the Library Module.
        current_layout = "";
        layout_path = "";
        xmlhttp.open("POST", "middleware/scripts/library_process.php", true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send("flag=1");
        xmlhttp.onreadystatechange = function() {
            if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                if (xmlhttp.responseText == "Error") {
                    window.alert("Successful Login Authentication Required To View This Content!!!");
                    return false;
                }else {
                    configure_system_interface();
                    enable("div#content_area", xmlhttp.responseText);
                    color_palette_initializer();
                    set_current_menu("Library");
                }
            }
        };
        return true;
    }

    function show_labels() {                                                                                            // This function is responsible for showing the current user's saved labels.
        var local_xmlhttp = new XMLHttpRequest();
        local_xmlhttp.open("POST", "middleware/scripts/library_process.php", true);
        local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        local_xmlhttp.send("flag=2");
        local_xmlhttp.onreadystatechange = function() {
            if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                document.getElementById("busy").style.display = "none";
                document.getElementById("library_records").innerHTML = local_xmlhttp.responseText;
            }else {
                document.getElementById("busy").style.display = "inline-block";
            }
        };
        return true;
    }

    function show_contact_info() {                                                                                       // This function displays the Contact Form and any other contact information.....
        xmlhttp.open("POST", "middleware/scripts/show_contact_info.php", true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send();
        xmlhttp.onreadystatechange = function() {
            if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                configure_system_interface();
                document.getElementById("registration_form").style.display = "none";
                document.getElementById("content_area").innerHTML = xmlhttp.responseText;
                document.getElementById("content_area").style.display = "block";
                set_current_menu("Contact");
            }
        };
        return true;
    }

    function send_contact_message() {                                                                                    // This function is responsible for validating and sending messages from the contact form......
        if (document.getElementById("full_name").value.trim() == "") {
            enable("span#contact_error_messages", "Please Enter Your Full Name.");
            interval = window.setTimeout("disable('span#contact_error_messages')", 3000);
            return false;
        }else if (document.getElementById("email_address").value.trim() == "") {
            enable("span#contact_error_messages", "Please Enter Your Email Address.");
            interval = window.setTimeout("disable('span#contact_error_messages')", 3000);
            return false;
        }else if (email_filter.test(document.getElementById("email_address").value.trim()) == false) {
            enable("span#contact_error_messages", "Email Address Entered is invalid. Please Enter a Valid Email Address.");
            interval = window.setTimeout("disable('span#contact_error_messages')", 3000);
            return false;
        }else if (document.getElementById("phone_number").value.trim() == "") {
            enable("span#contact_error_messages", "Please Enter Your Primary Phone Number.");
            interval = window.setTimeout("disable('span#contact_error_messages')", 3000);
            return false;
        }else if (document.getElementById("message_subject").value.trim() == "") {
            enable("span#contact_error_messages", "Please Enter Your Subject.");
            interval = window.setTimeout("disable('span#contact_error_messages')", 3000);
            return false;
        }else if (document.getElementById("contact_message").value.trim() == "") {
            enable("span#contact_error_messages", "Please Enter Your Message.");
            interval = window.setTimeout("disable('span#contact_error_messages')", 3000);
            return false;
        }else if (document.getElementById("contact_captcha_code").value.trim() == "") {
            enable("span#contact_error_messages", "Please Enter the Code within the Image to the right.");
            interval = window.setTimeout("disable('span#contact_error_messages')", 3000);
            return false;
        }else {
            var contact_captcha_code = document.getElementById("contact_captcha_code").value.trim();
            xmlhttp.open("POST", "middleware/scripts/captcha_generator.php", true);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send("captcha_code="+contact_captcha_code);
            xmlhttp.onreadystatechange = function() {
                if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                    document.getElementById("contact_busy").style.display = "none";
                    if (xmlhttp.responseText == "false") {
                        enable("span#contact_error_messages", "Please Ensure the Code Entered Matches that of the Image to the right.");
                        interval = window.setTimeout("disable('span#contact_error_messages')", 3000);
                        return false;
                    }else {
                        var full_name = document.getElementById("full_name").value.trim();
                        var email_address = document.getElementById("email_address").value.trim();
                        var phone_number = encodeURIComponent(document.getElementById("phone_number").value.trim());
                        var message_subject = document.getElementById("message_subject").value.trim();
                        var contact_message = document.getElementById("contact_message").value.trim();
                        xmlhttp.open("POST", "middleware/scripts/send_contact_message.php", true);
                        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        xmlhttp.send("full_name="+full_name+"&email_address="+email_address+"&phone_number="+phone_number+"&message_subject="+message_subject+"&contact_message="+contact_message);
                        xmlhttp.onreadystatechange = function() {
                            if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                                document.getElementById("contact_busy").style.display = "none";
                                if (xmlhttp.responseText == "Message Sent") {
                                    enable("span#contact_success_messages", "Your Contact Message has been Successfully Sent.");
                                    interval = window.setTimeout("disable('span#contact_success_messages')", 3000);
                                }else if (xmlhttp.responseText == "Error") {
                                    enable("span#contact_error_messages", "An Error Occurred while sending Contact Message. Please Try Again Later.");
                                    interval = window.setTimeout("disable('span#contact_error_messages')", 3000);
                                    return false;
                                }
                            }else {
                                document.getElementById("contact_busy").style.display = "inline-block";
                            }
                        };
                    }
                }else {
                    document.getElementById("contact_busy").style.display = "inline-block";
                }
            };
        }
        return true;
    }

    function toggle_instructions(arg) {                                                                                  // This function is responsible for displaying the associated instructions for each module.....
        $("div#main_container div#content_area div#instructions").slideToggle("normal");
        return true;
    }

    function initialize_templates_previewer() {                                                                          // This function initializes the Label Templates Previewer......
        document.getElementById("templates_previewer").innerHTML = "";
        document.getElementById("save_label_box").style.display = "none";
        document.getElementById("existing_labels").style.display = "none";
        document.getElementById("label_customizer").style.display = "none";
        document.getElementById("toggle_instructions").style.display = "none";
        document.getElementById("color_shade").style.display = "none";
        document.getElementById("label_hex_color").style.display = "none";
        document.getElementById("hex_color").style.display = "none";
        document.getElementById("picker-wrapper").style.display = "none";
        document.getElementById("slider-wrapper").style.display = "none";
        document.getElementById("content_area").getElementsByTagName("h2")[0].innerHTML = "Choose Your Template";
        if ((current_layout != "") && (layout_path != "")) {
            current_layout = "";
            layout_path = "";
        }
        templates_previewer();
        return true;
    }

    function templates_previewer() {                                                                                     // This function loads up the selected Label Template and also produces the list of template layouts available for the selected Label Template.
        var local_xmlhttp = new XMLHttpRequest();
        if (document.getElementById("label_templates").value != "") {
            var templates_path = "label_templates/" + document.getElementById("label_templates").value;
            var diagram_path = "label_template_diagrams/" + document.getElementById("label_templates").value;
            var list_of_templates = document.getElementById("label_templates");
            for (var i = 0; i < list_of_templates.length; i++) {
                if (list_of_templates[i].selected) {
                    current_template = list_of_templates[i].text;
                }
            }
            local_xmlhttp.open("POST", "middleware/scripts/templates_process.php", true);
            local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            local_xmlhttp.send("flag=2&current_template="+current_template);
            local_xmlhttp.onreadystatechange = function() {
                if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                    document.getElementById("busy").style.display = "none";
                    if (local_xmlhttp.responseText != "") {
                        document.getElementById("label_template_layouts").innerHTML = local_xmlhttp.responseText;
                        document.getElementById("label_diagram_container").style.background = "transparent url(" + diagram_path + ") no-repeat center center";
                        document.getElementById("label_diagram_container").style.backgroundSize = "100px 130px";
                        document.getElementById("templates_previewer").style.background = "transparent url(" + templates_path + ") no-repeat center center";
                    }else {
                        document.getElementById("templates_previewer").style.background = "transparent none";
                        document.getElementById("label_diagram_container").style.background = "transparent none";
                        document.getElementById("label_template_layouts").innerHTML = "<span id = 'error'>No Template Layouts Found for this Current Selection</span>";
                        document.getElementById("error").style.display = "inline-block";
                        document.getElementById("error").style.marginLeft = "0px";
                        return false;
                    }
                }else {
                    document.getElementById("busy").style.display = "inline-block";
                }
            };
        }
        return true;
    }

    function initialize_layouts_previewer() {                                                                            // This function initializes the Label Templates Layout Previewer......
        document.getElementById("templates_previewer").innerHTML = "";
        document.getElementById("save_label_box").style.display = "none";
        document.getElementById("existing_labels").style.display = "none";
        document.getElementById("label_customizer").style.display = "none";
        document.getElementById("toggle_instructions").style.display = "none";
        document.getElementById("color_shade").style.display = "none";
        document.getElementById("label_hex_color").style.display = "none";
        document.getElementById("hex_color").style.display = "none";
        document.getElementById("picker-wrapper").style.display = "none";
        document.getElementById("slider-wrapper").style.display = "none";
        document.getElementById("content_area").getElementsByTagName("h2")[0].innerHTML = "Choose Your Layout";
        if (document.getElementById("preview_label").innerHTML == "Preview Label") {
            document.getElementById("preview_label").style.display = "none";
        }else if (document.getElementById("preview_label").innerHTML == "Unset Preview") {
            document.getElementById("preview_label").innerHTML = "Preview Label";
            document.getElementById("preview_label").style.display = "none";
        }
        layouts_previewer();
        return true;
    }

    function layouts_previewer() {                                                                                       // This function loads up the selected Label Template Layout.....
        layout_path = "label_template_layouts/" + document.getElementById("list_of_layouts").value;
        document.getElementById("templates_previewer").style.background = "transparent url(" + layout_path + ") no-repeat center center";
        var list_of_layouts = document.getElementById("list_of_layouts");
        for (var i = 0; i < list_of_layouts.length; i++) {
            if (list_of_layouts[i].selected) {
                current_layout = list_of_layouts[i].text;
            }
        }
        return true;
    }

    function create_label() {                                                                                            // This function loads up settings for the selected Label Template Layout and enables Label Customizations.....
        if ((current_layout != "") && (layout_path != "")) {
            var local_xmlhttp_1 = new XMLHttpRequest();
            var local_xmlhttp_2 = new XMLHttpRequest();
            local_xmlhttp_1.open("POST", "middleware/scripts/templates_process.php", true);
            local_xmlhttp_1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            local_xmlhttp_1.send("flag=9&current_layout="+current_layout);
            local_xmlhttp_1.onreadystatechange = function() {
                if ((local_xmlhttp_1.readyState == 4) && (local_xmlhttp_1.status == 200)) {
                    $("div#main_container div#content_area div#label_customizer select#required_field").html(local_xmlhttp_1.responseText);
                    local_xmlhttp_2.open("POST", "middleware/scripts/templates_process.php", false);
                    local_xmlhttp_2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    local_xmlhttp_2.send("flag=3&current_layout="+current_layout);
                    if (local_xmlhttp_2.responseText != "") {
                        document.getElementById("content_area").getElementsByTagName("h2")[0].innerHTML = "Create Label From Layout";
                        document.getElementById("preview_label").style.display = "inline-block";
                        if (document.getElementById("preview_label").innerHTML == "Unset Preview") {
                            document.getElementById("preview_label").innerHTML = "Preview Label";
                        }
                        document.getElementById("toggle_instructions").style.display = "inline-block";
                        document.getElementById("save_label_box").style.display = "block";
                        document.getElementById("existing_labels").style.display = "block";
                        document.getElementById("label_customizer").style.display = "block";
                        document.getElementById("templates_previewer").style.background = "transparent none";
                        document.getElementById("templates_previewer").innerHTML = local_xmlhttp_2.responseText;
                        document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.background = "transparent url(" + layout_path + ") no-repeat center center";
                        document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.backgroundSize = "100% 100%";
                        adjust_system_interface_1();
                    }
                }
            };
        }
        return true;
    }

    function preview_label(arg) {                                                                                        // This function makes it possible to either Preview or Unpreview the selected Label Template Layout.....
        var x;
        var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
        if (arg.innerHTML == "Quick Preview") {
            document.getElementById("color_shade").style.display = "none";
            document.getElementById("label_hex_color").style.display = "none";
            document.getElementById("hex_color").style.display = "none";
            document.getElementById("picker-wrapper").style.display = "none";
            document.getElementById("slider-wrapper").style.display = "none";
            document.getElementById("save_label_box").style.display = "none";
            document.getElementById("existing_labels").style.display = "none";
            document.getElementById("label_customizer").style.display = "none";
            document.getElementById("toggle_instructions").style.display = "none";
            var preview_path = "label_paper_previews/" + document.getElementById("label_templates").value;
            document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.background = "transparent url(" + preview_path + ") no-repeat center center";
            document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.backgroundSize = "100% 100%";
            for (x in elements) {
                if ((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) {
                    if ((elements[x].value.match("_O=") != null) || (elements[x].value.match("12H_O=") != null) || (elements[x].value.match("24H_O=") != null)) {
                        field_collection.push(elements[x].id + " - " + elements[x].value);
                        var local_xmlhttp = new XMLHttpRequest();
                        local_xmlhttp.open("POST", "middleware/scripts/library_process.php", false);
                        local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        local_xmlhttp.send("flag=15&label_field_value="+elements[x].value);
                        if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                            document.getElementById(elements[x].id).value = local_xmlhttp.responseText;
                        }
                    }
                    elements[x].style.borderStyle = "none";
                    elements[x].style.outlineStyle = "none";
                    elements[x].style.backgroundColor = "transparent";
                }
            }
            arg.innerHTML = "Unset Preview";
        }else {
            document.getElementById("required_field").value = "";
            document.getElementById("all").checked = true;
            document.getElementById("label_customizer").style.display = "block";
            document.getElementById("save_label_box").style.display = "block";
            document.getElementById("existing_labels").style.display = "block";
            document.getElementById("toggle_instructions").style.display = "inline-block";
            document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.background = "transparent url(" + layout_path + ") no-repeat center center";
            document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.backgroundSize = "100% 100%";
            for (x in elements) {
                if ((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) {
                    for (var i = 0; i < field_collection.length; i++) {
                        if (field_collection[i].match(elements[x].id) != null) {
                            field_collection[i] = field_collection[i].replace(field_collection[i], field_collection[i].substring((elements[x].id.length + 4) - 1));
                            document.getElementById(elements[x].id).value = field_collection[i];
                        }else {
                            continue;
                        }
                    }
                    elements[x].style.borderStyle = "";
                    elements[x].style.outlineStyle = "dotted";
                    elements[x].style.backgroundColor = "#FFFFFF";
                }
            }
            if (field_collection.length > 0) {
                field_collection = new Array();
            }
            arg.innerHTML = "Quick Preview";
        }
        return true;
    }

    function check_save_name(arg) {                                                                                      // This function validates the Entered Save Name according to the Saved Button clicked upon.......
        if (document.getElementById("save_name").value.trim() == "") {
            enable("span#save_error_messages", "Please Enter the required SAVE NAME");
            interval = window.setTimeout("disable('span#save_error_messages')", 3000);
            return false;
        }else if (document.getElementById("save_name").value.trim().length > 100) {
            enable("span#save_error_messages", "Entered Save Name CANNOT be greater than 100 Characters");
            interval = window.setTimeout("disable('span#save_error_messages')", 3000);
            return false;
        }else {
            if (arg.id == "save_and_finish") {
                var local_xmlhttp = new XMLHttpRequest();
                var label_save_name = toTitleCase(document.getElementById("save_name").value.trim());
                local_xmlhttp.open("POST", "middleware/scripts/templates_process.php", true);
                local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                local_xmlhttp.send("flag=4&label_save_name="+label_save_name+"&label_layout_type="+current_layout);
                local_xmlhttp.onreadystatechange = function() {
                    if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                        if (local_xmlhttp.responseText == "Existing Label") {
                            document.getElementById("busy").style.display = "none";
                            enable("span#save_error_messages", "Entered SAVE NAME Already Exists. Please Enter New Save Name");
                            interval = window.setTimeout("disable('span#save_error_messages')", 3000);
                            return false;
                        }else if (local_xmlhttp.responseText == "New Label") {
                            var return_value = save();
                            if (return_value == true) {
                                interval = window.setTimeout("show_templates()", 3500);
                            }
                        }
                    }else {
                        document.getElementById("busy").style.display = "inline-block";
                    }
                };
            }else if (arg.id == "save_and_continue") {
                var local_xmlhttp = new XMLHttpRequest();
                var label_save_name = toTitleCase(document.getElementById("save_name").value.trim());
                local_xmlhttp.open("POST", "middleware/scripts/templates_process.php", true);
                local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                local_xmlhttp.send("flag=4&label_save_name="+label_save_name+"&label_layout_type="+current_layout+"&update=true");
                local_xmlhttp.onreadystatechange = function() {
                    if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                        if (local_xmlhttp.responseText == "Existing Label") {
                            update();
                        }else if (local_xmlhttp.responseText == "New Label") {
                            save();
                            interval = window.setTimeout("show_existing_labels()", 3500);
                        }else if (local_xmlhttp.responseText == "Update Error") {
                            document.getElementById("busy").style.display = "none";
                            enable("span#save_error_messages", "Label '" + label_save_name + "' NOT Updated. Ensure Save Name is Same As Most Recent Save Name!");
                            interval = window.setTimeout("disable('span#save_error_messages')", 4000);
                            return false;
                        }else if (local_xmlhttp.responseText == "Initialization Error") {
                            document.getElementById("busy").style.display = "none";
                            enable("span#save_error_messages", "Label '" + label_save_name + "' NOT Updated.");
                            interval = window.setTimeout("disable('span#save_error_messages')", 4000);
                            return false;
                        }
                    }else {
                        document.getElementById("busy").style.display = "inline-block";
                    }
                };
            }else if (arg.id == "update_label") {
                update_saved_label();
            }
        }
        return true;
    }

    function delete_uploaded_image(arg) {
        // to be implemented....
        window.alert(arg);
    }

    function select_uploaded_image(arg) {
        // to be implemented....
        window.alert(arg);
    }

    function apply_uploaded_image(arg) {
        // to be implemented....
        window.alert(arg);
    }

    function image_mode_handler(arg) {                                                                                   // This function is responsible for managing the Image Mode Conversion of Label Fields.....
        var x;
        var list_item = arg.id + "_Item";
        var list_items = document.getElementById("uploads_list").getElementsByTagName("li");
        var local_xmlhttp_1 = new XMLHttpRequest();
        var local_xmlhttp_2 = new XMLHttpRequest();
        for (x in list_items) {
            if (list_items[x].id == list_item) {
                var label_node = list_items[x].lastChild;
                var file_upload_node = label_node.lastChild;
                if (file_upload_node.value == "") {
                    local_xmlhttp_1.open("POST", "middleware/scripts/delete_uploaded_data.php", true);
                    local_xmlhttp_1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    local_xmlhttp_1.send();
                    local_xmlhttp_1.onreadystatechange = function() {
                        if ((local_xmlhttp_1.readyState == 4) && (local_xmlhttp_1.status == 200)) {
                            message = new Array();
                            enable("span#save_error_messages", "Label &quot;" + toTitleCase(document.getElementById("save_name").value.trim()) + "&quot; NOT Saved. No Selected Image Found For " + arg.id);
                            interval = window.setTimeout("disable('span#save_error_messages')", 4000);
                        }
                    };
                    return false;
                }else {
                    var field_width = parseInt(parseInt(arg.style.width.substring(0, arg.style.width.search("mm"))) / 0.264583333333334);
                    var field_height = parseInt(parseInt(arg.style.height.substring(0, arg.style.height.search("mm"))) / 0.264583333333334);
                    var formdata = new FormData();
                    formdata.append("field_width", field_width);
                    formdata.append("field_height", field_height);
                    formdata.append("resource", file_upload_node.files[0]);
                    local_xmlhttp_2.open("POST", "middleware/scripts/image_uploader.php", false);
                    local_xmlhttp_2.send(formdata);
                    if ((local_xmlhttp_2.readyState == 4) && (local_xmlhttp_2.status == 200)) {
                        if (local_xmlhttp_2.responseText == "Error") {
                            local_xmlhttp_1.open("POST", "middleware/scripts/delete_uploaded_data.php", true);
                            local_xmlhttp_1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                            local_xmlhttp_1.send();
                            local_xmlhttp_1.onreadystatechange = function() {
                                if ((local_xmlhttp_1.readyState == 4) && (local_xmlhttp_1.status == 200)) {
                                    message = new Array();
                                    enable("span#save_error_messages", "Label &quot;" + toTitleCase(document.getElementById("save_name").value.trim()) + "&quot; NOT Saved. An Error Occurred During Image Upload For " + arg.id + ". Please Try Again Later.");
                                    interval = window.setTimeout("disable('span#save_error_messages')", 4000);
                                }
                            };
                            return false;
                        }else if (local_xmlhttp_2.responseText == "Invalid Object") {
                            local_xmlhttp_1.open("POST", "middleware/scripts/delete_uploaded_data.php", true);
                            local_xmlhttp_1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                            local_xmlhttp_1.send();
                            local_xmlhttp_1.onreadystatechange = function() {
                                if ((local_xmlhttp_1.readyState == 4) && (local_xmlhttp_1.status == 200)) {
                                    message = new Array();
                                    enable("span#save_error_messages", "Label &quot;" + toTitleCase(document.getElementById("save_name").value.trim()) + "&quot; NOT Saved. Invalid Object Detected In " + arg.id);
                                    interval = window.setTimeout("disable('span#save_error_messages')", 4000);
                                }
                            };
                            return false;
                        }else if (local_xmlhttp_2.responseText == "Image Too Large") {
                            local_xmlhttp_1.open("POST", "middleware/scripts/delete_uploaded_data.php", true);
                            local_xmlhttp_1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                            local_xmlhttp_1.send();
                            local_xmlhttp_1.onreadystatechange = function() {
                                if ((local_xmlhttp_1.readyState == 4) && (local_xmlhttp_1.status == 200)) {
                                    message = new Array();
                                    enable("span#save_error_messages", "Label &quot;" + toTitleCase(document.getElementById("save_name").value.trim()) + "&quot; NOT Saved. Selected Image Too Large For " + arg.id);
                                    interval = window.setTimeout("disable('span#save_error_messages')", 4000);
                                }
                            };
                            return false;
                        }else {
                            return local_xmlhttp_2.responseText;
                        }
                    }
                }
            }else {
                continue;
            }
        }
    }

    function display_images(arg) {                                                                                       // This function is responsible for enabling the rendering or display of uploaded label images......
        var x, y;
        var server_response = arg.split(",");
        for (x in server_response) {
            if (server_response[x] != "") {
                var sub_data = server_response[x].split("; ");
                for (y in sub_data) {
                    if (sub_data[y].match("LUN=") != null) {
                        var the_label_username = sub_data[y].substring(sub_data[y].search("LUN=") + 4);
                    }else if (sub_data[y].match("LFN=") != null) {
                        var label_field_name = sub_data[y].substring(sub_data[y].search("LFN=") + 4);
                    }else if (sub_data[y].match("LIN=") != null) {
                        var background_image = sub_data[y].substring(sub_data[y].search("LIN=") + 4);
                    }else if (sub_data[y].match("LIW=") != null) {
                        var background_width = sub_data[y].substring(sub_data[y].search("LIW=") + 4);
                    }else if (sub_data[y].match("LIH=") != null) {
                        var background_height = sub_data[y].substring(sub_data[y].search("LIH=") + 4);
                    }
                }
                document.getElementById(label_field_name).value = "";
                document.getElementById(label_field_name).style.textAlign = "left";
                document.getElementById(label_field_name).style.background = "#FFFFFF url('label_images/" + the_label_username + "/" + background_image + "') no-repeat center center";
                document.getElementById(label_field_name).style.backgroundSize = background_width + "px " + background_height + "px";
            }else {
                continue;
            }
        }
        document.getElementById("image_uploader").style.display = "none";
        return true;
    }

    function save() {                                                                                                    // This function saves a Newly Customized Label.....
        var x;
        var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
        var local_xmlhttp = new XMLHttpRequest();
        for (x in elements) {
            if ((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) {
                var field_name = elements[x].id;
                if (elements[x].nodeName == "INPUT") {
                    var field_type = "Single_line";
                }else if (elements[x].nodeName == "TEXTAREA") {
                    var field_type = "Multi_line";
                }
                if ((elements[x].value == "") || (elements[x].readOnly == true)) {
                    var field_value = "";
                }else {
                    var field_value = encoder_3(elements[x].value);
                }
                if (elements[x].style.fontFamily == "") {
                    var field_face = "Arial";
                }else {
                    elements[x].style.fontFamily = encoder_1(elements[x].style.fontFamily);
                    var field_face = elements[x].style.fontFamily;
                    elements[x].style.fontFamily = decoder_1(elements[x].style.fontFamily);
                }
                if (elements[x].style.fontSize == "") {
                    var field_size = "small";
                }else {
                    var field_size = elements[x].style.fontSize;
                }
                if (elements[x].style.color == "") {
                    var field_color = "#000000";
                }else {
                    var field_color = elements[x].style.color;
                    field_color = encoder_2(field_color);
                }
                if ((elements[x].style.textAlign == "") || (elements[x].readOnly == true)) {
                    var field_alignment = "left";
                }else {
                    var field_alignment = elements[x].style.textAlign;
                }
                if (((elements[x].style.fontStyle == "") && (elements[x].style.fontWeight == "")) || ((elements[x].style.fontStyle == "normal") && (elements[x].style.fontWeight == "normal"))) {
                    var field_style = "normal";
                }else if ((elements[x].style.fontStyle == "italic") && (elements[x].style.fontWeight == "normal")) {
                    var field_style = "italic";
                }else if ((elements[x].style.fontStyle == "normal") && (elements[x].style.fontWeight == "bold")) {
                    var field_style = "bold";
                }else if ((elements[x].style.fontStyle == "italic") && (elements[x].style.fontWeight == "bold")) {
                    var field_style = "both";
                }
                if (elements[x].style.lineHeight == "") {
                    var field_line_height = "normal";
                }else {
                    var field_line_height = elements[x].style.lineHeight;
                }
                if (elements[x].readOnly == true) {
                    var data = image_mode_handler(elements[x]);
                    if (data != false) {
                        data = "LFN="+field_name+"; LFT="+field_type+"; LFV="+field_value+"; LFF="+field_face+"; LFS="+field_size+"; LFC="+field_color+"; LFA="+field_alignment+"; LFI="+field_style+"; LFH="+field_line_height + data;
                        message.push(data);
                    }else {
                        document.getElementById("busy").style.display = "none";
                        return false;
                    }
                }else {
                    var data = "LFN="+field_name+"; LFT="+field_type+"; LFV="+field_value+"; LFF="+field_face+"; LFS="+field_size+"; LFC="+field_color+"; LFA="+field_alignment+"; LFI="+field_style+"; LFH="+field_line_height;
                    message.push(data);
                }
            }else {
                continue;
            }
        }
        local_xmlhttp.open("POST", "middleware/scripts/templates_process.php", true);
        local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        local_xmlhttp.send("flag=5&request="+message.toString());
        local_xmlhttp.onreadystatechange = function() {
            if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                document.getElementById("busy").style.display = "none";
                if (local_xmlhttp.responseText != "Text Mode Fields Only") {
                    document.getElementById("uploads_list").innerHTML = "";
                    document.getElementById("image_uploader").style.display = "none";
                    display_images(local_xmlhttp.responseText);
                }
                enable("span#save_success_messages", "Label &quot;" + toTitleCase(document.getElementById("save_name").value.trim()) + "&quot; Saved Successfully!!!");
                interval = window.setTimeout("disable('span#save_success_messages')", 3000);
            }
        }
        message = new Array();
        return true;
    }

    function update() {                                                                                                  // This function either updates an Existing Label.....
        var x;
        var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
        var local_xmlhttp = new XMLHttpRequest();
        for (x in elements) {
            if ((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) {
                var field_name = elements[x].id;
                if ((elements[x].value == "") || (elements[x].readOnly == true)) {
                    var field_value = "";
                }else {
                    var field_value = encoder_3(elements[x].value);
                }
                if (elements[x].style.fontFamily == "") {
                    var field_face = "Arial";
                }else {
                    elements[x].style.fontFamily = encoder_1(elements[x].style.fontFamily);
                    var field_face = elements[x].style.fontFamily;
                    elements[x].style.fontFamily = decoder_1(elements[x].style.fontFamily);
                }
                if (elements[x].style.fontSize == "") {
                    var field_size = "small";
                }else {
                    var field_size = elements[x].style.fontSize;
                }
                if (elements[x].style.color == "") {
                    var field_color = "#000000";
                }else {
                    var field_color = elements[x].style.color;
                    field_color = encoder_2(field_color);
                }
                if ((elements[x].style.textAlign == "") || (elements[x].readOnly == true)) {
                    var field_alignment = "left";
                }else {
                    var field_alignment = elements[x].style.textAlign;
                }
                if (((elements[x].style.fontStyle == "") && (elements[x].style.fontWeight == "")) || ((elements[x].style.fontStyle == "normal") && (elements[x].style.fontWeight == "normal"))) {
                    var field_style = "normal";
                }else if ((elements[x].style.fontStyle == "italic") && (elements[x].style.fontWeight == "normal")) {
                    var field_style = "italic";
                }else if ((elements[x].style.fontStyle == "normal") && (elements[x].style.fontWeight == "bold")) {
                    var field_style = "bold";
                }else if ((elements[x].style.fontStyle == "italic") && (elements[x].style.fontWeight == "bold")) {
                    var field_style = "both";
                }
                if (elements[x].style.lineHeight == "") {
                    var field_line_height = "normal";
                }else {
                    var field_line_height = elements[x].style.lineHeight;
                }
                if (elements[x].readOnly == true) {
                    if (elements[x].style.backgroundImage == "none") {
                        var data = image_mode_handler(elements[x]);
                        if (data != false) {
                            data = "LFN="+field_name+"; LFV="+field_value+"; LFF="+field_face+"; LFS="+field_size+"; LFC="+field_color+"; LFA="+field_alignment+"; LFI="+field_style+"; LFH="+field_line_height + data;
                            message.push(data);
                        }else {
                            document.getElementById("busy").style.display = "none";
                            return false;
                        }
                    }
                }else {
                    var data = "LFN="+field_name+"; LFV="+field_value+"; LFF="+field_face+"; LFS="+field_size+"; LFC="+field_color+"; LFA="+field_alignment+"; LFI="+field_style+"; LFH="+field_line_height;
                    message.push(data);
                }
            }else {
                continue;
            }
        }
        local_xmlhttp.open("POST", "middleware/scripts/templates_process.php", true);
        local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        local_xmlhttp.send("flag=6&request="+message.toString());
        local_xmlhttp.onreadystatechange = function() {
            if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                document.getElementById("busy").style.display = "none";
                if (local_xmlhttp.responseText != "Text Mode Fields Only") {
                    document.getElementById("uploads_list").innerHTML = "";
                    document.getElementById("image_uploader").style.display = "none";
                    display_images(local_xmlhttp.responseText);
                }
                enable("span#save_success_messages", "Label &quot;" + toTitleCase(document.getElementById("save_name").value.trim()) + "&quot; Successfully Updated!!!");
                interval = window.setTimeout("disable('span#save_success_messages')", 3000);
            }
        };
        message = new Array();
        return true;
    }

    function date_time_initializer() {                                                                           // This function is responsible for fetching the required drop down list of formats to initialize the date/time functionality.......
        if ((document.getElementById("date_checkbox").checked) && (!(document.getElementById("time_checkbox").checked))) {
            date_time_flag = "Date";
            var local_xmlhttp = new XMLHttpRequest();
            local_xmlhttp.open("POST", "middleware/scripts/date_time_initializer.php", true);
            local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            local_xmlhttp.send("parameter=Date");
            local_xmlhttp.onreadystatechange = function() {
                if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                    document.getElementById("date_time_busy").style.display = "none";
                    document.getElementById("format_offset_placeholder").innerHTML = local_xmlhttp.responseText;
                }else {
                    document.getElementById("format_offset_placeholder").innerHTML = "";
                    document.getElementById("date_time_busy").style.display = "inline-block";
                }
            };
        }else if ((!(document.getElementById("date_checkbox").checked)) && (document.getElementById("time_checkbox").checked)) {
            date_time_flag = "Time";
            var local_xmlhttp = new XMLHttpRequest();
            local_xmlhttp.open("POST", "middleware/scripts/date_time_initializer.php", true);
            local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            local_xmlhttp.send("parameter=Time");
            local_xmlhttp.onreadystatechange = function() {
                if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                    document.getElementById("date_time_busy").style.display = "none";
                    document.getElementById("format_offset_placeholder").innerHTML = local_xmlhttp.responseText;
                }else {
                    document.getElementById("format_offset_placeholder").innerHTML = "";
                    document.getElementById("date_time_busy").style.display = "inline-block";
                }
            };
        }else if ((document.getElementById("date_checkbox").checked) && (document.getElementById("time_checkbox").checked)) {
            date_time_flag = "Date and Time";
            var local_xmlhttp = new XMLHttpRequest();
            local_xmlhttp.open("POST", "middleware/scripts/date_time_initializer.php", true);
            local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            local_xmlhttp.send("parameter="+encodeURIComponent("Date and Time"));
            local_xmlhttp.onreadystatechange = function() {
                if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                    document.getElementById("date_time_busy").style.display = "none";
                    document.getElementById("format_offset_placeholder").innerHTML = local_xmlhttp.responseText;
                }else {
                    document.getElementById("format_offset_placeholder").innerHTML = "";
                    document.getElementById("date_time_busy").style.display = "inline-block";
                }
            };
        }else if ((!document.getElementById("date_checkbox").checked) && (!document.getElementById("time_checkbox").checked)) {
            document.getElementById("format_offset_placeholder").innerHTML = "";
        }
        return true;
    }

    function apply_offset() {                                                                                         // This function is responsible for managing the application of offsets to specific label fields.
        if (date_time_flag == "Date") {
            apply_date_offset();
        }else if (date_time_flag == "Time") {
            apply_time_offset();
        }else if (date_time_flag == "Date and Time") {
            var flag = apply_date_offset();
            if (flag == true) {
                apply_time_offset();
            }
        }
        return true;
    }

    function apply_date_offset() {                                                                                    // This function is responsible for applying the date offset as required within a specific label field......
        var selected_field = document.getElementById("required_field").value;
        if ((document.getElementById(selected_field).value.match("_O=") != null) && (document.getElementById(selected_field).value.match("12H_O=") == null) && (document.getElementById(selected_field).value.match("24H_O=") == null)) {
            if (date_time_flag == "Date") {
                var start = document.getElementById(selected_field).value.indexOf("{");
                var end = document.getElementById(selected_field).value.indexOf("}");
                var format_value = document.getElementById(selected_field).value.substring(start + 1, end);
                var format_identifier = document.getElementById(selected_field).value.substring(start + 1, end - 2);
                if (document.getElementById("date_time_format_list").value.match(format_identifier) == null) {
                    window.alert("UNABLE TO APPLY OFFSET!\n\nTHE FORMAT DETECTED IS DIFFERENT FROM THE CURRENT FORMAT ALREADY INSERTED!!!");
                    return false;
                }else {
                    var offset_start = format_value.search("O=");
                    if (document.getElementById("day_offset").value != "Days") {
                        var new_format_value = format_value.replace(format_value.substring(offset_start), "O="+document.getElementById("day_offset").value);
                    }else {
                        var new_format_value = format_value.replace(format_value.substring(offset_start), "O=0");
                    }
                    document.getElementById(selected_field).value = document.getElementById(selected_field).value.replace(format_value, new_format_value);
                }
            }else {
                window.alert("UNABLE TO APPLY OFFSET!\n\nINCOMPATIBLE FORMAT DETECTED WITHIN SELECTED FIELD!!!\n\nPlease Ensure The Offset Pattern in Use is Compatible With The Current Format Already Inserted.");
                return false;
            }
        }else if ((document.getElementById(selected_field).value.match("_O=") != null) && ((document.getElementById(selected_field).value.match("12H_O=") != null) || (document.getElementById(selected_field).value.match("24H_O=") != null))) {
            if (date_time_flag == "Date and Time") {
                var start = document.getElementById(selected_field).value.indexOf("{");
                var end = document.getElementById(selected_field).value.indexOf("}");
                var startLast = document.getElementById(selected_field).value.lastIndexOf("{");
                var endLast = document.getElementById(selected_field).value.lastIndexOf("}");
                var format_value = document.getElementById(selected_field).value.substring(start + 1, end);
                var format_identifier_1 = document.getElementById(selected_field).value.substring(start + 1, end - 2);
                var format_identifier_2 = document.getElementById(selected_field).value.substring(startLast + 1, endLast - 4);
                if ((document.getElementById("date_time_format_list").value.match(format_identifier_1) == null) || (document.getElementById("date_time_format_list").value.match(format_identifier_2) == null)) {
                    window.alert("UNABLE TO APPLY OFFSET!\n\nTHE FORMAT DETECTED IS DIFFERENT FROM THE CURRENT FORMAT ALREADY INSERTED!!!");
                    return false;
                }else {
                    var offset_start = format_value.search("O=");
                    if (document.getElementById("day_offset").value != "Days") {
                        var new_format_value = format_value.replace(format_value.substring(offset_start), "O="+document.getElementById("day_offset").value);
                    }else {
                        var new_format_value = format_value.replace(format_value.substring(offset_start), "O=0");
                    }
                    document.getElementById(selected_field).value = document.getElementById(selected_field).value.replace(format_value, new_format_value);
                    if ((document.getElementById("hour_offset").value == "Hrs") && (document.getElementById("minute_offset").value == "Mins")) {
                        format_value = document.getElementById(selected_field).value.substring(startLast + 1, endLast);
                        new_format_value = format_value.replace(format_value.substring(format_value.search("O=")), "O=0,0");
                        document.getElementById(selected_field).value = document.getElementById(selected_field).value.replace(format_value, new_format_value);
                    }
                }
            }else {
                window.alert("UNABLE TO APPLY OFFSET!\n\nINCOMPATIBLE FORMAT DETECTED WITHIN SELECTED FIELD!!!\n\nPlease Ensure The Offset Pattern in Use is Compatible With The Current Format Already Inserted.");
                return false;
            }
        }
        return true;
    }

    function apply_time_offset() {                                                                                    // This function is responsible for applying the time offset(s) as required within a specific label field......
        var selected_field = document.getElementById("required_field").value;
        if ((document.getElementById(selected_field).value.match("DD") == null) && (document.getElementById(selected_field).value.match("MM") == null) && (document.getElementById(selected_field).value.match("YY") == null) && (document.getElementById(selected_field).value.match("MONTH") == null) && ((document.getElementById(selected_field).value.match("12H_O=") != null) || (document.getElementById(selected_field).value.match("24H_O=") != null))) {
            if (date_time_flag == "Time") {
                var start = document.getElementById(selected_field).value.indexOf("{");
                var end = document.getElementById(selected_field).value.indexOf("}");
                var format_value = document.getElementById(selected_field).value.substring(start + 1, end);
                var format_identifier = document.getElementById(selected_field).value.substring(start + 1, end - 4);
                if (document.getElementById("date_time_format_list").value.match(format_identifier) == null) {
                    window.alert("UNABLE TO APPLY OFFSET!\n\nTHE FORMAT DETECTED IS DIFFERENT FROM THE CURRENT FORMAT ALREADY INSERTED!!!");
                    return false;
                }else {
                    if ((document.getElementById("hour_offset").value != "Hrs") && (document.getElementById("minute_offset").value == "Mins")) {
                        var new_format_value = format_value.replace(format_value.substring(format_value.search("O="), format_value.search(",")), "O="+document.getElementById("hour_offset").value);
                        new_format_value = new_format_value.replace(new_format_value.substring(new_format_value.search(",")), ",0");
                        document.getElementById(selected_field).value = document.getElementById(selected_field).value.replace(format_value, new_format_value);
                    }else if ((document.getElementById("hour_offset").value == "Hrs") && (document.getElementById("minute_offset").value != "Mins")) {
                        var new_format_value = format_value.replace(format_value.substring(format_value.search(",")), ","+document.getElementById("minute_offset").value);
                        new_format_value = new_format_value.replace(new_format_value.substring(format_value.search("O="), format_value.search(",")), "O=0");
                        document.getElementById(selected_field).value = document.getElementById(selected_field).value.replace(format_value, new_format_value);
                    }else if ((document.getElementById("hour_offset").value != "Hrs") && (document.getElementById("minute_offset").value != "Mins")) {
                        var new_format_value = format_value.replace(format_value.substring(format_value.search("O="), format_value.search(",")), "O="+document.getElementById("hour_offset").value);
                        new_format_value = new_format_value.replace(new_format_value.substring(new_format_value.search(",")), ","+document.getElementById("minute_offset").value);
                        document.getElementById(selected_field).value = document.getElementById(selected_field).value.replace(format_value, new_format_value);
                    }else if ((document.getElementById("hour_offset").value == "Hrs") && (document.getElementById("minute_offset").value == "Mins")) {
                        var new_format_value = format_value.replace(format_value.substring(format_value.search("O="), format_value.search(",")), "O=0");
                        new_format_value = new_format_value.replace(new_format_value.substring(new_format_value.search(",")), ",0");
                        document.getElementById(selected_field).value = document.getElementById(selected_field).value.replace(format_value, new_format_value);
                    }
                }
            }else {
                window.alert("UNABLE TO APPLY OFFSET!\n\nINCOMPATIBLE FORMAT DETECTED WITHIN SELECTED FIELD!!!\n\nPlease Ensure The Offset Pattern in Use is Compatible With The Current Format Already Inserted.");
                return false;
            }
        }else if (((document.getElementById(selected_field).value.match("12H_O=") != null) || ((document.getElementById(selected_field).value.match("24H_O=") != null))) && ((document.getElementById(selected_field).value.match("DD") != null) || (document.getElementById(selected_field).value.match("MM") != null) || (document.getElementById(selected_field).value.match("YY") != null) || (document.getElementById(selected_field).value.match("MONTH") != null))) {
            if (date_time_flag == "Date and Time") {
                var startLast = document.getElementById(selected_field).value.lastIndexOf("{");
                var endLast = document.getElementById(selected_field).value.lastIndexOf("}");
                var format_value = document.getElementById(selected_field).value.substring(startLast + 1, endLast);
                if ((document.getElementById("hour_offset").value != "Hrs") && (document.getElementById("minute_offset").value == "Mins")) {
                    var new_format_value = format_value.replace(format_value.substring(format_value.search("O="), format_value.search(",")), "O="+document.getElementById("hour_offset").value);
                    new_format_value = new_format_value.replace(new_format_value.substring(new_format_value.search(",")), ",0");
                    document.getElementById(selected_field).value = document.getElementById(selected_field).value.replace(format_value, new_format_value);
                }else if ((document.getElementById("hour_offset").value == "Hrs") && (document.getElementById("minute_offset").value != "Mins")) {
                    var new_format_value = format_value.replace(format_value.substring(format_value.search(",")), ","+document.getElementById("minute_offset").value);
                    new_format_value = new_format_value.replace(new_format_value.substring(format_value.search("O="), format_value.search(",")), "O=0");
                    document.getElementById(selected_field).value = document.getElementById(selected_field).value.replace(format_value, new_format_value);
                }else if ((document.getElementById("hour_offset").value != "Hrs") && (document.getElementById("minute_offset").value != "Mins")) {
                    var new_format_value = format_value.replace(format_value.substring(format_value.search("O="), format_value.search(",")), "O="+document.getElementById("hour_offset").value);
                    new_format_value = new_format_value.replace(new_format_value.substring(new_format_value.search(",")), ","+document.getElementById("minute_offset").value);
                    document.getElementById(selected_field).value = document.getElementById(selected_field).value.replace(format_value, new_format_value);
                }
            }
        }else {
            window.alert("UNABLE TO APPLY OFFSET!\n\nINCOMPATIBLE FORMAT DETECTED WITHIN SELECTED FIELD!!!\n\nPlease Ensure The Offset Pattern in Use is Compatible With The Current Format Already Inserted.");
            return false;
        }
        return true;
    }

    function initialize_field_value(arg) {                                                                       // This function is responsible for initializing the Font Size Value Text Field.......
        if (arg.value.trim() == "pt") {
            arg.value = "";
            arg.style.color = "#000000";
        }else if (arg.value.trim() == "") {
            arg.value = "pt";
            arg.style.color = "#666666";
        }
        return true;
    }

    function label_customizer(arg1, arg2) {                                                                      // This function is responsible for enabling Label Template Layout Customizations.
        var x;
        if (arg1 == "required_field") {
            if ((document.getElementById("all").checked == false) && (document.getElementById("required_field").value == "")) {
                document.getElementById("all").checked = true;
                var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
                for (x in elements) {
                    if ((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) {
                        elements[x].style.outlineStyle = "dotted";
                        elements[x].style.outlineColor = "#629941";
                    }else {
                        continue;
                    }
                }
            }else {
                if (document.getElementById("all").checked) {
                    document.getElementById("all").checked = false;
                }
                var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
                for (x in elements) {
                    if ((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) {
                        if (elements[x].id == document.getElementById("required_field").value) {
                            elements[x].style.outlineStyle = "dotted";
                            elements[x].style.outlineColor = "#629941";
                        }else {
                            elements[x].style.outlineStyle = "none";
                            elements[x].style.outlineColor = "transparent";
                        }
                    }else {
                        continue;
                    }
                }
            }
        }else if (arg1 == "all") {
            if (document.getElementById("required_field").value == "") {
                document.getElementById("all").checked = true;
            }else {
                document.getElementById("required_field").value = "";
            }
            var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
            for (x in elements) {
                if ((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) {
                    elements[x].style.outlineStyle = "dotted";
                    elements[x].style.outlineColor = "#629941";
                }else {
                    continue;
                }
            }
        }else if (arg1.id == "convert") {
            if (document.getElementById("required_field").value != "") {
                var selected_field = document.getElementById("required_field").value;
                if (document.getElementById(selected_field).readOnly == false) {
                    document.getElementById(selected_field).style.fontFamily = "Arial";
                    document.getElementById(selected_field).style.fontSize = "small";
                    document.getElementById(selected_field).style.color = "#000000";
                    document.getElementById(selected_field).style.textAlign = "center";
                    document.getElementById(selected_field).style.fontStyle = "normal";
                    document.getElementById(selected_field).style.fontWeight = "normal";
                    document.getElementById(selected_field).style.lineHeight = "normal";
                    document.getElementById(selected_field).style.backgroundImage = "none";
                    document.getElementById(selected_field).value = parseInt(parseInt(document.getElementById(selected_field).style.width.substring(0, document.getElementById(selected_field).style.width.search("mm"))) / 0.264583333333334) + "px x " + parseInt(parseInt(document.getElementById(selected_field).style.height.substring(0, document.getElementById(selected_field).style.height.search("mm"))) / 0.264583333333334) + "px";
                    document.getElementById(selected_field).readOnly = true;
                    var file_upload_label = document.createElement("label");
                    var file_upload_control = document.createElement("input");
                    var list_item = document.createElement("li");
                    file_upload_label.innerHTML = selected_field + ":&nbsp;";
                    file_upload_control.type = "file";
                    file_upload_control.id = selected_field + "_Image";
                    file_upload_label.appendChild(file_upload_control);
                    list_item.id = selected_field + "_Item";
                    list_item.appendChild(file_upload_label);
                    document.getElementById("uploads_list").appendChild(list_item);
                    document.getElementById("image_uploader").style.display = "block";
                }else {
                    if (document.getElementById(selected_field).style.backgroundImage != "") {
                        var local_xmlhttp = new XMLHttpRequest();
                        local_xmlhttp.open("POST", "middleware/scripts/delete_uploaded_data.php", true);
                        local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        if ((current_layout != "") && (layout_path != "")) {
                            var label_save_name = toTitleCase(document.getElementById("save_name").value.trim());
                            local_xmlhttp.send("label_field_name="+selected_field+"&label_save_name="+label_save_name+"&label_layout_type="+current_layout+"&system_mode=templates");
                        }else {
                            var edit_save_name = sessionStorage.getItem("edit_save_name");
                            var edit_layout_type = sessionStorage.getItem("edit_layout_type");
                            local_xmlhttp.send("label_field_name="+selected_field+"&label_save_name="+edit_save_name+"&label_layout_type="+edit_layout_type+"&system_mode=library");
                        }
                        local_xmlhttp.onreadystatechange = function() {
                            if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                                document.getElementById("busy").style.display = "none";
                                if (local_xmlhttp.responseText != "Error") {
                                    document.getElementById(selected_field).value = "";
                                    document.getElementById(selected_field).style.textAlign = "left";
                                    document.getElementById(selected_field).style.backgroundImage = "";
                                    document.getElementById(selected_field).readOnly = false;
                                    var list_item = selected_field + "_Item";
                                    var list_items = document.getElementById("uploads_list").getElementsByTagName("li");
                                    for (x in list_items) {
                                        if (list_items[x].id == list_item) {
                                            document.getElementById("uploads_list").removeChild(list_items[x]);
                                            document.getElementById("image_uploader").style.display = "block";
                                            break;
                                        }else {
                                            continue;
                                        }
                                    }
                                }
                            }else {
                                document.getElementById("busy").style.display = "inline-block";
                            }
                        };
                    }
                }
            }else if (document.getElementById("all").checked) {
                window.alert("ALL LABEL FIELDS SELECTED. Please Select ONE LABEL FIELD At A Time To Proceed.");
                return false;
            }
        }else if (arg1.id == "toggle_image_uploader") {
            if (document.getElementById("image_uploader").style.display == "none") {
                document.getElementById("image_uploader").style.display = "block";
            }else {
                document.getElementById("image_uploader").style.display = "none";
            }
        }else if (arg1.id == "font_face") {
            if (document.getElementById("required_field").value != "") {
                var selected_field = document.getElementById("required_field").value;
                if (document.getElementById(selected_field).readOnly == false) {
                    document.getElementById(selected_field).style.fontFamily = arg1.value;
                }
            }else if (document.getElementById("all").checked) {
                var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
                for (x in elements) {
                    if (((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) && (elements[x].readOnly == false)) {
                        elements[x].style.fontFamily = arg1.value;
                    }else {
                        continue;
                    }
                }
            }
        }else if (arg1.id == "font_size") {
            if (document.getElementById("required_field").value != "") {
                var selected_field = document.getElementById("required_field").value;
                if (document.getElementById(selected_field).readOnly == false) {
                    document.getElementById(selected_field).style.fontSize = arg1.value;
                }
            }else if (document.getElementById("all").checked) {
                var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
                for (x in elements) {
                    if (((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) && (elements[x].readOnly == false)) {
                        elements[x].style.fontSize = arg1.value;
                    }else {
                        continue;
                    }
                }
            }
        }else if (arg1.id == "font_size_value") {
            if (isNaN(arg1.value)) {
                window.alert("Please Ensure The Value For The Font Size is Numerical!!!");
                arg1.value = "";
                return false;
            }else if (arg1.value == "-0") {
                window.alert("Please Ensure The Value for The Font Size is NOT INVALID!!!");
                arg1.value = "";
                return false;
            }else if (parseInt(arg1.value) < 0) {
                window.alert("Please Ensure The Value for The Font Size is NOT LESS THAN 0!!!");
                arg1.value = "";
                return false;
            }else {
                if (document.getElementById("required_field").value != "") {
                    var selected_field = document.getElementById("required_field").value;
                    if (document.getElementById(selected_field).readOnly == false) {
                        document.getElementById(selected_field).style.fontSize = arg1.value + "pt";
                    }
                }else if (document.getElementById("all").checked) {
                    var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
                    for (x in elements) {
                        if (((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) && (elements[x].readOnly == false)) {
                            elements[x].style.fontSize = arg1.value + "pt";
                        }else {
                            continue;
                        }
                    }
                }
            }
        }else if (arg1.id == "text_color") {
            if (document.getElementById("required_field").value != "") {
                var selected_field = document.getElementById("required_field").value;
                if (document.getElementById(selected_field).readOnly == false) {
                    document.getElementById(selected_field).style.color = arg1.value;
                }
            }else if (document.getElementById("all").checked) {
                var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
                for (x in elements) {
                    if (((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) && (elements[x].readOnly == false)) {
                        elements[x].style.color = arg1.value;
                    }else {
                        continue;
                    }
                }
            }
        }else if (arg1 == "color_palette") {
            if (document.getElementById("required_field").value != "") {
                var selected_field = document.getElementById("required_field").value;
                if (document.getElementById(selected_field).readOnly == false) {
                    document.getElementById(selected_field).style.color = arg2;
                }
            }else if (document.getElementById("all").checked) {
                var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
                for (x in elements) {
                    if (((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) && (elements[x].readOnly == false)) {
                        elements[x].style.color = arg2;
                    }else {
                        continue;
                    }
                }
            }
        }else if (arg1.id == "hex_color") {
            if (document.getElementById("required_field").value != "") {
                var selected_field = document.getElementById("required_field").value;
                if (document.getElementById(selected_field).readOnly == false) {
                    document.getElementById("color_shade").style.backgroundColor = arg1.value;
                    document.getElementById(selected_field).style.color = arg1.value;
                }
            }else if (document.getElementById("all").checked) {
                document.getElementById("color_shade").style.backgroundColor = arg1.value;
                var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
                for (x in elements) {
                    if (((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) && (elements[x].readOnly == false)) {
                        elements[x].style.color = arg1.value;
                    }else {
                        continue;
                    }
                }
            }
        }else if (arg1.id == "text_alignment") {
            if (document.getElementById("required_field").value != "") {
                var selected_field = document.getElementById("required_field").value;
                if (document.getElementById(selected_field).readOnly == false) {
                    document.getElementById(selected_field).style.textAlign = arg1.value;
                }
            }else if (document.getElementById("all").checked) {
                var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
                for (x in elements) {
                    if (((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) && (elements[x].readOnly == false)) {
                        elements[x].style.textAlign = arg1.value;
                    }else {
                        continue;
                    }
                }
            }
        }else if (arg1.id == "text_style") {
            if (document.getElementById("required_field").value != "") {
                var selected_field = document.getElementById("required_field").value;
                if (document.getElementById(selected_field).readOnly == false) {
                    if (arg1.value == "normal") {
                        document.getElementById(selected_field).style.fontStyle = "normal";
                        document.getElementById(selected_field).style.fontWeight = "normal";
                    }else if (arg1.value == "italic") {
                        document.getElementById(selected_field).style.fontStyle = "italic";
                        document.getElementById(selected_field).style.fontWeight = "normal";
                    }else if (arg1.value == "bold") {
                        document.getElementById(selected_field).style.fontStyle = "normal";
                        document.getElementById(selected_field).style.fontWeight = "bold";
                    }else if (arg1.value == "both") {
                        document.getElementById(selected_field).style.fontStyle = "italic";
                        document.getElementById(selected_field).style.fontWeight = "bold";
                    }
                }
            }else if (document.getElementById("all").checked) {
                var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
                for (x in elements) {
                    if (((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) && (elements[x].readOnly == false)) {
                        if (arg1.value == "normal") {
                            elements[x].style.fontStyle = "normal";
                            elements[x].style.fontWeight = "normal";
                        }else if (arg1.value == "italic") {
                            elements[x].style.fontStyle = "italic";
                            elements[x].style.fontWeight = "normal";
                        }else if (arg1.value == "bold") {
                            elements[x].style.fontWeight = "bold";
                            elements[x].style.fontStyle = "normal";
                        }else if (arg1.value == "both") {
                            elements[x].style.fontStyle = "italic";
                            elements[x].style.fontWeight = "bold";
                        }
                    }else {
                        continue;
                    }
                }
            }
        }else if (arg1.id == "line_spacing") {
            if (isNaN(arg1.value)) {
                window.alert("Please Ensure The Value for The Line Spacing is Numerical!!!");
                arg1.value = "";
                return false;
            }else if (arg1.value == "-0") {
                window.alert("Please Ensure The Value for The Line Spacing is NOT INVALID!!!");
                arg1.value = "";
                return false;
            }else if (parseInt(arg1.value) < 0) {
                window.alert("Please Ensure The Value for The Line Spacing is NOT LESS THAN 0!!!");
                arg1.value = "";
                return false;
            }else {
                if (document.getElementById("required_field").value != "") {
                    var selected_field = document.getElementById("required_field").value;
                    if (document.getElementById(selected_field).readOnly == false) {
                        if (arg1.value.trim() == "") {
                            document.getElementById(selected_field).style.lineHeight = "normal";
                        }else {
                            document.getElementById(selected_field).style.lineHeight = arg1.value + "pt";
                        }
                    }
                }else if (document.getElementById("all").checked) {
                    var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
                    for (x in elements) {
                        if (((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) && (elements[x].readOnly == false)) {
                            if (arg1.value.trim() == "") {
                                elements[x].style.lineHeight = "normal";
                            }else {
                                elements[x].style.lineHeight = arg1.value + "pt";
                            }
                        }else {
                            continue;
                        }
                    }
                }
            }
        }else if (arg1.id == "date_checkbox") {
            date_time_initializer();
        }else if (arg1.id == "time_checkbox") {
            date_time_initializer();
        }else if (arg1.id == "insert_format") {
            if (document.getElementById("date_time_format_list").value != "") {
                if (document.getElementById("required_field").value != "") {
                    var selected_field = document.getElementById("required_field").value;
                    if (document.getElementById(selected_field).readOnly == false) {
                        if ((document.getElementById(selected_field).value.indexOf("{") == -1) && (document.getElementById(selected_field).value.indexOf("}") == -1)) {
                            document.getElementById(selected_field).value += document.getElementById("date_time_format_list").value;
                            apply_offset();
                        }else {
                            var confirmation = window.confirm("{, } or {} Detected.\n\nA Date/Time Format Has Already Been Inserted For This Field.\n\nWould You Like To Proceed To Apply An Offset(s) For The Current Format Already Inserted?");
                            if (confirmation) {
                                apply_offset();
                            }
                        }
                    }
                }else if (document.getElementById("all").checked) {
                    window.alert("ALL LABEL FIELDS SELECTED. Please Select ONE LABEL FIELD At A Time To Proceed.");
                    return false;
                }
            }
        }else if (arg1.id == "day_offset") {
            if (arg1.value == "Days") {
                arg1.value = "";
                arg1.style.color = "#000000";
            }else if (arg1.value == "") {
                arg1.style.color = "#666666";
                arg1.value = "Days";
            }else if ((parseInt(arg1.value) < 0) || (arg1.value == "-0") || (isNaN(arg1.value))) {
                window.alert("ILLEGAL CHARACTER ENTERED for Number of Days Offset in Date/Time Settings. Please insert a Legal Number of Days.");
                arg1.style.color = "#666666";
                arg1.value = "Days";
                return false;
            }
        }else if ((arg1.id == "hour_offset") || (arg1.id == "minute_offset")) {
            if ((arg1.value == "Hrs") || (arg1.value == "Mins")) {
                arg1.value = "";
                arg1.style.color = "#000000";
            }else if (arg1.value == "") {
                if (arg1.id == "hour_offset") {
                    arg1.style.color = "#666666";
                    arg1.value = "Hrs";
                }else if (arg1.id == "minute_offset") {
                    arg1.style.color = "#666666";
                    arg1.value = "Mins";
                }
            }else if ((parseInt(arg1.value) < 0) || (arg1.value == "-0") || (isNaN(arg1.value))) {
                if (arg1.id == "hour_offset") {
                    window.alert("ILLEGAL CHARACTER ENTERED for Number of Hours Offset in Date/Time Settings. Please insert a Legal Number of Hours.");
                    arg1.style.color = "#666666";
                    arg1.value = "Hrs";
                    return false;
                }else if (arg1.id == "minute_offset") {
                    window.alert("ILLEGAL CHARACTER ENTERED for Number of Minutes Offset in Date/Time Settings. Please insert a Legal Number of Minutes.");
                    arg1.style.color = "#666666";
                    arg1.value = "Mins";
                    return false;
                }
            }else if ((arg1.id == "hour_offset") && (parseInt(arg1.value) > 23)) {
                window.alert("Number of Hours Offset in Date/Time Settings CANNOT BE GREATER than 23.");
                arg1.style.color = "#666666";
                arg1.value = "Hrs";
                return false;
            }else if ((arg1.id == "minute_offset") && (parseInt(arg1.value) > 59)) {
                window.alert("Number of Minutes Offset in Date/Time Settings CANNOT BE GREATER than 59.");
                arg1.style.color = "#666666";
                arg1.value = "Mins";
                return false;
            }
        }
        return true;
    }

    function preview_saved_label(arg1, arg2, arg3) {                                                                     // This function is responsible for previewing the current user's Saved Labels.......
        document.getElementById("print_queue").style.display = "none";
        document.getElementById("rename_label_box").style.display = "none";
        document.getElementById("update_label_box").style.display = "none";
        document.getElementById("color_shade").style.display = "none";
        document.getElementById("label_hex_color").style.display = "none";
        document.getElementById("hex_color").style.display = "none";
        document.getElementById("picker-wrapper").style.display = "none";
        document.getElementById("slider-wrapper").style.display = "none";
        document.getElementById("label_customizer").style.display = "none";
        document.getElementById("toggle_instructions").style.display = "none";
        xmlhttp.open("POST", "middleware/scripts/library_process.php", true);
        xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlhttp.send("flag=3&label_save_name="+arg1+"&label_layout_type="+arg2);
        xmlhttp.onreadystatechange = function() {
            if ((xmlhttp.readyState == 4) && (xmlhttp.status == 200)) {
                document.getElementById("busy").style.display = "none";
                document.getElementById("templates_previewer").innerHTML = xmlhttp.responseText;
                document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.background = "transparent url('label_paper_previews/" + arg3 + "') no-repeat center center";
                document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.backgroundSize = "100% 100%";
                adjust_system_interface_2();
            }else {
                document.getElementById("busy").style.display = "inline-block";
            }
        };
        return true;
    }

    function edit_saved_label(arg1, arg2, arg3, arg4) {                                                                  // This function is responsible for the current user's editing Saved Labels.......
        document.getElementById("print_queue").style.display = "none";
        document.getElementById("rename_label_box").style.display = "none";
        var local_xmlhttp_1 = new XMLHttpRequest();
        var local_xmlhttp_2 = new XMLHttpRequest();
        local_xmlhttp_1.open("POST", "middleware/scripts/library_process.php", true);
        local_xmlhttp_1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        local_xmlhttp_1.send("flag=13&label_layout_type="+arg2);
        local_xmlhttp_1.onreadystatechange = function() {
            if ((local_xmlhttp_1.readyState == 4) && (local_xmlhttp_1.status == 200)) {
                document.getElementById("busy").style.display = "none";
                $("div#main_container div#content_area div#label_customizer select#required_field").html(local_xmlhttp_1.responseText);
                local_xmlhttp_2.open("POST", "middleware/scripts/library_process.php", true);
                local_xmlhttp_2.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                local_xmlhttp_2.send("flag=4&label_save_name="+arg1+"&label_layout_type="+arg2);
                local_xmlhttp_2.onreadystatechange = function() {
                    if ((local_xmlhttp_2.readyState == 4) && (local_xmlhttp_2.status == 200)) {
                        document.getElementById("busy").style.display = "none";
                        document.getElementById("templates_previewer").innerHTML = local_xmlhttp_2.responseText;
                        document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.background = "transparent url('label_template_layouts/" + arg3 + "') no-repeat center center";
                        document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.backgroundSize = "100% 100%";
                        document.getElementById("all").checked = true;
                        document.getElementById("save_name").value = arg1;
                        document.getElementById("update_label_box").style.display = "block";
                        document.getElementById("label_customizer").style.display = "block";
                        document.getElementById("toggle_instructions").style.display = "inline-block";
                        sessionStorage.setItem("edit_save_name", arg1);
                        sessionStorage.setItem("edit_layout_type", arg2);
                        sessionStorage.setItem("layout_image_name", arg3);
                        sessionStorage.setItem("label_system_name", arg4);
                        adjust_system_interface_2();
                    }else {
                        document.getElementById("busy").style.display = "inline-block";
                    }
                };
            }else {
                document.getElementById("busy").style.display = "inline-block";
            }
        };
        return true;
    }

    function preview_label_2(arg) {                                                                                      // This function is responsible for quickly previewing the current user's Saved Labels during normal editing.......
        var x;
        var layout_image_name = sessionStorage.getItem("layout_image_name");
        var label_system_name = sessionStorage.getItem("label_system_name");
        var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
        if (arg.innerHTML == "Quick Preview") {
            document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.background = "transparent url('label_paper_previews/" + label_system_name + "') no-repeat center center";
            document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.backgroundSize = "100% 100%";
            for (x in elements) {
                if ((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) {
                    if ((elements[x].value.match("_O=") != null) || (elements[x].value.match("H_O=") != null)) {
                        field_collection.push(elements[x].id + " - " + elements[x].value);
                        var local_xmlhttp = new XMLHttpRequest();
                        local_xmlhttp.open("POST", "middleware/scripts/library_process.php", false);
                        local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        local_xmlhttp.send("flag=15&label_field_value="+elements[x].value);
                        if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                            document.getElementById(elements[x].id).value = local_xmlhttp.responseText;
                        }
                    }
                    elements[x].style.borderStyle = "none";
                    elements[x].style.outlineStyle = "none";
                    elements[x].style.backgroundColor = "transparent";
                }
            }
            arg.innerHTML = "Unset Preview";
        }else {
            document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.background = "transparent url('label_template_layouts/" + layout_image_name + "') no-repeat center center";
            document.getElementById("templates_previewer").getElementsByTagName("div")[0].style.backgroundSize = "100% 100%";
            for (x in elements) {
                if ((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) {
                    for (var i = 0; i < field_collection.length; i++) {
                        if (field_collection[i].match(elements[x].id) != null) {
                            field_collection[i] = field_collection[i].replace(field_collection[i], field_collection[i].substring((elements[x].id.length + 4) - 1));
                            document.getElementById(elements[x].id).value = field_collection[i];
                        }else {
                            continue;
                        }
                    }
                    elements[x].style.borderStyle = "";
                    elements[x].style.outlineStyle = "dotted";
                    elements[x].style.backgroundColor = "#FFFFFF";
                }
            }
            arg.innerHTML = "Quick Preview";
        }
        return true;
    }

    function update_saved_label() {                                                                                   // This function updates already Saved Labels.....
        var x;
        var local_xmlhttp = new XMLHttpRequest();
        var edit_save_name = sessionStorage.getItem("edit_save_name");
        var edit_layout_type = sessionStorage.getItem("edit_layout_type");
        var layout_image_name = sessionStorage.getItem("layout_image_name");
        var label_system_name = sessionStorage.getItem("label_system_name");
        var elements = document.getElementById("templates_previewer").getElementsByTagName("div")[0].childNodes;
        for (x in elements) {
            if ((elements[x].nodeName == "INPUT") || (elements[x].nodeName == "TEXTAREA")) {
                var field_name = elements[x].id;
                if ((elements[x].value == "") || (elements[x].readOnly == true)) {
                    var field_value = "";
                }else {
                    var field_value = encoder_3(elements[x].value);
                }
                var field_face = encoder_1(elements[x].style.fontFamily);
                var field_size = elements[x].style.fontSize;
                var field_color = elements[x].style.color;
                field_color = encoder_2(field_color);
                if (elements[x].readOnly == true) {
                    var field_alignment = "left";
                }else {
                    var field_alignment = elements[x].style.textAlign;
                }
                if ((elements[x].style.fontStyle == "normal") && (elements[x].style.fontWeight == "normal")) {
                    var field_style = "normal";
                }else if ((elements[x].style.fontStyle == "italic") && (elements[x].style.fontWeight == "normal")) {
                    var field_style = "italic";
                }else if ((elements[x].style.fontStyle == "normal") && (elements[x].style.fontWeight == "bold")) {
                    var field_style = "bold";
                }else if ((elements[x].style.fontStyle == "italic") && (elements[x].style.fontWeight == "bold")) {
                    var field_style = "both";
                }
                var field_line_height = elements[x].style.lineHeight;
                if (elements[x].readOnly == true) {
                    if ((elements[x].style.backgroundImage == "initial") || (elements[x].style.backgroundImage == "none")) {
                        var data = image_mode_handler(elements[x]);
                        if (data != false) {
                            data = "LFN="+field_name+"; LFV="+field_value+"; LFF="+field_face+"; LFS="+field_size+"; LFC="+field_color+"; LFA="+field_alignment+"; LFI="+field_style+"; LFH="+field_line_height + data;
                            message.push(data);
                        }else {
                            document.getElementById("busy").style.display = "none";
                            return false;
                        }
                    }
                }else {
                    var data = "LFN="+field_name+"; LFV="+field_value+"; LFF="+field_face+"; LFS="+field_size+"; LFC="+field_color+"; LFA="+field_alignment+"; LFI="+field_style+"; LFH="+field_line_height;
                    message.push(data);
                }
            }else {
                continue;
            }
        }
        local_xmlhttp.open("POST", "middleware/scripts/library_process.php", true);
        local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        local_xmlhttp.send("flag=5&request="+message.toString());
        local_xmlhttp.onreadystatechange = function() {
            if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                document.getElementById("busy").style.display = "none";
                document.getElementById("uploads_list").innerHTML = "";
                document.getElementById("image_uploader").style.display = "none";
                enable("span#save_success_messages", "Label &quot;" + edit_save_name + "&quot; Successfully Updated!!!");
                $("span#save_success_messages").fadeOut(3000, function() {
                    edit_saved_label(edit_save_name, edit_layout_type, layout_image_name, label_system_name);
                });
            }else {
                document.getElementById("busy").style.display = "inline-block";
            }
        };
        message = new Array();
        return true;
    }

    function clone_saved_label(arg1, arg2, arg3) {                                                                             // This function is responsible for cloning/copying saved labels......
        var local_xmlhttp = new XMLHttpRequest();
        local_xmlhttp.open("POST", "middleware/scripts/library_process.php", true);
        local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        local_xmlhttp.send("flag=6&label_template_name="+arg1+"&label_save_name="+arg2+"&label_layout_type="+arg3);
        local_xmlhttp.onreadystatechange = function() {
            if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                document.getElementById("busy").style.display = "none";
                show_labels();
            }else {
                document.getElementById("busy").style.display = "inline-block";
            }
        };
        return true;
    }

    function rename_saved_label(arg1, arg2, arg3, arg4) {                                                                            // This function is responsible for re-naming a saved label........
        if (arg1.id == "rename_saved_label") {
            sessionStorage.setItem("label_template", arg2);
            sessionStorage.setItem("template_layout", arg3);
            sessionStorage.setItem("rename_save_name", arg4);
            document.getElementById("new_name").value = arg4;
            document.getElementById("templates_previewer").innerHTML = "";
            document.getElementById("print_queue").style.display = "none";
            document.getElementById("update_label_box").style.display = "none";
            document.getElementById("color_shade").style.display = "none";
            document.getElementById("label_hex_color").style.display = "none";
            document.getElementById("hex_color").style.display = "none";
            document.getElementById("picker-wrapper").style.display = "none";
            document.getElementById("slider-wrapper").style.display = "none";
            document.getElementById("label_customizer").style.display = "none";
            document.getElementById("instructions").style.display = "none";
            document.getElementById("toggle_instructions").style.display = "none";
            document.getElementById("rename_label_box").style.display = "block";
        }else if (arg1.id == "enter") {
            var rename_save_name = sessionStorage.getItem("rename_save_name");
            if (document.getElementById("new_name").value.trim() == "") {
                enable("span#rename_error_messages", "New Save Name CANNOT be Empty.");
                interval = window.setTimeout("disable('span#rename_error_messages')", 3000);
                return false;
            }else if (document.getElementById("new_name").value.length > 100) {
                enable("span#rename_error_messages", "New Save Name CANNOT be greater than 100 Characters.");
                interval = window.setTimeout("disable('span#rename_error_messages')", 3000);
                return false;
            }else if (toTitleCase(document.getElementById("new_name").value.trim()) == rename_save_name) {
                enable("span#rename_error_messages", "New Save Name CANNOT be identical to the Current Save Name.");
                interval = window.setTimeout("disable('span#rename_error_messages')", 3000);
                return false;
            }else {
                var new_save_name = toTitleCase(document.getElementById("new_name").value.trim());
                var local_xmlhttp = new XMLHttpRequest();
                local_xmlhttp.open("POST", "middleware/scripts/library_process.php", true);
                local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                local_xmlhttp.send("flag=7&new_save_name="+new_save_name+"&current_save_name="+rename_save_name);
                local_xmlhttp.onreadystatechange = function() {
                    if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                        document.getElementById("busy").style.display = "none";
                        if (local_xmlhttp.responseText == "Updated Successfully") {
                            if (print_queue.length > 0) {
                                var label_template = sessionStorage.getItem("label_template");
                                var template_layout = sessionStorage.getItem("template_layout");
                                remove_from_print(label_template, template_layout, rename_save_name);
                            }
                            sessionStorage.removeItem("label_template");
                            sessionStorage.removeItem("template_layout");
                            sessionStorage.removeItem("rename_save_name");
                            document.getElementById("new_name").value = "";
                            document.getElementById("rename_label_box").style.display = "none";
                            show_labels();
                        }else if (local_xmlhttp.responseText == "Update Error") {
                            enable("span#rename_error_messages", "Please ensure the Entered SAVE NAME is Unique from Existing Save Names.");
                            interval = window.setTimeout("disable('span#rename_error_messages')", 3000);
                            return false;
                        }
                    }else {
                        document.getElementById("busy").style.display = "inline-block";
                    }
                };
            }
        }else if (arg1.id == "close") {
            document.getElementById("new_name").value = "";
            document.getElementById("rename_error_messages").style.display = "none";
            document.getElementById("rename_label_box").style.display = "none";
        }
        return true;
    }

    function select_all() {                                                                                              // This function selects all currently saved labels within the user's library......
        var x;
        var selected_labels = $("div#main_container div#content_area div#library_records table tbody tr td input[name = 'selected_label']");
        if (document.getElementById("all_labels").checked) {
            for (x in selected_labels) {
                selected_labels[x].checked = true;
            }
        }else {
            for (x in selected_labels) {
                selected_labels[x].checked = false;
            }
        }
        return true;
    }

    function set_all_labels(arg) {                                                                                       // This function is responsible for toggling the ALL LABELS checkbox.......
        var selected_labels = $("div#main_container div#content_area div#library_records table tbody tr td input[name = 'selected_label']");
        if (arg.checked == false) {
            document.getElementById("all_labels").checked = false;
        }else {
            var counter = 0;
            for (var i = 0; i < selected_labels.length; i++) {
                if (selected_labels[i].checked) {
                    counter++;
                    if (counter == selected_labels.length) {
                        document.getElementById("all_labels").checked = true;
                        break;
                    }
                }else {
                    continue;
                }
            }
        }
        return true;
    }

    function delete_saved_label() {                                                                                      // This function is responsible for deleting one or more saved labels from the user's library.............
        var x;
        var delete_labels = new Array();
        var selected_labels = $("div#main_container div#content_area div#library_records table tbody tr td input[name = 'selected_label']");
        if (document.getElementById("all_labels").checked == false) {
            for (x in selected_labels) {
                if (selected_labels[x].checked) {
                    delete_labels.push(selected_labels[x].value);
                }else {
                    continue;
                }
            }
        }else {
            for (x in selected_labels) {
                delete_labels.push(selected_labels[x].value);
            }
        }
        if (delete_labels.length > 0) {
            var confirmation = window.confirm("Are You Sure You Would Like To Proceed With This Deletion?");
            if (confirmation) {
                document.getElementById("templates_previewer").innerHTML = "";
                document.getElementById("update_label_box").style.display = "none";
                document.getElementById("color_shade").style.display = "none";
                document.getElementById("label_hex_color").style.display = "none";
                document.getElementById("hex_color").style.display = "none";
                document.getElementById("picker-wrapper").style.display = "none";
                document.getElementById("slider-wrapper").style.display = "none";
                document.getElementById("label_customizer").style.display = "none";
                document.getElementById("rename_label_box").style.display = "none";
                document.getElementById("toggle_instructions").style.display = "none";
                var local_xmlhttp = new XMLHttpRequest();
                local_xmlhttp.open("POST", "middleware/scripts/library_process.php", true);
                local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                local_xmlhttp.send("flag=8&request="+delete_labels.toString());
                local_xmlhttp.onreadystatechange = function() {
                    if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                        document.getElementById("busy").style.display = "none";
                        show_labels();
                        if (print_queue.length > 0) {
                            for (x in selected_labels) {
                                if (selected_labels[x].checked) {
                                    var identifier = selected_labels[x].parentNode.id.split(", ");
                                    remove_from_print(identifier[0], identifier[1], identifier[2]);
                                }
                            }
                        }
                    }else {
                        document.getElementById("busy").style.display = "inline-block";
                    }
                }
            }
        }
        return true;
    }

    function toggle_print_queue() {                                                                                      // This function hides/shows the client's Print Queue.......
        if (document.getElementById("print_queue").style.display == "none") {
            show_print_queue();
            cancel_meniature_display();
        }else {
            document.getElementById("print_queue").style.display = "none";
            cancel_meniature_display();
        }
        return true;
    }

    function empty_print_queue() {                                                                                       // This function empties the client's Print Queue and displays it........
        if (print_queue.length > 0) {
            print_queue = new Array();
            the_label_template_1 = "";
        }
        show_print_queue();
        cancel_meniature_display();
        return true;
    }

    function show_print_queue() {                                                                                        // This function fetches all entries and shows the client's Print Queue.......
        var x;
        document.getElementById("templates_previewer").innerHTML = "";
        document.getElementById("update_label_box").style.display = "none";
        document.getElementById("color_shade").style.display = "none";
        document.getElementById("label_hex_color").style.display = "none";
        document.getElementById("hex_color").style.display = "none";
        document.getElementById("picker-wrapper").style.display = "none";
        document.getElementById("slider-wrapper").style.display = "none";
        document.getElementById("label_customizer").style.display = "none";
        document.getElementById("instructions").style.display = "none";
        document.getElementById("toggle_instructions").style.display = "none";
        document.getElementById("rename_label_box").style.display = "none";
        $("div#print_queue table tbody").html("");
        if (print_queue.length > 0) {
            print_queue.sort();
            for (x in print_queue) {
                if(print_queue[x] == "") {
                    the_label_template_1 = "";
                    break;
                }else {
                    continue;
                }
            }
            for (var i = 0; i < print_queue.length; i++) {
                if (print_queue[i] != "") {
                    var data_items = print_queue[i].split("; ");
                    for (x in data_items) {
                        if (data_items[x] != "") {
                            if (elements == "") {
                                elements = "<td>" + data_items[x] + "</td>";
                            }else {
                                elements += "<td>" + data_items[x] + "</td>";
                            }
                        }else {
                            continue;
                        }
                    }
                    if (the_label_template_1 == "") {
                        the_label_template_1 = print_queue[i].substring(0, print_queue[i].indexOf("; "));
                        $("div#print_queue table tbody").append("<tr><td colspan = '7' style = 'height:20px;'></td></tr><tr>" + elements + "<td><button type = 'button' name = 'batch' onclick = 'initialize_batch_print(\"" + the_label_template_1 + "\")'>Batch</button></td></tr>");
                    }else {
                        var the_label_template_2 = print_queue[i].substring(0, print_queue[i].indexOf("; "));
                        if (the_label_template_2.match(the_label_template_1) != null) {
                            if (i == 0) {
                                $("div#print_queue table tbody").append("<tr><td colspan = '7' style = 'height:20px;'></td></tr><tr>" + elements + "<td><button type = 'button' name = 'batch' onclick = 'initialize_batch_print(\"" + the_label_template_1 + "\")'>Batch</button></td></tr>");
                            }else {
                                $("div#print_queue table tbody").append("<tr>" + elements + "</tr>");
                            }
                        }else {
                            the_label_template_1 = the_label_template_2;
                            $("div#print_queue table tbody").append("<tr><td colspan = '7' style = 'height:20px;'></td></tr><tr>" + elements + "<td><button type = 'button' name = 'batch' onclick = 'initialize_batch_print(\"" + the_label_template_1 + "\")'>Batch</button></td></tr>");
                        }
                    }
                    elements = "";
                }else {
                    continue;
                }
            }
        }
        document.getElementById("print_queue").style.display = "block";
        return true;
    }

    function remove_from_print(arg1, arg2, arg3) {                                                                       // This function removes or unsets entries made into the client's Print Queue.......
        var x;
        var counter = 0;
        if (print_queue.length > 0) {
            for (x in print_queue) {
                if (print_queue[x].match(arg1 + "; " + arg2 + "; " + arg3 + "; ") != null) {
                    print_queue[x] = "";
                    show_print_queue();
                    break;
                }else {
                    continue;
                }
            }
        }
        for (x in print_queue) {
            if (print_queue[x] == "") {
                counter++;
                if (counter == print_queue.length) {
                    print_queue = new Array();
                    the_label_template_1 = "";
                    break;
                }else {
                    continue;
                }
            }else {
                continue;
            }
        }
        cancel_meniature_display();
        return true;
    }

    function check_value(arg) {                                                                                          // This function is responsible for validating the Number of Copies Entered........
        var x;
        if ((isNaN(arg.value)) || (arg.value < 1)) {
            arg.value = 1;
            for (x in print_queue) {
                if (print_queue[x].match("<input type = 'text' name = '" + arg.name + "'") != null) {
                    var start_index = print_queue[x].search("value");
                    var end_index = print_queue[x].search("maxlength");
                    var resultant = print_queue[x].substring(start_index, end_index - 1);
                    print_queue[x] = print_queue[x].replace(resultant, "value = '" + arg.value + "'");
                }else {
                    continue;
                }
            }
        }else if ((arg.value >= 1) && (arg.value <= 200)) {
            for (x in print_queue) {
                if (print_queue[x].match("<input type = 'text' name = '" + arg.name + "'") != null) {
                    var start_index = print_queue[x].search("value");
                    var end_index = print_queue[x].search("maxlength");
                    var resultant = print_queue[x].substring(start_index, end_index - 1);
                    print_queue[x] = print_queue[x].replace(resultant, "value = '" + arg.value + "'");
                }else {
                    continue;
                }
            }
        }else {
            window.alert("Number of Label Copies Cannot Exceed 200");
            arg.value = 1;
            for (x in print_queue) {
                if (print_queue[x].match("<input type = 'text' name = '" + arg.name + "'") != null) {
                    var start_index = print_queue[x].search("value");
                    var end_index = print_queue[x].search("maxlength");
                    var resultant = print_queue[x].substring(start_index, end_index - 1);
                    print_queue[x] = print_queue[x].replace(resultant, "value = '" + arg.value + "'");
                }else {
                    continue;
                }
            }
        }
        return true;
    }

    function cancel_meniature_display() {                                                                                // This function hides/shows the Meniature Print Display........
        document.getElementById("meniature_contents").innerHTML = "";
        document.getElementById("meniature_pattern_display").style.display = "none";
        return true;
    }

    function initialize_batch_print(arg) {                                                                               // This function is responsible for initiating the Batch Print Process.......
        var counter = 0, batch_queue = new Array();
        if (batch_label_entries.length > 0) {
            batch_label_entries = new Array();
        }
        for (var i = 0; i < print_queue.length; i++) {
            if (print_queue[i].match(arg)) {
                batch_queue.push(print_queue[i]);
            }else {
                continue;
            }
        }
        for (var i = 0; i < batch_queue.length; i++) {
            var batch_serializer = batch_queue[i].split("; ", 4);
            var start_index = batch_serializer[3].search("value");
            var end_index = batch_serializer[3].search("maxlength");
            var number_of_copies = parseInt(batch_serializer[3].substring(start_index + 9, end_index - 2));
            counter += number_of_copies;
            if (counter > 200) {
                window.alert("Total Number of Label Copies For Batch Printing Cannot Exceed 200");
                return false;
            }else {
                continue;
            }
        }
        for (var i = 0; i < batch_queue.length; i++) {
            batch_serializer = batch_queue[i].split("; ", 4);
            start_index = batch_serializer[3].search("value");
            end_index = batch_serializer[3].search("maxlength");
            number_of_copies = parseInt(batch_serializer[3].substring(start_index + 9, end_index - 2));
            var batch_data = "LTL="+batch_serializer[1]+"; LSN="+batch_serializer[2]+"; LNC="+number_of_copies;
            batch_label_entries.push(batch_data);
        }
        start_batch_print(arg);
        return true;
    }

    function start_batch_print(arg) {                                                                                    // This function is responsible for starting the Batch Print Process......
        cancel_meniature_display();
        var local_xmlhttp = new XMLHttpRequest();
        local_xmlhttp.open("POST", "middleware/scripts/library_process.php", true);
        local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        local_xmlhttp.send("flag=11&batch_label_template="+arg);
        local_xmlhttp.onreadystatechange = function() {
            if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                document.getElementById("busy").style.display = "none";
                document.getElementById("meniature_contents").innerHTML = local_xmlhttp.responseText;
                document.getElementById("meniature_pattern_display").style.display = "block";
            }else {
                document.getElementById("busy").style.display = "inline-block";
            }
        }
        return true;
    }

    function begin_batch_print(arg) {                                                                                    // This function is responsible for beginning the Batch Print Process.......
        var local_xmlhttp = new XMLHttpRequest();
        local_xmlhttp.open("POST", "middleware/scripts/library_process.php", true);
        local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        local_xmlhttp.send("flag=12&starting_cell="+parseInt(arg.innerHTML)+"&batch_label_entries="+batch_label_entries.toString());
        local_xmlhttp.onreadystatechange = function() {
            if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                document.getElementById("busy").style.display = "none";
                var newhtml = "<!DOCTYPE html>";
                newhtml = "<html>";
                newhtml += "<head>";
                newhtml += "<title>Nimble - Label Print</title>";
                newhtml += "<meta name = 'Content-Type' content = 'text/html;charset=UTF-8' />";
                newhtml += "<style>";
                newhtml += "@media print {";
                newhtml += "@page {size:auto; margin:0mm;}";
                newhtml += "}";
                newhtml += "body {margin:0px; padding:0px;}";
                newhtml += "</style>";
                newhtml += "<script>";
                newhtml += "function loose_focus(arg) { arg.blur(); return true; }";
                //newhtml += "function label_print() { window.print(); window.close(); return true; }";
                //newhtml += "function terminate() { window.clearTimeout(interval); return true; }";
                newhtml += "</script>";
                newhtml += "</head>";
                //newhtml += "<body onunload = 'terminate()'>";
                newhtml += "<body>";
                var labelPrintWindow = window.open("", "Nimble - Label Print");
                labelPrintWindow.document.open("text/html");
                labelPrintWindow.document.write(newhtml + local_xmlhttp.responseText + "</body></html>");
                labelPrintWindow.document.close();
                //interval = labelPrintWindow.setTimeout("label_print()", 5000);
                cancel_meniature_display();
            }else {
                document.getElementById("busy").style.display = "inline-block";
            }
        }
        return true;
    }

    function start_print(arg1, arg2, arg3) {                                                                             // This function is responsible for starting the Single Print Process.......
        var x, local_xmlhttp = new XMLHttpRequest();
        cancel_meniature_display();
        for (x in print_queue) {
            if (print_queue[x].match(arg1 + "; " + arg2 + "; " + arg3 + "; ") != null) {
                var start_index = print_queue[x].search("value");
                var end_index = print_queue[x].search("maxlength");
                var number_of_copies = print_queue[x].substring(start_index + 9, end_index - 2);
                number_of_copies = parseInt(number_of_copies);
                break;
            }else {
                continue;
            }
        }
        local_xmlhttp.open("POST", "middleware/scripts/library_process.php", true);
        local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        local_xmlhttp.send("flag=9&label_template="+arg1+"&template_layout="+arg2+"&save_name="+arg3+"&number_of_copies="+number_of_copies);
        local_xmlhttp.onreadystatechange = function() {
            if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                document.getElementById("busy").style.display = "none";
                document.getElementById("meniature_contents").innerHTML = local_xmlhttp.responseText;
                document.getElementById("meniature_pattern_display").style.display = "block";
            }else {
                document.getElementById("busy").style.display = "inline-block";
            }
        }
        return true;
    }

    function begin_print(arg) {                                                                                          // This function begins the Single Print Process......
        var local_xmlhttp = new XMLHttpRequest();
        local_xmlhttp.open("POST", "middleware/scripts/library_process.php", true);
        local_xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        local_xmlhttp.send("flag=10&starting_cell="+parseInt(arg.innerHTML));
        local_xmlhttp.onreadystatechange = function() {
            if ((local_xmlhttp.readyState == 4) && (local_xmlhttp.status == 200)) {
                document.getElementById("busy").style.display = "none";
                var newhtml = "<!DOCTYPE html>";
                newhtml = "<html>";
                newhtml += "<head>";
                newhtml += "<title>Nimble - Label Print</title>";
                newhtml += "<meta name = 'Content-Type' content = 'text/html;charset=UTF-8' />";
                newhtml += "<style>";
                newhtml += "@media print {";
                newhtml += "@page {size:auto; margin:0mm;}";
                newhtml += "}";
                newhtml += "body {margin:0px; padding:0px;}";
                newhtml += "</style>";
                newhtml += "<script>";
                newhtml += "function loose_focus(arg) { arg.blur(); return true; }";
                //newhtml += "function label_print() { window.print(); window.close(); return true; }";
                //newhtml += "function terminate() { window.clearTimeout(interval); return true; }";
                newhtml += "</script>";
                newhtml += "</head>";
                //newhtml += "<body onunload = 'terminate()'>";
                newhtml += "<body>";
                var labelPrintWindow = window.open("", "Nimble - Label Print");
                labelPrintWindow.document.open("text/html");
                labelPrintWindow.document.write(newhtml + local_xmlhttp.responseText + "</body></html>");
                labelPrintWindow.document.close();
                //interval = labelPrintWindow.setTimeout("label_print()", 5000);
                cancel_meniature_display();
            }else {
                document.getElementById("busy").style.display = "inline-block";
            }
        }
        return true;
    }

    function add_to_print(arg1, arg2, arg3) {                                                                            // This function is responsible for adding entries into the client's Print Queue.......
        cancel_meniature_display();
        if (print_queue.length > 0) {
            for (var i = 0; i < print_queue.length; i++) {
                if (print_queue[i].match(arg1 + "; " + arg2 + "; " + arg3 + "; ") != null) {
                    show_print_queue();
                    return false;
                }else {
                    continue;
                }
            }
        }
        var number_of_copies = "<input type = 'text' name = '" + arg3 + "' value = '1' maxlength = '3' onchange = 'check_value(this)' style = 'width:25px;height:13px;text-align:center;' />";
        var start = "<button type = 'button' name = 'start' onclick = 'start_print(\"" + arg1 + "\", \"" + arg2 + "\", \"" + arg3 + "\")'>Start</button>";
        var remove = "<button type = 'button' name = 'remove' onclick = 'remove_from_print(\"" + arg1 + "\", \"" + arg2 + "\", \"" + arg3 + "\")'>Remove</button>";
        print_queue.push(arg1 + "; " + arg2 + "; " + arg3 + "; " + number_of_copies + "; " + start + "; " + remove + "; ");
        show_print_queue();
        return true;
    }
