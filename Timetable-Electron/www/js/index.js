const main = require('electron').remote.require('./main'); //acess export functions in main
const { dialog } = require('electron').remote;
const path = require('path'); //path to necessary files
const fs = require('fs');
const fse = require('fs-extra');

window.addEventListener('load', function () { //window loads
    console.warn('Running from:', process.resourcesPath)
    const loader = document.getElementById('loadprogress');
    if (localStorage.getItem(config.configlocation)) {
        config.load()
    } else {
        config.validate()
    }
    loader.style.width = '25%'
    UI.initalize()
    loader.style.width = '50%'
    table.initialize()
    loader.style.width = '75%'
    manage.initalize()
    loader.style.width = '100%'
    config.properties.startup = false
    setTimeout(() => {
        UI.navigate.TABLE()
        console.log('Closing loading screen...')
        document.getElementById('Loading').style.display = 'none'
    }, 50)

})

/*  Config file handler    */
let config = {
    data: {
        key: "TT01",
        theme: "timebased", //sets theme, defaults to time based
        themetimes: {
            sunrise: "",
            sunset: ""
        },
        backgroundimg: null,
        hilight_engine: false, //hilight engine whether to run or not
        animation: true,
        tiles: true,
        empty_rows: false,
        notification_type: 3,
        table_selected: 1,
        always_on_top: false,
        table_details: [ // Details about different tables
            {
                purpose: "table #1",
                deleted: false,
                identifier: 1
            },
            /*{ purpose: "table #2", deleted: false, identifier: 2 },
            { purpose: "table #3", deleted: false, identifier: 3 },
            { purpose: "table #4", deleted: false, identifier: 4 }*/
        ],
        table1_db: [ // Table database

            /*{ show: 4, day: 1, name: "Test 1", Lecturer: "placeholder", room: "none", course_code: "test data", type: "test data", color: { hue: 0, sat: 100, light: 50 }, start: 0.0, end: 1.0 },
            { show: 4, day: 2, name: "Test 2", Lecturer: "placeholder", room: "none", course_code: "test data", type: "test data", color: { hue: 50, sat: 100, light: 50 }, start: 11.62, end: 14.57 },
            { show: 4, day: 3, name: "Test 3", Lecturer: "placeholder", room: "none", course_code: "test data", type: "test data", color: { hue: 100, sat: 100, light: 50 }, start: 8.5, end: 10.76 },
            { show: 4, day: 4, name: "Test 4", Lecturer: "placeholder", room: "none", course_code: "test data", type: "test data", color: { hue: 150, sat: 100, light: 50 }, start: 1.32, end: 4.0 },
            { show: 4, day: 5, name: "Test 5", Lecturer: "placeholder", room: "none", course_code: "test data", type: "test data", color: { hue: 200, sat: 100, light: 50 }, start: 2.0, end: 4.0 },
            { show: 4, day: 6, name: "Test 6", Lecturer: "placeholder", room: "none", course_code: "test data", type: "test data", color: { hue: 250, sat: 100, light: 50 }, start: 4.0, end: 5.4 },
            { show: 4, day: 7, name: "Test 7", Lecturer: "placeholder", room: "none", course_code: "test data", type: "test data", color: { hue: 300, sat: 100, light: 50 }, start: 6.0, end: 7.7 },
            { show: 3, day: 7, name: "Test 8", Lecturer: "placeholder", room: "none", course_code: "test data", type: "test data", color: { hue: 300, sat: 0, light: 50 }, start: 7.0, end: 8.7 },
            { show: 2, day: 7, name: "Test 9", Lecturer: "placeholder", room: "none", course_code: "test data", type: "test data", color: { hue: 300, sat: 0, light: 50 }, start: 8.0, end: 9.7 },
            { show: 1, day: 7, name: "Test 10", Lecturer: "placeholder", room: "none", course_code: "test data", type: "test data", color: { hue: 300, sat: 0, light: 50 }, start: 9.0, end: 10.7 },*/
        ],
        previous_colors: [],
    },
    baseconfig: {
        use_alt_storage: false,
        alt_location: "",
    },
    properties: {
        tempdata: false,
        monday: false,
        tuesday: false,
        wednsday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
        changed: false,
        max: 0,
        min: 24, //Swapped because big brain, big big brain
        overwrite: null,
        called_from_plus: false,
        view: "", //defaults to table
        exit: false,
        startup: true,
        colors_changed: true, //re-render color pannel when this is true
        clocking: false, // is clock ticking
        management: false,
    },
    configlocation: "TT001_cfg", //not strict, can be anything. Think of it as a file name/path
    save: async function () { //Save the config file
        console.trace('Save function Triggered')
        if (config.baseconfig.use_alt_storage == true) {
            //save to alternate storage location
            fse.ensureDirSync(config.baseconfig.alt_location.toString()) //endure the directory exists
            //fse.ensureFileSync(config.baseconfig.alt_location.toString() + "/Timetableconfig.json")//Ensure the file exists
            fs.writeFile(config.baseconfig.alt_location.toString() + "/Timetableconfig.json", JSON.stringify(config.data), 'utf8', function (err) { // acync incase drive being writen to is garbage
                if (err) {
                    alert('File could not be saved to: ' + config.baseconfig.alt_location.toString() + "/Timetableconfig.json" + err.message);
                } else {
                    console.log('config saved to: ' + config.baseconfig.alt_location.toString())
                }
            })

        } else {
            console.log('config saved to application storage')
        }
        localStorage.setItem(this.configlocation, JSON.stringify(this.data))
        console.table(this.data)
    },
    load: function () { //Load the config file into memory
        console.trace('Configuration load triggered')

        if (localStorage.getItem("TT01_baseconfig")) { //load base_config firt
            config.baseconfig = JSON.parse(localStorage.getItem("TT01_baseconfig"))
        } else {
            //first startup
            localStorage.setItem("TT01_baseconfig", JSON.stringify(config.baseconfig))
        }

        if (config.baseconfig.use_alt_storage == true) {
            //load from alternate storage location
            if (fs.existsSync(config.baseconfig.alt_location.toString() + "/Timetableconfig.json")) { //Directory exists
                var fileout = fs.readFileSync(config.baseconfig.alt_location.toString() + "/Timetableconfig.json", {
                    encoding: 'utf8'
                }, (ctx) => {
                    console.error('The file directory was not found, ', ctx);
                });
                console.log('config Loaded from: ' + config.baseconfig.alt_location.toString())
                console.warn('Data from fs read operation: ', fileout)
                fileout = JSON.parse(fileout)
                if (fileout.key == "TT01") {
                    config.data = fileout;
                    console.warn('configuration applied from file')
                } else {
                    console.warn('The file is not a config file, internal configuration will be used')
                    this.data = JSON.parse(localStorage.getItem(this.configlocation))
                }
            } else { //file does not exist, was moved, deleted or is inaccesible
                this.data = JSON.parse(localStorage.getItem(this.configlocation))
                config.save() //save to recreate the file
            }
        } else {
            //load from application storage
            this.data = JSON.parse(localStorage.getItem(this.configlocation))
            console.log('config Loaded from application storage')
        }

        console.table(this.data)
        this.validate()
    },
    selectlocation: function () {
        var path = dialog.showOpenDialogSync({
            properties: ['createDirectory', 'openDirectory'],
            /* defaultPath: config.baseconfig.alt_location*/
        })
        if (path != undefined) {
            console.log('Alternate configuration path :', path)
            config.baseconfig.use_alt_storage = true
            config.baseconfig.alt_location = path
            localStorage.setItem("TT01_baseconfig", JSON.stringify(config.baseconfig)) //save base config
            var fileout = fs.readFileSync(config.baseconfig.alt_location + "/Timetableconfig.json", {
                encoding: 'utf8'
            });
            if (fileout != undefined) {
                fileout = JSON.parse(fileout)
                if (fileout.key == "TT01") {
                    console.warn('A file exists here, prompt the user on what to keep, default is currently whats in the file')
                    config.properties.changed = true
                    config.data = fileout
                    manage.initalize()
                    UI.initalize()
                    config.save()
                } else {
                    console.warn('No file exists here, config from this app is used')
                    config.save() //to create the file
                }
            } else {
                console.warn('No file exists here, config from this app is used')
                config.save() //to create the file
            }
        } else {
            notify.new('Error', 'no folder selected, click to try again', function () {
                config.selectlocation()
            })
        }
    },
    usedefault: function () { //use default config location
        config.baseconfig.use_alt_storage = false
        localStorage.setItem("TT01_baseconfig", JSON.stringify(config.baseconfig)) //save base config
        document.getElementById('pathrepresenter').value = "application storage"
    },
    validate: function () { //validate configuration file
        console.log('Config is being validated')
        let configisvalid = true
        if (typeof (this.data.always_on_top) !== 'undefined') {
            if (this.data.always_on_top == undefined || null) { //check db existance
                this.data.always_on_top = false;
                configisvalid = false;
                console.log('"always_on_top" was found to be invalid and was set to default');
            }
        } else {
            this.data.always_on_top = false;
            configisvalid = false;
            console.log('"always_on_top" was found to not exist and was set to default');
        }

        if (typeof (this.data.table1_db) !== 'undefined') {
            if (this.data.table1_db == undefined || null) { //check db existance
                this.data.table1_db = []
                configisvalid = false
                console.log('"Table1_database" was found to be invalid and was set to default')
            } else {
                let i = 0
                let overwrite = []
                let deleted = []
                let detetioncheck = false
                //Construct the data
                while (config.data.table1_db[i] != null || undefined) {
                    console.log('checked state on :', i)
                    if (config.data.table1_db[i].deleted) {
                        deleted.push(config.data.table1_db[i])
                        console.log('State of ', i, ' false')
                        detetioncheck = true
                    } else {
                        overwrite.push(config.data.table1_db[i])
                        console.log('State of ', i, ' true')
                    }
                    i++
                }
                if (detetioncheck) {
                    console.table(deleted)
                    config.data.table1_db = overwrite
                }
            }
        } else {
            this.data.table1_db = [];
            configisvalid = false;
            console.log('"Table1_database" was found to not exist and was set to default');
        }

        if (typeof (this.data.table_details) == 'undefined') {
            this.data.table_details = [{
                purpose: "table #1",
                deleted: false,
                identifier: 1
            }];
            console.log('Table names were not defined!');
            configisvalid = false;
        } else { //Remove deleted Items from the array
            let i = 0
            let overwrite = []
            let deleted = []
            let detetioncheck = false
            //Construct the data
            while (config.data.table_details[i] != null || undefined) {
                console.log('checked state on :', i)
                if (config.data.table_details[i].deleted == true) {
                    deleted.push(config.data.table_details[i])
                    console.log('State of ', i, ' false')
                    detetioncheck = true
                } else {
                    overwrite.push(config.data.table_details[i])
                    console.log('State of ', i, ' true')
                }
                i++
            }
            if (detetioncheck) {
                console.table(deleted)
                config.data.table_details = overwrite;
            }
        }

        if (typeof (this.data.previous_colors) !== 'undefined') {
            if (this.data.previous_colors == undefined || null) { //check db existance
                this.data.previous_colors = [];
                configisvalid = false;
                console.log('"previous_colors" was found to be invalid and was set to default');
            }
        } else {
            this.data.previous_colors = [];
            configisvalid = false;
            console.log('"previous_colors" was found to not exist and was set to default');
        }

        if (typeof (this.data.theme) == 'undefined') {
            this.data.theme = "dark";
            configisvalid = false;
            console.log('"theme" was found to not exist and was set to default');
        } else {
            if (this.data.theme == undefined || null) {
                this.data.theme = "dark";
                configisvalid = false;
                console.log('"theme" was found to not exist and was set to default');
            }
        }

        if (typeof (this.data.hilight_engine) == 'undefined') {
            this.data.hilight_engine = true;
            configisvalid = false;
            console.log('"hilight_engine" was found to be invalid and was set to default');
        } else {
            if (this.data.hilight_engine != true && this.data.hilight_engine != false) {
                this.data.hilight_engine = true;
                configisvalid = false;
                console.log('"hilight_engine" was found to not exist and was set to default');
            }
        }

        if (typeof (this.data.empty_rows) == 'undefined') {
            this.data.empty_rows = true;
            configisvalid = false;
            console.log('"empty_rows" was found to be invalid and was set to default');
        } else {
            if (this.data.empty_rows != true && this.data.empty_rows != false) {
                this.data.empty_rows = true;
                configisvalid = false;
                console.log('"empty_rows" was found to not exist and was set to default');
            }
        }

        if (typeof (this.data.animation) == 'undefined') {
            this.data.animation = true;
            configisvalid = false;
            console.log('"animation" was found to be invalid and was set to default');
        } else {
            if (this.data.animation != true && this.data.animation != false) {
                this.data.animation = true;
                configisvalid = false;
                console.log('"animation" was found to not exist and was set to default');
            }
        }

        if (typeof (this.data.tiles) == 'undefined') {
            this.data.tiles = false;
            configisvalid = false;
            console.log('"tiles" was found to be invalid and was set to default');
        } else {
            if (this.data.tiles != true && this.data.tiles != false) {
                this.data.tiles = false;
                configisvalid = false;
                console.log('"tiles" was found to not exist and was set to default');
            }
        }

        if (typeof (this.data.notification_type) == 'undefined') {
            this.data.notification_type = 3;
            configisvalid = false;
            console.log('"notification_type" was found to be invalid and was set to default');
        } else {
            if (this.data.notification_type != 1 && this.data.notification_type != 2 && this.data.notification_type != 3 && this.data.notification_type != 4) {
                this.data.notification_type = 3;
                configisvalid = false;
                console.log('"notification_type" was found to not exist and was set to default');
            }
        }

        if (typeof (this.data.previous_colors) == 'undefined') {
            this.data.previous_colors = [];
            console.log('previous_colors were not defined!');
            configisvalid = false;
        } else {
            config.data.previous_colors = Array.from(new Set(config.data.previous_colors)); //remove dublicates; vary comblicated (Sets dont allow duplicates, convert array to new set using "new Set()" then back to array using "Array.from()"")
            //limit to 25
            if (config.data.previous_colors.length > 25) {
                var i = 22; //because reasons
                while (config.data.previous_colors[i] != null || undefined) { //check check check
                    console.error('Removed recent color :', config.data.previous_colors.pop()) //for debugging
                    i++;
                }
            }
        }

        if (!configisvalid) {
            console.log('config was found to be invalid and will be overwritten');
            config.save(); //Save new confog because old config is no longer valid
        } else {
            console.log('config was found to be valid');
        }
    },
    delete: function () { //Does not delete the file itself. Just sets it to empty
        localStorage.clear(this.configlocation)
        localStorage.clear("TT01_baseconfig")
        console.warn('config deleted: ');
        //overwite the file if any file exists
        notify.new('Attention', 'Configuration deleted');
        setTimeout(() => {
            location.reload()
        }, 2000);
        //this.validate();
    },
    backup: function () { //backup configuration to file
        console.log('Configuration backup initiated')
        var date = new Date();
        var filepath = dialog.showSaveDialogSync({
            defaultPath: "Timetable backup " + Number(date.getMonth() + 1) + " - " + date.getDate() + " - " + date.getFullYear() + ".json",
            buttonLabel: "Save"
        });
        if (filepath == undefined) { //the file save dialogue was canceled my the user
            console.warn('The file dialogue was canceled by the user')
        } else {
            fs.writeFile(filepath, JSON.stringify(config.data), (error) => {
                if (error) {
                    alert("An error occurred creating the file " + err.message)
                } else {
                    console.log("The file has been successfully saved");
                    notify.new('Sucess', 'Saved to: ' + filepath.toString(), function () {
                        event.preventDefault();
                        let link = filepath.toString()
                        require("electron").shell.openExternal(link);
                    }, 'Click to open');
                }
            })
        }
    },
    restore: function () { //restore configuration from file
        console.log('Configuration backup initiated')
        var filepath = dialog.showOpenDialog({
            buttonLabel: "open"
        })
        console.log(filepath)
        if (filepath == undefined) {
            console.log("No file selected");
        } else {
            fs.readFile(filepath[0], 'utf-8', (err, data) => {
                if (err) {
                    alert("An error ocurred reading the file :" + err.message)
                }
                console.log("The file content is : " + data);
                var fileout = JSON.parse(data)
                if (fileout.key == "TT01") { //check if this file is a timetable backup file
                    config.data = fileout
                    config.save();
                    notify.new('Sucess', 'Backup restored')
                    setTimeout(() => {
                        location.reload()
                    }, 2000)
                } else {
                    notify.new('Error', filepath[0] + ' is not a backup file')
                }

            })
        }
    }
}

