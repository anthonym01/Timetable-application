const { Toast, App, Clipboard } = Capacitor.Plugins;//plugins


App.addListener('appStateChange', ({ isActive }) => {// app state is changed, usually sent to the background or suspended
    console.warn('App state changed. Is active: ', isActive);
    if (isActive) {
        //table.clock.stop_clock();//Stop ze clock
    } else {
        //if (config.properties.view == 'table') { table.clock.start_clock() }//resume clock tick
    }
});


window.addEventListener('load', function () { maininitalizer() })

document.getElementById('export_to_clipboard').addEventListener('click', async function () {
    document.getElementById("config_text").value = JSON.stringify(config.data)
    clipboard(JSON.stringify(config.data))

    Toast.show({
        text: 'config coppied to Clipboard',
        duration: 'long',
        position: 'bottom',
    });

})
document.getElementById('import_from_text').addEventListener('click', async function () {


    let parsed_data = JSON.parse(document.getElementById("config_text").value)

    if (parsed_data.key == "TT01") {
        console.log('This is a config file, load its ass')
        utility.toast('Loaded configuration from: ' + experimentalpath)

        config.data = parsed_data;
        config.save()
        UI.setting.hilight.setpostition()
        UI.setting.animation.setpostition()
        UI.setting.tiles.setpostition()
        UI.setting.Row.setpostition()
        UI.setting.wallpaper.set_wallpaper()
        UI.setting.set_theme()
        table.data_render()
        manage.initalize()
    } else {
        console.log('This is not a config file for this app')
    }
    /*Toast.show({
        text: 'config coppied to Clipboard',
        duration: 'long',
        position: 'bottom',
    });*/

})
function maininitalizer() {

    if (localStorage.getItem(config.configlocation)) {
        config.load()
    } else {
        config.validate()
    }
    //loader.style.width = '25%'
    UI.initalize()
    //loader.style.width = '50%'
    manage.initalize()
    //loader.style.width = '75%'
    table.initialize()
    //loader.style.width = '100%'
    config.properties.startup = false
    setTimeout(() => {
        //UI.navigate.TABLE()
        console.log('Closing loading screen...')
        table.hilight_engine_go_vroom()
        //table.clock.start_clock()
        clocktick()
        setInterval(() => { clocktick() }, 1000)
        //document.getElementById('Loading').style.display = 'none'
        /*navigator.splashscreen.hide();*/

    }, 50)
}

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
            /*
                        { show: 4, day: 1, name: "Test 1", Lecturer: "placeholder", room: "none", course_code: "test data", type: "test data", color: { hue: 0, sat: 100, light: 50 }, start: 0.0, end: 1.0 },
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
    save: function () {//Save the config file
        localStorage.setItem(this.configlocation, JSON.stringify(this.data))
        console.log('config saved: ')
        console.table(this.data)
    },
    load: function () {//Load the config file into memory
        this.data = JSON.parse(localStorage.getItem(this.configlocation))
        console.log('config Loaded: ')
        console.table(this.data)
        this.validate()
    },
    validate: function () {//validate configuration file
        console.log('Config is being validated')
        let configisvalid = true
        if (typeof (this.data.table1_db) !== 'undefined') {
            if (this.data.table1_db == undefined || null) {//check db existance
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
                        if (config.data.table1_db[i].show != 1 && 2 && 3 && 4 && 0) { config.data.table1_db[i].show = 1 }//fix oversight on older version
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

        if (typeof (this.data.previous_colors) !== 'undefined') {
            if (this.data.previous_colors == undefined || null) {//check db existance
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
            this.data.theme = "light";
            configisvalid = false;
            console.log('"theme" was found to not exist and was set to default');
        }
        else {
            if (this.data.theme == undefined || null) {
                this.data.theme = "light";
                configisvalid = false;
                console.log('"theme" was found to not exist and was set to default');
            }
        }

        if (typeof (this.data.hilight_engine) == 'undefined') {
            this.data.hilight_engine = true;
            configisvalid = false;
            console.log('"hilight_engine" was found to be invalid and was set to default');
        }
        else {
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
        }
        else {
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
        }
        else {
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
        }
        else {
            if (this.data.tiles != true && this.data.tiles != false) {
                this.data.tiles = false;
                configisvalid = false;
                console.log('"tiles" was found to not exist and was set to default');
            }
        }

        if (typeof (this.data.table_details) == 'undefined') {
            this.data.table_details = [{ purpose: "Table #1" }, { purpose: "Table #2" }, { purpose: "Table #3" }, { purpose: "Table #4" }];
            console.log('Table names were not defined!');
            configisvalid = false;
        }

        if (typeof (this.data.previous_colors) == 'undefined') {
            this.data.previous_colors = [];
            console.log('previous_colors were not defined!');
            configisvalid = false;
        } else {
            config.data.previous_colors = Array.from(new Set(config.data.previous_colors));//remove dublicates; vary comblicated (Sets dont allow duplicates, convert array to new set using "new Set()" then back to array using "Array.from()"")
            //limit to 25
            if (config.data.previous_colors.length > 25) {
                var i = 22;//because reasons
                while (config.data.previous_colors[i] != null || undefined) {//check check check
                    console.error('Removed recent color :', config.data.previous_colors.pop())//for debugging
                    i++;
                }
            }
        }

        if (!configisvalid) {
            console.log('config was found to be invalid and will be overwritten');
            this.save();//Save new confog because old config is no longer valid
        } else {
            console.log('config was found to be valid');
        }
    },
    delete: function () {//Does not delete the file itself. Just sets it to empty
        localStorage.clear(this.configlocation);
        console.log('config deleted: ');
        console.table(this.data);
        setTimeout(() => { location.reload() }, 100);
        this.validate();
    },
    backup: function (filepath) { //backup configuration to file
        console.log('Configuration backup initiated')

        filepath = '/timetable_backup.json'

    },
    restore: async function () { //restore configuration from file
        console.log('Configuration restore initiated')

        //filepath = '/testfile.json'//filepath
        //var file = chooser.getFile()

        /*
        await file.then((file) => {
            console.log('FIle chosen: ', file)
            window.resolveLocalFileSystemURL(file[0].uri, function (Entry) {
                console.log('Resolved uri: ', Entry.fullPath)//got file path, but needs to be resolved
                var experimentalpath = Entry.fullPath.replace('/com.android.providers.downloads.documents/document/raw:/storage/emulated/0', '')
                var experimentalpath = experimentalpath.replace('/com.android.externalstorage.documents/document/primary:', '/')
                cordova.file.
                    console.log(experimentalpath)
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {//Request access to file system
                    fs.root.getFile(experimentalpath, { create: false, exclusive: true }, function (fileEntry) {//Creates fileentry relitive to the root directory on android /storage/emulated/0/
                        console.log("fileEntry is file :" + fileEntry.isFile.toString())// is file a file?

                        fileEntry.file(function (file) {
                            var reader = new FileReader();

                            reader.onloadend = function () {
                                console.log("file loadend event output: " + this.result);
                                var parsed_data = this.result;
                                parsed_data = JSON.parse(parsed_data);
                                if (parsed_data.key == "TT01") {
                                    console.log('This is a config file, load its ass')
                                    utility.toast('Loaded configuration from: ' + experimentalpath)

                                    config.data = parsed_data;
                                    config.save()
                                    UI.setting.hilight.setpostition()
                                    UI.setting.animation.setpostition()
                                    UI.setting.tiles.setpostition()
                                    UI.setting.Row.setpostition()
                                    UI.setting.wallpaper.set_wallpaper()
                                    UI.setting.set_theme()
                                    table.data_render()
                                    manage.initalize()
                                } else {
                                    console.log('This is not a config file for this app')
                                    utility.toast('This is not a config file for this app')
                                }
                            }
                            console.log('File reader output text: ', reader.readAsText(file))//reader.readASText required
                        }, function () {
                            console.log('file error')
                        });

                    }, function () {//file entry fails
                        console.log('failed to create file entry')
                        utility.toast('failed to create file entry, app may not have file permissions')
                    })
                }, function () {//No file permission given
                    console.error('Failed to get file permissions')
                    utility.toast('Failed to get file permissions')
                })

            }, function () { console.error('Failed to resolve URI') })
        })*/
    }
}

