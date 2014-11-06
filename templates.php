<?php

    require("../classes/abstract_classes/abstract_templates_class.php");                    

    class templates_class extends abstract_templates_class {

        public function templates_class() {
             // Empty Constructor.....
        }

        public function get_label_templates() {
            echo "<h2>Choose Your Template</h2>";
            $query = "call get_label_templates('".$_SESSION["username"]."')";
            $results = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            if (mysqli_num_rows($results) > 0) {
                echo "<label for = 'label_templates'>Label Templates:&nbsp;</label>";
                echo "<select id = 'label_templates' size = '9' onfocus = 'initialize_templates_previewer()' onchange = 'templates_previewer()'>";
                while($rows = mysqli_fetch_assoc($results)) {
                    echo "<option value = '".$rows["label_system_name"]."'>".$rows["label_name"]."</option>";
                }
                echo "</select>";
                echo "<div id = 'label_diagram_container'></div>";
            }
            mysqli_free_result($results);
            mysqli_close($GLOBALS["connect"]);
            require("connect.php");
            echo "<img src = 'images/busy.gif' alt = 'Busy' id = 'busy' />";
            echo "<div id = 'label_template_layouts'></div>";
            echo "<div id = 'save_label_box'>
                        <label for = 'save_name'>Enter Save Name:&nbsp;</label>
                        <input type = 'text' id = 'save_name' /><br />
                        <button type = 'button' id = 'save_and_continue' onclick = 'check_save_name(this)'>Save &amp; Continue</button><br />
                        <button type = 'button' id = 'save_and_finish' onclick = 'check_save_name(this)'>Save &amp; Finish</button>
                        <span id = 'save_error_messages'></span>
                        <span id = 'save_success_messages'></span>
                    </div>";
            echo "<div id = 'existing_labels'>";
                    $this->existing_labels();
            echo "</div>";
            echo "<div id = 'templates_previewer'></div>";
            require("label_customizer.php");
            require("connect.php");
            echo "<div id = 'instructions'>
                        <h2>Instructions</h2>";
                        $query = "select customer_templates_module_instructions from general_settings";
                        $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                        $row = mysqli_fetch_array($result);
                        mysqli_free_result($result);
            echo        "<p>".$row[0]."</p>";
            echo "</div>";
            echo "<button type = 'button' id = 'toggle_instructions' onclick = 'toggle_instructions(&quot;Templates&quot;)'>Toggle Instructions</button>";
            echo "<div id = 'image_uploader'>
                        <h3>Image Uploader</h3>
                        <ol id = 'uploads_list'></ol>
                  </div>";
            echo "<div id = 'uploaded_images'>
                        <h3>Uploaded Images for <span>".$_SESSION["username"]."</span></h3>
                        <table id = 'uploaded_images_list'><tbody></tbody></table>
                  </div>";

            return true;
        }

        public function get_label_template_layouts() {
            $this->label_name = $_POST["current_template"];
            $query = "call get_label_template_layouts('$this->label_name')";
            $results = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            if (mysqli_num_rows($results) > 0) {
                echo "<label for = 'list_of_layouts'>Template Layouts:&nbsp;</label>";
                echo "<select id = 'list_of_layouts' size = '9' onfocus = 'initialize_layouts_previewer()' onchange = 'layouts_previewer()'>";
                    while($rows = mysqli_fetch_assoc($results)) {
                        echo "<option value = '".$rows["layout_image_name"]."'>".$rows["layout_type"]."</option>";
                    }
                echo "</select>&nbsp;";
                echo "<button type = 'button' id = 'create_label' onclick = 'create_label()'>Create Label</button>";
                echo "<button type = 'button' id = 'preview_label' onclick = 'preview_label(this)'>Quick Preview</button><br />";
            }
            mysqli_free_result($results);
            mysqli_close($GLOBALS["connect"]);
            return true;
        }

        public function label_customizer() {
            $this->label_layout_type = $_POST["current_layout"];
            $query = "call get_field_names('$this->label_layout_type')";
            $results = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            echo "<option selected = 'selected' value = ''>Select Desired Label Field</option>";
            if (mysqli_num_rows($results) > 0) {
                while($rows = mysqli_fetch_assoc($results)) {
                    echo "<option value = '".$rows["field_name"]."'>".$rows["field_name"]."</option>";
                }
            }
            mysqli_free_result($results);
            mysqli_close($GLOBALS["connect"]);
            return true;
        }

        public function existing_labels() {
          echo "<h3>My Existing Labels</h3>";
          $query = "call get_existing_labels('".$_SESSION["username"]."')";
          $results = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
          if (mysqli_num_rows($results) > 0) {
              echo "<ol>";
                  while($rows = mysqli_fetch_assoc($results)) {
                       echo "<li>".$rows["save_name"]."</li>";
                  }
              echo "</ol>";
          }
          mysqli_free_result($results);
          mysqli_close($GLOBALS["connect"]);
          return true;
        }

        public function create_label() {
            $this->label_layout_type = $_POST["current_layout"];
            $query = "call get_label_template_dimensions('$this->label_layout_type')";
            $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            mysqli_close($GLOBALS["connect"]);
            require("connect.php");
            $query = "call get_label_template_layout_settings('$this->label_layout_type')";
            $results = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            if ((mysqli_num_rows($result) > 0) && (mysqli_num_rows($results) > 0)) {
                $row = mysqli_fetch_array($result);
                echo "<div style = 'width:".$row["print_box_width"]."mm; height:".$row["print_box_height"]."mm;'>";
                    while($rows = mysqli_fetch_assoc($results)) {
                        $this->width = $rows["width"];
                        $this->height = $rows["height"];
                        $this->top_coordinate = $rows["top_coordinate"];
                        $this->left_coordinate = $rows["left_coordinate"];
                        if ($rows["field_type"] == "Single_line") {
                            echo "<input type = 'text' id = '".$rows["field_name"]."' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; outline:dotted #629941;' onfocus = 'loose_focus_preview(this)' />";
                        }elseif ($rows["field_type"] == "Multi_line") {
                            echo "<textarea id = '".$rows["field_name"]."' wrap = 'hard' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; outline:dotted #629941;' onfocus = 'loose_focus_preview(this)'></textarea>";
                        }
                    }
                echo "</div>";
                mysqli_free_result($result);
                mysqli_free_result($results);
                mysqli_close($GLOBALS["connect"]);
            }
            return true;
        }

        public function check_save_name() {
            try {
                $this->label_save_name = $_POST["label_save_name"];
                $this->label_layout_type = $_POST["label_layout_type"];
                $query = "select get_save_name('$this->label_save_name', '".$_SESSION["username"]."') as check_save_name";
                $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                $row = mysqli_fetch_array($result);
                if (!(empty($row[0]))) {
                    if (isset($_POST["update"])) {
                        if (isset($_SESSION["label_save_name"])) {
                            if ($row[0] != $_SESSION["label_save_name"]) {
                                throw new Exception("Update Error");
                            }else {
                                throw new Exception("Existing Label");
                            }
                        }else {
                            throw new Exception("Initialization Error");
                        }
                    }else {
                        throw new Exception("Existing Label");
                    }
                }else {
                    $query = "select get_label_name('$this->label_layout_type') as the_label_name";
                    $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                    $row = mysqli_fetch_array($result);
                    $_SESSION["label_name"] = $row[0];
                    $_SESSION["label_layout_type"] = $this->label_layout_type;
                    $_SESSION["label_save_name"] = $this->label_save_name;
                    throw new Exception("New Label");
                }
            }catch(Exception $err) {
                echo $err->getMessage();
            }
            mysqli_free_result($result);
            mysqli_close($GLOBALS["connect"]);
            return true;
        }

        public function save1() {
            $this->label_name = $_SESSION["label_name"];
            $this->label_layout_type = $_SESSION["label_layout_type"];
            $this->label_save_name = $_SESSION["label_save_name"];
            $request = $_POST["request"];
            $data = explode(",", $request);
            foreach($data as $item) {
                $sub_data = explode("; ", $item);
                foreach($sub_data as $value) {
                    if (strpos($value, "LFN=") !== false) {
                        $field_name = strpos($value, "LFN=");
                        $this->label_field_name = substr($value, $field_name + 4);
                    }elseif (strpos($value, "LFT=") !== false) {
                        $field_type = strpos($value, "LFT=");
                        $this->label_field_type = substr($value, $field_type + 4);
                    }elseif (strpos($value, "LFV=") !== false) {
                        $field_value = strpos($value, "LFV=");
                        $this->label_field_value = str_replace("'", "^", substr($value, $field_value + 4));
                    }elseif (strpos($value, "LFF=") !== false) {
                        $field_face = strpos($value, "LFF=");
                        $this->label_field_face = substr($value, $field_face + 4);
                    }elseif (strpos($value, "LFS=") !== false) {
                        $field_size = strpos($value, "LFS=");
                        $this->label_field_size = substr($value, $field_size + 4);
                    }elseif (strpos($value, "LFC=") !== false) {
                        $field_color = strpos($value, "LFC=");
                        $this->label_field_color = substr($value, $field_color + 4);
                    }elseif (strpos($value, "LFA=") !== false) {
                        $field_alignment = strpos($value, "LFA=");
                        $this->label_field_alignment = substr($value, $field_alignment + 4);
                    }elseif (strpos($value, "LFI=") !== false) {
                        $field_style = strpos($value, "LFI=");
                        $this->label_field_style = substr($value, $field_style + 4);
                    }elseif (strpos($value, "LFH=") !== false) {
                        $field_line_height = strpos($value, "LFH=");
                        $this->label_field_height = substr($value, $field_line_height + 4);
                    }elseif (strpos($value, "LFG=") !== false) {
                        $field_image = strpos($value, "LFG=");
                        $this->label_field_graphic = substr($value, $field_image + 4);
                    }
                }
                if (isset($this->label_field_graphic)) {
                    $image_upload_data = explode(",", $_SESSION["image_upload_data"]);
                    foreach($image_upload_data as $package) {
                        if (stripos($package, $this->label_field_graphic) !== false) {
                            $data_items = explode("; ", $package);
                            foreach($data_items as $data_item) {
                                if (strpos($data_item, "LIN=") !== false) {
                                    $label_image_name = strpos($data_item, "LIN=");
                                    $this->label_field_image_name = substr($data_item, $label_image_name + 4);
                                }elseif (strpos($data_item, "LIW=") !== false) {
                                    $label_image_width = strpos($data_item, "LIW=");
                                    $this->label_field_image_width = intval(substr($data_item, $label_image_width + 4));
                                }elseif (strpos($data_item, "LIH=") !== false) {
                                    $label_image_height = strpos($data_item, "LIH=");
                                    $this->label_field_image_height = intval(substr($data_item, $label_image_height + 4));
                                }
                            }
                            if (!(isset($uploaded_image_data))) {
                                $uploaded_image_data = "LUN=".$_SESSION["username"]."; LFN=".$this->label_field_name."; LIN=".$this->label_field_image_name."; LIW=".$this->label_field_image_width."; LIH=".$this->label_field_image_height;
                            }else {
                                $uploaded_image_data .= ",LUN=".$_SESSION["username"]."; LFN=".$this->label_field_name."; LIN=".$this->label_field_image_name."; LIW=".$this->label_field_image_width."; LIH=".$this->label_field_image_height;
                            }
                            $query = "call insert_new_label_2('".$_SESSION["username"]."', '$this->label_name', '$this->label_layout_type', '$this->label_save_name', '$this->label_field_name', '$this->label_field_type', '$this->label_field_value', '$this->label_field_face', '$this->label_field_size', '$this->label_field_color', '$this->label_field_alignment', '$this->label_field_style', '$this->label_field_height', '$this->label_field_image_name', $this->label_field_image_width, $this->label_field_image_height)";
                            $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                        }else {
                            continue;
                        }
                    }
                    unset($this->label_field_graphic);
                }else {
                    $query = "call insert_new_label('".$_SESSION["username"]."', '$this->label_name', '$this->label_layout_type', '$this->label_save_name', '$this->label_field_name', '$this->label_field_type', '$this->label_field_value', '$this->label_field_face', '$this->label_field_size', '$this->label_field_color', '$this->label_field_alignment', '$this->label_field_style', '$this->label_field_height')";
                    $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                }
            }
            $query = "call insert_clone_info('".$_SESSION["username"]."', '$this->label_name', '$this->label_layout_type', '$this->label_save_name')";
            $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            unset($result);
            unset($_SESSION["label_name"]);
            unset($_SESSION["image_upload_data"]);
            if (isset($uploaded_image_data)) {
                echo $uploaded_image_data;
                unset($uploaded_image_data);
            }else {
                echo "Text Mode Fields Only";
            }
            mysqli_close($GLOBALS["connect"]);
            return true;
        }

        public function save2() {
            $this->label_save_name = $_SESSION["label_save_name"];
            $this->label_layout_type = $_SESSION["label_layout_type"];
            $request = $_POST["request"];
            $data = explode(",", $request);
            foreach($data as $item) {
                $sub_data = explode("; ", $item);
                foreach($sub_data as $value) {
                    if (strpos($value, "LFN=") !== false) {
                        $field_name = strpos($value, "LFN=");
                        $this->label_field_name = substr($value, $field_name + 4);
                    }elseif (strpos($value, "LFV=") !== false) {
                        $field_value = strpos($value, "LFV=");
                        $this->label_field_value = str_replace("'", "^", substr($value, $field_value + 4));
                    }elseif (strpos($value, "LFF=") !== false) {
                        $field_face = strpos($value, "LFF=");
                        $this->label_field_face = substr($value, $field_face + 4);
                    }elseif (strpos($value, "LFS=") !== false) {
                        $field_size = strpos($value, "LFS=");
                        $this->label_field_size = substr($value, $field_size + 4);
                    }elseif (strpos($value, "LFC=") !== false) {
                        $field_color = strpos($value, "LFC=");
                        $this->label_field_color = substr($value, $field_color + 4);
                    }elseif (strpos($value, "LFA=") !== false) {
                        $field_alignment = strpos($value, "LFA=");
                        $this->label_field_alignment = substr($value, $field_alignment + 4);
                    }elseif (strpos($value, "LFI=") !== false) {
                        $field_style = strpos($value, "LFI=");
                        $this->label_field_style = substr($value, $field_style + 4);
                    }elseif (strpos($value, "LFH=") !== false) {
                        $field_line_height = strpos($value, "LFH=");
                        $this->label_field_height = substr($value, $field_line_height + 4);
                    }elseif (strpos($value, "LFG=") !== false) {
                        $field_image = strpos($value, "LFG=");
                        $this->label_field_graphic = substr($value, $field_image + 4);
                    }
                }
                if (isset($this->label_field_graphic)) {
                    $image_upload_data = explode(",", $_SESSION["image_upload_data"]);
                    foreach($image_upload_data as $package) {
                        if (stripos($package, $this->label_field_graphic) !== false) {
                            $data_items = explode("; ", $package);
                            foreach($data_items as $data_item) {
                                if (strpos($data_item, "LIN=") !== false) {
                                    $label_image_name = strpos($data_item, "LIN=");
                                    $this->label_field_image_name = substr($data_item, $label_image_name + 4);
                                }elseif (strpos($data_item, "LIW=") !== false) {
                                    $label_image_width = strpos($data_item, "LIW=");
                                    $this->label_field_image_width = intval(substr($data_item, $label_image_width + 4));
                                }elseif (strpos($data_item, "LIH=") !== false) {
                                    $label_image_height = strpos($data_item, "LIH=");
                                    $this->label_field_image_height = intval(substr($data_item, $label_image_height + 4));
                                }
                            }
                            if (!(isset($uploaded_image_data))) {
                                $uploaded_image_data = "LUN=".$_SESSION["username"]."; LFN=".$this->label_field_name."; LIN=".$this->label_field_image_name."; LIW=".$this->label_field_image_width."; LIH=".$this->label_field_image_height;
                            }else {
                                $uploaded_image_data .= ",LUN=".$_SESSION["username"]."; LFN=".$this->label_field_name."; LIN=".$this->label_field_image_name."; LIW=".$this->label_field_image_width."; LIH=".$this->label_field_image_height;
                            }
                            $query = "call update_saved_label_2('$this->label_field_value', '$this->label_field_face', '$this->label_field_size', '$this->label_field_color', '$this->label_field_alignment', '$this->label_field_style', '$this->label_field_height', '$this->label_field_image_name', $this->label_field_image_width, $this->label_field_image_height, '$this->label_field_name', '$this->label_save_name', '$this->label_layout_type', '".$_SESSION["username"]."')";
                            $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                        }else {
                            continue;
                        }
                    }
                    unset($this->label_field_graphic);
                }else {
                    $query = "call update_saved_label('$this->label_field_value', '$this->label_field_face', '$this->label_field_size', '$this->label_field_color', '$this->label_field_alignment', '$this->label_field_style', '$this->label_field_height', '$this->label_field_name', '$this->label_save_name', '$this->label_layout_type', '".$_SESSION["username"]."')";
                    $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                }
            }
            unset($result);
            unset($_SESSION["image_upload_data"]);
            if (isset($uploaded_image_data)) {
                echo $uploaded_image_data;
                unset($uploaded_image_data);
            }else {
                echo "Text Mode Fields Only";
            }
            mysqli_close($GLOBALS["connect"]);
            return true;
        }

    }

?>