/*  Table generator */
let table = {
    initialize: function () {
        console.log('Table initalization Begins');
        this.data_render(); //render data
        setTimeout(() => {
            table.hilight_engine_go_vroom();
        }, 50);
    },
    data_render: function () {
        console.log('Table render started')
        var i = 0;
        if (config.data.table1_db[i] == null || undefined) {
            //show first time setup screen
            notify.new('U new here?', 'To start off, click here to add some classes', function () {
                UI.navigate.MANAGE()
                manage.dialogue.open()
            }, 'click to add new class')
        } else {
            for (i = 0; i < config.data.table1_db.length; i++) { //Get minimum time and maximum time to construct correct height
                if (config.data.table1_db[i].deleted != true && config.data.table1_db[i].show == config.data.table_selected) {
                    let starthraw = Number(config.data.table1_db[i].start) - config.data.table1_db[i].start % 1; // taking away the modulus 1 of itself removes the remainder
                    config.properties.min = Math.min(starthraw, config.properties.min); //find minimum time in all datu
                    config.properties.max = Math.max(config.data.table1_db[i].end, config.properties.max); //find maximum time in all datu
                }
            }
            console.log('Table minimum found to be: ', config.properties.min, ' Table maximum found to be: ', config.properties.max)
            for (i = 0; i < config.data.table1_db.length; i++) { //construct table
                console.log('Data run on index :', i);
                if (config.data.table1_db[i].deleted != true && config.data.table1_db[i].show == config.data.table_selected) {
                    build_block_db1(i);
                }
            }
            validate(); //Strip empty cells form top and bottom
        }
        console.log('Table render Completed');

        function build_block_db1(index) { //Builds timetable from database
            console.log('Building Block :', index);
            //Create the data block
            let tempblock = document.createElement('div');
            tempblock.setAttribute("class", "data_block");

            //time processing
            let startmeridian = 'a.m.';
            let starthr = 0;
            let startminute = Number(config.data.table1_db[index].start % 1 * 60).toFixed(0);
            if (startminute == 0) {
                startminute = '00'
            }
            let endmeridian = 'a.m.';
            let endhr = 0;
            let endminute = Number(config.data.table1_db[index].end % 1 * 60).toFixed(0);
            if (endminute == 0) {
                endminute = '00'
            }

            if (config.data.table1_db[index].start >= 12) {
                startmeridian = 'p.m.'; //morning or evening
                starthr = Number(config.data.table1_db[index].start - 12) - config.data.table1_db[index].start % 1; //removes remainder
            } else {
                starthr = Number(config.data.table1_db[index].start) - config.data.table1_db[index].start % 1; //removes remainder
            }
            if (config.data.table1_db[index].end >= 12) {
                endmeridian = 'p.m.'; //morning or evening
                endhr = Number(config.data.table1_db[index].end - 12) - config.data.table1_db[index].end % 1; //removes remainder
            } else {
                endhr = Number(config.data.table1_db[index].end) - config.data.table1_db[index].end % 1; //removes remainder
            }
            if (starthr == 0) {
                starthr = 12
            }
            if (endhr == 0) {
                endhr = 12
            }


            //populate the block with relivant data
            tempblock.innerHTML = config.data.table1_db[index].name /* + '<br>' + starthr+':'+startminute+' '+startmeridian+' - '+endhr+':'+endminute+' '+endmeridian*/;

            //info doots
            let doot = document.createElement('div');
            doot.setAttribute('class', 'infodoot');
            if (config.data.table1_db[index].start < config.properties.min + 3) { //Set the doot to flip up or down depending on the pannels position
                doot.style.top = '0vh';
                doot.style.bottom = 'unset';
            }

            //make table in doot to keep things even
            let sub_tab = document.createElement("table");
            let name_tab_row = document.createElement("tr");
            let name_tab_content = document.createElement("th");
            name_tab_content.innerHTML = config.data.table1_db[index].name;
            name_tab_content.setAttribute("colspan", 2);
            name_tab_row.appendChild(name_tab_content);
            sub_tab.appendChild(name_tab_row);
            doot.appendChild(sub_tab);
            if (config.data.table1_db[index].room != "" && config.data.table1_db[index].room != undefined) {
                let room_tab_row = document.createElement("tr");
                let room_tab_head = document.createElement("td");
                let room_tab_content = document.createElement("td");
                room_tab_head.setAttribute("class", "lefter");
                room_tab_content.setAttribute("class", "righter");
                room_tab_head.innerHTML = 'Room : ';
                room_tab_content.innerHTML = config.data.table1_db[index].room;
                room_tab_row.appendChild(room_tab_head);
                room_tab_row.appendChild(room_tab_content);
                sub_tab.appendChild(room_tab_row);
                doot.appendChild(sub_tab);
            }
            if (config.data.table1_db[index].course_code != "" && config.data.table1_db[index].course_code != undefined) {
                let course_code_tab_row = document.createElement("tr");
                let course_code_tab_head = document.createElement("td");
                let course_code_tab_content = document.createElement("td");
                course_code_tab_head.setAttribute("class", "lefter");
                course_code_tab_content.setAttribute("class", "righter");
                course_code_tab_head.innerHTML = 'Code : ';
                course_code_tab_content.innerHTML = config.data.table1_db[index].course_code;
                course_code_tab_row.appendChild(course_code_tab_head);
                course_code_tab_row.appendChild(course_code_tab_content);
                sub_tab.appendChild(course_code_tab_row);
                doot.appendChild(sub_tab);
            }
            if (config.data.table1_db[index].Lecturer != "" && config.data.table1_db[index].Lecturer != undefined) {
                let Lecturer_tab_row = document.createElement("tr");
                let Lecturer_tab_head = document.createElement("td");
                let Lecturer_tab_content = document.createElement("td");
                Lecturer_tab_head.setAttribute("class", "lefter");
                Lecturer_tab_content.setAttribute("class", "righter");
                Lecturer_tab_head.innerHTML = 'Lecturer : ';
                Lecturer_tab_content.innerHTML = config.data.table1_db[index].Lecturer;
                Lecturer_tab_row.appendChild(Lecturer_tab_head);
                Lecturer_tab_row.appendChild(Lecturer_tab_content);
                sub_tab.appendChild(Lecturer_tab_row);
                doot.appendChild(sub_tab);
            }
            if (config.data.table1_db[index].type != "" && config.data.table1_db[index].type != undefined) {
                let type_tab_row = document.createElement("tr");
                let type_tab_head = document.createElement("td");
                let type_tab_content = document.createElement("td");
                type_tab_head.setAttribute("class", "lefter");
                type_tab_content.setAttribute("class", "righter");
                type_tab_head.innerHTML = 'Type : ';
                type_tab_content.innerHTML = config.data.table1_db[index].type;
                type_tab_row.appendChild(type_tab_head);
                type_tab_row.appendChild(type_tab_content);
                sub_tab.appendChild(type_tab_row);
                doot.appendChild(sub_tab);
            }
            let time_tab_row = document.createElement("tr");
            let time_tab = document.createElement("td");
            time_tab.setAttribute("colspan", 2);
            time_tab.innerHTML = starthr + ':' + startminute + ' ' + startmeridian + ' to ' + endhr + ':' + endminute + ' ' + endmeridian;
            time_tab_row.appendChild(time_tab);
            sub_tab.appendChild(time_tab_row);
            doot.appendChild(sub_tab);
            tempblock.appendChild(doot);

            //Decide where it does
            let starthraw = Number(config.data.table1_db[index].start) - config.data.table1_db[index].start % 1; //removes remainder
            console.warn('Raw Time value: ', starthraw);
            switch (config.data.table1_db[index].day) { //Day decsion
                case 1: //Monday
                    config.properties.monday = true;
                    if (starthraw < 10 && starthraw >= 0) {
                        document.getElementById('1_' + starthraw.toPrecision(1)).appendChild(tempblock)
                    } //less than 10 precision 1
                    else if (starthraw >= 10 && starthraw < 24) {
                        document.getElementById('1_' + starthraw.toPrecision(2)).appendChild(tempblock)
                    } //more than 10 precision 2
                    else {
                        console.log('Time logic error on index :', index, ' Time code :', starthraw)
                    } //yeet a time error cause that dont exist fam
                    break;
                case 2: //Tuesday
                    config.properties.tuesday = true;
                    if (starthraw < 10 && starthraw >= 0) {
                        document.getElementById('2_' + starthraw.toPrecision(1)).appendChild(tempblock)
                    } else if (starthraw >= 10 && starthraw < 24) {
                        document.getElementById('2_' + starthraw.toPrecision(2)).appendChild(tempblock)
                    } else {
                        console.log('Time logic error on index :', index, ' Time code :', starthraw)
                    }
                    break;
                case 3: //Wednsday
                    config.properties.wednsday = true;
                    if (starthraw < 10 && starthraw >= 0) {
                        document.getElementById('3_' + starthraw.toPrecision(1)).appendChild(tempblock)
                    } else if (starthraw >= 10 && starthraw < 24) {
                        document.getElementById('3_' + starthraw.toPrecision(2)).appendChild(tempblock)
                    } else {
                        console.log('Time logic error on index :', index, ' Time code :', starthraw)
                    }
                    break;
                case 4:
                    config.properties.thursday = true;
                    if (starthraw < 10 && starthraw >= 0) {
                        document.getElementById('4_' + starthraw.toPrecision(1)).appendChild(tempblock)
                    } else if (starthraw >= 10 && starthraw < 24) {
                        document.getElementById('4_' + starthraw.toPrecision(2)).appendChild(tempblock)
                    } else {
                        console.log('Time logic error on index :', index, ' Time code :', starthraw)
                    }
                    break;
                case 5:
                    config.properties.friday = true;
                    if (starthraw < 10 && starthraw >= 0) {
                        document.getElementById('5_' + starthraw.toPrecision(1)).appendChild(tempblock)
                    } else if (starthraw >= 10 && starthraw < 24) {
                        document.getElementById('5_' + starthraw.toPrecision(2)).appendChild(tempblock)
                    } else {
                        console.log('Time logic error on index :', index, ' Time code :', starthraw)
                    }
                    break;
                case 6:
                    config.properties.saturday = true;
                    if (starthraw < 10 && starthraw >= 0) {
                        document.getElementById('6_' + starthraw.toPrecision(1)).appendChild(tempblock)
                    } else if (starthraw >= 10 && starthraw < 24) {
                        document.getElementById('6_' + starthraw.toPrecision(2)).appendChild(tempblock)
                    } else {
                        console.log('Time logic error on index :', index, ' Time code :', starthraw)
                    }
                    break;
                case 7:
                    config.properties.sunday = true;
                    if (starthraw < 10 && starthraw >= 0) {
                        document.getElementById('7_' + starthraw.toPrecision(1)).appendChild(tempblock)
                    } else if (starthraw >= 10 && starthraw < 24) {
                        document.getElementById('7_' + starthraw.toPrecision(2)).appendChild(tempblock)
                    } else {
                        console.log('Time logic error on index :', index, ' Time code :', starthraw)
                    }
                    break;
                default:
                    console.log('Date positioning error on index: ', index, ' Day code: ', config.data.table1_db[index].day);
            }
            //time to height calculations must be done after render
            setTimeout(() => {
                let blockheight = Number(config.data.table1_db[index].end - config.data.table1_db[index].start) * 100;
                console.log(config.data.table1_db[index].name, ' As assigned height of :', blockheight, '%');
                tempblock.style.backgroundColor = "hsl(" + config.data.table1_db[index].color.hue + "," + config.data.table1_db[index].color.sat + "%," + config.data.table1_db[index].color.light + "%)";
                tempblock.style.height = blockheight + '%';
                let blocktop = document.getElementById('live_clock').offsetHeight * startminute / 60; //gets the height of a cell in pixels and the multiples by minute percentage
                tempblock.style.transform = "translate(-0.5vh," + blocktop + 'px' + ")";
            }, 100);

            //click action
            tempblock.addEventListener('click', () => {
                console.log('Triggered data cell: ', tempblock);
                if (config.data.tiles) { //show full tile view
                    //place data into overlay
                    tempblock.name = "off";
                    tempblock.setAttribute("class", "data_block");
                    document.getElementById('title_cell').innerText = config.data.table1_db[index].name;
                    switch (config.data.table1_db[index].day) {
                        case 1:
                            document.getElementById('day_cell').innerText = "Monday";
                            break;
                        case 2:
                            document.getElementById('day_cell').innerText = "Tuesday";
                            break;
                        case 3:
                            document.getElementById('day_cell').innerText = "Wednesday";
                            break;
                        case 4:
                            document.getElementById('day_cell').innerText = "Thursday";
                            break;
                        case 5:
                            document.getElementById('day_cell').innerText = "Friday";
                            break;
                        case 6:
                            document.getElementById('day_cell').innerText = "Saturday";
                            break;
                        case 7:
                            document.getElementById('day_cell').innerText = "Sunday";
                            break;
                        default:
                            console.log('Date error on index: ', index, ' Returned value: ', config.data.table1_db[index].day);
                    }
                    if (config.data.table1_db[index].room != undefined) {
                        document.getElementById('room_cell').innerText = config.data.table1_db[index].room
                    } else {
                        document.getElementById('room_cell').innerText = "unknown"
                    }
                    if (config.data.table1_db[index].Lecturer != undefined) {
                        document.getElementById('Lecturer_cell').innerText = config.data.table1_db[index].Lecturer
                    } else {
                        document.getElementById('Lecturer_cell').innerText = "unknown"
                    }
                    if (config.data.table1_db[index].type != undefined) {
                        document.getElementById('type_cell').innerText = config.data.table1_db[index].type
                    } else {
                        document.getElementById('type_cell').innerText = "unknown"
                    }
                    if (config.data.table1_db[index].course_code != undefined) {
                        document.getElementById('coursecode_cell').innerText = config.data.table1_db[index].course_code
                    } else {
                        document.getElementById('coursecode_cell').innerText = "unknown"
                    }
                    document.getElementById('time_cell').innerText = starthr + ':' + startminute + ' ' + startmeridian + ' to ' + endhr + ':' + endminute + ' ' + endmeridian;
                    document.getElementById('fullscreen_tile').classList = "fullscreen_tile_active"
                    document.getElementById('close_btn').style.backgroundColor = "hsl(" + config.data.table1_db[index].color.hue + "," + config.data.table1_db[index].color.sat + "%," + config.data.table1_db[index].color.light + "%)";
                } else {
                    //show the normal card flip out view
                    if (tempblock.name == "on") {
                        tempblock.name = "off";
                        tempblock.setAttribute("class", "data_block");
                    } else {
                        tempblock.name = "on";
                        tempblock.setAttribute("class", "data_block_active");
                    }
                }
            });
            console.log('Block :', index, ' Check complete');
        }

        function validate() {
            //Remove empty days with the bread crums left behing durring the initial render
            if (config.data.empty_rows == false) {
                console.log('Validating Table');
                let days = 7;
                if (!config.properties.monday) { //remove monday?
                    document.getElementById('day1').style.display = 'none'; //Blank the title
                    for (i = 0; i < 24; i++) { //Loop to blank the cells associated with that title
                        document.getElementById('1_' + i).style.display = 'none';
                        console.log('Removing Monday time index :', i);
                    }
                    days--;
                }
                if (!config.properties.tuesday) { //remove tuesday?
                    document.getElementById('day2').style.display = 'none';
                    for (i = 0; i < 24; i++) {
                        document.getElementById('2_' + i).style.display = 'none';
                        console.log('Removing Tuesday time index :', i);
                    }
                    days--;
                }
                if (!config.properties.wednsday) { //remove wednsday?
                    document.getElementById('day3').style.display = 'none';
                    for (i = 0; i < 24; i++) {
                        document.getElementById('3_' + i).style.display = 'none';
                        console.log('Removing wednsday time index :', i);
                    }
                    days--;
                }
                if (!config.properties.thursday) { //remove thursday?
                    document.getElementById('day4').style.display = 'none';
                    for (i = 0; i < 24; i++) {
                        document.getElementById('4_' + i).style.display = 'none';
                        console.log('Removing Thursday time index :', i);
                    }
                    days--;
                }
                if (!config.properties.friday) { //remove friday?
                    document.getElementById('day5').style.display = 'none';
                    for (i = 0; i < 24; i++) {
                        document.getElementById('5_' + i).style.display = 'none';
                        console.log('Removing friday time index :', i);
                    }
                    days--;
                }
                if (!config.properties.saturday) { //remove saturday?
                    document.getElementById('day6').style.display = 'none';
                    for (i = 0; i < 24; i++) {
                        document.getElementById('6_' + i).style.display = 'none';
                        console.log('Removing saturday time index :', i);
                    }
                    days--;
                }
                if (!config.properties.sunday) { //remove sunday?
                    document.getElementById('day0').style.display = 'none';
                    for (i = 0; i < 24; i++) {
                        document.getElementById('7_' + i).style.display = 'none';
                        console.log('Removing sunday time index :', i);
                    }
                    days--;
                }

                //remove empty time cells
                if (config.data.table1_db.length < 3) { //normalization makes life easier fror small table users
                    config.properties.min = config.properties.min - 3;
                    config.properties.max = config.properties.max + 3;
                    if (config.properties.min < 0) {
                        config.properties.min = 0
                    }
                    if (config.properties.min > 23) {
                        config.properties.min = 23
                    }
                }

                let rows = 24;
                for (i = 0; i < config.properties.min; i++) { //knock out all below minimum start time
                    console.log('Called null on row: ', i);
                    if (document.getElementById('timerow_' + i)) {
                        document.getElementById('timerow_' + i).style.display = "none";
                    }
                    rows--;
                }
                for (i = config.properties.max.toPrecision(2); i < 24; i++) { //knock out all above maximum end time
                    console.log('Called null on row: ', i);
                    if (document.getElementById('timerow_' + i)) {
                        document.getElementById('timerow_' + i).style.display = "none";
                    }
                    rows--;
                }
                console.log('Time rows found value: ', rows);

                //set font size dependent on rows value
                switch (rows) {
                    case 1:
                        document.getElementById('timetable').style.fontSize = '11vh';
                        break;
                    case 2:
                        document.getElementById('timetable').style.fontSize = '10vh';
                        break;
                    case 3:
                        document.getElementById('timetable').style.fontSize = '9vh';
                        break;
                    case 4:
                        document.getElementById('timetable').style.fontSize = '8vh';
                        break;
                    case 5:
                        document.getElementById('timetable').style.fontSize = '7vh';
                        break;
                    case 6:
                        document.getElementById('timetable').style.fontSize = '6vh';
                        break;
                    case 7:
                        document.getElementById('timetable').style.fontSize = '6vh';
                        break;
                    case 8:
                        document.getElementById('timetable').style.fontSize = '5vh';
                        break;
                    case 9:
                        document.getElementById('timetable').style.fontSize = '3.4vh';
                        break;
                    case 10:
                        document.getElementById('timetable').style.fontSize = '4vh';
                        break;
                    case 11:
                        document.getElementById('timetable').style.fontSize = '4vh';
                        break;
                    case 12:
                        document.getElementById('timetable').style.fontSize = '3vh';
                        break;
                    case 13:
                        document.getElementById('timetable').style.fontSize = '3vh';
                        break;
                    case 14:
                        document.getElementById('timetable').style.fontSize = '3vh';
                        break;
                    case 15:
                        document.getElementById('timetable').style.fontSize = '3vh';
                        break;
                    case 16:
                        document.getElementById('timetable').style.fontSize = '3vh';
                        break;
                    case 17:
                        document.getElementById('timetable').style.fontSize = '2vh';
                        break;
                    case 18:
                        document.getElementById('timetable').style.fontSize = '2vh';
                        break;
                    case 19:
                        document.getElementById('timetable').style.fontSize = '2vh';
                        break;
                    case 20:
                        document.getElementById('timetable').style.fontSize = '2vh';
                        break;
                    case 21:
                        document.getElementById('timetable').style.fontSize = '2vh';
                        break;
                    case 22:
                        document.getElementById('timetable').style.fontSize = '2vh';
                        break;
                    case 23:
                        document.getElementById('timetable').style.fontSize = '2vh';
                        break;
                    case 24:
                        document.getElementById('timetable').style.fontSize = '2vh';
                        break;
                    default:
                        console.log('Row error, defaulted :', rows);
                }
                if (days == 0 || rows == 0) {
                    //Table is empty
                    notify.new('Table: ' + config.data.table_selected, 'Table #' + config.data.table_selected + ' is empty...', 3);
                }
                console.log('Table validated');
            }

        }
    },
    clock: {
        clock_tick_trigger: null, //setInterval(()=>{table.clock.clock_tick()},1000),
        clock_tick: function () {
            console.log('Clock ticks');
            let date = new Date();
            document.getElementById('live_clock').innerHTML = date.toLocaleTimeString();
            switch (date.getDay()) { //Date switch
                case 0:
                    document.getElementById('day0').style.backgroundColor = 'red';
                    document.getElementById('day1').style.backgroundColor = '';
                    document.getElementById('day2').style.backgroundColor = '';
                    document.getElementById('day3').style.backgroundColor = '';
                    document.getElementById('day4').style.backgroundColor = '';
                    document.getElementById('day5').style.backgroundColor = '';
                    document.getElementById('day6').style.backgroundColor = '';
                    break;
                case 1:
                    document.getElementById('day0').style.backgroundColor = '';
                    document.getElementById('day1').style.backgroundColor = 'red';
                    document.getElementById('day2').style.backgroundColor = '';
                    document.getElementById('day3').style.backgroundColor = '';
                    document.getElementById('day4').style.backgroundColor = '';
                    document.getElementById('day5').style.backgroundColor = '';
                    document.getElementById('day6').style.backgroundColor = '';
                    break;
                case 2:
                    document.getElementById('day0').style.backgroundColor = '';
                    document.getElementById('day1').style.backgroundColor = '';
                    document.getElementById('day2').style.backgroundColor = 'red';
                    document.getElementById('day3').style.backgroundColor = '';
                    document.getElementById('day4').style.backgroundColor = '';
                    document.getElementById('day5').style.backgroundColor = '';
                    document.getElementById('day6').style.backgroundColor = '';
                    break;
                case 3:
                    document.getElementById('day0').style.backgroundColor = '';
                    document.getElementById('day1').style.backgroundColor = '';
                    document.getElementById('day2').style.backgroundColor = '';
                    document.getElementById('day3').style.backgroundColor = 'red';
                    document.getElementById('day4').style.backgroundColor = '';
                    document.getElementById('day5').style.backgroundColor = '';
                    document.getElementById('day6').style.backgroundColor = '';
                    break;
                case 4:
                    document.getElementById('day0').style.backgroundColor = '';
                    document.getElementById('day1').style.backgroundColor = '';
                    document.getElementById('day2').style.backgroundColor = '';
                    document.getElementById('day3').style.backgroundColor = '';
                    document.getElementById('day4').style.backgroundColor = 'red';
                    document.getElementById('day5').style.backgroundColor = '';
                    document.getElementById('day6').style.backgroundColor = '';
                    break;
                case 5:
                    document.getElementById('day0').style.backgroundColor = '';
                    document.getElementById('day1').style.backgroundColor = '';
                    document.getElementById('day2').style.backgroundColor = '';
                    document.getElementById('day3').style.backgroundColor = '';
                    document.getElementById('day4').style.backgroundColor = '';
                    document.getElementById('day5').style.backgroundColor = 'red';
                    document.getElementById('day6').style.backgroundColor = '';
                    break;
                case 6:
                    document.getElementById('day0').style.backgroundColor = '';
                    document.getElementById('day1').style.backgroundColor = '';
                    document.getElementById('day2').style.backgroundColor = '';
                    document.getElementById('day3').style.backgroundColor = '';
                    document.getElementById('day4').style.backgroundColor = '';
                    document.getElementById('day5').style.backgroundColor = '';
                    document.getElementById('day6').style.backgroundColor = 'red';
                    break;
            }
            switch (date.getHours()) { //Hour switch
                case 0:
                    document.getElementById('timerow_0').className = 'glowrow';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 1:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = 'glowrow';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 2:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = 'glowrow';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 3:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = 'glowrow';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 4:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = 'glowrow';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 5:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = 'glowrow';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 6:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = 'glowrow';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 7:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = 'glowrow';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 8:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = 'glowrow';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 9:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = 'glowrow';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 10:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = 'glowrow';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 11:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = 'glowrow';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 12:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = 'glowrow';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 13:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = 'glowrow';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 14:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = 'glowrow';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 15:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = 'glowrow';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 16:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = 'glowrow';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 17:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = 'glowrow';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 18:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = 'glowrow';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 19:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = 'glowrow';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 20:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = 'glowrow';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 21:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = 'glowrow';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 22:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = 'glowrow';
                    document.getElementById('timerow_23').className = '';
                    break;
                case 23:
                    document.getElementById('timerow_0').className = '';
                    document.getElementById('timerow_1').className = '';
                    document.getElementById('timerow_2').className = '';
                    document.getElementById('timerow_3').className = '';
                    document.getElementById('timerow_4').className = '';
                    document.getElementById('timerow_5').className = '';
                    document.getElementById('timerow_6').className = '';
                    document.getElementById('timerow_7').className = '';
                    document.getElementById('timerow_8').className = '';
                    document.getElementById('timerow_9').className = '';
                    document.getElementById('timerow_10').className = '';
                    document.getElementById('timerow_11').className = '';
                    document.getElementById('timerow_12').className = '';
                    document.getElementById('timerow_13').className = '';
                    document.getElementById('timerow_14').className = '';
                    document.getElementById('timerow_15').className = '';
                    document.getElementById('timerow_16').className = '';
                    document.getElementById('timerow_17').className = '';
                    document.getElementById('timerow_18').className = '';
                    document.getElementById('timerow_19').className = '';
                    document.getElementById('timerow_20').className = '';
                    document.getElementById('timerow_21').className = '';
                    document.getElementById('timerow_22').className = '';
                    document.getElementById('timerow_23').className = 'glowrow';
                    break;
                default:
                    console.error('THEY CHANGED THE RULES FOR DATES NIBBA!!!');
            }
        },
        stop_clock: function () {
            console.warn('Clock was stopped');
            clearInterval(this.clock_tick_trigger); //stops teh clock ticking
            config.properties.clocking = false
        },
        start_clock: function () {
            console.warn('Clock has started');
            this.clock_tick();
            setTimeout(() => {
                this.clock_tick_trigger = setInterval(() => {
                    this.clock_tick()
                }, 1000);
            }, 500); // Set timeout higher if slow devices can initalize intime
            config.properties.clocking = true
        },
    },
    change: {
        changeinterval: null,
        startcheck: function () {
            if (config.baseconfig.use_alt_storage) {
                this.changeinterval = setInterval(() => {
                    this.check() //every 5 seconds checks if the file has changed
                }, 5000);
            }
        },
        check: function () {
            //a test function comparing length of array in data to array length in file
            console.log('A file check is being made')
            var configarraylength = config.data.table1_db.length
            var fileout = JSON.parse(fs.readFileSync(config.baseconfig.alt_location.toString() + "/Timetableconfig.json", {
                encoding: 'utf8'
            }))
            //before comparison files configuration needs to be validated
            var filearraylength = fileout.table1_db.length
            if (configarraylength != filearraylength) {
                console.log(configarraylength, filearraylength)
                //location.reload()//reload to re-render table, do not reload if this user is editing data
            } else {
                console.log('there is no change');
            }
        },
    },
    hilight_engine_go_vroom: function () {
        if (config.data.hilight_engine) {
            console.log('Hilight Query state Checking..');
            let query = document.querySelectorAll(".maincell");
            let i = 0;
            while (query[i] != null || query[i] != undefined) {
                query[i].addEventListener('mouseover', () => {
                    table.engine_spark(event)
                }, {
                    passive: true
                });
                i++;
                console.log('Added event listener for hilight_query: ', i);
            }
        }
    },
    engine_spark: function (event) {
        if (config.data.hilight_engine) {
            console.log('Hilight Engine trigger fired on :', event);
            if (!event.target.classList.contains('data_block')) { //check if the cell is a data_block
                if (config.data.theme == "light") {
                    event.target.style.color = 'black';
                    event.target.style.backgroundColor = 'hsl(' + utility.rand.number(360, 0) + ',100%,70%)'; //color the target
                } else if (config.data.theme == "dark") {
                    event.target.style.color = 'black';
                    event.target.style.backgroundColor = 'hsl(' + utility.rand.number(360, 0) + ',100%,60%)'; //color the target
                }
                setTimeout(() => {
                    event.target.style.backgroundColor = "";
                    event.target.style.color = '';
                }, 1000); //un-color the target
            }
        }
    }
}

