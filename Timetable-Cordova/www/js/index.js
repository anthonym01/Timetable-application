
var app = {// Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
        document.addEventListener("pause", this.onPause, false);
        document.addEventListener("resume", this.onResume, false);
    },// deviceready Event Handler

    onDeviceReady: function() {//device ready event
        this.receivedEvent('deviceready');
        console.log('Device Ready...');
    },
    onBackKeyDown:function() {//Back button pressed event
        console.log('"Backbtn" event triggered');
        UI.navigate.BACK();
    },
    onPause:function(){//application pause event
        console.log('"pause" event triggered');
        table.clock.stop_clock();//Stop ze clock
        config.save();
    },
    onResume:function(){
        console.log('"Resume" event triggered');
        if(config.properties.view=='table'){table.clock.start_clock()}//resume clock tick
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};app.initialize();

window.addEventListener('load',function(){//window loads
    console.log('javascript Starts');
    if(localStorage.getItem(config.configlocation)){
        config.load()
    }else{
        config.validate()
    }
    UI.initalize();
    table.initialize();
    manage.initalize();
    config.properties.startup=false;
    setTimeout(()=>{
        console.log('Closing loading screen...');
        document.getElementById('Loading').style.display='none';
    },50);
});

/*  Config file handler    */
var config={
    data:{
        theme:"dark",
        hilight_engine:false,
        animation:true,
        tiles:false,
        table_selected:1,
        table_details:[// Details about different tables
            {purpose:"table 1"},
            {purpose:"table 2"},
            {purpose:"table 3"},
            {purpose:"table 4"}
        ],
        table1_db:[// Table database
            /*          KEY
                name:           Name of the class
                day:            1-7, represent monday to friday
                room:           Room/location of the class
                type:           class type (1 - Lecture,2 - Practical,custom - a custom string)
                course_code:    A string containing the courses id code
                color:          Color of the block
                start:          The starting time of the class represented in 24hr
                end:            End time of the class represented in 24hr
                    (minutes represented as percentage of hr "30/60 = 0.5")
            */
            /*
            {show:1,day:1,name:"Test 1",Lecturer:"placeholder",room:"none",course_code:"cpyxkt",type:"test_class",color:1,start:10.00,end:11.833},
            {show:1,day:2,name:"Test 2",Lecturer:"placeholder",room:"none",course_code:"wfsvvt",type:"test_class",color:2,start:12.5,end:14.833},
            {show:1,day:3,name:"Test 3",Lecturer:"placeholder",room:"none",course_code:"dfvsdzf",type:"test_class",color:3,start:10.5,end:13},
            {show:1,day:4,name:"Test 4",Lecturer:"placeholder",room:"none",course_code:"wfvt",type:"test_class",color:4,start:9.2,end:12},
            {show:1,day:5,name:"Test 5",Lecturer:"placeholder",room:"none",course_code:"wfsvvvt",type:"test_class",color:5,start:13.8,end:14.833},
            {show:1,day:6,name:"Test 6",Lecturer:"placeholder",room:"none",course_code:"wfsvvsfvvt",type:"test_class",color:6,start:12.5,end:16.833},
            {show:1,day:7,name:"Test 7",Lecturer:"placeholder",room:"none",course_code:"svfdvt",type:"test_class",color:7,start:10.5,end:15.833},
            */
        ],
    },
    properties:{
        monday:false,
        tuesday:false,
        wednsday:false,
        thursday:false,
        friday:false,
        saturday:false,
        sunday:false,
        changed:false,
        max:0,min:24,//Swapped because big brain, big big brain
        overwrite:null,
        called_from_plus:false,
        view:"table",//defaults to table
        exit:false,
        startup:true,
    },
    configlocation:"TT001_cfg",//not strict, can be anything. Think of it as a file name/path
    save:function(){//Save the config file
        localStorage.setItem(this.configlocation,JSON.stringify(this.data));
        console.log('config saved: ');
        console.table(this.data);
    },
    load:function(){//Load the config file into memory
        this.data=JSON.parse(localStorage.getItem(this.configlocation));
        console.log('config Loaded: ');
        console.table(this.data);
        this.validate();
    },
    validate:function(){//validate configuration file
        console.log('Config is being validated');
        var configisvalid = true;
        if(typeof(this.data.table1_db)!=='undefined'){
            if(this.data.table1_db==undefined||null){//check db existance
                this.data.table1_db=[];
                configisvalid=false;
                console.log('"Table1_database" was found to be invalid and was set to default');
            }else{
                var i=0;
                var overwrite=[];
                var deleted=[];
                var detetioncheck=false;
                //Construct the data
                while(config.data.table1_db[i]!=null||undefined){
                    console.log('checked state on :',i);
                    if(config.data.table1_db[i].deleted){
                        deleted.push(config.data.table1_db[i]);
                        console.log('State of ',i,' false');
                        detetioncheck=true;
                    }else{
                        if(config.data.table1_db[i].show!=1 && 2 && 3 && 4 && 0){config.data.table1_db[i].show=1;}//fix oversight on older version
                        overwrite.push(config.data.table1_db[i]);
                        console.log('State of ',i,' true');
                    }
                    i++;
                }
                if(detetioncheck){
                    console.table(deleted);
                    config.data.table1_db=overwrite;
                }
            }
        }else{
            this.data.table1_db=[];
            configisvalid=false;
            console.log('"Table1_database" was found to not exist and was set to default');
        }

        if(typeof(this.data.theme)=='undefined'){
            this.data.theme="light";
            configisvalid=false;
            console.log('"theme" was found to not exist and was set to default');
        }
        else{
            if(this.data.theme==undefined||null){
                this.data.theme="light";
                configisvalid=false;
                console.log('"theme" was found to not exist and was set to default');
            }
        }

        if(typeof(this.data.hilight_engine)=='undefined'){
            this.data.hilight_engine=true;
            configisvalid=false;
            console.log('"hilight_engine" was found to be invalid and was set to default');
        }
        else{
            if(this.data.hilight_engine!=true && this.data.hilight_engine!=false){
                this.data.hilight_engine=true;
                configisvalid=false;
                console.log('"hilight_engine" was found to not exist and was set to default');
            }
        }

        if(typeof(this.data.animation)=='undefined'){
            this.data.animation=true;
            configisvalid=false;
            console.log('"animation" was found to be invalid and was set to default');
        }
        else{
            if(this.data.animation!=true && this.data.animation!=false){
                this.data.animation=true;
                configisvalid=false;
                console.log('"animation" was found to not exist and was set to default');
            }
        }

        if(typeof(this.data.tiles)=='undefined'){
            this.data.tiles=false;
            configisvalid=false;
            console.log('"tiles" was found to be invalid and was set to default');
        }
        else{
            if(this.data.tiles!=true && this.data.tiles!=false){
                this.data.tiles=false;
                configisvalid=false;
                console.log('"tiles" was found to not exist and was set to default');
            }
        }
        
        if(typeof(this.data.table_details)=='undefined'){
            this.data.table_details=[ {purpose:"Table #1"}, {purpose:"Table #2"}, {purpose:"Table #3"}, {purpose:"Table #4"}];
            console.log('Table names were not defined!');
            configisvalid=false;
        }

        if(!configisvalid){
            console.log('config was found to be invalid and will be overwritten');
            this.save();//Save new confog because old config is no longer valid
        }else{
            console.log('config was found to be valid');
        }
    },
    delete:function(){//Does not delete the file itself. Just sets it to empty
        localStorage.clear(this.configlocation);
        console.log('config deleted: ');
        console.table(this.data);
        utility.toast('App will now restart');
        setTimeout(()=>{location.reload()},3000);
        this.validate();
    },
}