/*  Table generator */
let table = {
    initialize: function () {
        console.log('Table initalization Begins');
        this.data_render(); //render data
        config.properties.changed = false;
    },
    data_render: function () {
        console.log('Table render started')
        //var i = 0;

        //wjipe main cells
        var jkx = document.querySelectorAll(".jkx")
        for (let i = 0; i < jkx.length; i++) {
            jkx[i].innerHTML = ""
            jkx[i].style.display = ""
        }

        document.getElementById('day0').style.display = '';
        document.getElementById('day1').style.display = '';
        document.getElementById('day2').style.display = '';
        document.getElementById('day3').style.display = '';
        document.getElementById('day4').style.display = '';
        document.getElementById('day5').style.display = '';
        document.getElementById('day6').style.display = '';
        for (let i = 0; i < 24; i++) {
            document.getElementById('timerow_' + i).style.display = "";
        }

        config.properties.max = 0
        config.properties.min = 24
        config.properties.monday = false
        config.properties.tuesday = false
        config.properties.wednsday = false
        config.properties.thursday = false
        config.properties.friday = false
        config.properties.saturday = false
        config.properties.sunday = false

        if (config.data.table1_db[0] == null || undefined) {
            //show first time setup screen


            /*notify.new('U new here?', 'To start off, click here to add some classes', function () {
                UI.navigate.MANAGE()
                manage.dialogue.open()
            })*/
        } else {
            for (let i = 0; i < config.data.table1_db.length; i++) { //Get minimum time and maximum time to construct correct height
                if (config.data.table1_db[i].deleted != true && config.data.table1_db[i].show == config.data.table_selected) {
                    let starthraw = Number(config.data.table1_db[i].start) - config.data.table1_db[i].start % 1; // taking away the modulus 1 of itself removes the remainder
                    config.properties.min = Math.min(starthraw, config.properties.min); //find minimum time in all datu
                    config.properties.max = Math.max(config.data.table1_db[i].end, config.properties.max); //find maximum time in all datu
                }
            }
            console.log('Table minimum found to be: ', config.properties.min, ' Table maximum found to be: ', config.properties.max)
            for (let i = 0; i < config.data.table1_db.length; i++) { //construct table
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
            name_tab_content.classList = "nowrap"
            name_tab_content.innerHTML = config.data.table1_db[index].name;
            //name_tab_content.setAttribute("colspan", 2);
            name_tab_row.appendChild(name_tab_content);
            sub_tab.appendChild(name_tab_row);
            doot.appendChild(sub_tab);
            let time_tab_row = document.createElement("tr");
            let time_tab = document.createElement("td");
            time_tab.classList = "nowrap"
            //time_tab.setAttribute("colspan", 2);
            time_tab.innerHTML = starthr + ':' + startminute + ' ' + startmeridian + ' to ' + endhr + ':' + endminute + ' ' + endmeridian;
            time_tab_row.appendChild(time_tab);
            sub_tab.appendChild(time_tab_row);
            doot.appendChild(sub_tab);
            tempblock.appendChild(doot);
            if (config.data.table1_db[index].detail != "" && config.data.table1_db[index].detail != undefined) {
                let detail_row = document.createElement("tr");
                let detail_content = document.createElement("td");
                //detail_content.setAttribute("colspan", 2);
                detail_content.innerHTML = marked(config.data.table1_db[index].detail);
                detail_row.appendChild(detail_content);
                sub_tab.appendChild(detail_row);
                doot.appendChild(sub_tab);
            }


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

                console.log(blocktop, document.getElementById('live_clock').getBoundingClientRect())

                tempblock.style.transform = "translate(-0.5vh," + blocktop + 'px' + ")";
                if (config.data.table1_db[index].color.light < 49) {
                    tempblock.style.color = "white"
                    tempblock.style.textShadow = " 0vh 0vh 2vh black";
                } else {
                    tempblock.style.color = "black"
                    tempblock.style.textShadow = " 0vh 0vh 2vh white";
                }
            }, 500);

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
                    if (config.data.table1_db[index].detail != undefined) {
                        document.getElementById('detail_cell').innerHTML = marked(config.data.table1_db[index].detail);
                    } else {
                        document.getElementById('detail_cell').innerText = "No details"
                    }
                    document.getElementById('time_cell').innerText = starthr + ':' + startminute + ' ' + startmeridian + ' to ' + endhr + ':' + endminute + ' ' + endmeridian;
                    document.getElementById('fullscreen_tile').classList = "fullscreen_tile_active"
                    document.getElementById('close_btn').style.backgroundColor = "hsl(" + config.data.table1_db[index].color.hue + "," + config.data.table1_db[index].color.sat + "%," + config.data.table1_db[index].color.light + "%)";
                    if (config.data.table1_db[index].color.light > 49) {
                        document.getElementById('close_btn').style.color = "black"
                    } else {
                        document.getElementById('close_btn').style.color = "white"
                    }
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
                    utility.toast('Table: ' + config.data.table_details[config.data.table_selected].purpose + ' is empty')
                }
                console.log('Table validated');
            }

        }
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
            if (!event.target.classList.contains('data_block') && !event.target.classList.contains('data_block_active')) { //check if the cell is a data_block
                if (config.data.theme == "light") {
                    event.target.style.color = 'black';
                    event.target.style.backgroundColor = 'hsl(' + rand.number(360, 0) + ',100%,70%)'; //color the target
                } else if (config.data.theme == "dark") {
                    event.target.style.color = 'black';
                    event.target.style.backgroundColor = 'hsl(' + rand.number(360, 0) + ',100%,60%)'; //color the target
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
                break;
            } else {
                document.getElementById('tablemanage_txt').innerText = "Homeless tiles";
            }
            i++
        }
        //Initalize day_put selector
        document.getElementById('day_put').value = "1";
        document.getElementById('day_put_text').innerText = "Monday"

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
        document.getElementById('color_put').addEventListener('touchmove', slidecolor)
        document.getElementById('sat_put').addEventListener('touchmove', slidesat)
        document.getElementById('color_put').addEventListener('touchmove', slidecolor)
        document.getElementById('sat_put').addEventListener('touchmove', slidesat)

        function slidecolor() {
            document.getElementById('light_put').style.background = "linear-gradient(90deg, #000000,hsl(" + document.getElementById('color_put').value + "," + document.getElementById('sat_put').value + "%, 50%),#ffffff)";
            document.getElementById('sat_put').style.background = "linear-gradient(90deg, rgb(128, 128, 128),hsl(" + document.getElementById('color_put').value + ", 100%, 50%)";
        }

        function slidesat() {
            document.getElementById('light_put').style.background = "linear-gradient(90deg, #000000,hsl(" + document.getElementById('color_put').value + "," + document.getElementById('sat_put').value + "%, 50%),#ffffff)";
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
            if (config.data.table_details[0] == null) { //there are no tables or everyone is homeless render them all
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
                    config.data.table1_db[index].deleted = true
                    config.save()
                    manage.render_list()
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
            document.getElementById('detail_put').value = config.data.table1_db[index].detail; //set detail
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
            document.getElementById('detail_put').value = "";
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
                detail: null,
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
            tempentry.detail = document.getElementById('detail_put').value;

            //Get Name feild
            tempentry.name = document.getElementById('name_put').value;
            if (tempentry.name == "" || undefined || null) {
                entryisvalid = false;
                document.getElementById('name_put').style.border = "0.3vh solid #ff0000";
                utility.toast('Cannot save without A name')
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
                utility.toast('Need to set a start time')
                document.getElementById('start_time_put').style.border = "0.3vh solid #ff0000";
                entryisvalid = false;
            } else if (end_time_raw == "" || end_time_raw == null || end_time_raw == undefined) {
                utility.toast('Need to set an end time')
                document.getElementById('end_time_put').style.border = "0.3vh solid #ff0000";
                entryisvalid = false;
            } else if (percentage_start == percentage_end) {
                document.getElementById('start_time_put').style.border = "0.3vh solid #ff0000";
                document.getElementById('end_time_put').style.border = "0.3vh solid #ff0000";
                entryisvalid = false;
            } else if (percentage_start > percentage_end) {
                utility.toast('Event cant start after it ends')
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
                manage.initalize()
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
                utility.toast('Confirmation ', document.getElementById('name_put').value + ' was saved, U may now add another');
                //no clear function needed, the clearfeild action btns will fufill this task
                manage.dialogue.open();
            }
        },
    },

}