/*  Data manager    */
let manage = {
    initalize: function () {
        console.log('Manager initializes');
        this.render_list();
        this.render_tables();
        //Set text feilds
        let i = 0;
        while (config.data.table_details[i] != null) {
            if (config.data.table_details[i].identifier == Number(config.data.table_selected) && config.data.table_details[i].deleted != true) {
                document.getElementById('selected_table').innerText = config.data.table_details[i].purpose;
                document.getElementById('tablemanage_txt').innerText = config.data.table_details[i].purpose;
                document.getElementById('title_txt').innerText = config.data.table_details[i].purpose;
                break;
            } else {
                document.getElementById('tablemanage_txt').innerText = "Homeless tiles";
                document.getElementById('title_txt').innerText = "Homeless tiles";
            }
            i++
        }
        //table manager actions
        document.getElementById('tablemanger').addEventListener('click', function () {
            if (config.properties.management == false) {
                document.getElementById('tablemanger').classList = "tablemanger_active"
                config.properties.management = true
            } else {
                config.properties.management = false
                document.getElementById('tablemanger').classList = "tablemanger"
            }
        })
        document.getElementById('manage_dataspace').addEventListener('click', function () {
            if (config.properties.management == true) {
                config.properties.management = false
                document.getElementById('tablemanger').classList = "tablemanger"
            }
        })
        document.getElementById('tablespace_render').addEventListener('click', function () {
            event.stopPropagation() //Stop propogation to the dataspace
        })

        //Add new button
        document.getElementById('new_class_button').addEventListener('click', function () {
            manage.dialogue.open();
            console.log('Add new class button clicked')
        }) //add new btn listener

        document.getElementById('cancel_btn').addEventListener('click', () => {
            console.log('Cancel button clicked');
            manage.dialogue.clear();
            manage.dialogue.close();
            config.properties.overwrite = null;
        });
        document.getElementById('save_btn').addEventListener('click', this.dialogue.save); //Save button
        document.getElementById('savepluss_btn').addEventListener('click', this.dialogue.saveplus);
        document.getElementById('delete_btn').addEventListener('click', this.dialogue.call_delete);
        document.getElementById('yes_btn').addEventListener('click', function () { // Delete yes button
            console.log('Delete Confirmation called');
            config.data.table1_db[config.properties.overwrite].deleted = true; //pseudo delete function
            manage.dialogue.clear();
            manage.dialogue.close();
            config.properties.changed = true;
            config.save();
            document.getElementById('delete_confirm_pannel').style.display = 'none';
            manage.render_list();
        });

        document.getElementById('no_del_btn').addEventListener('click', function () { // Delete No button
            console.log('Delete denial called');
            document.getElementById('delete_confirm_pannel').style.display = 'none';
        });
        document.getElementById('erraser').addEventListener('click', manage.dialogue.clear);

        //Initalize day_put selector
        document.getElementById('day_put').value = "1";
        document.getElementById('day_put_text').innerText = "Monday"
        document.getElementById('day_put').addEventListener('change', function () {
            /* Switches dates on change */
            console.log('Day put changed');
            let tmp = document.getElementById('day_put').value;
            switch (tmp) {
                case "1":
                    document.getElementById('day_put_text').innerText = "Monday";
                    break;
                case "2":
                    document.getElementById('day_put_text').innerText = "Tuesday";
                    break;
                case "3":
                    document.getElementById('day_put_text').innerText = "Wednsday";
                    break;
                case "4":
                    document.getElementById('day_put_text').innerText = "Thursday";
                    break;
                case "5":
                    document.getElementById('day_put_text').innerText = "Friday";
                    break;
                case "6":
                    document.getElementById('day_put_text').innerText = "Saturday";
                    break;
                case "7":
                    document.getElementById('day_put_text').innerText = "Sunday";
                    break;
                default:
                    console.error('Blyat');
            }
        });

        //Initalize Table put selector
        i = 0;
        var view_put = document.getElementById('view_put');
        view_put.innerHTML = "";
        while (config.data.table_details[i] != null) {
            if (config.data.table_details[i].deleted != true) {
                buildoption(i)
            }
            i++;
        }
        document.getElementById('view_put').value = config.data.table_selected; //Value to view put
        function buildoption(i) { //function build options
            var option = document.createElement('option')
            option.value = config.data.table_details[i].identifier;
            option.innerHTML = config.data.table_details[i].purpose;
            view_put.appendChild(option);
            if (config.data.table_details[i].identifier == config.data.table_selected) {
                document.getElementById('view_put_text').innerHTML = config.data.table_details[i].purpose;
            }
        }
        document.getElementById('view_put').addEventListener('change', function () {
            setTimeout(() => {
                var vewalue = document.getElementById('view_put').value;
                var i = 0;
                while (config.data.table_details[i] != null) {
                    if (config.data.table_details[i].deleted != true && config.data.table_details[i].identifier == vewalue) {
                        document.getElementById('view_put_text').innerHTML = config.data.table_details[i].purpose
                        break; //found it
                    }
                    i++;
                }
            }, 50)
        })

        //color sliders initalizer
        document.getElementById('color_put').addEventListener('change', slidecolor)
        document.getElementById('sat_put').addEventListener('change', slidesat)
        document.getElementById('color_put').addEventListener('mousemove', slidecolor)
        document.getElementById('sat_put').addEventListener('mousemove', slidesat)

        function slidecolor() {
            document.getElementById('light_put').style.background = "linear-gradient(90deg, #000000,hsl(" + document.getElementById('color_put').value + "," + document.getElementById('sat_put').value + "%, 50%),#ffffff)";
            document.getElementById('sat_put').style.background = "linear-gradient(90deg, rgb(128, 128, 128),hsl(" + document.getElementById('color_put').value + ", 100%, 50%)";
        }

        function slidesat() {
            document.getElementById('light_put').style.background = "linear-gradient(90deg, #000000,hsl(" + document.getElementById('color_put').value + "," + document.getElementById('sat_put').value + "%, 50%),#ffffff)";
        }

        //name autofill
        var lecture_autofill, room_autofill, type_autofill, course_autofill; //save for later
        document.getElementById('name_put').addEventListener('keydown', function () {
            console.log('Name autofill fired')
            setTimeout(() => {
                if (document.getElementById('name_put').value == "") {
                    //clear autofill
                    document.getElementById('name_autofill').innerHTML = "";
                    document.getElementById('name_autofill').classList = "autofill_container"
                } else {
                    document.getElementById('name_autofill').innerHTML = "";
                    document.getElementById('name_autofill').classList = "autofill_container_active"
                    for (i = 0; i < config.data.table1_db.length; i++) {
                        if (config.data.table1_db[i].name.indexOf(document.getElementById('name_put').value.toString()) != -1) {
                            autofill_name(i)
                        } else {
                            //nothing found
                        }
                    }
                }

            }, 200)
        })

        function autofill_name(i) {

            var fillbar = document.createElement('div');
            var name_autofill = config.data.table1_db[i].name;
            fillbar.setAttribute('class', 'fillbar');
            fillbar.innerHTML = config.data.table1_db[i].name;
            fillbar.addEventListener('click', function () {
                document.getElementById('name_autofill').classList = "autofill_container"
                document.getElementById('name_put').value = name_autofill;
            });
            document.getElementById('name_autofill').appendChild(fillbar);
        }

        //room autofill
        document.getElementById('room_put').addEventListener('keydown', function () {
            console.log('room autofill fired')
            setTimeout(() => {
                if (document.getElementById('room_put').value == "") {
                    //clear autofill
                    document.getElementById('room_autofill').innerHTML = "";
                    document.getElementById('room_autofill').classList = "autofill_container"
                } else {
                    document.getElementById('room_autofill').innerHTML = "";
                    document.getElementById('room_autofill').classList = "autofill_container_active"
                    for (i = 0; i < config.data.table1_db.length; i++) {
                        if (config.data.table1_db[i].room.indexOf(document.getElementById('room_put').value.toString()) != -1) {
                            autofill_room(i)
                        } else {
                            //nothing found
                        }
                    }
                }

            }, 200)
        })

        function autofill_room(i) {
            var fillbar = document.createElement('div');
            var room_autofill = config.data.table1_db[i].room;
            fillbar.setAttribute('class', 'fillbar');
            fillbar.innerHTML = config.data.table1_db[i].room;
            fillbar.addEventListener('click', function () {
                document.getElementById('room_autofill').classList = "autofill_container"
                document.getElementById('room_put').value = room_autofill;
            });
            document.getElementById('room_autofill').appendChild(fillbar);
        }

        //type autofill
        document.getElementById('type_put').addEventListener('keydown', function () {
            console.log('type autofill fired')
            setTimeout(() => {
                if (document.getElementById('type_put').value == "") {
                    //clear autofill
                    document.getElementById('type_autofill').innerHTML = "";
                    document.getElementById('type_autofill').classList = "autofill_container"
                } else {
                    document.getElementById('type_autofill').innerHTML = "";
                    document.getElementById('type_autofill').classList = "autofill_container_active"
                    for (i = 0; i < config.data.table1_db.length; i++) {
                        if (config.data.table1_db[i].type.indexOf(document.getElementById('type_put').value.toString()) != -1) {
                            autofill_type(i)
                        } else {
                            //nothing found
                        }
                    }
                }

            }, 200)
        })

        function autofill_type(i) {
            var fillbar = document.createElement('div');
            var type_autofill = config.data.table1_db[i].type;
            fillbar.setAttribute('class', 'fillbar');
            fillbar.innerHTML = config.data.table1_db[i].type;
            fillbar.addEventListener('click', function () {
                document.getElementById('type_autofill').classList = "autofill_container"
                document.getElementById('type_put').value = type_autofill;
            });
            document.getElementById('type_autofill').appendChild(fillbar);
        }

        //course_code autofill
        document.getElementById('course_code_put').addEventListener('keydown', function () {
            console.log('course_code autofill fired')
            setTimeout(() => {
                if (document.getElementById('course_code_put').value == "") {
                    //clear autofill
                    document.getElementById('course_code_autofill').innerHTML = "";
                    document.getElementById('course_code_autofill').classList = "autofill_container"
                } else {
                    document.getElementById('course_code_autofill').innerHTML = "";
                    document.getElementById('course_code_autofill').classList = "autofill_container_active"
                    for (i = 0; i < config.data.table1_db.length; i++) {
                        if (config.data.table1_db[i].course_code.indexOf(document.getElementById('course_code_put').value.toString()) != -1) {
                            autofill_course_code(i)
                        } else {
                            //nothing found
                        }
                    }
                }

            }, 200)
        })

        function autofill_course_code(i) {
            var fillbar = document.createElement('div');
            var course_code_autofill = config.data.table1_db[i].course_code;
            fillbar.setAttribute('class', 'fillbar');
            fillbar.innerHTML = config.data.table1_db[i].course_code;
            fillbar.addEventListener('click', function () {
                document.getElementById('course_code_autofill').classList = "autofill_container"
                document.getElementById('course_code_put').value = course_code_autofill;
            });
            document.getElementById('course_code_autofill').appendChild(fillbar);
        }

        //Lecture autofill
        document.getElementById('Lecture_put').addEventListener('keydown', function () {
            console.log('Lecture autofill fired')
            setTimeout(() => {
                if (document.getElementById('Lecture_put').value == "") {
                    //clear autofill
                    document.getElementById('Lecture_autofill').innerHTML = "";
                    document.getElementById('Lecture_autofill').classList = "autofill_container"
                } else {
                    document.getElementById('Lecture_autofill').innerHTML = "";
                    document.getElementById('Lecture_autofill').classList = "autofill_container_active"
                    for (i = 0; i < config.data.table1_db.length; i++) {
                        if (config.data.table1_db[i].Lecturer.indexOf(document.getElementById('Lecture_put').value.toString()) != -1) {
                            autofill_Lecture(i)
                        } else {
                            //nothing found
                        }
                    }
                }

            }, 200)
        })

        function autofill_Lecture(i) {
            var fillbar = document.createElement('div');
            var Lecture_autofill = config.data.table1_db[i].Lecturer;
            fillbar.setAttribute('class', 'fillbar');
            fillbar.innerHTML = config.data.table1_db[i].Lecturer;
            fillbar.addEventListener('click', function () {
                document.getElementById('Lecture_autofill').classList = "autofill_container"
                document.getElementById('Lecture_put').value = Lecture_autofill;
            });
            document.getElementById('Lecture_autofill').appendChild(fillbar);
        }
    },

    render_tables: function () {
        console.log('Table management render started');
        clear();
        let i = 0;
        while (config.data.table_details[i] != undefined || null) {
            if (config.data.table_details[i].deleted != true) {
                renderbar(i);
            }
            i++;
        }

        //button to select table 0
        let table0_button = document.createElement('div');
        table0_button.setAttribute("class", "table_bar");
        let titlespan0 = document.createElement('span');
        titlespan0.innerHTML = "Homeless tiles";
        titlespan0.title = "Tiles not associated with any table";
        table0_button.appendChild(titlespan0)
        document.getElementById('tablespace_render').appendChild(table0_button);
        table0_button.addEventListener('click', function () {
            event.stopPropagation
            config.data.table_selected = 0;
            config.save();
            manage.initalize();
            config.properties.changed = true
        })

        //Button to add new table
        let new_table_button = document.createElement('div');
        new_table_button.setAttribute("class", "table_bar");
        let titlespan = document.createElement('span');
        titlespan.innerHTML = "Create new table";
        titlespan.title = "Click to create new empty table";
        new_table_button.appendChild(titlespan)
        document.getElementById('tablespace_render').appendChild(new_table_button);
        new_table_button.addEventListener('click', function () {
            event.stopPropagation
            let identifier = 1
            let i = 0;
            while (config.data.table_details[i] != null) {
                if (config.data.table_details[i].deleted != true) {
                    identifier = Math.max(config.data.table_details[i].identifier, identifier)
                }
                i++
            }
            let newtable = {
                purpose: "new table #" + Number(identifier + 1),
                deleted: false,
                identifier: Number(identifier + 1)
            }
            config.data.table_details.push(newtable);
            config.save();
            console.warn('value: ', identifier)
            manage.initalize();
            config.properties.changed = true
        })

        function renderbar(index) {
            console.log('Creating actionbutton for :', config.data.table_details[index]);
            //build menu
            let table_bar = document.createElement('div');
            table_bar.setAttribute("class", "table_bar");
            let titlespan = document.createElement('span');
            titlespan.innerHTML = config.data.table_details[index].purpose;
            let tabmenu = document.createElement('div');
            tabmenu.setAttribute("class", "tabmenu");
            let editbtn = document.createElement('div');
            editbtn.style.display = "block";
            editbtn.setAttribute("class", "tabtion_btn editbtn");
            editbtn.setAttribute("title", "Edit " + config.data.table_details[index].purpose);
            let deletebtn = document.createElement('div');
            deletebtn.style.display = "block";
            deletebtn.setAttribute("class", "tabtion_btn deletebtn");
            deletebtn.setAttribute("title", "Delete " + config.data.table_details[index].purpose);
            let confirmimg = document.createElement('div');
            confirmimg.setAttribute("class", "tabtion_btn confirmimg");
            let cancelimg = document.createElement('div');
            cancelimg.setAttribute("class", "tabtion_btn cancelimg");
            let tab_put = document.createElement('input');
            tab_put.setAttribute("class", "tab_put");


            //inject into document
            tabmenu.appendChild(confirmimg)
            tabmenu.appendChild(cancelimg)
            tabmenu.appendChild(editbtn)
            tabmenu.appendChild(deletebtn)
            table_bar.appendChild(titlespan)
            table_bar.appendChild(tab_put)
            table_bar.appendChild(tabmenu)
            document.getElementById('tablespace_render').appendChild(table_bar);

            //make fucntion
            tab_put.addEventListener('click', function () {
                event.stopPropagation()
            }) //stop this event from trigering table select action
            table_bar.addEventListener('click', function () { //select table fucntion
                console.warn('Table selected by identifier : ', config.data.table_details[index].identifier)
                config.data.table_selected = config.data.table_details[index].identifier;
                config.save()
                manage.initalize()
                config.properties.changed = true
            })
            table_bar.addEventListener('mouseover', function () {
                tabmenu.style.transform = "translate(0, 0)";
            })
            table_bar.addEventListener('mouseout', function () {
                if (confirmimg.style.display != "block") {
                    tabmenu.style.transform = "";
                }
            })
            editbtn.addEventListener('click', function () { //edit button is pressed
                event.stopPropagation();
                console.log('Edit called on table name: ' + config.data.table_details[index].purpose)
                confirmimg.setAttribute("title", "Confirm name change")
                cancelimg.setAttribute("title", "Do not change")
                confirmimg.style.display = "block"
                cancelimg.style.display = "block"
                deletebtn.style.display = "none"
                editbtn.style.display = "none"
                tab_put.style.display = "block"
                tab_put.value = config.data.table_details[index].purpose
                setTimeout(() => {
                    tab_put.focus()
                }, 500)
                tab_put.addEventListener('keyup', function (event) {
                    if (event.keyCode === 13) { //enterkey
                        confirmimg.click(); //enterkey is pressed, confirm input
                    } else if (event.keyCode == 27) { //esckey
                        cancelimg.click(); //Cancel key is pressed, cancel input
                    }
                })
            })
            deletebtn.addEventListener('click', function () { //edit button is pressed
                event.stopPropagation();
                console.log('Delete called on table name: ' + config.data.table_details[index].purpose)
                confirmimg.setAttribute("title", "Confirm delete " + config.data.table_details[index].purpose);
                cancelimg.setAttribute("title", "Do not delete " + config.data.table_details[index].purpose);
                confirmimg.style.display = "block"
                cancelimg.style.display = "block"
                deletebtn.style.display = "none"
                editbtn.style.display = "none"
                tab_put.style.display = "none"
            })
            confirmimg.addEventListener('click', function () { //cancel button is pressed
                event.stopPropagation();
                console.log('Confirm button pressed')
                //perform confirmation action
                if (tab_put.style.display == "block") {
                    console.log('save action on: ' + config.data.table_details[index])
                    config.data.table_details[index].purpose = tab_put.value;
                } else if (tab_put.style.display == "none") {
                    console.log('delete action')
                    config.data.table_details[index].deleted = true;
                }
                config.save()
                manage.initalize()
                config.properties.changed = true
            })
            cancelimg.addEventListener('click', function () { //cancel button is pressed
                event.stopPropagation();
                console.log('Cancel button pressed')
                confirmimg.style.display = "none"
                cancelimg.style.display = "none"
                deletebtn.style.display = "block"
                editbtn.style.display = "block"
                tab_put.style.display = "none"
            })
        }

        function clear() {
            document.getElementById('tablespace_render').innerHTML = "";
        }
    },
    render_list: function () {
        console.log('Manager Render starts');
        clear();
        let i = 0;

        if (config.data.table1_db[i] == null || undefined) {
            //show first time setup screen
            console.log('The table database is empty,manager will show first time setup');
        } else {
            //Construct the data
            if (config.data.table_details[0] == null) { //there are no tables, everyone is homeless render them all
                while (config.data.table1_db[i] != null || undefined) { //render selected tables data
                    console.log('Data run on index :', i);
                    build_bar_db1(i);
                    i++;
                }
            } else {
                while (config.data.table1_db[i] != null || undefined) { //render selected tables data
                    console.log('Data run on index :', i);
                    if (config.data.table1_db[i].show == config.data.table_selected) {
                        build_bar_db1(i);
                    }
                    i++;
                }
                i = 0;
                while (config.data.table1_db[i] != null || undefined) { //render non-selected tables data
                    console.log('Data run on index :', i);
                    if (config.data.table1_db[i].show != config.data.table_selected) {
                        build_bar_db1(i);
                    }
                    i++;
                }
            }
            //config.save()//save because many things get changed and shuffled durring this function
        }
        console.log('Manager Render Completed');

        function build_bar_db1(index) { //Builds timetable from database
            //check if block is homeless (has no table or its tables been deleted)
            let i = 0
            let homeless = true
            while (config.data.table_details[i] != null) {
                if (config.data.table_details[i].identifier == config.data.table1_db[index].show && config.data.table_details[i].deleted != true) {
                    homeless = false
                }
                i++;
            }
            if (homeless) {
                config.data.table1_db[index].show = 0;
            }
            //Create the data block
            console.log('Building Bar: ', index);
            let tempblock = document.createElement('div');
            tempblock.title = "Click to edit";
            tempblock.setAttribute("class", "data_bar");

            //assign a color
            tempblock.style.borderColor = "hsl(" + config.data.table1_db[index].color.hue + "," + config.data.table1_db[index].color.sat + "%," + config.data.table1_db[index].color.light + "%)";
            tempblock.style.boxShadow = "0vh 0vh 0.5vh 0vh hsl(" + config.data.table1_db[index].color.hue + "," + config.data.table1_db[index].color.sat + "%," + config.data.table1_db[index].color.light + "%)";

            //build menu
            let sub_optionbar = document.createElement('div');
            sub_optionbar.setAttribute("class", "sub_optionbar");
            let editbtn = document.createElement('div');
            editbtn.setAttribute("class", "optionbutton editbtn");
            editbtn.setAttribute("title", "edit");
            let deletebtn = document.createElement('div');
            deletebtn.setAttribute("class", "optionbutton deletebtn");
            deletebtn.setAttribute("title", "delete");

            sub_optionbar.appendChild(editbtn)
            sub_optionbar.appendChild(deletebtn)
            tempblock.appendChild(sub_optionbar)

            //time processing
            let startmeridian = 'a.m.';
            let starthr = 0;
            let startminute = Number(config.data.table1_db[index].start % 1 * 60).toFixed(0);
            if (startminute == 0) {
                startminute = '00'
            }
            let endmeridian = 'a.m.';
            let endhr = 0;
            let endminute = Number(config.data.table1_db[index].end % 1 * 60).toFixed(0);
            if (endminute == 0) {
                endminute = '00'
            }

            if (config.data.table1_db[index].start > 12) {
                startmeridian = 'p.m.'; //morning or evening
                starthr = Number(config.data.table1_db[index].start - 12) - config.data.table1_db[index].start % 1; //removes remainder
            } else {
                starthr = Number(config.data.table1_db[index].start) - config.data.table1_db[index].start % 1; //removes remainder
            }
            if (config.data.table1_db[index].end > 12) {
                endmeridian = 'p.m.'; //morning or evening
                endhr = Number(config.data.table1_db[index].end - 12) - config.data.table1_db[index].end % 1; //removes remainder
            } else {
                endhr = Number(config.data.table1_db[index].end) - config.data.table1_db[index].end % 1; //removes remainder
            }
            if (starthr == 0) {
                starthr = 12
            }
            if (endhr == 0) {
                endhr = 12
            }
            let day;
            switch (config.data.table1_db[index].day) {
                case 1:
                    day = "Monday";
                    break;
                case 2:
                    day = "Tuesday";
                    break;
                case 3:
                    day = "Wednesday";
                    break;
                case 4:
                    day = "Thursday";
                    break;
                case 5:
                    day = "Friday";
                    break;
                case 6:
                    day = "Saturday";
                    break;
                case 7:
                    day = "Sunday";
                    break;
                default:
                    console.log('Date error on index: ', index, ' Returned value: ', config.data.table1_db[index].day);
            }
            if (config.data.table1_db[index].deleted) { //Check deleted state
                //populate the block with relivant data
                tempblock.innerHTML = config.data.table1_db[index].name + '<br> Marked for delete, Click to undo';
                tempblock.setAttribute("class", "data_bar");
                tempblock.style.border = "0.3vh solid red";
                //alow editing function
                tempblock.setAttribute('id', 'bar_' + index);
                tempblock.addEventListener('click', function () {
                    config.data.table1_db[index].deleted = false;
                    config.save();
                    manage.render_list();
                }); //un-"delete"
            } else {
                //populate the block with relivant data
                //make table in tempblock to keep things even
                let sub_tab = document.createElement("table");
                let name_tab_row = document.createElement("tr");
                let name_tab_content = document.createElement("th");
                name_tab_content.innerHTML = config.data.table1_db[index].name;
                name_tab_content.setAttribute("colspan", 2);
                name_tab_row.appendChild(name_tab_content);
                sub_tab.appendChild(name_tab_row);
                tempblock.appendChild(sub_tab);
                let day_tab_row = document.createElement("tr");
                //let day_tab_head = document.createElement("td");
                let day_tab_content = document.createElement("td");
                /*day_tab_head.setAttribute("class","lefter");
                day_tab_content.setAttribute("class","righter");
                day_tab_head.innerHTML='Day : ';*/
                day_tab_content.innerHTML = day;
                day_tab_content.setAttribute("colspan", 2);
                //day_tab_row.appendChild(day_tab_head);
                day_tab_row.appendChild(day_tab_content);
                sub_tab.appendChild(day_tab_row);
                tempblock.appendChild(sub_tab);
                let time_tab_row = document.createElement("tr");
                let time_tab = document.createElement("td");
                time_tab.setAttribute("colspan", 2);
                time_tab.innerHTML = starthr + ':' + startminute + ' ' + startmeridian + ' - ' + endhr + ':' + endminute + ' ' + endmeridian;
                time_tab_row.appendChild(time_tab);
                sub_tab.appendChild(time_tab_row);
                tempblock.appendChild(sub_tab);
                //alow editing function
                tempblock.setAttribute('id', 'bar_' + index);
                tempblock.addEventListener('click', function () {
                    manage.dialogue.edit(index)
                }); //Edit btn
                editbtn.addEventListener('click', function () {
                    manage.dialogue.edit(index)
                }); //Edit btn
                deletebtn.addEventListener('click', function () {
                    manage.dialogue.edit(index);
                    manage.dialogue.call_delete()
                })

            }
            let noot = document.createElement('div');
            if (config.data.table1_db[index].show == 0) { // this dataset is homeless
                noot.innerHTML = '<del>Not in a table</del>';
                noot.style.color = 'red';
            } //noot is hidden
            else {
                let i = 0;
                while (config.data.table_details[i] != null) {
                    if (config.data.table_details[i].identifier == Number(config.data.table1_db[index].show) && config.data.table_details[i].deleted != true) {
                        noot.innerHTML = config.data.table_details[i].purpose;
                        break;
                    }
                    i++
                }
            } //not gets a number
            noot.setAttribute('class', 'data_noot');
            tempblock.appendChild(noot)
            document.getElementById('manage_dataspace').appendChild(tempblock); //put the bar into the dukument
            console.log('Bar: ', index, ' Complete');
        }

        function clear() {
            console.log('manage_dataspace clear called');
            document.getElementById('manage_dataspace').innerHTML = '';
        }
    },
    dialogue: {
        edit: function (index) { //Does not edit anything, only populates feilds in the editor with data, listener found in manage.data.build_bar_db1();
            console.log('Dialogue Edit called on index: ', index);

            config.properties.overwrite = index; //Set overwrtite so save function knows to do
            document.getElementById('day_put').value = config.data.table1_db[index].day; //set day feild
            switch (config.data.table1_db[index].day) {
                case 0:
                    document.getElementById('day_put_text').innerText = "Sunday";
                    break;
                case 1:
                    document.getElementById('day_put_text').innerText = "Monday";
                    break;
                case 2:
                    document.getElementById('day_put_text').innerText = "Tuesday";
                    break;
                case 3:
                    document.getElementById('day_put_text').innerText = "Wednsday";
                    break;
                case 4:
                    document.getElementById('day_put_text').innerText = "Thursday";
                    break;
                case 5:
                    document.getElementById('day_put_text').innerText = "Friday";
                    break;
                case 6:
                    document.getElementById('day_put_text').innerText = "Saturday";
                    break;
            }
            document.getElementById('color_put').value = config.data.table1_db[index].color.hue; //set color feild
            document.getElementById('light_put').value = config.data.table1_db[index].color.light; //set color feild
            document.getElementById('sat_put').value = config.data.table1_db[index].color.sat; //set color feild
            document.getElementById('light_put').style.background = "linear-gradient(90deg, #000000,hsl(" + config.data.table1_db[index].color.hue + "," + config.data.table1_db[index].color.sat + "%, 50%),#ffffff)";
            document.getElementById('sat_put').style.background = "linear-gradient(90deg, rgb(128, 128, 128),hsl(" + config.data.table1_db[index].color.hue + ", 100%, 50%)";
            document.getElementById('course_code_put').value = config.data.table1_db[index].course_code; //set course code
            document.getElementById('type_put').value = config.data.table1_db[index].type; //set room type
            document.getElementById('room_put').value = config.data.table1_db[index].room; //set room feild
            document.getElementById('name_put').value = config.data.table1_db[index].name; //Set Name feild

            //process time
            let starthr = Number(config.data.table1_db[index].start) - config.data.table1_db[index].start % 1; //removes remainder
            let startminute = Number(config.data.table1_db[index].start % 1 * 60).toFixed(0);
            if (startminute == 0) {
                startminute = '00'
            }
            if (starthr < 10) {
                starthr = '0' + starthr
            }
            let endhr = Number(config.data.table1_db[index].end) - config.data.table1_db[index].end % 1; //removes remainder
            let endminute = Number(config.data.table1_db[index].end % 1 * 60).toFixed(0);
            if (endminute == 0) {
                endminute = '00'
            }
            if (endhr < 10) {
                endhr = '0' + endhr
            }
            document.getElementById('start_time_put').value = starthr + ':' + startminute //Set start time feild
            document.getElementById('end_time_put').value = endhr + ':' + endminute //Set the end time feild
            document.getElementById('view_put').value = config.data.table1_db[index].show //Set view state feild
            switch (config.data.table1_db[index].show) {
                case 0:
                    document.getElementById('view_put_text').innerText = "Hidden";
                    break;
                case 1:
                    document.getElementById('view_put_text').innerText = config.data.table_details[0].purpose;
                    break;
                case 2:
                    document.getElementById('view_put_text').innerText = config.data.table_details[1].purpose;
                    break;
                case 3:
                    document.getElementById('view_put_text').innerText = config.data.table_details[2].purpose;
                    break;
                case 4:
                    document.getElementById('view_put_text').innerText = config.data.table_details[3].purpose;
                    break;
            }
            this.open() //Open after
        },
        open: function () { //The listener for the add open btn is in manage.render_list() 
            console.log('Dialogue open called');

            //other stuff
            document.getElementById('manage_dataspace').classList = "dataspace_compact"; //switch dataspace to compact view


            if (config.properties.overwrite == null) {
                document.getElementById('savepluss_btn').style.display = 'block';
                document.getElementById('delete_btn').style.display = 'none';
                document.getElementById('data_title').innerHTML = 'New Entry';
                setTimeout(() => {
                    document.getElementById('name_put').focus()
                }, 500)
            } else {
                document.getElementById('savepluss_btn').style.display = 'none';
                document.getElementById('delete_btn').style.display = 'block';
                document.getElementById('data_title').innerHTML = 'Edit ' + config.data.table1_db[config.properties.overwrite].name;
            }
            document.getElementById('name_put').style.border = "";
            document.getElementById('start_time_put').style.border = "";
            document.getElementById('end_time_put').style.border = "";
            if (config.data.animation) {
                document.getElementById('dataentry_screen').style.transform = "translate(0,100%)"; //strange bug, setting this in css causes the buttons to glitch out
                document.getElementById('dataentry_screen').style.display = "block";
                setTimeout(() => {
                    document.getElementById('dataentry_screen').style.transform = "initial";
                    setTimeout(() => {
                        document.getElementById('btn_bar').style.display = "flex";
                    }, 210);
                }, 0);
            } else {
                document.getElementById('dataentry_screen').style.transform = "initial";
                document.getElementById('btn_bar').style.display = "flex";
                document.getElementById('dataentry_screen').style.display = "block";
            }
            if (config.properties.colors_changed == true) { // render recent colors
                if (config.data.previous_colors[0] != null) {
                    document.getElementById('recent_colors').innerHTML = "";
                    var index = config.data.previous_colors.length - 1;
                    while (config.data.previous_colors[index] != null) {
                        render_color(index);
                        index--;
                    }
                    config.properties.colors_changed = false;
                } else {
                    document.getElementById('recent_colors').innerHTML = "Recent Colors";
                }
            }

            function render_color(index) {
                console.log('Rendering recent color :', config.data.previous_colors[index], ', index:', index);
                var color_doot = document.createElement("div");
                color_doot.setAttribute("class", "color_doot");
                color_doot.style.backgroundColor = "hsl(" + config.data.previous_colors[index].hue + "," + config.data.previous_colors[index].sat + "%," + config.data.previous_colors[index].light + "%)";
                document.getElementById('recent_colors').appendChild(color_doot);
                color_doot.addEventListener('click', function () {
                    document.getElementById('color_put').value = config.data.previous_colors[index].hue;
                    document.getElementById('sat_put').value = config.data.previous_colors[index].sat;
                    document.getElementById('light_put').value = config.data.previous_colors[index].light;
                    //sets slider colors
                    document.getElementById('light_put').style.background = "linear-gradient(90deg, #000000,hsl(" + config.data.previous_colors[index].hue + "," + config.data.previous_colors[index].sat + "%, 50%),#ffffff)";
                    document.getElementById('sat_put').style.background = "linear-gradient(90deg, rgb(128, 128, 128),hsl(" + config.data.previous_colors[index].hue + ", 100%, 50%)";
                    console.warn('Pushed recent color: ', config.data.previous_colors[index])
                });
            }
        },
        clear: function () { //clear the input and remove the input screen
            console.log('Dialogue clear called');
            document.getElementById('course_code_put').value = "";
            document.getElementById('Lecture_put').value = "";
            document.getElementById('type_put').value = "";
            document.getElementById('room_put').value = "";
            document.getElementById('name_put').value = "";
            document.getElementById('start_time_put').value = "";
            document.getElementById('end_time_put').value = "";
            document.getElementById('view_put').validate = 1;
        },
        close: function () { //remove the input screen
            document.getElementById('manage_dataspace').classList = "dataspace";
            console.log('Dialogue close called');
            if (config.data.animation) {
                document.getElementById('dataentry_screen').style.transform = "translate(0,100%)"; //strange bug, setting this in css causes the buttons to glitch out
                setTimeout(() => {
                    document.getElementById('dataentry_screen').style.display = "none";
                }, 205);
            } else {
                document.getElementById('dataentry_screen').style.display = "none";
                document.getElementById('btn_bar').style.display = "none";
            }
        },
        save: function () {
            console.log('Dialogue save called');
            let tempentry = {
                show: true,
                day: null,
                name: null,
                room: null,
                course_code: null,
                Lecturer: null,
                type: null,
                color: {
                    hue: null,
                    sat: null,
                    light: null
                },
                start: null,
                end: null
            }; //Its test data
            let entryisvalid = true;

            //get day select, no validation, because default is valid
            tempentry.day = Number(document.getElementById('day_put').value);

            //get color select, no validation, because default is valid
            tempentry.color.hue = Number(document.getElementById('color_put').value);
            tempentry.color.sat = Number(document.getElementById('sat_put').value);
            tempentry.color.light = Number(document.getElementById('light_put').value);
            /*if(typeof(config.data.previous_colors[config.data.previous_colors.length-1])!='undefined'){
                if(tempentry.color.hue!=config.data.previous_colors[config.data.previous_colors.length-1].hue || tempentry.color.sat!=config.data.previous_colors[config.data.previous_colors.length-1].sat || tempentry.color.hue!=config.data.previous_colors[config.data.previous_colors.length-1].light){
                    config.data.previous_colors.push(tempentry.color);
                    config.properties.colors_changed=true;
                }
            }*/
            config.data.previous_colors.push(tempentry.color);
            config.properties.colors_changed = true;
            //Course Code is not required and can be anything, even nothing
            tempentry.course_code = document.getElementById('course_code_put').value;

            //Lecturer can be anything
            tempentry.Lecturer = document.getElementById('Lecture_put').value;

            //type is not required and can be anything, even nothing
            tempentry.type = document.getElementById('type_put').value;

            //Room is not required and can be anything, even nothing
            tempentry.room = document.getElementById('room_put').value;

            //Get Name feild
            tempentry.name = document.getElementById('name_put').value;
            if (tempentry.name == "" || undefined || null) {
                entryisvalid = false;
                document.getElementById('name_put').style.border = "0.3vh solid #ff0000";
                notify.new('HEY!', 'Please Enter a name');
            } else {
                document.getElementById('name_put').style.border = "";
                console.log('Name detected: ', tempentry.name);
            }

            //Process time
            let start_time_raw = document.getElementById('start_time_put').value.toString();
            let end_time_raw = document.getElementById('end_time_put').value.toString();
            let percentage_start = Number((start_time_raw.slice(0, 2) / 1 /*I divide it by one becasue the scripting engine is drunk*/) + (start_time_raw.slice(3) / 60));
            let percentage_end = Number((end_time_raw.slice(0, 2) / 1 /*I divide it by one becasue the scripting engine is drunk*/) + (end_time_raw.slice(3) / 60));
            if (start_time_raw == "" || start_time_raw == null || start_time_raw == undefined) {
                notify.new('HEY!', 'Start time cannot be empty');
                document.getElementById('start_time_put').style.border = "0.3vh solid #ff0000";
                entryisvalid = false;
            } else if (end_time_raw == "" || end_time_raw == null || end_time_raw == undefined) {
                notify.new('HEY!', 'End time cannot be empty');
                document.getElementById('end_time_put').style.border = "0.3vh solid #ff0000";
                entryisvalid = false;
            } else if (percentage_start == percentage_end) {
                document.getElementById('start_time_put').style.border = "0.3vh solid #ff0000";
                document.getElementById('end_time_put').style.border = "0.3vh solid #ff0000";
                entryisvalid = false;
            } else if (percentage_start > percentage_end) {
                notify.new('E=MC<sup>2</sup>', 'Class cannot start after it ends');
                document.getElementById('start_time_put').style.border = "0.3vh solid #ff0000";
                document.getElementById('end_time_put').style.border = "0.3vh solid #ff0000";
                entryisvalid = false;
            } else {
                tempentry.start = percentage_start;
                tempentry.end = percentage_end;
                document.getElementById('start_time_put').style.border = "";
                document.getElementById('end_time_put').style.border = "";
            }

            //get view state
            tempentry.show = document.getElementById('view_put').value;

            console.table(tempentry);

            if (entryisvalid) {
                if (config.properties.overwrite == null) {
                    config.data.table1_db.push(tempentry);
                    console.log('Entry saved')
                } else {
                    config.data.table1_db[config.properties.overwrite] = tempentry;
                    console.log('Overwrite on index: ', config.properties.overwrite);
                }
                config.save();
                manage.initalize();
                if (config.properties.called_from_plus) {
                    config.properties.called_from_plus = false;
                } else {
                    manage.dialogue.close();
                }
                config.properties.changed = true;
                config.properties.overwrite = null;
            }
            return entryisvalid;
        },
        saveplus: function () {
            console.log('Dialogue savepluss was called');
            config.properties.called_from_plus = true;
            let entryisvalid = manage.dialogue.save();
            if (entryisvalid) {
                notify.new('Confirmation', document.getElementById('name_put').value + ' was saved, U may now add another');
                //no clear function needed, the clearfeild action btns will fufill this task
                manage.dialogue.open();
            }
        },
        call_delete: function () {
            console.log('Delete pseudo function called');
            //time processing
            let startmeridian = 'a.m.';
            let starthr = 0;
            let startminute = Number(config.data.table1_db[config.properties.overwrite].start % 1 * 60).toFixed(0);
            if (startminute == 0) {
                startminute = '00'
            }
            let endmeridian = 'a.m.';
            let endhr = 0;
            let endminute = Number(config.data.table1_db[config.properties.overwrite].end % 1 * 60).toFixed(0);
            if (endminute == 0) {
                endminute = '00'
            }

            if (config.data.table1_db[config.properties.overwrite].start > 12) {
                startmeridian = 'p.m.'; //morning or evening
                starthr = Number(config.data.table1_db[config.properties.overwrite].start - 12) - config.data.table1_db[config.properties.overwrite].start % 1; //removes remainder
            } else {
                starthr = Number(config.data.table1_db[config.properties.overwrite].start) - config.data.table1_db[config.properties.overwrite].start % 1; //removes remainder
            }
            if (config.data.table1_db[config.properties.overwrite].end > 12) {
                endmeridian = 'p.m.'; //morning or evening
                endhr = Number(config.data.table1_db[config.properties.overwrite].end - 12) - config.data.table1_db[config.properties.overwrite].end % 1; //removes remainder
            } else {
                endhr = Number(config.data.table1_db[config.properties.overwrite].end) - config.data.table1_db[config.properties.overwrite].end % 1; //removes remainder
            }
            if (starthr == 0) {
                starthr = 12
            }
            if (endhr == 0) {
                endhr = 12
            }

            document.getElementById('title_cellp').innerText = config.data.table1_db[config.properties.overwrite].name;
            switch (config.data.table1_db[config.properties.overwrite].day) {
                case 1:
                    document.getElementById('day_cellp').innerText = "Monday";
                    break;
                case 2:
                    document.getElementById('day_cellp').innerText = "Tuesday";
                    break;
                case 3:
                    document.getElementById('day_cellp').innerText = "Wednesday";
                    break;
                case 4:
                    document.getElementById('day_cellp').innerText = "Thursday";
                    break;
                case 5:
                    document.getElementById('day_cellp').innerText = "Friday";
                    break;
                case 6:
                    document.getElementById('day_cellp').innerText = "Saturday";
                    break;
                case 7:
                    document.getElementById('day_cellp').innerText = "Sunday";
                    break;
                default:
                    console.log('Date error on config.properties.overwrite: ', config.properties.overwrite, ' Returned value: ', config.data.table1_db[config.properties.overwrite].day);
            }
            if (config.data.table1_db[config.properties.overwrite].room != undefined) {
                document.getElementById('room_cellp').innerText = config.data.table1_db[config.properties.overwrite].room
            } else {
                document.getElementById('room_cellp').innerText = "unknown"
            }
            if (config.data.table1_db[config.properties.overwrite].Lecturer != undefined) {
                document.getElementById('Lecturer_cellp').innerText = config.data.table1_db[config.properties.overwrite].Lecturer
            } else {
                document.getElementById('Lecturer_cellp').innerText = "unknown"
            }
            if (config.data.table1_db[config.properties.overwrite].type != undefined) {
                document.getElementById('type_cellp').innerText = config.data.table1_db[config.properties.overwrite].type
            } else {
                document.getElementById('type_cellp').innerText = "unknown"
            }
            if (config.data.table1_db[config.properties.overwrite].course_code != undefined) {
                document.getElementById('coursecode_cellp').innerText = config.data.table1_db[config.properties.overwrite].course_code
            } else {
                document.getElementById('coursecode_cellp').innerText = "unknown"
            }
            document.getElementById('time_cellp').innerText = starthr + ':' + startminute + ' ' + startmeridian + ' to ' + endhr + ':' + endminute + ' ' + endmeridian;
            document.getElementById('delete_confirm_pannel').style.display = 'block';
        }
    },
    batch_delete: {
        detect: function () {
            //Query select all the bar ids or mark them durring their creation
        },
    }
}