/*  Table generator\manager */
let table = {
    initialize:function(){
        console.log('Table initalization Begins');
        this.construct.render();
        this.clock.clock_tick();
        setTimeout(()=>{table.hilight_engine.initialize();},50);
    },
    construct:{
        render:function(){//initalizes, and feeds the build function
            console.log('Table render started')
            var i=0;
            if(config.data.table_selected==0){config.data.table_selected=1}//Fix oversight
            if(config.data.table1_db[i]==null||undefined){
                //show first time setup screen
                this.first_settup(1);
            }else{
                while(config.data.table1_db[i]!=null||undefined){//Get minimum time and maximum time to construct correct height
                    if(config.data.table1_db[i].deleted!=true && config.data.table1_db[i].show==config.data.table_selected){
                        var starthraw =Number(config.data.table1_db[i].start)-config.data.table1_db[i].start%1;//removes remainder
                        config.properties.min = Math.min(starthraw,config.properties.min);//find minimum time in all datu
                        config.properties.max = Math.max(config.data.table1_db[i].end,config.properties.max);//find maximum time in all datu
                    }
                    i++;
                }
                console.warn('Table minimum found to be: ',config.properties.min);
                console.warn('Table maximum found to be: ',config.properties.max);
                i=0;
                while(config.data.table1_db[i]!=null){//construct table
                    console.log('Data run on index :',i);
                    if(config.data.table1_db[i].deleted!=true && config.data.table1_db[i].show==config.data.table_selected){
                        this.build_block_db1(i);
                    }
                    i++;
                }
                this.validate();//Strip empty cells form top and bottom
            }
            console.log('Table render Completed');
            UI.navigate.TABLE();//Starts the ticking of the clock
        },
        build_block_db1:function(index){//Builds timetable from database
            console.log('Building Block :',index);
                //Create the data block
                var tempblock = document.createElement('div');
                
                //assign a color
                tempblock.setAttribute("class", "data_block hue"+config.data.table1_db[index].color);

                //time processing
                var startmeridian = 'a.m.';
                var starthr=0;
                var startminute=Number(config.data.table1_db[index].start%1*60).toFixed(0);
                if(startminute==0){startminute='00'}
                var endmeridian = 'a.m.';
                var endhr = 0;
                var endminute=Number(config.data.table1_db[index].end%1*60).toFixed(0);
                if(endminute==0){endminute='00'}
                
                if(config.data.table1_db[index].start>12){
                    startmeridian='p.m.';//morning or evening
                    starthr=Number(config.data.table1_db[index].start-12)-config.data.table1_db[index].start%1;//removes remainder
                }else{
                    starthr=Number(config.data.table1_db[index].start)-config.data.table1_db[index].start%1;//removes remainder
                }
                if(config.data.table1_db[index].end>12){
                    endmeridian='p.m.';//morning or evening
                    endhr=Number(config.data.table1_db[index].end-12)-config.data.table1_db[index].end%1;//removes remainder
                }else{
                    endhr=Number(config.data.table1_db[index].end)-config.data.table1_db[index].end%1;//removes remainder
                }
                if(starthr==0){starthr=12}
                if(endhr==0){endhr=12}
        
                
                //populate the block with relivant data
                tempblock.innerHTML=config.data.table1_db[index].name/* + '<br>' + starthr+':'+startminute+' '+startmeridian+' - '+endhr+':'+endminute+' '+endmeridian*/;

                //info doots
                var doot = document.createElement('div');
                doot.setAttribute('class','infodoot');
                if(config.data.table1_db[index].start<config.properties.min+3){//Set the doot to flip up or down depending on the pannels position
                    doot.style.top='0vh';
                    doot.style.bottom='unset';
                }

                //Put doot into the Data Bar
                //make table in doot to keep things even
                var sub_tab = document.createElement("table");
                var name_tab_row = document.createElement("tr");
                var name_tab_content = document.createElement("th");
                name_tab_content.innerHTML=config.data.table1_db[index].name;
                name_tab_content.setAttribute("colspan",2);
                name_tab_row.appendChild(name_tab_content);
                sub_tab.appendChild(name_tab_row);
                doot.appendChild(sub_tab);
                if(config.data.table1_db[index].room!="" && config.data.table1_db[index].room!=undefined){
                    var room_tab_row = document.createElement("tr");
                    var room_tab_head = document.createElement("td");
                    var room_tab_content = document.createElement("td");
                    room_tab_head.setAttribute("class","lefter");
                    room_tab_content.setAttribute("class","righter");
                    room_tab_head.innerHTML='Room : ';
                    room_tab_content.innerHTML=config.data.table1_db[index].room;
                    room_tab_row.appendChild(room_tab_head);
                    room_tab_row.appendChild(room_tab_content);
                    sub_tab.appendChild(room_tab_row);
                    doot.appendChild(sub_tab);
                }
                if(config.data.table1_db[index].course_code!="" && config.data.table1_db[index].course_code!=undefined){
                    var course_code_tab_row = document.createElement("tr");
                    var course_code_tab_head = document.createElement("td");
                    var course_code_tab_content = document.createElement("td");
                    course_code_tab_head.setAttribute("class","lefter");
                    course_code_tab_content.setAttribute("class","righter");
                    course_code_tab_head.innerHTML='Code : ';
                    course_code_tab_content.innerHTML=config.data.table1_db[index].course_code;
                    course_code_tab_row.appendChild(course_code_tab_head);
                    course_code_tab_row.appendChild(course_code_tab_content);
                    sub_tab.appendChild(course_code_tab_row);
                    doot.appendChild(sub_tab);
                }
                if(config.data.table1_db[index].Lecturer!="" && config.data.table1_db[index].Lecturer!=undefined){
                    var Lecturer_tab_row = document.createElement("tr");
                    var Lecturer_tab_head = document.createElement("td");
                    var Lecturer_tab_content = document.createElement("td");
                    Lecturer_tab_head.setAttribute("class","lefter");
                    Lecturer_tab_content.setAttribute("class","righter");
                    Lecturer_tab_head.innerHTML='Lecturer : ';
                    Lecturer_tab_content.innerHTML=config.data.table1_db[index].Lecturer;
                    Lecturer_tab_row.appendChild(Lecturer_tab_head);
                    Lecturer_tab_row.appendChild(Lecturer_tab_content);
                    sub_tab.appendChild(Lecturer_tab_row);
                    doot.appendChild(sub_tab);
                }
                if(config.data.table1_db[index].type!="" && config.data.table1_db[index].type!=undefined){
                    var type_tab_row = document.createElement("tr");
                    var type_tab_head = document.createElement("td");
                    var type_tab_content = document.createElement("td");
                    type_tab_head.setAttribute("class","lefter");
                    type_tab_content.setAttribute("class","righter");
                    type_tab_head.innerHTML='Type : ';
                    type_tab_content.innerHTML=config.data.table1_db[index].type;
                    type_tab_row.appendChild(type_tab_head);
                    type_tab_row.appendChild(type_tab_content);
                    sub_tab.appendChild(type_tab_row);
                    doot.appendChild(sub_tab);
                }
                var time_tab_row = document.createElement("tr");
                var time_tab = document.createElement("td");
                time_tab.setAttribute("colspan",2);
                time_tab.innerHTML = starthr+':'+startminute+' '+startmeridian+' - '+endhr+':'+endminute+' '+endmeridian;
                time_tab_row.appendChild(time_tab);
                sub_tab.appendChild(time_tab_row);
                doot.appendChild(sub_tab);
                tempblock.appendChild(doot);

                //Decide where it does
                var starthraw =Number(config.data.table1_db[index].start)-config.data.table1_db[index].start%1;//removes remainder
                console.warn('Raw Time value: ',starthraw);
                switch(config.data.table1_db[index].day){//Day decsion
                    case 1://Monday
                        config.properties.monday=true;
                        if(starthraw<10 && starthraw>=0){document.getElementById('1_'+starthraw.toPrecision(1)).appendChild(tempblock)}//less than 10 precision 1
                        else if(starthraw>=10 && starthraw<24){document.getElementById('1_'+starthraw.toPrecision(2)).appendChild(tempblock)}//more than 10 precision 2
                        else{console.log('Time logic error on index :',index,' Time code :',starthraw)} //yeet a time error cause that dont exist fam
                    break;
                    case 2://Tuesday
                        config.properties.tuesday=true;
                        if(starthraw<10 && starthraw>=0){document.getElementById('2_'+starthraw.toPrecision(1)).appendChild(tempblock)}
                        else if(starthraw>=10 && starthraw<24){document.getElementById('2_'+starthraw.toPrecision(2)).appendChild(tempblock)}
                        else{console.log('Time logic error on index :',index,' Time code :',starthraw)}
                    break;
                    case 3://Wednsday
                        config.properties.wednsday=true;
                        if(starthraw<10 && starthraw>=0){document.getElementById('3_'+starthraw.toPrecision(1)).appendChild(tempblock)}
                        else if(starthraw>=10 && starthraw<24){document.getElementById('3_'+starthraw.toPrecision(2)).appendChild(tempblock)}
                        else{console.log('Time logic error on index :',index,' Time code :',starthraw)}
                    break;
                    case 4:
                        config.properties.thursday=true;
                        if(starthraw<10 && starthraw>=0){document.getElementById('4_'+starthraw.toPrecision(1)).appendChild(tempblock)}
                        else if(starthraw>=10 && starthraw<24){document.getElementById('4_'+starthraw.toPrecision(2)).appendChild(tempblock)}
                        else{console.log('Time logic error on index :',index,' Time code :',starthraw)}
                    break;
                    case 5:
                        config.properties.friday=true;
                        if(starthraw<10 && starthraw>=0){document.getElementById('5_'+starthraw.toPrecision(1)).appendChild(tempblock)}
                        else if(starthraw>=10 && starthraw<24){document.getElementById('5_'+starthraw.toPrecision(2)).appendChild(tempblock)}
                        else{console.log('Time logic error on index :',index,' Time code :',starthraw)}
                    break;
                    case 6:
                        config.properties.saturday=true;
                        if(starthraw<10 && starthraw>=0){document.getElementById('6_'+starthraw.toPrecision(1)).appendChild(tempblock)}
                        else if(starthraw>=10 && starthraw<24){document.getElementById('6_'+starthraw.toPrecision(2)).appendChild(tempblock)}
                        else{console.log('Time logic error on index :',index,' Time code :',starthraw)}
                    break;
                    case 7:
                        config.properties.sunday=true;
                        if(starthraw<10 && starthraw>=0){document.getElementById('7_'+starthraw.toPrecision(1)).appendChild(tempblock)}
                        else if(starthraw>=10 && starthraw<24){document.getElementById('7_'+starthraw.toPrecision(2)).appendChild(tempblock)}
                        else{console.log('Time logic error on index :',index,' Time code :',starthraw)}
                    break;
                    default:console.log('Date positioning error on index: ',index,' Day code: ',config.data.table1_db[index].day);
                }
                //time to height calculations must be done after render
                setTimeout(()=>{
                    var blockheight=Number(config.data.table1_db[index].end-config.data.table1_db[index].start)*100;
                    console.log(config.data.table1_db[index].name,' As assigned height of :',blockheight,'%');
                    tempblock.style.height=blockheight+'%';
                    var blocktop = document.getElementById('live_clock').offsetHeight*startminute/60;//gets the height of a cell in pixels and the multiples by minute percentage
                    tempblock.style.transform="translate(-0.5vh,"+blocktop+'px'+")";
                },5);

                //click action
                tempblock.addEventListener('click',()=>{
                    console.log('Triggered data cell: ',tempblock);
                    if(config.data.tiles){//show full tile view
                        tempblock.name="off";
                        tempblock.setAttribute("class", "data_block hue"+config.data.table1_db[index].color);
                        //document.getElementById('tile_table').setAttribute("class", "data_block hue"+config.data.table1_db[index].color);
                        document.getElementById('title_cell').innerText=config.data.table1_db[index].name;
                        switch (config.data.table1_db[index].day) {
                            case 1: document.getElementById('day_cell').innerText="Monday"; break;
                            case 2: document.getElementById('day_cell').innerText="Tuesday"; break;
                            case 3: document.getElementById('day_cell').innerText="Wednesday"; break;
                            case 4: document.getElementById('day_cell').innerText="Thursday"; break;
                            case 5: document.getElementById('day_cell').innerText="Friday"; break;
                            case 6: document.getElementById('day_cell').innerText="Saturday"; break;
                            case 7: document.getElementById('day_cell').innerText="Sunday"; break;
                            default: console.log('Date error on index: ',index,' Returned value: ',config.data.table1_db[index].day);
                        }
                        if(config.data.table1_db[index].room!=undefined){document.getElementById('room_cell').innerText=config.data.table1_db[index].room}
                        else{document.getElementById('room_cell').innerText="unknown"}
                        if(config.data.table1_db[index].Lecturer!=undefined){document.getElementById('Lecturer_cell').innerText=config.data.table1_db[index].Lecturer}
                        else{document.getElementById('Lecturer_cell').innerText="unknown"}
                        if(config.data.table1_db[index].type!=undefined){document.getElementById('type_cell').innerText=config.data.table1_db[index].type}
                        else{document.getElementById('type_cell').innerText="unknown"}
                        if(config.data.table1_db[index].course_code!=undefined){document.getElementById('coursecode_cell').innerText=config.data.table1_db[index].course_code}
                        else{document.getElementById('coursecode_cell').innerText="unknown"}
                        document.getElementById('time_cell').innerText = starthr+':'+startminute+' '+startmeridian+' - '+endhr+':'+endminute+' '+endmeridian;
                        document.getElementById('fullscreen_tile').style.display='block';
                    }else{//show the normal card flip out view
                        if(tempblock.name=="on"){
                            tempblock.name="off";
                            tempblock.setAttribute("class", "data_block hue"+config.data.table1_db[index].color);
                        }else{
                            tempblock.name="on";
                            tempblock.setAttribute("class", "data_block_active hue"+config.data.table1_db[index].color);
                        }
                    }
                });
            console.log('Block :',index,' Check complete');
        },
        validate:function(){
            //Remove empty days
            console.log('Validating Table');
            var days=7;
            if(!config.properties.monday){//remove monday?
                document.getElementById('day1').style.display='none';//Blank the title
                for(i=0;i<24;i++){//Loop to blank the cells associated with that title
                    document.getElementById('1_'+i).style.display='none';
                    console.log('Removing Monday time index :',i);
                }
                days--;
            }
            if(!config.properties.tuesday){//remove tuesday?
                document.getElementById('day2').style.display='none';
                for(i=0;i<24;i++){
                    document.getElementById('2_'+i).style.display='none';
                    console.log('Removing Tuesday time index :',i);
                }
                days--;
            }
            if(!config.properties.wednsday){//remove wednsday?
                document.getElementById('day3').style.display='none';
                for(i=0;i<24;i++){
                    document.getElementById('3_'+i).style.display='none';
                    console.log('Removing wednsday time index :',i);
                }
                days--;
            }
            if(!config.properties.thursday){//remove thursday?
                document.getElementById('day4').style.display='none';
                for(i=0;i<24;i++){
                    document.getElementById('4_'+i).style.display='none';
                    console.log('Removing Thursday time index :',i);
                }
                days--;
            }
            if(!config.properties.friday){//remove friday?
                document.getElementById('day5').style.display='none';
                for(i=0;i<24;i++){
                    document.getElementById('5_'+i).style.display='none';
                    console.log('Removing friday time index :',i);
                }
                days--;
            }
            if(!config.properties.saturday){//remove saturday?
                document.getElementById('day6').style.display='none';
                for(i=0;i<24;i++){
                    document.getElementById('6_'+i).style.display='none';
                    console.log('Removing saturday time index :',i);
                }
                days--;
            }
            if(!config.properties.sunday){//remove sunday?
                document.getElementById('day0').style.display='none';
                for(i=0;i<24;i++){
                    document.getElementById('7_'+i).style.display='none';
                    console.log('Removing sunday time index :',i);
                }
                days--;
            }

            //remove empty time cells

            if(config.data.table1_db.length<3){//normalization makes life easier fror small table users
                config.properties.min=config.properties.min-3;
                config.properties.max=config.properties.max+3;
                if(config.properties.min<0){config.properties.min=0}
                if(config.properties.min>23){config.properties.min=23}
                //add a reload check here
            }

            var rows=24;
            for(i=0;i<config.properties.min;i++){//knock out all below minimum start time
                console.log('Called null on row: ',i);
                if(document.getElementById('timerow_'+i)){
                    document.getElementById('timerow_'+i).style.display="none";
                }
                rows--;
            }
            for(i=config.properties.max.toPrecision(2);i<24;i++){//knock out all above maximum end time
                console.log('Called null on row: ',i);
                if(document.getElementById('timerow_'+i)){
                    document.getElementById('timerow_'+i).style.display="none";
                }
                rows--;
            }
            console.log('Time rows found value: ',rows);
            
            //set font size dependent on rows value
            switch(rows){//Switch this to dynamic font sizing
                case 1: document.getElementById('timetable').style.fontSize='11vh'; break;
                case 2: document.getElementById('timetable').style.fontSize='10vh'; break;
                case 3: document.getElementById('timetable').style.fontSize='9vh'; break;
                case 4: document.getElementById('timetable').style.fontSize='8vh'; break;
                case 5: document.getElementById('timetable').style.fontSize='7vh'; break;
                case 6: document.getElementById('timetable').style.fontSize='6vh'; break;
                case 7: document.getElementById('timetable').style.fontSize='6vh'; break;
                case 8: document.getElementById('timetable').style.fontSize='5vh'; break;
                case 9: document.getElementById('timetable').style.fontSize='3.4vh'; break;
                case 10: document.getElementById('timetable').style.fontSize='4vh'; break;
                case 11: document.getElementById('timetable').style.fontSize='4vh'; break;
                case 12: document.getElementById('timetable').style.fontSize='3vh'; break;
                case 13: document.getElementById('timetable').style.fontSize='3vh'; break;
                case 14: document.getElementById('timetable').style.fontSize='3vh'; break;
                case 15: document.getElementById('timetable').style.fontSize='3vh'; break;
                case 16: document.getElementById('timetable').style.fontSize='3vh'; break;
                case 17: document.getElementById('timetable').style.fontSize='2vh'; break;
                case 18: document.getElementById('timetable').style.fontSize='2vh'; break;
                case 19: document.getElementById('timetable').style.fontSize='2vh'; break;
                case 20: document.getElementById('timetable').style.fontSize='2vh'; break;
                case 21: document.getElementById('timetable').style.fontSize='2vh'; break;
                case 22: document.getElementById('timetable').style.fontSize='2vh'; break;
                case 23: document.getElementById('timetable').style.fontSize='2vh'; break;
                case 24: document.getElementById('timetable').style.fontSize='2vh'; break;
                default:console.log('Row error, defaulted :',rows);
            }
            if(days==0 || rows==0){
                //Table is empty
                this.first_settup(config.data.table_selected);
                utility.toast(' This table is empty...');
            }
            console.log('Table validated');
        },
        first_settup:function(table_num){
            console.log('First settup called table#: ',table_num);
            utility.toast('To start off lets add something to display');
            document.getElementById('data_title').innerHTML='First Time?';
            setTimeout(()=>{manage.dialogue.open();UI.navigate.MANAGE();},100);
            document.getElementById('Loading').style.display='none';
            console.log('Closing loading screen...');
        },
    },
    clock:{
        clock_tick_trigger:null,//setInterval(()=>{table.clock.clock_tick()},1000),
        clock_tick:function(){
            console.log('Clock ticks');
            var date = new Date();
            document.getElementById('live_clock').innerHTML=date.toLocaleTimeString();
            switch(date.getDay()){//Date switch
                case 0:document.getElementById('day0').style.backgroundColor='red';document.getElementById('day1').style.backgroundColor='';document.getElementById('day2').style.backgroundColor='';document.getElementById('day3').style.backgroundColor='';document.getElementById('day4').style.backgroundColor='';document.getElementById('day5').style.backgroundColor='';document.getElementById('day6').style.backgroundColor='';break;
                case 1:document.getElementById('day0').style.backgroundColor='';document.getElementById('day1').style.backgroundColor='red';document.getElementById('day2').style.backgroundColor='';document.getElementById('day3').style.backgroundColor='';document.getElementById('day4').style.backgroundColor='';document.getElementById('day5').style.backgroundColor='';document.getElementById('day6').style.backgroundColor='';break;
                case 2:document.getElementById('day0').style.backgroundColor='';document.getElementById('day1').style.backgroundColor='';document.getElementById('day2').style.backgroundColor='red';document.getElementById('day3').style.backgroundColor='';document.getElementById('day4').style.backgroundColor='';document.getElementById('day5').style.backgroundColor='';document.getElementById('day6').style.backgroundColor='';break;
                case 3:document.getElementById('day0').style.backgroundColor='';document.getElementById('day1').style.backgroundColor='';document.getElementById('day2').style.backgroundColor='';document.getElementById('day3').style.backgroundColor='red';document.getElementById('day4').style.backgroundColor='';document.getElementById('day5').style.backgroundColor='';document.getElementById('day6').style.backgroundColor='';break;
                case 4:document.getElementById('day0').style.backgroundColor='';document.getElementById('day1').style.backgroundColor='';document.getElementById('day2').style.backgroundColor='';document.getElementById('day3').style.backgroundColor='';document.getElementById('day4').style.backgroundColor='red';document.getElementById('day5').style.backgroundColor='';document.getElementById('day6').style.backgroundColor='';break;
                case 5:document.getElementById('day0').style.backgroundColor='';document.getElementById('day1').style.backgroundColor='';document.getElementById('day2').style.backgroundColor='';document.getElementById('day3').style.backgroundColor='';document.getElementById('day4').style.backgroundColor='';document.getElementById('day5').style.backgroundColor='red';document.getElementById('day6').style.backgroundColor='';break;
                case 6:document.getElementById('day0').style.backgroundColor='';document.getElementById('day1').style.backgroundColor='';document.getElementById('day2').style.backgroundColor='';document.getElementById('day3').style.backgroundColor='';document.getElementById('day4').style.backgroundColor='';document.getElementById('day5').style.backgroundColor='';document.getElementById('day6').style.backgroundColor='red';break;
            }
            switch(date.getHours()){//Hour switch
                case 0: document.getElementById('timerow_0').className='glowrow';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 1: document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='glowrow';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 2: document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='glowrow';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 3: document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='glowrow';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 4: document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='glowrow';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 5: document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='glowrow';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 6: document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='glowrow';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 7: document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='glowrow';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 8: document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='glowrow';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 9: document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='glowrow';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 10:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='glowrow';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 11:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='glowrow';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 12:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='glowrow';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 13:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='glowrow';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 14:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='glowrow';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 15:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='glowrow';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 16:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='glowrow';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 17:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='glowrow';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 18:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='glowrow';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 19:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='glowrow';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 20:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='glowrow';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 21:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='glowrow';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='';break;
                case 22:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='glowrow';document.getElementById('timerow_23').className='';break;
                case 23:document.getElementById('timerow_0').className='';document.getElementById('timerow_1').className='';document.getElementById('timerow_2').className='';document.getElementById('timerow_3').className='';document.getElementById('timerow_4').className='';document.getElementById('timerow_5').className='';document.getElementById('timerow_6').className='';document.getElementById('timerow_7').className='';document.getElementById('timerow_8').className='';document.getElementById('timerow_9').className='';document.getElementById('timerow_10').className='';document.getElementById('timerow_11').className='';document.getElementById('timerow_12').className='';document.getElementById('timerow_13').className='';document.getElementById('timerow_14').className='';document.getElementById('timerow_15').className='';document.getElementById('timerow_16').className='';document.getElementById('timerow_17').className='';document.getElementById('timerow_18').className='';document.getElementById('timerow_19').className='';document.getElementById('timerow_20').className='';document.getElementById('timerow_21').className='';document.getElementById('timerow_22').className='';document.getElementById('timerow_23').className='glowrow';break;
                default:console.error('THEY CHANGED THE RULES FOR DATES NIBBA!!!');
            }
        },
        stop_clock:function(){
            console.warn('Clock was stopped');
            clearInterval(this.clock_tick_trigger);//stops teh clock ticking
        },
        start_clock:function(){
            console.warn('Clock has started');
            setTimeout(()=>{this.clock_tick_trigger=setInterval(()=>{this.clock_tick()},1000);},0);// Set timeout higher if slow devices can initalize intime
        },
    },
    hilight_engine:{
        initialize:function(){
            if(config.data.hilight_engine){
                console.log('Hilight Query state Checking..');
                var query = document.querySelectorAll(".maincell");
                var i=0;
                if(typeof(device)!="undefined"){
                    if(device.platform=='Android'||'iOS'){//mobile
                        while(query[i]!=null || query[i]!=undefined){
                            query[i].addEventListener('touchstart',()=>{this.engine(event)},{passive:true});
                            i++;
                            console.log('Added event listener for hilight_query: ',i);
                        }
                    }else{//Desktop
                        while(query[i]!=null || query[i]!=undefined){
                            query[i].addEventListener('mouseover',()=>{this.engine(event)},{passive:true});
                            i++;
                            console.log('Added event listener for hilight_query: ',i);
                        }
                    }
                }else{
                    console.error('"device" plugin broke!');
                    while(query[i]!=null || query[i]!=undefined){
                        query[i].addEventListener('mouseover',()=>{this.engine(event)},{passive:true});
                        i++;
                        console.log('Added event listener for hilight_query: ',i);
                    }
                }
            }
        },
        engine:function(event){
            if(config.data.hilight_engine){
                console.log('Hilight Engine trigger fired on :',event);
                if(config.data.theme=="light"){
                    event.target.style.color='black';
                    event.target.style.backgroundColor='hsl('+ utility.rand.number(360,0) +',100%,70%)';//color the target
                }else if(config.data.theme=="dark"){
                    event.target.style.color='black';
                    event.target.style.backgroundColor='hsl('+ utility.rand.number(360,0) +',100%,60%)';//color the target
                }
                setTimeout(()=>{event.target.style.backgroundColor='';event.target.style.color='';},1000);//un-color the target
            }
        },
    },
}

