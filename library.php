<?php

    require("../classes/abstract_classes/abstract_library_class.php");

    class library_class extends abstract_library_class {

        public function library_class() {
             // Empty Constructor.....
        }

        public function get_saved_labels() {
            echo "<h2>My Library</h2>";
            echo "<div id = 'library_records'>";
                $this->get_labels();
            echo "</div>";
            echo "<img src = 'images/busy.gif' alt = 'Busy' id = 'busy' />";
            echo "<div id = 'additional_library_controls'>
                    <button type = 'button' id = 'delete' onclick = 'delete_saved_label()'>Delete</button>
                    <button type = 'button' id = 'empty_queue' onclick = 'empty_print_queue()'>Empty Queue</button>
                    <button type = 'button' id = 'toggle_queue' onclick = 'toggle_print_queue()'>Toggle Queue</button>
                </div>";
            echo "<div id = 'update_label_box'>
                        <label for = 'save_name'>Current Save Name:&nbsp;</label>
                        <input type = 'text' id = 'save_name' readonly = 'readonly' onfocus = 'loose_focus(this)' /><br />
                        <button type = 'button' id = 'preview_label_2' onclick = 'preview_label_2(this)'>Quick Preview</button>
                        <button type = 'button' id = 'update_label' onclick = 'check_save_name(this)'>Update Label</button><br />
                        <span id = 'save_error_messages'></span>
                        <span id = 'save_success_messages'></span>
                </div>";
            echo "<div id = 'image_uploader'>
                    <h3></h3>
                    <ol id = 'uploads_list'></ol>
                 </div>";
            echo "<div id = 'templates_previewer'></div>";
            echo "<div id = 'rename_label_box'>
                    <label for = 'new_name'>Enter New Name: </label>
                    <input type = 'text' id = 'new_name' />
                    <button type = 'button' id = 'enter' onclick = 'rename_saved_label(this)'>Enter</button>
                    <button type = 'button' id = 'close' onclick = 'rename_saved_label(this)'>Close</button>
                    <span id = 'rename_error_messages'></span>
                </div>";
            require("connect.php");
            echo "<div id = 'instructions'>
                        <h2>Instructions</h2>";
                        $query = "select customer_library_module_instructions from general_settings";
                        $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                        $row = mysqli_fetch_array($result);
                        mysqli_free_result($result);
            echo        "<p>".$row[0]."</p>";
            echo "</div>";
            echo "<button type = 'button' id = 'toggle_instructions' onclick = 'toggle_instructions(&quot;Templates&quot;)'>Toggle Instructions</button>";
            require("label_customizer.php");
            echo "<div id = 'print_queue'>
                    <h3>Print Queue</h3>
                    <table>
                        <thead>
                            <tr>
                                <th scope = 'col'>Label Template</th>
                                <th scope = 'col'>Template Layout</th>
                                <th scope = 'col'>Save Name</th>
                                <th scope = 'col'>Copies</th>
                                <th scope = 'col' colspan = '3'>Controls</th>
                            </tr>
                        </thead>
                        <tfoot></tfoot>
                        <tbody></tbody>
                    </table>
                 </div>";
            echo "<div id = 'meniature_pattern_display'>
                     <h3>Choose A Starting Cell</h3>
                     <div id = 'meniature_contents'></div>
                     <button type = 'button' id = 'cancel_meniature_display' onclick = 'cancel_meniature_display()'>Cancel</button>
                  </div>";
            unset($_SESSION["label_save_name"]);
            unset($_SESSION["label_layout_type"]);
            return true;
        }

        public function get_labels() {
            echo "<table id = 'library_records_table'>";
                echo "<thead>";
                    echo "<tr>";
                        echo "<th scope = 'col'><input type = 'checkbox' id = 'all_labels' value = '' onclick = 'select_all()' /></th>";
                        echo "<th scope = 'col'>Save Name</th>";
                        echo "<th scope = 'col'>Template Layout<br />
                                <select id = 'template_layouts_list' onchange = 'filter_by_template_layout()'>
                                    <option selected = 'selected' value = 'show_all'>Show All</option>";
                                    $query = "call get_filter_contents('".$_SESSION["username"]."', 'template_layouts')";
                                    $results = mysqli_query($GLOBALS["connect"], $query) or die(mysql_error());
                                    if (mysqli_num_rows($results) > 0) {
                                        while ($rows == mysqli_fetch_assoc($results)) {
                                            echo "<option value = '".$rows["layout_type"]."'>".$rows["layout_type"]."</option>";
                                        }
                                    }
                        echo    "</select>";
                        echo "</th>";
                        mysqli_free_result($results);
                        mysqli_close($GLOBALS["connect"]);
                        require("connect.php");
                        echo "<th scope = 'col'>Label Template<br />
                                <select id = 'label_templates_list' onchange = 'filter_by_label_template()'>
                                    <option selected = 'selected' value = 'show_all'>Show All</option>";
                                    $query = "call get_filter_contents('".$_SESSION["username"]."', 'label_templates')";
                                    $results = mysqli_query($GLOBALS["connect"], $query) or die(mysql_error());
                                    if (mysqli_num_rows($results) > 0) {
                                        while ($rows == mysqli_fetch_assoc($results)) {
                                            echo "<option value = '".$rows["label_name"]."'>".$rows["label_name"]."</option>";
                                        }
                                    }
                        echo    "</select>";
                        echo "</th>";
                        mysqli_free_result($results);
                        mysqli_close($GLOBALS["connect"]);
                        require("connect.php");
                        echo "<th scope = 'col' colspan = '5'>Controls</th>";
                    echo "</tr>";
                echo "</thead>";
                echo "<tbody>";
                $query = "call get_saved_labels('".$_SESSION["username"]."')";
                $results = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                if (mysqli_num_rows($results) > 0) {
                    while($rows = mysqli_fetch_assoc($results)) {
?>
                        <tr>
                            <td id = "<?php echo $rows["label_name"]; ?>, <?php echo $rows["layout_type"]; ?>, <?php echo $rows["save_name"]; ?>"><input type = "checkbox" name = "selected_label" value = "<?php echo $rows["save_name"]; ?>" onclick = "set_all_labels(this)" /></td>
                            <td><?php echo $rows["save_name"]; ?></td>
                            <td><?php echo $rows["layout_type"]; ?></td>
                            <td><?php echo $rows["label_name"]; ?></td>
                            <td><button type = "button" id = "preview_saved_label" onclick = "preview_saved_label('<?php echo $rows["save_name"]; ?>', '<?php echo $rows["layout_type"]; ?>', '<?php echo $rows["label_system_name"]; ?>')">Preview</button></td>
                            <td><button type = "button" id = "edit_saved_label" onclick = "edit_saved_label('<?php echo $rows["save_name"]; ?>', '<?php echo $rows["layout_type"]; ?>', '<?php echo $rows["layout_image_name"]; ?>', '<?php echo $rows["label_system_name"]; ?>')">Edit</button></td>
                            <td><button type = "button" id = "clone_saved_label" onclick = "clone_saved_label('<?php echo $rows["label_name"]; ?>', '<?php echo $rows["save_name"]; ?>', '<?php echo $rows["layout_type"]; ?>')">Clone</button></td>
                            <td><button type = "button" id = "rename_saved_label" onclick = "rename_saved_label(this, '<?php echo $rows["label_name"]; ?>', '<?php echo $rows["layout_type"]; ?>', '<?php echo $rows["save_name"]; ?>')">Rename</button></td>
                            <td><button type = "button" id = "add_to_print" onclick = "add_to_print('<?php echo $rows["label_name"]; ?>', '<?php echo $rows["layout_type"]; ?>', '<?php echo $rows["save_name"]; ?>')">Print</button></td>
                        </tr>
<?php
                    }
                }
                echo "</tbody>";
            echo "</table>";
            mysqli_free_result($results);
            mysqli_close($GLOBALS["connect"]);
            return true;
        }

        public function preview_saved_label() {
            $this->label_save_name = $_POST["label_save_name"];
            $this->label_layout_type = $_POST["label_layout_type"];
            $query = "call get_label_template_dimensions('$this->label_layout_type')";
            $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            mysqli_close($GLOBALS["connect"]);
            require("connect.php");
            $query = "call preview_saved_label('".$_SESSION["username"]."', '$this->label_save_name', '$this->label_layout_type')";
            $results = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            if ((mysqli_num_rows($result) > 0) && (mysqli_num_rows($results) > 0)) {
                $row = mysqli_fetch_array($result);
                echo "<div style = 'width:".$row["print_box_width"]."mm; height:".$row["print_box_height"]."mm;'>";
                    while($rows = mysqli_fetch_assoc($results)) {
                        $field_value = str_replace("~", ",", $rows["field_value"]);
                        $field_value = str_replace("^", "&#39;", $field_value);
                        $field_value = $this->date_time_processor($field_value);
                        if ($rows["field_type"] == "Single_line") {
                            if ($rows["text_style"] == "normal") {
                                echo "<input type = 'text' id = '".$rows["field_name"]."' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:normal; font-weight:normal; line-height:".$rows["line_height"]."; border-style:none; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px;' value = '".$field_value."' onfocus = 'loose_focus(this)' />";
                            }elseif ($rows["text_style"] == "italic") {
                                echo "<input type = 'text' id = '".$rows["field_name"]."' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:italic; font-weight:normal; line-height:".$rows["line_height"]."; border-style:none; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px;' value = '".$field_value."' onfocus = 'loose_focus(this)' />";
                            }elseif ($rows["text_style"] == "bold") {
                                echo "<input type = 'text' id = '".$rows["field_name"]."' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:normal; font-weight:bold; line-height:".$rows["line_height"]."; border-style:none; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px;' value = '".$field_value."' onfocus = 'loose_focus(this)' />";
                            }elseif ($rows["text_style"] == "both") {
                                echo "<input type = 'text' id = '".$rows["field_name"]."' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:italic; font-weight:bold; line-height:".$rows["line_height"]."; border-style:none; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px;' value = '".$field_value."' onfocus = 'loose_focus(this)' />";
                            }
                        }elseif ($rows["field_type"] == "Multi_line") {
                            if ($rows["text_style"] == "normal") {
                                echo "<textarea id = '".$rows["field_name"]."' wrap = 'hard' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:normal; font-weight:normal; line-height:".$rows["line_height"]."; border-style:none; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px;' onfocus = 'loose_focus(this)'>".$field_value."</textarea>";
                            }elseif ($rows["text_style"] == "italic") {
                                echo "<textarea id = '".$rows["field_name"]."' wrap = 'hard' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:italic; font-weight:normal; line-height:".$rows["line_height"]."; border-style:none; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px;' onfocus = 'loose_focus(this)'>".$field_value."</textarea>";
                            }elseif ($rows["text_style"] == "bold") {
                                echo "<textarea id = '".$rows["field_name"]."' wrap = 'hard' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:normal; font-weight:bold; line-height:".$rows["line_height"]."; border-style:none; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px;' onfocus = 'loose_focus(this)'>".$field_value."</textarea>";
                            }elseif ($rows["text_style"] == "both") {
                                echo "<textarea id = '".$rows["field_name"]."' wrap = 'hard' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:italic; font-weight:bold; line-height:".$rows["line_height"]."; border-style:none; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px;' onfocus = 'loose_focus(this)'>".$field_value."</textarea>";
                            }
                        }
                    }
                echo "</div>";
            }
            mysqli_free_result($result);
            mysqli_free_result($results);
            mysqli_close($GLOBALS["connect"]);
            return true;
        }

        public function label_customizer() {
            $this->label_layout_type = $_POST["label_layout_type"];
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

        public function edit_saved_label() {
            $this->label_save_name = $_POST["label_save_name"];
            $this->label_layout_type = $_POST["label_layout_type"];
            $query = "call get_label_template_dimensions('$this->label_layout_type')";
            $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            mysqli_close($GLOBALS["connect"]);
            require("connect.php");
            $query = "call preview_saved_label('".$_SESSION["username"]."', '$this->label_save_name', '$this->label_layout_type')";
            $results = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            if ((mysqli_num_rows($result) > 0) && (mysqli_num_rows($results) > 0)) {
                $row = mysqli_fetch_array($result);
                echo "<div style = 'width:".$row["print_box_width"]."mm; height:".$row["print_box_height"]."mm;'>";
                    while($rows = mysqli_fetch_assoc($results)) {
                        $field_value = str_replace("~", ",", $rows["field_value"]);
                        $field_value = str_replace("^", "&#39;", $field_value);
                        if ($rows["field_type"] == "Single_line") {
                            if ((empty($rows["image_name"])) && (empty($rows["image_width"])) && (empty($rows["image_height"]))) {
                                if ($rows["text_style"] == "normal") {
                                    echo "<input type = 'text' id = '".$rows["field_name"]."' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:normal; font-weight:normal; line-height:".$rows["line_height"]."; background:#FFFFFF; outline:dotted #629941;' value = '".$field_value."' onfocus = 'loose_focus_preview(this)' />";
                                }elseif ($rows["text_style"] == "italic") {
                                    echo "<input type = 'text' id = '".$rows["field_name"]."' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:italic; font-weight:normal; line-height:".$rows["line_height"]."; background:#FFFFFF; outline:dotted #629941;' value = '".$field_value."' onfocus = 'loose_focus_preview(this)' />";
                                }elseif ($rows["text_style"] == "bold") {
                                    echo "<input type = 'text' id = '".$rows["field_name"]."' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:normal; font-weight:bold; line-height:".$rows["line_height"]."; background:#FFFFFF; outline:dotted #629941;' value = '".$field_value."' onfocus = 'loose_focus_preview(this)' />";
                                }elseif ($rows["text_style"] == "both") {
                                    echo "<input type = 'text' id = '".$rows["field_name"]."' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:italic; font-weight:bold; line-height:".$rows["line_height"]."; background:#FFFFFF; outline:dotted #629941;' value = '".$field_value."' onfocus = 'loose_focus_preview(this)' />";
                                }
                            }else {
                                if ($rows["text_style"] == "normal") {
                                    echo "<input type = 'text' id = '".$rows["field_name"]."' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:normal; font-weight:normal; line-height:".$rows["line_height"]."; background:#FFFFFF url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px; outline:dotted #629941;' readonly = 'readonly' value = '".$field_value."' onfocus = 'loose_focus_preview(this)' />";
                                }elseif ($rows["text_style"] == "italic") {
                                    echo "<input type = 'text' id = '".$rows["field_name"]."' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:italic; font-weight:normal; line-height:".$rows["line_height"]."; background:#FFFFFF url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px; outline:dotted #629941;' readonly = 'readonly' value = '".$field_value."' onfocus = 'loose_focus_preview(this)' />";
                                }elseif ($rows["text_style"] == "bold") {
                                    echo "<input type = 'text' id = '".$rows["field_name"]."' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:normal; font-weight:bold; line-height:".$rows["line_height"]."; background:#FFFFFF url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px; outline:dotted #629941;' readonly = 'readonly' value = '".$field_value."' onfocus = 'loose_focus_preview(this)' />";
                                }elseif ($rows["text_style"] == "both") {
                                    echo "<input type = 'text' id = '".$rows["field_name"]."' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:italic; font-weight:bold; line-height:".$rows["line_height"]."; background:#FFFFFF url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px; outline:dotted #629941;' readonly = 'readonly' value = '".$field_value."' onfocus = 'loose_focus_preview(this)' />";
                                }
                            }
                        }elseif ($rows["field_type"] == "Multi_line") {
                            if ((empty($rows["image_name"])) && (empty($rows["image_width"])) && (empty($rows["image_height"]))) {
                                if ($rows["text_style"] == "normal") {
                                    echo "<textarea id = '".$rows["field_name"]."' wrap = 'hard' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:normal; font-weight:normal; line-height:".$rows["line_height"]."; background:#FFFFFF; outline:dotted #629941;' onfocus = 'loose_focus_preview(this)'>".$field_value."</textarea>";
                                }elseif ($rows["text_style"] == "italic") {
                                    echo "<textarea id = '".$rows["field_name"]."' wrap = 'hard' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:italic; font-weight:normal; line-height:".$rows["line_height"]."; background:#FFFFFF; outline:dotted #629941;' onfocus = 'loose_focus_preview(this)'>".$field_value."</textarea>";
                                }elseif ($rows["text_style"] == "bold") {
                                    echo "<textarea id = '".$rows["field_name"]."' wrap = 'hard' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:normal; font-weight:bold; line-height:".$rows["line_height"]."; background:#FFFFFF; outline:dotted #629941;' onfocus = 'loose_focus_preview(this)'>".$field_value."</textarea>";
                                }elseif ($rows["text_style"] == "both") {
                                    echo "<textarea id = '".$rows["field_name"]."' wrap = 'hard' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:italic; font-weight:bold; line-height:".$rows["line_height"]."; background:#FFFFFF; outline:dotted #629941;' onfocus = 'loose_focus_preview(this)'>".$field_value."</textarea>";
                                }
                            }else {
                                if ($rows["text_style"] == "normal") {
                                    echo "<textarea id = '".$rows["field_name"]."' wrap = 'hard' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:normal; font-weight:normal; line-height:".$rows["line_height"]."; background:#FFFFFF url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px; outline:dotted #629941;' readonly = 'readonly' onfocus = 'loose_focus_preview(this)'>".$field_value."</textarea>";
                                }elseif ($rows["text_style"] == "italic") {
                                    echo "<textarea id = '".$rows["field_name"]."' wrap = 'hard' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:italic; font-weight:normal; line-height:".$rows["line_height"]."; background:#FFFFFF url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px; outline:dotted #629941;' readonly = 'readonly' onfocus = 'loose_focus_preview(this)'>".$field_value."</textarea>";
                                }elseif ($rows["text_style"] == "bold") {
                                    echo "<textarea id = '".$rows["field_name"]."' wrap = 'hard' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:normal; font-weight:bold; line-height:".$rows["line_height"]."; background:#FFFFFF url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px; outline:dotted #629941;' readonly = 'readonly' onfocus = 'loose_focus_preview(this)'>".$field_value."</textarea>";
                                }elseif ($rows["text_style"] == "both") {
                                    echo "<textarea id = '".$rows["field_name"]."' wrap = 'hard' style = 'width:".$rows["width"]."mm; height:".$rows["height"]."mm; margin-top:".$rows["top_coordinate"]."mm; margin-left:".$rows["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows["font_face"])."; font-size:".$rows["font_size"]."; color:".str_replace("-", ",", $rows["text_color"])."; text-align:".$rows["text_alignment"]."; font-style:italic; font-weight:bold; line-height:".$rows["line_height"]."; background:#FFFFFF url(&quot;label_images/".$_SESSION["username"]."/".$rows["image_name"]."&quot;) no-repeat center center; background-size:".$rows["image_width"]."px ".$rows["image_height"]."px; outline:dotted #629941;' readonly = 'readonly' onfocus = 'loose_focus_preview(this)'>".$field_value."</textarea>";
                                }
                            }
                        }
                    }
                echo "</div>";
            }
            mysqli_free_result($result);
            mysqli_free_result($results);
            mysqli_close($GLOBALS["connect"]);
            $_SESSION["current_save_name"] = $this->label_save_name;
            $_SESSION["current_layout_type"] = $this->label_layout_type;
            return true;
        }

        public function update_saved_label() {
            $request = $_POST["request"];
            $data = explode(",", $request);
            foreach($data as $item) {
                $items = explode("; ", $item);
                foreach($items as $value) {
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
                            $query = "call edit_saved_label_2('$this->label_field_value', '$this->label_field_face', '$this->label_field_size', '$this->label_field_color', '$this->label_field_alignment', '$this->label_field_style', '$this->label_field_height', '$this->label_field_image_name', $this->label_field_image_width, $this->label_field_image_height, '$this->label_field_name', '".$_SESSION["current_save_name"]."', '".$_SESSION["current_layout_type"]."', '".$_SESSION["username"]."')";
                            $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                        }else {
                            continue;
                        }
                    }
                    unset($this->label_field_graphic);
                }else {
                    $query = "call edit_saved_label('$this->label_field_value', '$this->label_field_face', '$this->label_field_size', '$this->label_field_color', '$this->label_field_alignment', '$this->label_field_style', '$this->label_field_height', '$this->label_field_name', '".$_SESSION["current_save_name"]."', '".$_SESSION["current_layout_type"]."', '".$_SESSION["username"]."')";
                    $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                }
            }
            unset($result);
            mysqli_close($GLOBALS["connect"]);
            echo "Updated Successfully";
            return true;
        }

        public function clone_saved_label() {
            $this->label_name = $_POST["label_template_name"];
            $this->label_save_name = $_POST["label_save_name"];
            $this->label_layout_type = $_POST["label_layout_type"];
            $query = "select update_clone_info('$this->label_save_name', '$this->label_layout_type', '".$_SESSION["username"]."')";
            $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            $row = mysqli_fetch_array($result);
            $counter = $row[0];
            $query = "select check_clone_name('$this->label_save_name', ".$counter.", '".$_SESSION["username"]."')";
            $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            $row = mysqli_fetch_array($result);
            if ($row[0] != "") {
                do {
                    $counter = $counter + 1;
                    $query = "select check_clone_name('$this->label_save_name', ".$counter.", '".$_SESSION["username"]."')";
                    $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                    $row = mysqli_fetch_array($result);
                    if ($row[0] == "") {
                         break;
                    }
                }while($row[0] != "");
            }
            $query = "call clone_saved_label('$this->label_name', '$this->label_save_name', ".$counter.", '$this->label_layout_type', '".$_SESSION["username"]."')";
            $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            unset($result);
            mysqli_close($GLOBALS["connect"]);
            echo "Successfully Cloned";
            return true;
        }

        public function rename_saved_label() {
            $new_save_name = $_POST["new_save_name"];
            $current_save_name = $_POST["current_save_name"];
            $query = "select get_save_name('$new_save_name', '".$_SESSION["username"]."') as the_save_name";
            $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            $row = mysqli_fetch_array($result);
            if (empty($row[0])) {
                $query = "call rename_saved_label('$new_save_name', '$current_save_name', '".$_SESSION["username"]."')";
                $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                unset($result);
                echo "Updated Successfully";
            }else {
                mysqli_free_result($result);
                echo "Update Error";
            }
            mysqli_close($GLOBALS["connect"]);
            return true;
        }

        public function delete_saved_label() {
            $request = $_POST["request"];
            $data = explode(",", $request);
            foreach($data as $item) {
                $query = "select get_parent_name('$item', '".$_SESSION["username"]."')";
                $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
                $row = mysqli_fetch_array($result);
                $the_parent_name = $row[0];
                $query = "call delete_saved_label('$the_parent_name', '$item', '".$_SESSION["username"]."')";
                $result = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            }
            unset($result);
            mysqli_close($GLOBALS["connect"]);
            echo "Deleted Successfully";
            return true;
        }

        private static function time_offseter($arg1, $arg2) {
            $hours_offset_length = strpos($arg2, ",") - (strpos($arg2, "O=") + 2);
            $minutes_offset_length = strpos($arg2, "}") - (strpos($arg2, ",") + 1);
            $hours_offset = substr($arg2, strpos($arg2, "O=") + 2, $hours_offset_length);
            $minutes_offset = substr($arg2, strpos($arg2, ",") + 1, $minutes_offset_length);
            if (strpos($arg2, "12H") !== false) {
                $the_offset_time = strtotime((int)$hours_offset." hours");
                $the_offset_time = date("h:ia", strtotime((int)$minutes_offset." minutes", $the_offset_time));
                $arg1 = str_replace($arg2, $the_offset_time, $arg1);
            }elseif (strpos($arg2, "24H") !== false) {
                $the_offset_time = strtotime((int)$hours_offset." hours");
                $the_offset_time = date("H:i", strtotime((int)$minutes_offset." minutes", $the_offset_time));
                $arg1 = str_replace($arg2, $the_offset_time, $arg1);
            }
            return $arg1;
        }

        private static function date_offseter($arg1, $arg2) {
            $offset_length = strpos($arg2, "}") - (strpos($arg2, "O=") + 2);
            $days_offset = substr($arg2, strpos($arg2, "O=") + 2, $offset_length);
            if (substr($arg2, (strpos($arg2, "{") + 1), (strpos($arg2, "_") - (strpos($arg2, "{") + 1))) === "DD MONTH") {
                $the_offset_date = date("d M", strtotime($days_offset." days"));
                $arg1 = str_replace($arg2, $the_offset_date, $arg1);
            }elseif (substr($arg2, (strpos($arg2, "{") + 1), (strpos($arg2, "_") - (strpos($arg2, "{") + 1))) === "DD MONTH YY") {
                $the_offset_date = date("d M y", strtotime($days_offset." days"));
                $arg1 = str_replace($arg2, $the_offset_date, $arg1);
            }elseif (substr($arg2, (strpos($arg2, "{") + 1), (strpos($arg2, "_") - (strpos($arg2, "{") + 1))) === "DD/MM") {
                $the_offset_date = date("d/m", strtotime($days_offset." days"));
                $arg1 = str_replace($arg2, $the_offset_date, $arg1);
            }elseif (substr($arg2, (strpos($arg2, "{") + 1), (strpos($arg2, "_") - (strpos($arg2, "{") + 1))) === "DD/MM/YY") {
                $the_offset_date = date("d/m/y", strtotime($days_offset." days"));
                $arg1 = str_replace($arg2, $the_offset_date, $arg1);
            }elseif (substr($arg2, (strpos($arg2, "{") + 1), (strpos($arg2, "_") - (strpos($arg2, "{") + 1))) === "MM/DD") {
                $the_offset_date = date("m/d", strtotime($days_offset." days"));
                $arg1 = str_replace($arg2, $the_offset_date, $arg1);
            }elseif (substr($arg2, (strpos($arg2, "{") + 1), (strpos($arg2, "_") - (strpos($arg2, "{") + 1))) === "MM/DD/YY") {
                $the_offset_date = date("m/d/y", strtotime($days_offset." days"));
                $arg1 = str_replace($arg2, $the_offset_date, $arg1);
            }
            return $arg1;
        }

        public function date_time_processor($field_value) {
            if ((strpos($field_value, "{") !== false) && (!(strrpos($field_value, "{") > strpos($field_value, "{")))) {
                $length_of_chars = (strpos($field_value, "}") + 1) - strpos($field_value, "{");
                $current_format = substr($field_value, strpos($field_value, "{"), $length_of_chars);
                if ((strpos($current_format, "12H") !== false) || (strpos($current_format, "24H") !== false)) {
                    $field_value = self::time_offseter($field_value, $current_format);
                }else {
                    $field_value = self::date_offseter($field_value, $current_format);
                }
            }elseif ((strpos($field_value, "{") !== false) && (strrpos($field_value, "{") > strpos($field_value, "{"))) {
                $length_of_chars = (strpos($field_value, "}") + 1) - strpos($field_value, "{");
                $date_format = substr($field_value, strpos($field_value, "{"), $length_of_chars);
                $length_of_chars = (strrpos($field_value, "}") + 1) - strrpos($field_value, "{");
                $time_format = substr($field_value, strrpos($field_value, "{"), $length_of_chars);
                $field_value = self::date_offseter($field_value, $date_format);
                $field_value = self::time_offseter($field_value, $time_format);
            }
            return $field_value;
        }

        public function start_print_process() {
            $counter = 0;
            $this->label_name = $_POST["label_template"];
            $this->label_layout_type = $_POST["template_layout"];
            $this->label_save_name = $_POST["save_name"];
            $number_of_copies = $_POST["number_of_copies"];
            $query = "call get_label_meniature_print_settings('$this->label_name')";
            $results = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            if (mysqli_num_rows($results) > 0) {
                while($rows = mysqli_fetch_assoc($results)) {
                    $counter++;
                    echo "<a id = '".$rows["box_name"]."' style = 'margin-top:".$rows["meniature_print_top_coordinate"]."px; margin-left:".$rows["meniature_print_left_coordinate"]."px;' onclick = 'begin_print(this)'>".$counter."</a>";
                }
            }
            $_SESSION["label_name"] = $this->label_name;
            $_SESSION["label_layout_type"] = $this->label_layout_type;
            $_SESSION["label_save_name"] = $this->label_save_name;
            $_SESSION["label_number_of_copies"] = $number_of_copies;
            mysqli_free_result($results);
            mysqli_close($GLOBALS["connect"]);
            return true;
        }

        public function print_saved_label() {
            $starting_cell = $_POST["starting_cell"];
            $counter = 0;
            $copies = 0;
            $query1 = "call get_label_print_box_settings('".$_SESSION["label_name"]."')";
            $results1 = mysqli_query($GLOBALS["connect"], $query1) or die(mysqli_error());
            mysqli_close($GLOBALS["connect"]);
            require("connect.php");
            $query2 = "call get_saved_label_fields('".$_SESSION["username"]."', '".$_SESSION["label_name"]."', '".$_SESSION["label_layout_type"]."', '".$_SESSION["label_save_name"]."')";
            $results2 = mysqli_query($GLOBALS["connect"], $query2) or die(mysqli_error());
            while($rows1 = mysqli_fetch_assoc($results1)) {
                $counter++;
                if ($counter == 1) {
                    echo "<div id = 'parent_container' style = 'position:relative; top:0mm; left:0mm; margin:0mm; width:210mm; height:297mm;'>";
                }
                echo "<div id = '".$rows1["the_box_name"]."' style = 'position:absolute; top:0mm; left:0mm; width:".$rows1["print_box_width"]."mm; height:".$rows1["print_box_height"]."mm; margin-top:".$rows1["print_top_coordinate"]."mm; margin-left:".$rows1["print_left_coordinate"]."mm;'>";
                    if ($counter >= $starting_cell) {
                        while($rows2 = mysqli_fetch_assoc($results2)) {
                            $field_value = str_replace("~", ",", $rows2["field_value"]);
                            $field_value = str_replace("^", "&#39;", $field_value);
                            $field_value = $this->date_time_processor($field_value);
                            if ($rows2["field_type"] == "Single_line") {
                                if ($rows2["text_style"] == "normal") {
                                    echo "<input type = 'text' id = '".$rows2["field_name"]."' style = 'position:absolute; border:0px none transparent; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:normal; font-weight:normal; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' value = '".$field_value."' onfocus = 'loose_focus(this)' />";
                                }elseif ($rows2["text_style"] == "italic") {
                                    echo "<input type = 'text' id = '".$rows2["field_name"]."' style = 'position:absolute; border:0px none transparent; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:italic; font-weight:normal; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' value = '".$field_value."' onfocus = 'loose_focus(this)' />";
                                }elseif ($rows2["text_style"] == "bold") {
                                    echo "<input type = 'text' id = '".$rows2["field_name"]."' style = 'position:absolute; border:0px none transparent; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:normal; font-weight:bold; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' value = '".$field_value."' onfocus = 'loose_focus(this)' />";
                                }elseif ($rows2["text_style"] == "both") {
                                    echo "<input type = 'text' id = '".$rows2["field_name"]."' style = 'position:absolute; border:0px none transparent; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:italic; font-weight:bold; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' value = '".$field_value."' onfocus = 'loose_focus(this)' />";
                                }
                            }elseif ($rows2["field_type"] == "Multi_line") {
                                if ($rows2["text_style"] == "normal") {
                                    echo "<textarea id = '".$rows2["field_name"]."' wrap = 'hard' style = 'position:absolute; border:0px none transparent; resize:none; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:normal; font-weight:normal; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' onfocus = 'loose_focus(this)'>".$field_value."</textarea>";
                                }elseif ($rows2["text_style"] == "italic") {
                                    echo "<textarea id = '".$rows2["field_name"]."' wrap = 'hard' style = 'position:absolute; border:0px none transparent; resize:none; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:italic; font-weight:normal; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' onfocus = 'loose_focus(this)'>".$field_value."</textarea>";
                                }elseif ($rows2["text_style"] == "bold") {
                                    echo "<textarea id = '".$rows2["field_name"]."' wrap = 'hard' style = 'position:absolute; border:0px none transparent; resize:none; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:normal; font-weight:bold; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' onfocus = 'loose_focus(this)'>".$field_value."</textarea>";
                                }elseif ($rows2["text_style"] == "both") {
                                    echo "<textarea id = '".$rows2["field_name"]."' wrap = 'hard' style = 'position:absolute; border:0px none transparent; resize:none; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:italic; font-weight:bold; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' onfocus = 'loose_focus(this)'>".$field_value."</textarea>";
                                }
                            }
                        }
                        $copies++;
                        mysqli_data_seek($results2, 0);
                    }
                echo "</div>";
                if ($copies == $_SESSION["label_number_of_copies"]) {
                    echo "</div>";
                    break;
                }elseif (($counter == mysqli_num_rows($results1)) && ($copies < $_SESSION["label_number_of_copies"])) {
                    echo "</div>";
                    $counter = 0;
                    $starting_cell = 1;
                    mysqli_data_seek($results1, 0);
                }
            }
            mysqli_free_result($results1);
            mysqli_free_result($results2);
            mysqli_close($GLOBALS["connect"]);
            return true;
        }

        public function start_batch_print_process() {
            $counter = 0;
            $this->label_name = $_POST["batch_label_template"];
            $query = "call get_label_meniature_print_settings('$this->label_name')";
            $results = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            if (mysqli_num_rows($results) > 0) {
                while($rows = mysqli_fetch_assoc($results)) {
                    $counter++;
                    echo "<a id = '".$rows["box_name"]."' style = 'margin-top:".$rows["meniature_print_top_coordinate"]."px; margin-left:".$rows["meniature_print_left_coordinate"]."px;' onclick = 'begin_batch_print(this)'>".$counter."</a>";
                }
            }
            $_SESSION["label_name"] = $this->label_name;
            mysqli_free_result($results);
            mysqli_close($GLOBALS["connect"]);
            return true;
        }

        public function begin_batch_print_process() {
            $counter = 0;
            $copies = 0;
            $starting_cell = $_POST["starting_cell"];
            $batch_label_entries = $_POST["batch_label_entries"];
            $query1 = "call get_label_print_box_settings('".$_SESSION["label_name"]."')";
            $results1 = mysqli_query($GLOBALS["connect"], $query1) or die(mysqli_error());
            mysqli_close($GLOBALS["connect"]);
            $batch_label_entry_items = explode(",", $batch_label_entries);
            foreach ($batch_label_entry_items as $batch_entry) {
                require("connect.php");
                $data_items = explode("; ", $batch_entry);
                foreach ($data_items as $item) {
                    if (strpos($item, "LTL=") !== false) {
                        $the_template_layout = strpos($item, "LTL=");
                        $this->label_template_layout = substr($item, $the_template_layout + 4);
                    }elseif (strpos($item, "LSN=") !== false) {
                        $the_save_name = strpos($item, "LSN=");
                        $this->label_save_name = substr($item, $the_save_name + 4);
                    }elseif (strpos($item, "LNC=") !== false) {
                        $number_of_copies = strpos($item, "LNC=");
                        $label_number_of_copies = substr($item, $number_of_copies + 4);
                    }
                }
                $query2 = "call get_saved_label_fields('".$_SESSION["username"]."', '".$_SESSION["label_name"]."', '$this->label_template_layout', '$this->label_save_name')";
                $results2 = mysqli_query($GLOBALS["connect"], $query2) or die(mysqli_error());
                mysqli_close($GLOBALS["connect"]);
                while($rows1 = mysqli_fetch_assoc($results1)) {
                    $counter++;
                    if ($counter == 1) {
                        echo "<div id = 'parent_container' style = 'position:relative; top:0mm; left:0mm; margin:0mm; width:210mm; height:297mm;'>";
                    }
                    echo "<div id = '".$rows1["the_box_name"]."' style = ' position:absolute; top:0mm; left:0mm; width:".$rows1["print_box_width"]."mm; height:".$rows1["print_box_height"]."mm; margin-top:".$rows1["print_top_coordinate"]."mm; margin-left:".$rows1["print_left_coordinate"]."mm;'>";
                        if ($counter >= $starting_cell) {
                            while($rows2 = mysqli_fetch_assoc($results2)) {
                                $field_value = str_replace("~", ",", $rows2["field_value"]);
                                $field_value = str_replace("^", "&#39;", $field_value);
                                $field_value = $this->date_time_processor($field_value);
                                if ($rows2["field_type"] == "Single_line") {
                                    if ($rows2["text_style"] == "normal") {
                                        echo "<input type = 'text' id = '".$rows2["field_name"]."' style = 'position:absolute; border:0px none transparent; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:normal; font-weight:normal; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' value = '".$field_value."' onfocus = 'loose_focus(this)' />";
                                    }elseif ($rows2["text_style"] == "italic") {
                                        echo "<input type = 'text' id = '".$rows2["field_name"]."' style = 'position:absolute; border:0px none transparent; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:italic; font-weight:normal; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' value = '".$field_value."' onfocus = 'loose_focus(this)' />";
                                    }elseif ($rows2["text_style"] == "bold") {
                                        echo "<input type = 'text' id = '".$rows2["field_name"]."' style = 'position:absolute; border:0px none transparent; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:normal; font-weight:bold; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' value = '".$field_value."' onfocus = 'loose_focus(this)' />";
                                    }elseif ($rows2["text_style"] == "both") {
                                        echo "<input type = 'text' id = '".$rows2["field_name"]."' style = 'position:absolute; border:0px none transparent; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:italic; font-weight:bold; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' value = '".$field_value."' onfocus = 'loose_focus(this)' />";
                                    }
                                }elseif ($rows2["field_type"] == "Multi_line") {
                                    if ($rows2["text_style"] == "normal") {
                                        echo "<textarea id = '".$rows2["field_name"]."' wrap = 'hard' style = 'position:absolute; border:0px none transparent; resize:none; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:normal; font-weight:normal; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' onfocus = 'loose_focus(this)'>".$field_value."</textarea>";
                                    }elseif ($rows2["text_style"] == "italic") {
                                        echo "<textarea id = '".$rows2["field_name"]."' wrap = 'hard' style = 'position:absolute; border:0px none transparent; resize:none; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:italic; font-weight:normal; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' onfocus = 'loose_focus(this)'>".$field_value."</textarea>";
                                    }elseif ($rows2["text_style"] == "bold") {
                                        echo "<textarea id = '".$rows2["field_name"]."' wrap = 'hard' style = 'position:absolute; border:0px none transparent; resize:none; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:normal; font-weight:bold; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' onfocus = 'loose_focus(this)'>".$field_value."</textarea>";
                                    }elseif ($rows2["text_style"] == "both") {
                                        echo "<textarea id = '".$rows2["field_name"]."' wrap = 'hard' style = 'position:absolute; border:0px none transparent; resize:none; overflow:hidden; width:".$rows2["width"]."mm; height:".$rows2["height"]."mm; margin-top:".$rows2["top_coordinate"]."mm; margin-left:".$rows2["left_coordinate"]."mm; font-family:".str_replace("_", " ", $rows2["font_face"])."; font-size:".$rows2["font_size"]."; color:".str_replace("-", ",", $rows2["text_color"])."; text-align:".$rows2["text_alignment"]."; font-style:italic; font-weight:bold; line-height:".$rows2["line_height"]."; background:transparent url(&quot;label_images/".$_SESSION["username"]."/".$rows2["image_name"]."&quot;) no-repeat center center; background-size:".$rows2["image_width"]."px ".$rows2["image_height"]."px;' onfocus = 'loose_focus(this)'>".$field_value."</textarea>";
                                    }
                                }
                            }
                            $copies++;
                            mysqli_data_seek($results2, 0);
                        }
                    echo "</div>";
                    if (($counter != mysqli_num_rows($results1)) && ($copies == $label_number_of_copies)) {
                        $copies = 0;
                        break;
                    }elseif (($counter == mysqli_num_rows($results1)) && ($copies == $label_number_of_copies)) {
                        echo "</div>";
                        $counter = 0;
                        $starting_cell = 1;
                        $copies = 0;
                        mysqli_data_seek($results1, 0);
                        break;
                    }elseif (($counter == mysqli_num_rows($results1)) && ($copies < $label_number_of_copies)) {
                        echo "</div>";
                        $counter = 0;
                        $starting_cell = 1;
                        mysqli_data_seek($results1, 0);
                    }
                }
            }
            mysqli_free_result($results1);
            mysqli_free_result($results2);
            return true;
        }

        public function filter_library_content() {
            if (isset($_POST["filter_template_layouts"])) {
                $template_layouts_list_value = $_POST["template_layouts_list_value"];
                $query = "call filter_library_content('".$_SESSION["username"]."', '$template_layouts_list_value', 'template_layouts')";
                $results = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            }elseif (isset($_POST["filter_label_templates"])) {
                $label_templates_list_value = $_POST["label_templates_list_value"];
                $query = "call filter_library_content('".$_SESSION["username"]."', '$label_templates_list_value', 'label_templates')";
                $results = mysqli_query($GLOBALS["connect"], $query) or die(mysqli_error());
            }
            if (mysqli_num_rows($results) > 0) {
                while ($rows = mysqli_fetch_assoc($results)) {
?>
                    <tr>
                        <td id = "<?php echo $rows["label_name"]; ?>, <?php echo $rows["layout_type"]; ?>, <?php echo $rows["save_name"]; ?>"><input type = "checkbox" name = "selected_label" value = "<?php echo $rows["save_name"]; ?>" onclick = "set_all_labels(this)" /></td>
                        <td><?php echo $rows["save_name"]; ?></td>
                        <td><?php echo $rows["layout_type"]; ?></td>
                        <td><?php echo $rows["label_name"]; ?></td>
                        <td><button type = "button" id = "preview_saved_label" onclick = "preview_saved_label('<?php echo $rows["save_name"]; ?>', '<?php echo $rows["layout_type"]; ?>', '<?php echo $rows["label_system_name"]; ?>')">Preview</button></td>
                        <td><button type = "button" id = "edit_saved_label" onclick = "edit_saved_label('<?php echo $rows["save_name"]; ?>', '<?php echo $rows["layout_type"]; ?>', '<?php echo $rows["layout_image_name"]; ?>')">Edit</button></td>
                        <td><button type = "button" id = "clone_saved_label" onclick = "clone_saved_label('<?php echo $rows["save_name"]; ?>', '<?php echo $rows["layout_type"]; ?>')">Clone</button></td>
                        <td><button type = "button" id = "rename_saved_label" onclick = "rename_saved_label(this, '<?php echo $rows["label_name"]; ?>', '<?php echo $rows["layout_type"]; ?>', '<?php echo $rows["save_name"]; ?>')">Rename</button></td>
                        <td><button type = "button" id = "add_to_print" onclick = "add_to_print('<?php echo $rows["label_name"]; ?>', '<?php echo $rows["layout_type"]; ?>', '<?php echo $rows["save_name"]; ?>')">Print</button></td>
                    </tr>
<?php

                }
            }
            mysqli_free_result($results);
            mysqli_close($GLOBALS["connect"]);
            return true;
        }

    }

?>