/*  UI trickery */
let UI = {
    initalize: function () {
        console.log('UI Initalize');

        //Action bar handlers (look about touch triggers)
        document.getElementById('action_bar').addEventListener('mouseover', function () {
            document.getElementById('action_bar').className = "Action_bar_active";
        })
        document.getElementById('action_bar').addEventListener('mouseout', function () {
            document.getElementById('action_bar').className = "Action_bar";
        })

        //Remote triggers for windowstate management
        if (config.data.always_on_top == true) {
            main.setontop()
            document.getElementById('always_on_top_btn').classList = "statusbtn_active"
        } else {
            main.setnotontop()
        }

        document.getElementById('mainx_btn').addEventListener('click', function () {
            main.closeapp()
        })

        document.getElementById('maximize_btn').addEventListener('click', function () {
            var state = main.maximize_main_window()
            if (state == true) {
                //is maximized
                document.getElementById('resise_constraint').style.display = "none"
            } else {
                //is not maximized
                document.getElementById('resise_constraint').style.display = "block"
            }
            console.log('Window maximized :', state);
        })

        document.getElementById('minimize_btn').addEventListener('click', function () {
            main.minmize_main_window()
        })

        document.getElementById('always_on_top_btn').addEventListener('click', function () {
            var state = main.togglealways_on_top()
            if (state == true) {
                //is always on top
                document.getElementById('always_on_top_btn').classList = "statusbtn_active"
                config.data.always_on_top = true;
                config.save()
            } else {
                //is not always on top
                document.getElementById('always_on_top_btn').classList = "statusbtn"
                config.data.always_on_top = false;
                config.save()
            }
            console.log('Window always on top :', state);
        })

        //Proto navigation
        document.getElementById('table_btn').addEventListener('click', UI.navigate.TABLE)
        document.getElementById('manage_btn').addEventListener('click', UI.navigate.MANAGE)
        document.getElementById('setting_btn').addEventListener('click', UI.navigate.SETTING)
        document.getElementById('hilight_btn').addEventListener('click', UI.setting.hilight.flip)
        document.getElementById('Animations_btn').addEventListener('click', UI.setting.animation.flip)
        document.getElementById('Row_btn').addEventListener('click', UI.setting.Row.flip)
        document.getElementById('tiles_btn').addEventListener('click', UI.setting.tiles.flip)
        document.getElementById('close_btn').addEventListener('click', UI.navigate.close_tile);
        document.getElementById('about_btn').addEventListener('click', function () {
            utility.clipboard(JSON.stringify(config.data));
            notify.new('Debug info coppied to clipboard', JSON.stringify(config.data));
        });

        //select notification handlers
        document.getElementById('notification_style1').addEventListener('click', this.setting.notification.set_1)
        document.getElementById('notification_style2').addEventListener('click', this.setting.notification.set_2)
        document.getElementById('notification_style3').addEventListener('click', this.setting.notification.set_3)
        document.getElementById('notification_style4').addEventListener('click', this.setting.notification.set_4)
        switch (config.data.notification_type) {
            case 1:
                document.getElementById('notification_pallet1').classList = "notification_pallet_active"
                document.getElementById('notification_pallet2').classList = "notification_pallet"
                document.getElementById('notification_pallet3').classList = "notification_pallet"
                document.getElementById('notification_pallet4').classList = "notification_pallet"
                break;
            case 2:
                document.getElementById('notification_pallet1').classList = "notification_pallet"
                document.getElementById('notification_pallet2').classList = "notification_pallet_active"
                document.getElementById('notification_pallet3').classList = "notification_pallet"
                document.getElementById('notification_pallet4').classList = "notification_pallet"
                break;
            case 3:
                document.getElementById('notification_pallet1').classList = "notification_pallet"
                document.getElementById('notification_pallet2').classList = "notification_pallet"
                document.getElementById('notification_pallet3').classList = "notification_pallet_active"
                document.getElementById('notification_pallet4').classList = "notification_pallet"
                break;
            case 4:
                document.getElementById('notification_pallet1').classList = "notification_pallet"
                document.getElementById('notification_pallet2').classList = "notification_pallet"
                document.getElementById('notification_pallet3').classList = "notification_pallet"
                document.getElementById('notification_pallet4').classList = "notification_pallet_active"
                break;
            default:

                break;
        }

        //Manual config handlers
        if (config.baseconfig.use_alt_storage == true) {
            document.getElementById('pathrepresenter').value = config.baseconfig.alt_location.toString() + "/Timetableconfig.json"
        }

        document.getElementById('select_btn').addEventListener('click', function () { //Select the configuration location
            config.selectlocation()
            document.getElementById('pathrepresenter').value = path.join(config.baseconfig.alt_location.toString(), "Timetableconfig.json")
            config.properties.changed = true
        })
        document.getElementById('save_btn').addEventListener('click', function () {
            config.save()
        })
        document.getElementById('default_btn').addEventListener('click', function () {
            config.usedefault()
        })
        document.getElementById('backup_btn').addEventListener('click', function () {
            config.backup()
        })
        document.getElementById('restore_btn').addEventListener('click', function () {
            config.restore();
        })

        //Set switch positions
        this.setting.hilight.setpostition();
        this.setting.animation.setpostition();
        this.setting.tiles.setpostition();
        this.setting.Row.setpostition();
        this.setting.wallpaper.set_wallpaper()

        //theme and pallet
        this.setting.set_theme();
        document.getElementById('dark_theme_selection').addEventListener('click', function () {
            config.data.theme = "dark";
            config.save();
            UI.setting.set_theme();
        })
        document.getElementById('light_theme_selection').addEventListener('click', function () {
            config.data.theme = "light"
            config.save();
            UI.setting.set_theme();
        })
        document.getElementById('hueinverse-selec').addEventListener('click', function () {
            hue_selec(-1)
            console.log('hue change -1')
        })
        document.getElementById('hue0-selec').addEventListener('click', function () {
            hue_selec(0)
            console.log('%chue change 0', "color: hsl(0,100%,50%)")
        })
        document.getElementById('hue30-selec').addEventListener('click', function () {
            hue_selec(30)
            console.log('%chue change 30', "color: hsl(30,100%,50%)")
        })
        document.getElementById('hue60-selec').addEventListener('click', function () {
            hue_selec(60)
            console.log('%chue change 60', "color: hsl(60,100%,50%)")
        })
        document.getElementById('hue90-selec').addEventListener('click', function () {
            hue_selec(90)
            console.log('%chue change 90', "color: hsl(90,100%,50%)")
        })
        document.getElementById('hue120-selec').addEventListener('click', function () {
            hue_selec(120)
            console.log('%chue change 120', "color: hsl(120,100%,50%)")
        })
        document.getElementById('hue150-selec').addEventListener('click', function () {
            hue_selec(150)
            console.log('%chue change 150', "color: hsl(150,100%,50%)")
        })
        document.getElementById('hue180-selec').addEventListener('click', function () {
            hue_selec(180)
            console.log('%chue change 180', "color: hsl(180,100%,50%)")
        })
        document.getElementById('hue210-selec').addEventListener('click', function () {
            hue_selec(210)
            console.log('%chue change 210', "color: hsl(210,100%,50%)")
        })
        document.getElementById('hue240-selec').addEventListener('click', function () {
            hue_selec(240)
            console.log('%chue change 240', "color: hsl(240,100%,50%)")
        })
        document.getElementById('hue270-selec').addEventListener('click', function () {
            hue_selec(270)
            console.log('%chue change 270', "color: hsl(270,100%,50%)")
        })
        document.getElementById('hue300-selec').addEventListener('click', function () {
            hue_selec(300)
            console.log('%chue change 300', "color: hsl(300,100%,50%)")
        })
        document.getElementById('hue330-selec').addEventListener('click', function () {
            hue_selec(330)
            console.log('%chue change 330', "color: hsl(330,100%,50%)")
        })

        function hue_selec(hue) {
            config.data.colorpallet = hue;
            config.save()
            UI.setting.set_theme();
        }
    },
    navigate: {
        BACK: function () { //Back button handle
            console.log('Back navigation started');

        },
        close_tile: function () {
            console.log('closed full tile function');
            document.getElementById('fullscreen_tile').classList = "fullscreen_tile"
        },
        TABLE: function () {
            console.log('Table navigation started');
            if (config.properties.changed || config.properties.view == "table") {
                window.location.reload();
                /*table.data_render();
                setTimeout(() => { table.hilight_engine_go_vroom(); }, 50);*/
            } else {
                if (config.properties.clocking == false || undefined) {
                    table.clock.start_clock();
                }
                config.properties.view = "table";
                document.getElementById('table1').style.display = 'block';
                document.getElementById('manage_view').style.display = 'none';
                document.getElementById('setting_view').style.display = 'none';
                document.getElementById('setting_btn_icon').style.transform = 'rotate(0deg)'; //Rotate the button
                document.getElementById('setting_btn').className = "menubtn";
                document.getElementById('manage_btn').className = "menubtn";
                document.getElementById('table_btn').className = "menubtn_active";
            }
            document.getElementById('action_bar').className = "Action_bar";
        },
        MANAGE: function () {
            console.log('MANAGE navigation started');
            config.properties.view = "manage";
            table.clock.stop_clock();
            document.getElementById('table1').style.display = 'none';
            document.getElementById('manage_view').style.display = 'block';
            document.getElementById('setting_view').style.display = 'none';
            document.getElementById('setting_btn_icon').style.transform = 'rotate(0deg)'; //Rotate the button
            document.getElementById('setting_btn').className = "menubtn";
            document.getElementById('manage_btn').className = "menubtn_active";
            document.getElementById('table_btn').className = "menubtn";
            document.getElementById('action_bar').className = "Action_bar";
        },
        SETTING: function () {
            console.log('SETTING navigation started');
            config.properties.view = "setting";
            table.clock.stop_clock();
            document.getElementById('table1').style.display = 'none';
            document.getElementById('manage_view').style.display = 'none';
            document.getElementById('setting_view').style.display = 'block';
            document.getElementById('setting_btn_icon').style.transform = 'rotate(90deg)'; //Rotate the button
            document.getElementById('setting_btn').className = "menubtn_active";
            document.getElementById('manage_btn').className = "menubtn";
            document.getElementById('table_btn').className = "menubtn";
            document.getElementById('action_bar').className = "Action_bar"; //Force menu to close
        },
    },
    setting: {
        set_theme: function () {
            console.log('Set theme')
            if (config.data.theme == "dark") {
                set_dark()
                document.getElementById('light_selection_put').checked = false;
                document.getElementById('dark_selection_put').checked = true;
            } else if (config.data.theme == "light") {
                set_light()
                document.getElementById('light_selection_put').checked = true;
                document.getElementById('dark_selection_put').checked = false;
            } else if (config.data.theme == "timebased") {
                //do some quick maths and set a theme
                var now = new Date().getHours();
                console.warn('Time based theme', now)
                if (now > 6 && now < 17) {
                    //day time
                    set_light();
                } else if (now > 16 || now < 7) {
                    //night time
                    set_dark();
                }
            }

            function set_dark() {
                switch (config.data.colorpallet) {
                    case -1:
                        document.getElementById('body').classList = "dark";
                        console.log('Dark inverse theme');
                        break;
                    case 0:
                        document.getElementById('body').classList = "dark _0";
                        console.log('%cdark _0', "color: hsl(0,100%,50%)")
                        break;
                    case 30:
                        document.getElementById('body').classList = "dark _30";
                        console.log('%cdark _30', "color: hsl(30,100%,50%)");
                        break;
                    case 60:
                        document.getElementById('body').classList = "dark _60";
                        console.log('%cdark _60', "color: hsl(60,100%,50%)");
                        break;
                    case 90:
                        document.getElementById('body').classList = "dark _90";
                        console.log('%cdark _90', "color: hsl(90,100%,50%)");
                        break;
                    case 120:
                        document.getElementById('body').classList = "dark _120";
                        console.log('%cdark _120', "color: hsl(120,100%,50%)");
                        break;
                    case 150:
                        document.getElementById('body').classList = "dark _150";
                        console.log('%cdark _150', "color: hsl(150,100%,50%)");
                        break;
                    case 180:
                        document.getElementById('body').classList = "dark _180";
                        console.log('%cdark _180', "color: hsl(180,100%,50%)");
                        break;
                    case 210:
                        document.getElementById('body').classList = "dark _210";
                        console.log('%cdark _210', "color: hsl(210,100%,50%)");
                        break;
                    case 240:
                        document.getElementById('body').classList = "dark _240";
                        console.log('%cdark _240', "color: hsl(240,100%,50%)");
                        break;
                    case 270:
                        document.getElementById('body').classList = "dark _270";
                        console.log('%cdark _270', "color: hsl(270,100%,50%)");
                        break;
                    case 300:
                        document.getElementById('body').classList = "dark _300";
                        console.log('%cdark _300', "color: hsl(300,100%,50%)");
                        break;
                    case 330:
                        document.getElementById('body').classList = "dark _330";
                        console.log('%cdark _330', "color: hsl(330,100%,50%)");
                        break;
                    default:
                        console.error('Theme error :', config.data.colorpallet);
                        document.getElementById('body').classList = "dark _210";
                        config.data.colorpallet = 210;
                }
            }

            function set_light() {
                switch (config.data.colorpallet) {
                    case -1:
                        document.getElementById('body').classList = "light";
                        console.log('light inverse theme');
                        break;
                    case 0:
                        document.getElementById('body').classList = "light _0";
                        console.log('%clight_0', "color: hsl(0,100%,50%)")
                        break;
                    case 30:
                        document.getElementById('body').classList = "light _30";
                        console.log('%clight_30', "color: hsl(30,100%,50%)");
                        break;
                    case 60:
                        document.getElementById('body').classList = "light _60";
                        console.log('%clight_60', "color: hsl(60,100%,50%)");
                        break;
                    case 90:
                        document.getElementById('body').classList = "light _90";
                        console.log('%clight_90', "color: hsl(90,100%,50%)");
                        break;
                    case 120:
                        document.getElementById('body').classList = "light _120";
                        console.log('%clight_120', "color: hsl(120,100%,50%)");
                        break;
                    case 150:
                        document.getElementById('body').classList = "light _150";
                        console.log('%clight_150', "color: hsl(150,100%,50%)");
                        break;
                    case 180:
                        document.getElementById('body').classList = "light _180";
                        console.log('%clight_180', "color: hsl(180,100%,50%)");
                        break;
                    case 210:
                        document.getElementById('body').classList = "light _210";
                        console.log('%clight_210', "color: hsl(210,100%,50%)");
                        break;
                    case 240:
                        document.getElementById('body').classList = "light _240";
                        console.log('%clight_240', "color: hsl(240,100%,50%)");
                        break;
                    case 270:
                        document.getElementById('body').classList = "light _270";
                        console.log('%clight_270', "color: hsl(270,100%,50%)");
                        break;
                    case 300:
                        document.getElementById('body').classList = "light _300";
                        console.log('%clight_300', "color: hsl(300,100%,50%)");
                        break;
                    case 330:
                        document.getElementById('body').classList = "light _330";
                        console.log('%clight_330', "color: hsl(330,100%,50%)");
                        break;
                    default:
                        console.error('Theme error :', config.data.colorpallet);
                        document.getElementById('body').classList = "light _210";
                        config.data.colorpallet = 210;
                }
            }
        },
        notification: {
            set_1: function () {
                console.warn('Notification type 1 selected');
                config.data.notification_type = 1
                config.save();
                notify.new('Notifications', 'Notification type 1 selected');
                document.getElementById('notification_pallet1').classList = "notification_pallet_active"
                document.getElementById('notification_pallet2').classList = "notification_pallet"
                document.getElementById('notification_pallet3').classList = "notification_pallet"
                document.getElementById('notification_pallet4').classList = "notification_pallet"
            },
            set_2: function () {
                console.warn('Notification type 2 selected');
                config.data.notification_type = 2
                config.save();
                notify.new('Notifications', 'Notification type 2 selected');
                document.getElementById('notification_pallet1').classList = "notification_pallet"
                document.getElementById('notification_pallet2').classList = "notification_pallet_active"
                document.getElementById('notification_pallet3').classList = "notification_pallet"
                document.getElementById('notification_pallet4').classList = "notification_pallet"
            },
            set_3: function () {
                console.warn('Notification type 3 selected');
                config.data.notification_type = 3
                config.save();
                notify.new('Notifications', 'Notification type 3 selected');
                document.getElementById('notification_pallet1').classList = "notification_pallet"
                document.getElementById('notification_pallet2').classList = "notification_pallet"
                document.getElementById('notification_pallet3').classList = "notification_pallet_active"
                document.getElementById('notification_pallet4').classList = "notification_pallet"
            },
            set_4: function () {
                console.warn('Notification type 4 selected');
                config.data.notification_type = 4
                config.save();
                notify.new('Notifications', 'Notification type 4 selected');
                document.getElementById('notification_pallet1').classList = "notification_pallet"
                document.getElementById('notification_pallet2').classList = "notification_pallet"
                document.getElementById('notification_pallet3').classList = "notification_pallet"
                document.getElementById('notification_pallet4').classList = "notification_pallet_active"
            },
        },
        hilight: {
            flip: function () {
                console.log('switch triggered');
                if (config.data.hilight_engine) {
                    //turn off the switch
                    config.data.hilight_engine = false;
                    notify.new('Settings', 'hilights dissabled');
                    console.log('hilights dissabled');
                } else {
                    //turn on the witch
                    config.data.hilight_engine = true;
                    table.hilight_engine_go_vroom();
                    notify.new('Settings', 'hilights enabled');
                    console.log('hilights enabled');
                    //table.hilight_engine_go_vroom();
                }
                config.save();
                UI.setting.hilight.setpostition();
            },
            setpostition: function () {
                //sets the switches position depending on the theme, and changes the theme accordingly
                console.log('hilight Position set to: ', config.data.hilight_engine);
                if (config.data.hilight_engine) {
                    document.getElementById('hilight_switch_container').className = 'switch_container_active';
                } else {
                    document.getElementById('hilight_switch_container').className = 'switch_container_dissabled';
                }
            },
        },
        animation: {
            flip: function () {
                console.log('animation switch triggered');
                if (config.data.animation) {
                    //turn off the switch
                    config.data.animation = false;
                    notify.new('Settings', 'animations dissabled');
                    console.warn('animations dissabled');
                } else {
                    //turn on the witch
                    config.data.animation = true;
                    notify.new('Settings', 'animations enabled');
                    console.warn('animations enabled');
                }
                config.save();
                UI.setting.animation.setpostition();
            },
            setpostition: function () {
                if (config.data.animation) {
                    document.getElementById('Animations_switch_container').className = 'switch_container_active';
                    document.getElementById('nomation').href = "";
                } else {
                    document.getElementById('Animations_switch_container').className = 'switch_container_dissabled';
                    document.getElementById('nomation').href = "css/nomation.css"; //nomation sheet removes animations
                }
            },
        },
        tiles: {
            flip: function () {
                console.log('tiles switch triggered');
                if (config.data.tiles) {
                    //turn off the switch
                    config.data.tiles = false;
                    notify.new('Settings', 'tiles dissabled');
                    console.warn('tiles dissabled');
                } else {
                    //turn on the witch
                    config.data.tiles = true;
                    notify.new('Settings', 'tiles enabled');
                    console.warn('tiles enabled');
                }
                config.save();
                UI.setting.tiles.setpostition();
            },
            setpostition: function () {
                if (config.data.tiles) {
                    document.getElementById('tiles_switch_container').className = 'switch_container_active';
                } else {
                    document.getElementById('tiles_switch_container').className = 'switch_container_dissabled';
                }
            },
        },
        Row: {
            flip: function () {
                console.log('Row switch triggered');
                if (config.data.empty_rows) {
                    //turn off the switch
                    config.data.empty_rows = false;
                    notify.new('Settings', 'Empty Rows dissabled');
                    console.warn('Empty Rows dissabled');
                    config.properties.changed = true;
                } else {
                    //turn on the witch
                    config.data.empty_rows = true;
                    notify.new('Settings', 'Empty Rows Enabled');
                    console.warn('Empty Rows Enabled');
                    config.properties.changed = true;
                }
                config.save();
                UI.setting.Row.setpostition();
            },
            setpostition: function () {
                if (config.data.empty_rows) {
                    document.getElementById('Row_switch_container').className = 'switch_container_active';
                } else {
                    document.getElementById('Row_switch_container').className = 'switch_container_dissabled';
                }
            },
        },
        wallpaper: {
            set_wallpaper: function () {
                //document.getElementById('timetable').style.backgroundImage = "url('img/usebkgrounds/test-user-background.jpg')"
            },
        }
    },
}