/*  Data manager    */
let manage = {
    initalize:function(){
        console.log('Manager initializes');
        document.getElementById('table_selector').value=config.data.table_selected; //Set the table selectors value
        switch(config.data.table_selected){
            case 0:document.getElementById('tableselector_text').innerText="Hidden" ;break;
            case 1:document.getElementById('tableselector_text').innerText=config.data.table_details[0].purpose; ;break;
            case 2:document.getElementById('tableselector_text').innerText=config.data.table_details[1].purpose; ;break;
            case 3:document.getElementById('tableselector_text').innerText=config.data.table_details[2].purpose; ;break;
            case 4:document.getElementById('tableselector_text').innerText=config.data.table_details[3].purpose; ;break;
        }
        document.getElementById('1_selectorsub').innerHTML = config.data.table_details[0].purpose;
        document.getElementById('1_selectormain').innerHTML = config.data.table_details[0].purpose;
        document.getElementById('2_selectorsub').innerHTML= config.data.table_details[1].purpose;
        document.getElementById('2_selectormain').innerHTML= config.data.table_details[1].purpose;
        document.getElementById('3_selectorsub').innerHTML= config.data.table_details[2].purpose;
        document.getElementById('3_selectormain').innerHTML= config.data.table_details[2].purpose;
        document.getElementById('4_selectorsub').innerHTML= config.data.table_details[3].purpose;
        document.getElementById('4_selectormain').innerHTML= config.data.table_details[3].purpose;
        this.data.render();
        document.getElementById('cancel_btn').addEventListener('click',()=>{//Click because touch start gay
            console.log('Cancel button clicked');
            manage.dialogue.clear();
            manage.dialogue.close();
            config.properties.overwrite=null;
        });
        document.getElementById('save_btn').addEventListener('click',this.dialogue.save); //Save button
        document.getElementById('savepluss_btn').addEventListener('click',this.dialogue.saveplus);
        document.getElementById('delete_btn').addEventListener('click',this.dialogue.call_delete);
        document.getElementById('yes_btn').addEventListener('click',function(){// Delete yes button
            console.log('Delete Confirmation called');
            config.data.table1_db[config.properties.overwrite].deleted=true;//pseudo delete function
            manage.dialogue.clear();
            manage.dialogue.close();
            config.properties.changed=true;
            config.save();
            document.getElementById('delete_confirm_pannel').style.display='none';
            manage.data.render();
        });
        document.getElementById('no_btn').addEventListener('click',function(){// Delete No button
            console.log('Delete denial called');
            document.getElementById('delete_confirm_pannel').style.display='none';
        });
        //initalize color put selector (needs an upgrade)
        document.getElementById('color_put').value="1";
        document.getElementById('color_put_text').innerText="Red";
        document.getElementById('color_put_container').className='hue1 select_container';
        document.getElementById('color_put').addEventListener('change',function(){      // Change color put color on change
            console.log('Color selection changed to :',document.getElementById('color_put').value);
            document.getElementById('color_put_container').className='hue'+document.getElementById('color_put').value+' select_container';
            switch(document.getElementById('color_put').value){
                case "0":document.getElementById('color_put_text').innerText="Grey";break;
                case "1":document.getElementById('color_put_text').innerText="Red";break;
                case "2":document.getElementById('color_put_text').innerText="Orange";break;
                case "3":document.getElementById('color_put_text').innerText="Yellow";break;
                case "4":document.getElementById('color_put_text').innerText="Lime";break;
                case "5":document.getElementById('color_put_text').innerText="Green";break;
                case "6":document.getElementById('color_put_text').innerText="Aqua";break;
                case "7":document.getElementById('color_put_text').innerText="Sky-Blue";break;
                case "8":document.getElementById('color_put_text').innerText="Blue";break;
                case "9":document.getElementById('color_put_text').innerText="Purple";break;
                case "10":document.getElementById('color_put_text').innerText="Royal-blue";break;
                case "11":document.getElementById('color_put_text').innerText="Cherry";break;
                default:console.warn('Colors went blyat');
            }
        });
        document.getElementById('erraser').addEventListener('click',manage.dialogue.clear);

        document.getElementById('table_selector').addEventListener('change',function(){
            console.log('table_selector changed');
            config.data.table_selected=document.getElementById('table_selector').value;
            switch(document.getElementById('table_selector').value){
                case "0":document.getElementById('tableselector_text').innerText="Hidden Items" ;break;
                case "1":document.getElementById('tableselector_text').innerText=config.data.table_details[0].purpose; ;break;
                case "2":document.getElementById('tableselector_text').innerText=config.data.table_details[1].purpose; ;break;
                case "3":document.getElementById('tableselector_text').innerText=config.data.table_details[2].purpose; ;break;
                case "4":document.getElementById('tableselector_text').innerText=config.data.table_details[3].purpose; ;break;
            }
            config.properties.changed=true;
            manage.data.render();
            config.save();
        });
        //Initalize day_put selector
        document.getElementById('day_put').value="1";
        document.getElementById('day_put_text').innerText="Monday"
        document.getElementById('day_put').addEventListener('change',function(){/* Switches dates on change */
            console.log('Day put changed');
            var tmp = document.getElementById('day_put').value;
            switch(tmp){
                case "1":document.getElementById('day_put_text').innerText="Monday";break;
                case "2":document.getElementById('day_put_text').innerText="Tuesday" ;break;
                case "3":document.getElementById('day_put_text').innerText="Wednsday" ;break;
                case "4":document.getElementById('day_put_text').innerText="Thursday" ;break;
                case "5":document.getElementById('day_put_text').innerText="Friday" ;break;
                case "6":document.getElementById('day_put_text').innerText="Saturday" ;break;
                case "7":document.getElementById('day_put_text').innerText="Sunday";break;
                default:console.error('Blyat');
            }
        });
        // view put selector
        document.getElementById('view_put').value="1";
        document.getElementById('view_put_text').innerText=config.data.table_details[0].purpose;
        document.getElementById('view_put').addEventListener('change',function(){/* Switches text displayed on change */
            console.log('View put changed');
            switch(document.getElementById('view_put').value){
                case "0":document.getElementById('view_put_text').innerText="Hidden" ;break;
                case "1":document.getElementById('view_put_text').innerText=config.data.table_details[0].purpose;/* purpose is the array with names of tables */ ;break;
                case "2":document.getElementById('view_put_text').innerText=config.data.table_details[1].purpose; ;break;
                case "3":document.getElementById('view_put_text').innerText=config.data.table_details[2].purpose; ;break;
                case "4":document.getElementById('view_put_text').innerText=config.data.table_details[3].purpose; ;break;
            }
        });
    },
    data:{
        render:function(){//initalizes, and feeds the build function
            console.log('Manager Render starts');
            this.clear();
            var i=0;
            //Add new button
            var tempblock = document.createElement('div');
            tempblock.setAttribute("class", "data_bar hue0");
            tempblock.innerHTML='New Class';
            tempblock.title='Add a new class';
            document.getElementById('manage_dataspace').appendChild(tempblock);
            var plusimg = document.createElement('div');//plus image
            plusimg.setAttribute("class","plusimg");
            tempblock.appendChild(plusimg);
            tempblock.addEventListener('click',function(){manage.dialogue.open();console.log('Add new class button clicked')});//add new btn listener
            if(config.data.table1_db[i]==null||undefined){
                //show first time setup screen
                console.log('The table database is empty,manager will show first time setup');
            }else{
                //Construct the data
                while(config.data.table1_db[i]!=null||undefined){
                    console.log('Data run on index :',i);
                    if(config.data.table1_db[i].show==config.data.table_selected){
                        this.build_bar_db1(i);
                    }
                    i++;
                }
                i=0;
                while(config.data.table1_db[i]!=null||undefined){
                    console.log('Data run on index :',i);
                    if(config.data.table1_db[i].show!=config.data.table_selected){
                        this.build_bar_db1(i);
                    }
                    i++;
                }
            }
            console.log('Manager Render Completed');
        },
        build_bar_db1:function(index){//Builds timetable from database
            //Create the data block
            console.log('Building Bar: ',index);
            var tempblock = document.createElement('div');
            tempblock.title="Click to edit";
            //assign a color
            switch(config.data.table1_db[index].color){
                case 0: tempblock.setAttribute("class", "data_bar hue0"); break;
                case 1: tempblock.setAttribute("class", "hue1 data_bar"); break;
                case 2: tempblock.setAttribute("class", "hue2 data_bar"); break;
                case 3: tempblock.setAttribute("class", "hue3 data_bar"); break;
                case 4: tempblock.setAttribute("class", "hue4 data_bar"); break;
                case 5: tempblock.setAttribute("class", "hue5 data_bar"); break;
                case 6: tempblock.setAttribute("class", "hue6 data_bar"); break;
                case 7: tempblock.setAttribute("class", "hue7 data_bar"); break;
                case 8: tempblock.setAttribute("class", "hue8 data_bar"); break;
                case 9: tempblock.setAttribute("class", "hue9 data_bar"); break;
                case 10: tempblock.setAttribute("class", "hue10 data_bar"); break;
                case 11: tempblock.setAttribute("class", "hue11 data_bar"); break;
                default:
                tempblock.setAttribute("class", "data_bar");
                console.log('Color was defaulted :');
                console.table(config.data.table1_db[index]);
            }
    
            //time processing
            var startmeridian = 'a.m.';
            var starthr=0;
            var startminute=Number(config.data.table1_db[index].start%1*60).toFixed(0);
            if(startminute==0){startminute='00'}
            var endmeridian = 'a.m.';
            var endhr = 0;
            var endminute=Number(config.data.table1_db[index].end%1*60).toFixed(0);
            if(endminute==0){endminute='00'}
            
            if(config.data.table1_db[index].start>12){
                startmeridian='p.m.';//morning or evening
                starthr=Number(config.data.table1_db[index].start-12)-config.data.table1_db[index].start%1;//removes remainder
            }else{
                starthr=Number(config.data.table1_db[index].start)-config.data.table1_db[index].start%1;//removes remainder
            }
            if(config.data.table1_db[index].end>12){
                endmeridian='p.m.';//morning or evening
                endhr=Number(config.data.table1_db[index].end-12)-config.data.table1_db[index].end%1;//removes remainder
            }else{
                endhr=Number(config.data.table1_db[index].end)-config.data.table1_db[index].end%1;//removes remainder
            }
            if(starthr==0){starthr=12}
            if(endhr==0){endhr=12}
            var day;
            switch (config.data.table1_db[index].day) {
                case 1: day = "Monday"; break;
                case 2: day = "Tuesday"; break;
                case 3: day = "Wednesday"; break;
                case 4: day = "Thursday"; break;
                case 5: day = "Friday"; break;
                case 6: day = "Saturday"; break;
                case 7: day = "Sunday"; break;
                default: console.log('Date error on index: ',index,' Returned value: ',config.data.table1_db[index].day);
            }
            if(config.data.table1_db[index].deleted){//Check deleted state
                //populate the block with relivant data
                tempblock.innerHTML=config.data.table1_db[index].name+'<br> Marked for delete, tap to undo';
                tempblock.setAttribute("class", "data_bar hue0");
                tempblock.style.border="0.3vh solid red";
                //alow editing function
                tempblock.setAttribute('id','bar_'+index);
                tempblock.addEventListener('click',function(){config.data.table1_db[index].deleted=false;config.save();manage.data.render();});//un-"delete"
            }else{
                //populate the block with relivant data
                //make table in tempblock to keep things even
                var sub_tab = document.createElement("table");
                var name_tab_row = document.createElement("tr");
                var name_tab_content = document.createElement("th");
                name_tab_content.innerHTML=config.data.table1_db[index].name;
                name_tab_content.setAttribute("colspan",2);
                name_tab_row.appendChild(name_tab_content);
                sub_tab.appendChild(name_tab_row);
                tempblock.appendChild(sub_tab);
                var day_tab_row = document.createElement("tr");
                //var day_tab_head = document.createElement("td");
                var day_tab_content = document.createElement("td");
                /*day_tab_head.setAttribute("class","lefter");
                day_tab_content.setAttribute("class","righter");
                day_tab_head.innerHTML='Day : ';*/
                day_tab_content.innerHTML=day;
                day_tab_content.setAttribute("colspan",2);
                //day_tab_row.appendChild(day_tab_head);
                day_tab_row.appendChild(day_tab_content);
                sub_tab.appendChild(day_tab_row);
                tempblock.appendChild(sub_tab);
                var time_tab_row = document.createElement("tr");
                var time_tab = document.createElement("td");
                time_tab.setAttribute("colspan",2);
                time_tab.innerHTML = starthr+':'+startminute+' '+startmeridian+' - '+endhr+':'+endminute+' '+endmeridian;
                time_tab_row.appendChild(time_tab);
                sub_tab.appendChild(time_tab_row);
                tempblock.appendChild(sub_tab);
                //alow editing function
                tempblock.setAttribute('id','bar_'+index);
                tempblock.addEventListener('click',function(){manage.dialogue.edit(index)});//Edit btn
            }
            var noot = document.createElement('div');
            if(config.data.table1_db[index].show==0){noot.innerHTML='<del>'+config.data.table1_db[index].show+'</del>';noot.style.color='red';}//noot is hidden
            else{noot.innerHTML=config.data.table1_db[index].show;}//not gets a number
            noot.setAttribute('class','data_noot');
            tempblock.appendChild(noot)
            document.getElementById('manage_dataspace').appendChild(tempblock);//put the bar into the dukument
            console.log('Bar: ',index,' Complete');
        },
        clear:function(){
            console.log('manage_dataspace clear called');
            document.getElementById('manage_dataspace').innerHTML='';
        },
    },
    dialogue:{
        edit:function(index){//Does not edit anything, only populates feilds in the editor with data, listener found in manage.data.build_bar_db1();
            console.log('Dialogue Edit called on index: ',index);
            config.properties.overwrite=index;  //Set overwrtite so save function knows to do
            document.getElementById('day_put').value = config.data.table1_db[index].day;    //set day feild
            switch(config.data.table1_db[index].day){
                case 0:document.getElementById('day_put_text').innerText="Sunday";break;
                case 1:document.getElementById('day_put_text').innerText="Monday" ;break;
                case 2:document.getElementById('day_put_text').innerText="Tuesday" ;break;
                case 3:document.getElementById('day_put_text').innerText="Wednsday" ;break;
                case 4:document.getElementById('day_put_text').innerText="Thursday" ;break;
                case 5:document.getElementById('day_put_text').innerText="Friday" ;break;
                case 6:document.getElementById('day_put_text').innerText="Saturday" ;break;
            }
            document.getElementById('color_put').value = config.data.table1_db[index].color;    //set color feild
            document.getElementById('color_put_container').className='hue'+config.data.table1_db[index].color+' select_container';    //set color class to make the feild glow
            switch(document.getElementById('color_put').value){//set name of color
                case "0":document.getElementById('color_put_text').innerText="Grey";break;
                case "1":document.getElementById('color_put_text').innerText="Red";break;
                case "2":document.getElementById('color_put_text').innerText="Orange";break;
                case "3":document.getElementById('color_put_text').innerText="Yellow";break;
                case "4":document.getElementById('color_put_text').innerText="Lime";break;
                case "5":document.getElementById('color_put_text').innerText="Green";break;
                case "6":document.getElementById('color_put_text').innerText="Aqua";break;
                case "7":document.getElementById('color_put_text').innerText="Sky-Blue";break;
                case "8":document.getElementById('color_put_text').innerText="Blue";break;
                case "9":document.getElementById('color_put_text').innerText="Purple";break;
                case "10":document.getElementById('color_put_text').innerText="Royal-blue";break;
                case "11":document.getElementById('color_put_text').innerText="Cherry";break;
                default:console.warn('Colors went blyat');
            }
            document.getElementById('course_code_put').value = config.data.table1_db[index].course_code;    //set course code
            document.getElementById('type_put').value = config.data.table1_db[index].type;  //set room type
            document.getElementById('room_put').value = config.data.table1_db[index].room;  //set room feild
            document.getElementById('name_put').value = config.data.table1_db[index].name;  //Set Name feild
            
            //process time
            var starthr = Number(config.data.table1_db[index].start)-config.data.table1_db[index].start%1;//removes remainder
            var startminute=Number(config.data.table1_db[index].start%1*60).toFixed(0);
            if(startminute==0){startminute='00'}
            if(starthr<10){starthr='0'+starthr}
            var endhr = Number(config.data.table1_db[index].end)-config.data.table1_db[index].end%1;//removes remainder
            var endminute = Number(config.data.table1_db[index].end%1*60).toFixed(0);
            if(endminute==0){endminute='00'}
            if(endhr<10){endhr='0'+endhr}
            document.getElementById('start_time_put').value = starthr+':'+startminute;      //Set start time feild
            document.getElementById('end_time_put').value = endhr+':'+endminute;            //Set the end time feild
            this.open();
            document.getElementById('view_put').value=config.data.table1_db[index].show;    //Set view state feild
            switch(config.data.table1_db[index].show){
                case 0:document.getElementById('view_put_text').innerText="Hidden" ;break;
                case 1:document.getElementById('view_put_text').innerText=config.data.table_details[0].purpose; ;break;
                case 2:document.getElementById('view_put_text').innerText=config.data.table_details[1].purpose; ;break;
                case 3:document.getElementById('view_put_text').innerText=config.data.table_details[2].purpose; ;break;
                case 4:document.getElementById('view_put_text').innerText=config.data.table_details[3].purpose; ;break;
            }
            //document.getElementById('view_put_text').innerText=config.data.table_details[index].purpose;//view state text
        },
        open:function(){//The listener for the add open btn is in manage.data.render() 
            console.log('Dialogue open called');
            document.getElementById('view_put').value=config.data.table_selected;//if new
            if(config.properties.overwrite==null){
                document.getElementById('savepluss_btn').style.display='block';
                document.getElementById('delete_btn').style.display='none';
                document.getElementById('data_title').innerHTML='New Entry';
            }else{
                document.getElementById('savepluss_btn').style.display='none';
                document.getElementById('delete_btn').style.display='block';
                document.getElementById('data_title').innerHTML='Edit';
            }
            document.getElementById('name_put').style.border="";
            document.getElementById('start_time_put').style.border="";
            document.getElementById('end_time_put').style.border="";
            if(config.data.animation){
                document.getElementById('dataentry_screen').style.transform="translate(0,100%)";//strange bug, setting this in css causes the buttons to glitch out
                document.getElementById('dataentry_screen').style.display="block";
                setTimeout(()=>{
                    document.getElementById('dataentry_screen').style.transform="initial";
                    setTimeout(()=>{
                        document.getElementById('btn_bar').style.display="block";
                    },210);
                },0);
            }else{
                document.getElementById('dataentry_screen').style.transform="initial";
                document.getElementById('btn_bar').style.display="block";    
                document.getElementById('dataentry_screen').style.display="block";    
            }
        },
        clear:function(){//clear the input and remove the input screen
            console.log('Dialogue clear called');
            //document.getElementById('day_put').value = "";
            //document.getElementById('color_put').value = "";
            document.getElementById('course_code_put').value = "";
            document.getElementById('Lecture_put').value = "";
            document.getElementById('type_put').value = "";
            document.getElementById('room_put').value = "";
            document.getElementById('name_put').value = "";
            document.getElementById('start_time_put').value = "";
            document.getElementById('end_time_put').value = "";
            document.getElementById('view_put').validate=1;
        },
        close:function(){//remove the input screen
            console.log('Dialogue close called');
            if(config.data.animation){
                document.getElementById('dataentry_screen').style.transform="translate(0,100%)";//strange bug, setting this in css causes the buttons to glitch out
                setTimeout(()=>{
                    document.getElementById('dataentry_screen').style.display="none";
                },205);
            }else{
                document.getElementById('dataentry_screen').style.display="none";
                document.getElementById('btn_bar').style.display="none";    
            }
        },
        save:function(){
            console.log('Dialogue save called');
            var tempentry = {show:true,day:null,name:null,room:null,course_code:null,Lecturer:null,type:null,color:null,start:null,end:null};//Its test data
            var entryisvalid=true;

            //get day select, no validation, because default is valid
            tempentry.day = Number(document.getElementById('day_put').value);

            //get color select, no validation, because default is valid
            tempentry.color = Number(document.getElementById('color_put').value);

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
            if(tempentry.name==""||undefined||null){
                entryisvalid=false;
                document.getElementById('name_put').style.border="0.3vh solid #ff0000";
                utility.toast('Please Enter a name');
            }else{
                document.getElementById('name_put').style.border="";
                console.log('Name detected: ',tempentry.name);
            }

            //Process time
            var start_time_raw = document.getElementById('start_time_put').value.toString();
            var end_time_raw = document.getElementById('end_time_put').value.toString();
            var percentage_start = Number((start_time_raw.slice(0,2)/1/*I divide it by one becasue the scripting engine is drunk*/) + (start_time_raw.slice(3)/60));
            var percentage_end = Number((end_time_raw.slice(0,2)/1/*I divide it by one becasue the scripting engine is drunk*/) + (end_time_raw.slice(3)/60));
            if(start_time_raw=="" ||start_time_raw==null ||start_time_raw==undefined){
                utility.toast('Start time cannot be empty');
                document.getElementById('start_time_put').style.border="0.3vh solid #ff0000";
                entryisvalid=false; 
            }else if(end_time_raw=="" ||end_time_raw==null ||end_time_raw==undefined){
                utility.toast('End time cannot be empty');
                document.getElementById('end_time_put').style.border="0.3vh solid #ff0000";
                entryisvalid=false;
            }else if(percentage_start==percentage_end){
                document.getElementById('start_time_put').style.border="0.3vh solid #ff0000";
                document.getElementById('end_time_put').style.border="0.3vh solid #ff0000";
                entryisvalid=false;
            }else if(percentage_start>percentage_end){
                utility.toast('Class cannot start after it ends');
                document.getElementById('start_time_put').style.border="0.3vh solid #ff0000";
                document.getElementById('end_time_put').style.border="0.3vh solid #ff0000";
                entryisvalid=false;
            }else{
                tempentry.start=percentage_start;
                tempentry.end=percentage_end;
                document.getElementById('start_time_put').style.border="";
                document.getElementById('end_time_put').style.border="";
            }
            
            //get view state
            tempentry.show=document.getElementById('view_put').value;

            console.table(tempentry);

            if(entryisvalid){
                if(config.properties.overwrite==null){
                    config.data.table1_db.push(tempentry);
                    console.log('Entry saved')
                }else{
                    config.data.table1_db[config.properties.overwrite]=tempentry;
                    console.log('Overwrite on index: ',config.properties.overwrite);
                }
                config.save();
                manage.initalize();
                if(config.properties.called_from_plus){
                    config.properties.called_from_plus=false;
                }else{
                    manage.dialogue.close();
                }
                config.properties.changed=true;
                config.properties.overwrite=null;
            }
            return entryisvalid;
        },
        saveplus:function(){
            console.log('Dialogue savepluss was called');
            config.properties.called_from_plus=true;
            var entryisvalid = manage.dialogue.save();
            if(entryisvalid){
                utility.toast(document.getElementById('name_put').value+' was saved, U may now add another');
                //no clear function needed, the clearfeild action btns will fufill this task
                manage.dialogue.open();
            }
        },
        call_delete:function(){
            console.log('Delete pseudo function called');
            //time processing
            var startmeridian = 'a.m.';
            var starthr=0;
            var startminute=Number(config.data.table1_db[config.properties.overwrite].start%1*60).toFixed(0);
            if(startminute==0){startminute='00'}
            var endmeridian = 'a.m.';
            var endhr = 0;
            var endminute=Number(config.data.table1_db[config.properties.overwrite].end%1*60).toFixed(0);
            if(endminute==0){endminute='00'}
            
            if(config.data.table1_db[config.properties.overwrite].start>12){
                startmeridian='p.m.';//morning or evening
                starthr=Number(config.data.table1_db[config.properties.overwrite].start-12)-config.data.table1_db[config.properties.overwrite].start%1;//removes remainder
            }else{
                starthr=Number(config.data.table1_db[config.properties.overwrite].start)-config.data.table1_db[config.properties.overwrite].start%1;//removes remainder
            }
            if(config.data.table1_db[config.properties.overwrite].end>12){
                endmeridian='p.m.';//morning or evening
                endhr=Number(config.data.table1_db[config.properties.overwrite].end-12)-config.data.table1_db[config.properties.overwrite].end%1;//removes remainder
            }else{
                endhr=Number(config.data.table1_db[config.properties.overwrite].end)-config.data.table1_db[config.properties.overwrite].end%1;//removes remainder
            }
            if(starthr==0){starthr=12}
            if(endhr==0){endhr=12}

            document.getElementById('title_cellp').innerText=config.data.table1_db[config.properties.overwrite].name;
            switch (config.data.table1_db[config.properties.overwrite].day) {
                case 1: document.getElementById('day_cellp').innerText="Monday"; break;
                case 2: document.getElementById('day_cellp').innerText="Tuesday"; break;
                case 3: document.getElementById('day_cellp').innerText="Wednesday"; break;
                case 4: document.getElementById('day_cellp').innerText="Thursday"; break;
                case 5: document.getElementById('day_cellp').innerText="Friday"; break;
                case 6: document.getElementById('day_cellp').innerText="Saturday"; break;
                case 7: document.getElementById('day_cellp').innerText="Sunday"; break;
                default: console.log('Date error on config.properties.overwrite: ',config.properties.overwrite,' Returned value: ',config.data.table1_db[config.properties.overwrite].day);
            }
            if(config.data.table1_db[config.properties.overwrite].room!=undefined){document.getElementById('room_cellp').innerText=config.data.table1_db[config.properties.overwrite].room}
            else{document.getElementById('room_cellp').innerText="unknown"}
            if(config.data.table1_db[config.properties.overwrite].Lecturer!=undefined){document.getElementById('Lecturer_cellp').innerText=config.data.table1_db[config.properties.overwrite].Lecturer}
            else{document.getElementById('Lecturer_cellp').innerText="unknown"}
            if(config.data.table1_db[config.properties.overwrite].type!=undefined){document.getElementById('type_cellp').innerText=config.data.table1_db[config.properties.overwrite].type}
            else{document.getElementById('type_cellp').innerText="unknown"}
            if(config.data.table1_db[config.properties.overwrite].course_code!=undefined){document.getElementById('coursecode_cellp').innerText=config.data.table1_db[config.properties.overwrite].course_code}
            else{document.getElementById('coursecode_cellp').innerText="unknown"}
            document.getElementById('time_cellp').innerText = starthr+':'+startminute+' '+startmeridian+' - '+endhr+':'+endminute+' '+endmeridian;
            //document.getElementById('pseudo_container').setAttribute("class", "data_block hue"+config.data.table1_db[config.properties.overwrite].color);
            document.getElementById('delete_confirm_pannel').style.display='block';
        }
    },
    batch_delete:{
        detect:function(){
            //Query select all the bar ids or mark them durring their creation
        },
    }
}