/*  UI trickery */
let UI = {
    initalize: function () {
        console.log('UI Initalize');

        //Manual config handlers
        document.getElementById('backup_btn').addEventListener('click', function () {
            config.backup('/')
        })
        document.getElementById('restore_btn').addEventListener('click', function () {
            config.restore();
        })

        //name autofill
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
        document.getElementById('save_btn').addEventListener('click', manage.dialogue.save); //Save button
        document.getElementById('savepluss_btn').addEventListener('click', manage.dialogue.saveplus);
        document.getElementById('delete_btn').addEventListener('click', function () {
            console.log('Delete called');
            config.data.table1_db[config.properties.overwrite].deleted = true;
            config.properties.changed = true
            manage.dialogue.close();
            manage.dialogue.clear();
            manage.render_list();
        });
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

        /*
                setTimeout(() => {
                    window.plugins.screensize.get(function (result) {//Check device screen size
                        console.log(result);
                        if (result.diameter > 5.9) {
                            //tablet size screen
                            document.getElementById('stylesheet').href = "css/index-tablet.css"
                            console.warn('Set tablet screen scale with size: ', result.diameter);
                        } else {
                            //phone size screen
                            document.getElementById('stylesheet').href = "css/index-phone.css"
                            console.warn('Set phone screen scale with size: ', result.diameter);
                        }
                    }, function (err) {
                        console.log(err)
                        //error default to phone size
                        document.getElementById('stylesheet').href = "css/index-phone.css"
                        console.error('defaulted to phone screen scale');
                    });
                }, 500);
        */
        //Action bar handlers (look about touch triggers)
        document.getElementById('action_bar').addEventListener('mouseover', function () {
            document.getElementById('action_bar').className = "Action_bar_active";
        })
        document.getElementById('action_bar').addEventListener('mouseout', function () {
            document.getElementById('action_bar').className = "Action_bar";
        })
        //Proto navigation
        document.getElementById('table_btn').addEventListener('touchstart', UI.navigate.TABLE)
        document.getElementById('manage_btn').addEventListener('touchstart', UI.navigate.MANAGE)
        document.getElementById('setting_btn').addEventListener('touchstart', UI.navigate.SETTING)
        document.getElementById('hilight_btn').addEventListener('click', UI.setting.hilight.flip)
        document.getElementById('Animations_btn').addEventListener('click', UI.setting.animation.flip)
        document.getElementById('Row_btn').addEventListener('click', UI.setting.Row.flip)
        document.getElementById('tiles_btn').addEventListener('click', UI.setting.tiles.flip)
        document.getElementById('close_btn').addEventListener('click', UI.navigate.close_tile);


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
        close_tile: function () {
            console.log('closed full tile function');
            document.getElementById('fullscreen_tile').classList = "fullscreen_tile"
        },
        TABLE: function () {
            console.log('Table navigation started');

            document.getElementById('Loading').style.display = 'none'
            if (config.properties.changed) {
                table.initialize();
                /*table.data_render();
                setTimeout(() => { table.hilight_engine_go_vroom(); }, 50);*/
            }
            if (config.properties.clocking == false || undefined) {
                //table.clock.start_clock();
            }
            config.properties.view = "table";
            document.getElementById('table1').style.display = 'block';
            document.getElementById('manage_view').style.display = 'none';
            document.getElementById('setting_view').style.display = 'none';
            document.getElementById('setting_btn_icon').style.transform = 'rotate(0deg)'; //Rotate the button
            document.getElementById('setting_btn').className = "menubtn";
            document.getElementById('manage_btn').className = "menubtn";
            document.getElementById('table_btn').className = "menubtn_active";
            document.getElementById('action_bar').className = "Action_bar";
        },
        MANAGE: function () {
            console.log('MANAGE navigation started');

            document.getElementById('Loading').style.display = 'none'
            config.properties.view = "manage";
            //table.clock.stop_clock();
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

            document.getElementById('Loading').style.display = 'none'
            config.properties.view = "setting";
            //table.clock.stop_clock();
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
        hilight: {
            flip: function () {
                console.log('switch triggered');
                if (config.data.hilight_engine) {
                    //turn off the switch
                    config.data.hilight_engine = false;
                    utility.toast('hilights dissabled')
                    console.log('hilights dissabled');
                } else {
                    //turn on the witch
                    config.data.hilight_engine = true;
                    table.hilight_engine_go_vroom();
                    utility.toast('hilights enabled')
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
                    utility.toast('animations dissabled')
                    console.warn('animations dissabled');
                } else {
                    //turn on the witch
                    config.data.animation = true;
                    utility.toast('animations enabled')
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
                    utility.toast('tiles dissabled')
                    console.warn('tiles dissabled');
                } else {
                    //turn on the witch
                    config.data.tiles = true;
                    utility.toast('tiles enabled')
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

                    Toast.show({
                        text: 'Empty Rows dissabled',
                        duration: 'long',
                        position: 'bottom',
                    });

                    console.warn('Empty Rows dissabled');
                    config.properties.changed = true;
                } else {
                    //turn on the witch
                    config.data.empty_rows = true;
                    utility.toast('Empty Rows Enabled')
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
                if (false) {
                    document.getElementById('timetable').style.backgroundImage = "url()"
                }
            },
        }
    },
}

let rand = {//Some usefull thing
    HEX: function () { return '#' + Math.floor(Math.random() * 16777215).toString(16) /* hex color code */ },
    RGB: function () { return { RED: this.number(255, 0), GREEN: this.number(255, 0), BLUE: this.number(255, 0) } /* object with RGB color code */ },
    HSL: function () { return { HUE: this.number(360, 0), SATURATION: this.number(100, 0) + '%', LIGHTENESS: this.number(100, 1) + '%' }/* HSL color code */ },
    number(max, min) { return Math.floor(Math.random() * (max - min + 1)) + min /* Random number*/ }
}

async function clipboard(textpush) {//Push text to clipboard


    try {
        Clipboard.write({ string: textpush });
    } catch (error) {
        navigator.clipboard.writeText(textpush)
    }


    //navigator.clipboard.writeText(textpush)
}