/*  Notification handler  */
let notify = {
    preset_height: 22, //2 more than the height in the css
    previous_type: 1,
    animate_old: true, //turn on and off old notification Animation
    current: 0, //Current is incimented every time theres a new notifyer
    resizecheck: window.addEventListener('resize', () => {
        notify.clearall()
    }),
    new: function (title, body, fx, bdytitle) {
        this.current++; //Inciment the current pisition
        style = config.data.notification_type;
        if (this.previous_type != style) {
            this.clearall()
        }
        this.previous_type = style;

        //create the notification holder
        var tempnotif = document.createElement("div"); //create a div
        document.body.appendChild(tempnotif); //Put the div into the body of the page
        tempnotif.setAttribute("id", "notif" + this.current); //set an id to the div

        //create the title
        var tmptitle = document.createElement("div"); //create a div
        tmptitle.setAttribute("class", "title"); //set the class of the div to 'title'
        tempnotif.appendChild(tmptitle); //Put the 'title' div into the 'notification' div from before
        tmptitle.innerHTML = title; //Puts the title text into the 'title' div

        //create the body
        var tmpbdy = document.createElement("div"); //create a div
        tmpbdy.setAttribute("class", "notifbody"); //set the class of the div to 'notifbody'
        tempnotif.appendChild(tmpbdy); //put the 'notifbody' div into the 'notification' div from before
        tmpbdy.innerHTML = body; //puts body text into the 'notifbody' div

        //style switch
        switch (style) {
            case 1:
                tempnotif.setAttribute("class", "notification_style1"); //set the class of the div to 'notification_style1'
                this.preset_height = 22;
                break;
            case 2:
                tempnotif.setAttribute("class", "notification_style2"); //set the class of the div to 'notification_style2'
                this.preset_height = 16;
                break;
            case 3:
                tempnotif.setAttribute("class", "notification_style3"); //set the class of the div to 'notification_style2'
                this.preset_height = 16;
                break;
            case 4:
                tempnotif.setAttribute("class", "notification_style4"); //set the class of the div to 'notification_style2'
                this.preset_height = 22;
                break;
            default:
                tempnotif.setAttribute("class", "notification_style3"); //set the class of the div to 'notification_style2'
                this.preset_height = 16;
                break;
        }

        //Timing effects
        setTimeout(() => {
            tempnotif.style.transform = 'translate(0vw,0vh)'
            //manuver old notifications out of the way
            if (this.animate_old) {
                if (document.getElementById('notif' + Number(this.current - 1))) { //stars at -1 because 1 less than the latest notification
                    document.getElementById('notif' + Number(this.current - 1)).style.transform = 'translate(0vw,-' + this.preset_height + 'vh)';
                }
                if (document.getElementById('notif' + Number(this.current - 2))) {
                    document.getElementById('notif' + Number(this.current - 2)).style.transform = 'translate(0vw,-' + this.preset_height * 2 + 'vh)';
                }
                if (document.getElementById('notif' + Number(this.current - 3))) {
                    document.getElementById('notif' + Number(this.current - 3)).style.transform = 'translate(0vw,-' + this.preset_height * 3 + 'vh)';
                }
                if (document.getElementById('notif' + Number(this.current - 4))) {
                    document.getElementById('notif' + Number(this.current - 4)).style.transform = 'translate(0vw,-' + this.preset_height * 4 + 'vh)';
                }
                if (document.getElementById('notif' + Number(this.current - 5))) {
                    document.getElementById('notif' + Number(this.current - 5)).style.transform = 'translate(0vw,-' + this.preset_height * 5 + 'vh)';
                }
                if (document.getElementById('notif' + Number(this.current - 6))) {
                    document.getElementById('notif' + Number(this.current - 6)).style.transform = 'translate(0vw,-' + this.preset_height * 6 + 'vh)';
                }
                if (document.getElementById('notif' + Number(this.current - 7))) {
                    document.getElementById('notif' + Number(this.current - 7)).style.transform = 'translate(0vw,-' + this.preset_height * 7 + 'vh)';
                }
            }

        }, 50); //Slide into view
        setTimeout(() => {
            tempnotif.style.opacity = '0.0'
        }, 10000); //dissapear
        setTimeout(() => {
            document.body.removeChild(tempnotif);
        }, 11000); //remove from document

        if (typeof (fx) == 'function') { //There is a function, use X button
            tempnotif.addEventListener('click', fx); //asign action to shutter

            //Close button
            var xbutton = document.createElement('div')
            xbutton.setAttribute('class', 'x-button')
            tempnotif.appendChild(xbutton)
            xbutton.title = 'click to dismiss';
            xbutton.addEventListener('click', function () {
                event.stopImmediatePropagation();
                //close app
                setTimeout(() => {
                    tempnotif.style.opacity = '0.0';
                }, 100)
                //yee.style.zIndex = '-999';
                tempnotif.style.transform = 'translate(35vw,0)'
            })

        }
        if (bdytitle != undefined) {
            tempnotif.title = bdytitle
        } else {
            tempnotif.title = 'click to dismiss'
        }
        tempnotif.addEventListener('click', function () { //close regardless of function
            setTimeout(() => {
                this.style.opacity = '0.0';
                this.style.zIndex = '-999';
            }, 100)
            this.style.transform = 'translate(35vw,0)'
        })

    },
    clearall: function () {
        if (document.getElementById('notif' + Number(this.current))) { //nep them from latest going up
            document.getElementById('notif' + Number(this.current)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current)).style.transform = 'translate(0vw,0vh)'
        }
        if (document.getElementById('notif' + Number(this.current - 1))) {
            document.getElementById('notif' + Number(this.current - 1)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 1)).style.transform = 'translate(0vw,0vh)'
        }
        if (document.getElementById('notif' + Number(this.current - 2))) {
            document.getElementById('notif' + Number(this.current - 2)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 2)).style.transform = 'translate(0vw,0vh)'

        }
        if (document.getElementById('notif' + Number(this.current - 3))) {
            document.getElementById('notif' + Number(this.current - 3)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 3)).style.transform = 'translate(0vw,0vh)'

        }
        if (document.getElementById('notif' + Number(this.current - 4))) {
            document.getElementById('notif' + Number(this.current - 4)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 4)).style.transform = 'translate(0vw,0vh)'

        }
        if (document.getElementById('notif' + Number(this.current - 5))) {
            document.getElementById('notif' + Number(this.current - 5)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 5)).style.transform = 'translate(0vw,0vh)'

        }
        if (document.getElementById('notif' + Number(this.current - 6))) {
            document.getElementById('notif' + Number(this.current - 6)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 6)).style.transform = 'translate(0vw,0vh)'

        }
        if (document.getElementById('notif' + Number(this.current - 7))) {
            document.getElementById('notif' + Number(this.current - 7)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 7)).style.transform = 'translate(0vw,0vh)'

        }
    }
}