/*  UI trickery */
let UI={
    initalize:function(){
        console.log('UI Initalize');
        switch(config.data.theme){
            case 'dark':this.setting.theme.set_dark() ;break;
            case 'light':this.setting.theme.set_light() ;break;
            default: 
                console.error('Theme error :', config.data.theme);
                this.setting.theme.set_light();
        }
        this.setting.hilight.setpostition();
        this.setting.animation.setpostition();
        this.setting.tiles.setpostition();
        if(typeof(device)!="undefined"){//sometimes plugins break
            if(device.platform=='Android'||'iOS'){//mobile
                document.getElementById('table_btn').addEventListener('touchstart',UI.navigate.TABLE)
                document.getElementById('manage_btn').addEventListener('touchstart',UI.navigate.MANAGE)
                document.getElementById('setting_btn').addEventListener('touchstart',UI.navigate.SETTING)
                document.getElementById('hilight_btn').addEventListener('touchstart',UI.setting.hilight.flip)
                document.getElementById('Animations_btn').addEventListener('touchstart',UI.setting.animation.flip)
                document.getElementById('tiles_btn').addEventListener('touchstart',UI.setting.tiles.flip)
                document.getElementById('close_btn').addEventListener('click',UI.navigate.close_tile);
            }else{//Desktop
                document.getElementById('table_btn').addEventListener('click',UI.navigate.TABLE)
                document.getElementById('manage_btn').addEventListener('click',UI.navigate.MANAGE)
                document.getElementById('setting_btn').addEventListener('click',UI.navigate.SETTING)
                document.getElementById('hilight_btn').addEventListener('click',UI.setting.hilight.flip)
                document.getElementById('Animations_btn').addEventListener('click',UI.setting.animation.flip)
                document.getElementById('tiles_btn').addEventListener('click',UI.setting.tiles.flip)
                document.getElementById('close_btn').addEventListener('click',UI.navigate.close_tile);
            }
        }
        else{
            console.error('"device" plugin broke!');
            document.getElementById('table_btn').addEventListener('click',UI.navigate.TABLE)
            document.getElementById('manage_btn').addEventListener('click',UI.navigate.MANAGE)
            document.getElementById('setting_btn').addEventListener('click',UI.navigate.SETTING)
            document.getElementById('hilight_btn').addEventListener('click',UI.setting.hilight.flip)
            document.getElementById('Animations_btn').addEventListener('click',UI.setting.animation.flip)
            document.getElementById('tiles_btn').addEventListener('click',UI.setting.tiles.flip)
            document.getElementById('close_btn').addEventListener('click',UI.navigate.close_tile);
        }
        
        document.getElementById('about_btn').addEventListener('click',function(){
            /*
            utility.clipboard('Phone: 876-5744-801, Email: samuelmatheson15@gmail.com');
            utility.toast('Contact info coppied to clipboard');*/
            utility.clipboard(JSON.stringify(config.data));
            utility.toast('Debug info coppied to clipboard');
        });

        document.getElementById('dark_theme_selection').addEventListener('click',this.setting.theme.set_dark)
        document.getElementById('light_theme_selection').addEventListener('click',this.setting.theme.set_light)
    },
    navigate:{
        BACK:function(){//Back button handle
            console.log('Back navigation started');
            if(document.getElementById('dataentry_screen').style.display=="block"){
                console.warn('Backbutton closed dataentry screen');
                manage.dialogue.close();
                manage.dialogue.clear();
            }else if(document.getElementById('fullscreen_tile').style.display=='block'){
                console.warn('Back button closed full table tile');
                this.close_tile();
            }else if(config.properties.view=="table"){
                console.warn('Backbutton triggered exit strategy')
                this.exitstrategy();
            }else{
                console.warn('Backbutton Navigated to table view');
                this.TABLE();
            }
            
        },
        close_tile:function(){
            console.log('closed full tile function');
            if(config.data.animation){
                document.getElementById('fullscreen_tile').style.opacity="0.0";
                document.getElementById('fullscreen_tile').style.height="0";
                setTimeout(()=>{
                    document.getElementById('fullscreen_tile').style.display="none";
                    document.getElementById('fullscreen_tile').style.opacity="1.0";
                    document.getElementById('fullscreen_tile').style.height="93vh";
                },200);
            }else{
                document.getElementById('fullscreen_tile').style.display="none";   
                document.getElementById('fullscreen_tile').style.height="93vh";
                document.getElementById('fullscreen_tile').style.opacity="1.0"; 
            }
        },
        exitstrategy:function(){
            if(config.properties.exit){utility.close()}
            else{
                config.properties.exit=true;
                setTimeout(()=>{config.properties.exit=false;},2000);
                utility.toast('Press back button again to exit');
            }
        },
        TABLE:function(){
            console.log('Table navigation started');
            if(config.properties.changed){
                window.location.reload();
            }else{
                if(config.properties.view!="table"){
                    table.clock.start_clock();
                }
                config.properties.view="table";
                document.getElementById('table1').style.display='block';
                document.getElementById('manage_view').style.display='none';
                document.getElementById('setting_view').style.display='none';
                document.getElementById('setting_btn_icon').style.transform='rotate(0deg)';//Rotate the button
                document.getElementById('setting_btn').className="menubtn";
                document.getElementById('manage_btn').className="menubtn";
                document.getElementById('table_btn').className="menubtn_active";
            }
            
        },
        MANAGE:function(){
            console.log('MANAGE navigation started');
            config.properties.view="manage";
            table.clock.stop_clock();
            document.getElementById('table1').style.display='none';
            document.getElementById('manage_view').style.display='block';
            document.getElementById('setting_view').style.display='none';
            document.getElementById('setting_btn').className="menubtn";
            document.getElementById('manage_btn').className="menubtn_active";
            document.getElementById('table_btn').className="menubtn";
        },
        SETTING:function(){
            
            console.log('SETTING navigation started');
            config.properties.view="setting";
            table.clock.stop_clock();
            document.getElementById('table1').style.display='none';
            document.getElementById('manage_view').style.display='none';
            document.getElementById('setting_view').style.display='block';
            document.getElementById('setting_btn_icon').style.transform='rotate(90deg)';//Rotate the button
            document.getElementById('setting_btn').className="menubtn_active";
            document.getElementById('manage_btn').className="menubtn";
            document.getElementById('table_btn').className="menubtn";
        },
    },
    setting:{
        theme:{
            set_dark:function(){
                console.warn('Theme set Dark');
                document.getElementById('theme').href="css/dark-theme.css"
                config.data.theme='dark'
                document.getElementById('light_selection_put').checked=false;
                document.getElementById('dark_selection_put').checked=true;
                config.save();
            },
            set_light:function(){
                console.warn('Theme set Light');
                document.getElementById('theme').href="css/light-theme.css"
                config.data.theme='light'
                document.getElementById('light_selection_put').checked=true;
                document.getElementById('dark_selection_put').checked=false;
                config.save();
            },
        },
        hilight:{
            flip:function(){
                console.log('switch triggered');
                if(config.data.hilight_engine){
                    //turn off the switch
                    config.data.hilight_engine=false;
                    utility.toast('hilights dissabled');
                    console.log('hilights dissabled');
                }else{
                    //turn on the witch
                    config.data.hilight_engine=true;
                    table.hilight_engine.initialize();
                    utility.toast('hilights enabled');
                    console.log('hilights enabled');
                    //table.hilight_engine.initialize();
                }
                config.save();
                UI.setting.hilight.setpostition();
            },
            setpostition:function(){
                //sets the switches position depending on the theme, and changes the theme accordingly
                console.log('hilight Position set to: ',config.data.hilight_engine);
                if(config.data.hilight_engine){
                    document.getElementById('hilight_switch_container').className='switch_container_active';
                }else{
                    document.getElementById('hilight_switch_container').className='switch_container_dissabled';
                }
            },
        },
        animation:{
            flip:function(){
                console.log('animation switch triggered');
                if(config.data.animation){
                    //turn off the switch
                    config.data.animation=false;
                    utility.toast('animations dissabled');console.warn('animations dissabled');
                }else{
                    //turn on the witch
                    config.data.animation=true;
                    utility.toast('animations enabled');console.warn('animations enabled');
                }
                config.save();
                UI.setting.animation.setpostition();
            },
            setpostition:function(){
                if(config.data.animation){
                    document.getElementById('Animations_switch_container').className='switch_container_active';
                    document.getElementById('nomation').href="";
                }else{
                    document.getElementById('Animations_switch_container').className='switch_container_dissabled';
                    document.getElementById('nomation').href="css/nomation.css";//nomation sheet removes animations
                }
            },
        },
        tiles:{
            flip:function(){
                console.log('tiles switch triggered');
                if(config.data.tiles){
                    //turn off the switch
                    config.data.tiles=false;
                    utility.toast('tiles dissabled');console.warn('tiles dissabled');
                }else{
                    //turn on the witch
                    config.data.tiles=true;
                    utility.toast('tiles enabled');console.warn('tiles enabled');
                }
                config.save();
                UI.setting.tiles.setpostition();
            },
            setpostition:function(){
                if(config.data.tiles){
                    document.getElementById('tiles_switch_container').className='switch_container_active';
                }else{
                    document.getElementById('tiles_switch_container').className='switch_container_dissabled';
                }
            },
        },
    },
}

let utility = {//Some usefull things
    /*  Close the app   */
    close:function(){
        config.save();
        if (navigator.app) {
            navigator.app.exitApp();
        } else if (navigator.device) {
            navigator.device.exitApp();
        } else {
            window.close();
        }
    },
    /*  Produce toast messages    */
    toast:function(text,durration_in_ms,position_top_right_left_bottom,offset_in_px){
        if(typeof(device)!='undefined'){
            if(position_top_right_left_bottom==undefined){position_top_right_left_bottom='bottom'}//default the position
            if(durration_in_ms==undefined){durration_in_ms=4000}//default the duration
            if(offset_in_px==undefined){offset_in_px=-160}//default the offset
            window.plugins.toast.showWithOptions({message: text, duration: durration_in_ms, position: position_top_right_left_bottom, addPixelsY: offset_in_px},);    
        }else{console.error('Device plugin broke cannot push toast')}
    },
    /*  Push text to the keyboard   */
    clipboard:function(textpush) {
        copyText.toString(); //Makes it a string so the clipboard will accept it
        var temptxtbox = document.createElement("input"); //creates an 'input' element and assigns it to 'temptxtbox'
        document.body.appendChild(temptxtbox); //Puts the input element into the document
        temptxtbox.setAttribute("id", "temp_copy"); //Assigns an id to the input element
        document.getElementById("temp_copy").value = copyText; //Puts the txt u want to copy into the input element
        temptxtbox.select(); //Makes the curser select the text that's in the input element
        document.execCommand("copy"); //Commands the document to copy the selected text
        document.body.removeChild(temptxtbox); //Removes the input element from the document
    },
    /*  Produce Random numbers  */
    rand:{
        HEX:function(){return '#'+Math.floor(Math.random()*16777215).toString(16) /* hex color code */ },
        RGB:function(){return { RED:this.number(255,0), GREEN:this.number(255,0), BLUE:this.number(255,0)} /* object with RGB color code */ },
        HSL:function(){return  { HUE:this.number(360,0), SATURATION:this.number(100,0)+'%', LIGHTENESS:this.number(100,1)+'%' }/* HSL color code */},
        number(max,min){return Math.floor(Math.random() * (max - min + 1) ) + min /* Random number*/}
    },
}