let utility = { //Some usefull things
    /*  Close the app   */
    close: function () {
        config.save();
        if (navigator.app) {
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        } else {
            window.close();
        }
    },
    /*  Push text to the keyboard   */
    clipboard: function (textpush) {
        copyText.toString(); //Makes it a string so the clipboard will accept it
        let temptxtbox = document.createElement("input"); //creates an 'input' element and assigns it to 'temptxtbox'
        document.body.appendChild(temptxtbox); //Puts the input element into the document
        temptxtbox.setAttribute("id", "temp_copy"); //Assigns an id to the input element
        document.getElementById("temp_copy").value = copyText; //Puts the txt u want to copy into the input element
        temptxtbox.select(); //Makes the curser select the text that's in the input element
        document.execCommand("copy"); //Commands the document to copy the selected text
        document.body.removeChild(temptxtbox); //Removes the input element from the document
    },
    /*  Produce Random numbers  */
    rand: {
        HEX: function () {
            return '#' + Math.floor(Math.random() * 16777215).toString(16) /* hex color code */
        },
        RGB: function () {
            return {
                RED: this.number(255, 0),
                GREEN: this.number(255, 0),
                BLUE: this.number(255, 0)
            } /* object with RGB color code */
        },
        HSL: function () {
            return {
                HUE: this.number(360, 0),
                SATURATION: this.number(100, 0) + '%',
                LIGHTENESS: this.number(100, 1) + '%'
            } /* HSL color code */
        },
        number(max, min) {
            return Math.floor(Math.random() * (max - min + 1)) + min /* Random number*/
        }
    },
}