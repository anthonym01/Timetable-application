
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
        config.load();
        config.data.usecount++;
    }else{
        config.validate();
    }
    UI.initalize();
    manage.initalize();
    table.initialize();
    config.properties.startup=false;
    setTimeout(()=>{
        console.log('Closing loading screen...');
        document.getElementById('Loading').style.display='none';
    },50);
});

/*  Config file handler    */
var config={
    data:{
        usecount:0,
        theme:"dark",
        hilight_engine:false,
        table_selected:1,
        table_details:[//   This needs a setting pannel in the setting menu
            {purpose:"table 1"},
            {purpose:"table 2"},
            {purpose:"table 3"},
            {purpose:"table 4"}
        ],
        table1_db:[
            /*          KEY
                name:           Name of the class
                day:            1-7, represent monday to friday
                room:           Room/location of the class
                type:           class type (1 - Lecture,2 - Practical,custom - a custom string)
                course_code:    A string containing the courses id code
                color:          Color of the block
                start:          The starting time of the class represented in 24hr
                end:            End time of the class represented in 24hr
                    (minutes represented as percentage of hr "x/60")
            */
            
            {show:1,day:1,name:"Analysis of Algorithms",Lecturer:"David W. White",room:"1A-66",course_code:"CIT3003",type:"Lecture",color:1,start:10.00,end:11.833},
            {show:1,day:1,name:"Operating Systems",Lecturer:"Khalilah Burrell-Battick",room:"1A-X",course_code:"CIT3002",type:"Tutorial",color:2,start:17.00,end:18.00},
            {show:1,day:1,name:"Operating Systems",Lecturer:"Khalilah Burrell-Battick",room:"1A-X",course_code:"CIT3002",type:"Practical",color:2,start:18.00,end:21},
            {show:1,day:1,name:"IT Project Management",room:"2B-3",course_code:"CIT4024",type:"Tutorial",color:5,start:15.00,end:17.00},
            {show:1,day:1,name:"IT Project Management",room:"LT-48",course_code:"CIT4024",type:"Lecture",color:5,start:12.00,end:13.00},
            {show:1,day:2,name:"Academic Writing II",room:"LT-49",course_code:"COM2013",type:"Lecture",color:3,start:9.00,end:10.00},
            {show:1,day:2,name:"Analysis of Algorithms",Lecturer:"David W. White",room:"1A-65",course_code:"CIT3003",type:"Tutorial",color:1,start:15.00,end:16.00},
            {show:1,day:2,name:"Operating Systems",Lecturer:"Khalilah Burrell-Battick",room:"47C-1",course_code:"CIT3002",type:"Lecture",color:2,start:13.00,end:14.00},
            {show:1,day:2,name:"Academic Writing II",Lecturer:"Kay dougly",room:"LT-48/49",course_code:"COM2013",type:"Lecture",color:3,start:18.00,end:19.00},
            {show:1,day:3,name:"IT Project Management",room:"LT-49",course_code:"CIT4024",type:"Tutorial",color:5,start:12.00,end:13.00},
            {show:1,day:3,name:"IT Project Management",room:"2B-3",course_code:"",type:"Tutorial",color:0,start:8.00,end:9.833},
            {show:1,day:3,name:"IT Project Management",room:"2B-6",course_code:"",type:"Tutorial",color:0,start:19.00,end:21.00},
            {show:1,day:5,name:"Academic Writing II",Lecturer:"Kay dougly",room:"2B-5",course_code:"COM2013",type:"Tutorial",color:3,start:8.00,end:10},
            {show:1,day:1,name:"Academic Writing II",room:"LT-48",course_code:"COM2013",type:"Lecture",color:3,start:13.00,end:13.833},
            
            {show:0,day:2,name:"Forensics",room:"1A-12",course_code:"",type:"Practical",color:8,start:14.00,end:16.00},
            {show:0,day:5,name:"Forensics",room:"47B-3",course_code:"",type:"Lecture",color:8,start:14.00,end:15.00},
            {show:0,day:5,name:"Forensics",room:"47B-3",course_code:"",type:"Lecture",color:8,start:15.00,end:17.00},
            {show:0,day:3,name:"Advanced Programming",room:"2B-7",course_code:"CIT4024",type:"Tutorial",color:0,start:12.00,end:13.00},
            {show:0,day:2,name:"Advanced Programming",room:"2B-7",course_code:"CIT4024",type:"Practical",color:0,start:12.00,end:14.00},
            {show:0,day:1,name:"Forensics",room:"C1",course_code:"",type:"Practical",color:8,start:15.00,end:17.00},
            {show:0,day:3,name:"Forensics",room:"22B-1",course_code:"",type:"Lecture",color:8,start:12.00,end:13.00},
            {show:0,day:3,name:"Operating Systems",room:"",course_code:"CIT3002",type:"Tutorial",color:2,start:11.00,end:12.00},
            {show:0,day:4,name:"Advanced Programming",room:"Lab C",course_code:"CIT4024",type:"Practical",color:0,start:12.00,end:15.00},
            {show:0,day:2,name:"Operating Systems",room:"3B-20",course_code:"CIT3002",type:"Lecture",color:2,start:18.00,end:19.00},

            {show:2,day:1,name:"General Chemistry Lab 1",room:"3B-5",course_code:"",type:"Practical",color:3,start:8.00,end:11.00},
            {show:2,day:2,name:"Academic writing 1",room:"1B-C2",course_code:"",type:"lecture & Tutorial",color:5,start:8.00,end:11.00},
            {show:2,day:2,name:"Information Technology",room:"1B-C2",course_code:"",type:"Lecture",color:6,start:11.00,end:12.00},
            {show:2,day:2,name:"Information Technology",room:"47B-3",course_code:"",type:"Practical",color:6,start:14.00,end:17.00},
            {show:2,day:2,name:"General Chemistry 1",room:"1B-C2",course_code:"",type:"Tutorial",color:1,start:12.00,end:13.00},
            
        ],
        task_db:[

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
        
        if(typeof(this.data.task_db)!=='undefined'){
            if(this.data.task_db==undefined||null){//check db existance
                this.data.task_db=[];
                configisvalid=false;
                console.log('"Task_database" was found to be invalid and was set to default');
            }else{//validate after design
                   
            }
        }else{
            this.data.task_db=[];
            configisvalid=false;
            console.log('"Table1_database" was found to not exist and was set to default');
        }

        if(this.data.view){
            if(this.data.view==undefined||null){
                this.data.view="table";
                configisvalid=false;
                console.log('"view" was found to be invalid and was set to default');
            }
        }
        else{
            this.data.view="table";
            configisvalid=false;
            console.log('"view" was found to not exist and was set to default');
        }

        if(this.data.theme){
            if(this.data.theme==undefined||null){
                this.data.theme="light";
                configisvalid=false;
                console.log('"theme" was found to not exist and was set to default');
            }
        }
        else{
            this.data.theme="light";
            configisvalid=false;
            console.log('"theme" was found to not exist and was set to default');
        }

        if(this.data.hilight_engine){
            if(this.data.hilight_engine!=true && this.data.hilight_engine!=false){
                this.data.hilight_engine=true;
                configisvalid=false;
                console.log('"hilight_engine" was found to be invalid and was set to default');
            }
        }
        else{
            if(this.data.hilight_engine!=true && this.data.hilight_engine!=false){
                this.data.hilight_engine=true;
                configisvalid=false;
                console.log('"hilight_engine" was found to not exist and was set to default');
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
            console.log('Table render started');
            this.clear();
            var i=0;
            if(config.data.table_selected==0){config.data.table_selected=1}//Fix oversight
            if(config.data.table1_db[i]==null||undefined){
                //show first time setup screen
                console.log('The table database is empty');
                utility.toast('To start off lets add something to display');
                document.getElementById('data_title').innerHTML='First Time?';

                setTimeout(()=>{manage.dialogue.open();UI.navigate.MANAGE();},100);

                document.getElementById('Loading').style.display='none';
                console.log('Closing loading screen...');
    
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
        clear:function(){
            console.log('Table Flushed');
            document.getElementById('table1').innerHTML='<table id="timetable">            <tr><!--Head row-->                <th class="maincell" id="live_clock">live_clock</th>                <th class="maincell" id="day1">Monday</th>                <th class="maincell" id="day2">Tuesday</th>                <th class="maincell" id="day3">Wednsday</th>                <th class="maincell" id="day4">Thursday</th>                <th class="maincell" id="day5">Friday</th>                <th class="maincell" id="day6">Saturday</th>                <th class="maincell" id="day0">Sunday</th>            </tr>            <tr id="timerow_0"><!--0:00 - 1:00 row-->                <th class="maincell">12:00 - 1:00 a.m.</th>                <td class="maincell" id="1_0"></td>                <td class="maincell" id="2_0"></td>                <td class="maincell" id="3_0"></td>                <td class="maincell" id="4_0"></td>                <td class="maincell" id="5_0"></td>                <td class="maincell" id="6_0"></td>                <td class="maincell" id="7_0"></td>            </tr>            <tr id="timerow_1"><!--1:00 - 2:00 row-->                <th class="maincell">1:00 - 2:00 a.m.</th>                <td class="maincell" id="1_1"></td>                <td class="maincell" id="2_1"></td>                <td class="maincell" id="3_1"></td>                <td class="maincell" id="4_1"></td>                <td class="maincell" id="5_1"></td>                <td class="maincell" id="6_1"></td>                <td class="maincell" id="7_1"></td>            </tr>            <tr id="timerow_2"><!--2:00 - 3:00 row-->                <th class="maincell">2:00 - 3:00 a.m.</th>                <td class="maincell" id="1_2"></td>                <td class="maincell" id="2_2"></td>                <td class="maincell" id="3_2"></td>                <td class="maincell" id="4_2"></td>                <td class="maincell" id="5_2"></td>                <td class="maincell" id="6_2"></td>                <td class="maincell" id="7_2"></td>            </tr>            <tr id="timerow_3"><!--3:00 - 4:00 row-->                <th class="maincell">3:00 - 4:00 a.m.</th>                <td class="maincell" id="1_3"></td>                <td class="maincell" id="2_3"></td>                <td class="maincell" id="3_3"></td>                <td class="maincell" id="4_3"></td>                <td class="maincell" id="5_3"></td>                <td class="maincell" id="6_3"></td>                <td class="maincell" id="7_3"></td>            </tr>            <tr id="timerow_4"><!--4:00 - 5:00 row-->                <th class="maincell">4:00 - 5:00 a.m.</th>                <td class="maincell" id="1_4"></td>                <td class="maincell" id="2_4"></td>                <td class="maincell" id="3_4"></td>                <td class="maincell" id="4_4"></td>                <td class="maincell" id="5_4"></td>                <td class="maincell" id="6_4"></td>                <td class="maincell" id="7_4"></td>            </tr>            <tr id="timerow_5"><!--5:00 - 6:00 row-->                <th class="maincell">5:00 - 6:00 a.m.</th>                <td class="maincell" id="1_5"></td>                <td class="maincell" id="2_5"></td>                <td class="maincell" id="3_5"></td>                <td class="maincell" id="4_5"></td>                <td class="maincell" id="5_5"></td>                <td class="maincell" id="6_5"></td>                <td class="maincell" id="7_5"></td>            </tr>            <tr id="timerow_6"><!--6:00 - 7:00 row-->                <th class="maincell">6:00 - 7:00 a.m.</th>                <td class="maincell" id="1_6"></td>                <td class="maincell" id="2_6"></td>                <td class="maincell" id="3_6"></td>                <td class="maincell" id="4_6"></td>                <td class="maincell" id="5_6"></td>                <td class="maincell" id="6_6"></td>                <td class="maincell" id="7_6"></td>            </tr>            <tr id="timerow_7"><!--7:00 - 8:00 row-->                <th class="maincell">7:00 - 8:00 a.m.</th>                <td class="maincell" id="1_7"></td>                <td class="maincell" id="2_7"></td>                <td class="maincell" id="3_7"></td>                <td class="maincell" id="4_7"></td>                <td class="maincell" id="5_7"></td>                <td class="maincell" id="6_7"></td>                <td class="maincell" id="7_7"></td>            </tr>            <tr id="timerow_8"><!--8:00 - 9:00 row-->                <th class="maincell">8:00 - 9:00 a.m.</th>                <td class="maincell" id="1_8"></td>                <td class="maincell" id="2_8"></td>                <td class="maincell" id="3_8"></td>                <td class="maincell" id="4_8"></td>                <td class="maincell" id="5_8"></td>                <td class="maincell" id="6_8"></td>                <td class="maincell" id="7_8"></td>            </tr>            <tr id="timerow_9"><!--9:00 - 10:00 row-->                <th class="maincell">9:00 - 10:00 a.m.</th>                <td class="maincell" id="1_9"></td>                <td class="maincell" id="2_9"></td>                <td class="maincell" id="3_9"></td>                <td class="maincell" id="4_9"></td>                <td class="maincell" id="5_9"></td>                <td class="maincell" id="6_9"></td>                <td class="maincell" id="7_9"></td>            </tr>            <tr  id="timerow_10"><!--10:00 - 11:00 row-->                <th class="maincell">10:00 - 11:00 a.m.</th>                <td class="maincell" id="1_10"></td>                <td class="maincell" id="2_10"></td>                <td class="maincell" id="3_10"></td>                <td class="maincell" id="4_10"></td>                <td class="maincell" id="5_10"></td>                <td class="maincell" id="6_10"></td>                <td class="maincell" id="7_10"></td>            </tr>            <tr id="timerow_11"><!--11:00 - 12:00 row-->                <th class="maincell">11:00 - 12:00 p.m.</th>                <td class="maincell" id="1_11"></td>                <td class="maincell" id="2_11"></td>                <td class="maincell" id="3_11"></td>                <td class="maincell" id="4_11"></td>                <td class="maincell" id="5_11"></td>                <td class="maincell" id="6_11"></td>                <td class="maincell" id="7_11"></td>            </tr>            <tr id="timerow_12"><!--12:00 - 13:00 row-->                <th class="maincell">12:00 - 1:00 p.m.</th>                <td class="maincell" id="1_12"></td>                <td class="maincell" id="2_12"></td>                <td class="maincell" id="3_12"></td>                <td class="maincell" id="4_12"></td>                <td class="maincell" id="5_12"></td>                <td class="maincell" id="6_12"></td>                <td class="maincell" id="7_12"></td>            </tr>            <tr id="timerow_13"><!--13:00 - 14:00 row-->                <th class="maincell">1:00 - 2:00 p.m.</th>                <td class="maincell" id="1_13"></td>                <td class="maincell" id="2_13"></td>                <td class="maincell" id="3_13"></td>                <td class="maincell" id="4_13"></td>                <td class="maincell" id="5_13"></td>                <td class="maincell" id="6_13"></td>                <td class="maincell" id="7_13"></td>            </tr>            <tr id="timerow_14"><!--14:00 - 15:00 row-->                <th class="maincell">2:00 - 3:00 p.m.</th>                <td class="maincell" id="1_14"></td>                <td class="maincell" id="2_14"></td>                <td class="maincell" id="3_14"></td>                <td class="maincell" id="4_14"></td>                <td class="maincell" id="5_14"></td>                <td class="maincell" id="6_14"></td>                <td class="maincell" id="7_14"></td>           </tr>            <tr id="timerow_15"><!--15:00 - 16:00 row-->                <th class="maincell">3:00 - 4:00 p.m.</th>                <td class="maincell" id="1_15"></td>                <td class="maincell" id="2_15"></td>                <td class="maincell" id="3_15"></td>                <td class="maincell" id="4_15"></td>                <td class="maincell" id="5_15"></td>                <td class="maincell" id="6_15"></td>                <td class="maincell" id="7_15"></td>            </tr>            <tr id="timerow_16"><!--16:00 - 17:00 row-->                <th class="maincell">4:00 - 5:00 p.m.</th>                <td class="maincell" id="1_16"></td>                <td class="maincell" id="2_16"></td>                <td class="maincell" id="3_16"></td>                <td class="maincell" id="4_16"></td>                <td class="maincell" id="5_16"></td>                <td class="maincell" id="6_16"></td>                <td class="maincell" id="7_16"></td>            </tr>            <tr id="timerow_17"><!--17:00 - 18:00 row-->                <th class="maincell">5:00 - 6:00 p.m.</th>                <td class="maincell" id="1_17"></td>                <td class="maincell" id="2_17"></td>                <td class="maincell" id="3_17"></td>                <td class="maincell" id="4_17"></td>                <td class="maincell" id="5_17"></td>                <td class="maincell" id="6_17"></td>                <td class="maincell" id="7_17"></td>           </tr>            <tr id="timerow_18"><!--18:00 - 19:00 row-->                <th class="maincell">6:00 - 7:00 p.m.</th>                <td class="maincell" id="1_18"></td>                <td class="maincell" id="2_18"></td>                <td class="maincell" id="3_18"></td>               <td class="maincell" id="4_18"></td>                <td class="maincell" id="5_18"></td>                <td class="maincell" id="6_18"></td>                <td class="maincell" id="7_18"></td>            </tr>            <tr id="timerow_19"><!--19:00 - 20:00 row-->                <th class="maincell">7:00 - 8:00 p.m.</th>                <td class="maincell" id="1_19"></td>                <td class="maincell" id="2_19"></td>                <td class="maincell" id="3_19"></td>                <td class="maincell" id="4_19"></td>                <td class="maincell" id="5_19"></td>                <td class="maincell" id="6_19"></td>                <td class="maincell" id="7_19"></td>            </tr>            <tr id="timerow_20"><!--20:00 - 21:00 row-->                <th class="maincell">8:00 - 9:00 p.m.</th>                <td class="maincell" id="1_20"></td>                <td class="maincell" id="2_20"></td>                <td class="maincell" id="3_20"></td>                <td class="maincell" id="4_20"></td>                <td class="maincell" id="5_20"></td>                <td class="maincell" id="6_20"></td>                <td class="maincell" id="7_20"></td>            </tr>            <tr id="timerow_21"><!--21:00 - 22:00 row-->                <th class="maincell">9:00 - 10:00 p.m.</th>                <td class="maincell" id="1_21"></td>                <td class="maincell" id="2_21"></td>                <td class="maincell" id="3_21"></td>                <td class="maincell" id="4_21"></td>                <td class="maincell" id="5_21"></td>                <td class="maincell" id="6_21"></td>                <td class="maincell" id="7_21"></td>            </tr>            <tr id="timerow_22"><!--22:00 - 23:00 row-->                <th class="maincell">10:00 - 11:00 p.m.</th>                <td class="maincell" id="1_22"></td>                <td class="maincell" id="2_22"></td>               <td class="maincell" id="3_22"></td>                <td class="maincell" id="4_22"></td>                <td class="maincell" id="5_22"></td>                <td class="maincell" id="6_22"></td>                <td class="maincell" id="7_22"></td>            </tr>            <tr id="timerow_23"><!--23:00 - 24:00 row-->                <th class="maincell">11:00 - 11:59 p.m.</th>                <td class="maincell" id="1_23"></td>                <td class="maincell" id="2_23"></td>                <td class="maincell" id="3_23"></td>                <td class="maincell" id="4_23"></td>                <td class="maincell" id="5_23"></td>                <td class="maincell" id="6_23"></td>                <td class="maincell" id="7_23"></td>            </tr></table>';
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
                    //doot.style.paddingBottom='0';
                    //doot.style.paddingTop='5%';
                }

                //Put doot into the Data Bar
                if(true){//Slap a customization setting here
                    //make table in doot to keep things even
                    var sub_tab = document.createElement("table");
                    var name_tab_row = document.createElement("tr");
                    var name_tab_content = document.createElement("th");
                    name_tab_content.innerHTML=config.data.table1_db[index].name;
                    name_tab_content.setAttribute("colspan",2);
                    name_tab_content.setAttribute("name","sub_element");
                    name_tab_row.appendChild(name_tab_content);
                    sub_tab.appendChild(name_tab_row);
                    doot.appendChild(sub_tab);
                
                    if(config.data.table1_db[index].room!="" && config.data.table1_db[index].room!=undefined){
                        var room_tab_row = document.createElement("tr");
                        var room_tab_head = document.createElement("td");
                        var room_tab_content = document.createElement("td");
                        room_tab_head.setAttribute("class","lefter");
                        room_tab_content.setAttribute("class","righter");
                        room_tab_head.setAttribute("name","sub_element");
                        room_tab_content.setAttribute("name","sub_element");
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
                        course_code_tab_head.setAttribute("name","sub_element");
                        course_code_tab_content.setAttribute("name","sub_element");
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
                    var start_time_tab = document.createElement("td");
                    var end_time_tab = document.createElement("td");
                    start_time_tab.setAttribute("class","lefter");
                    end_time_tab.setAttribute("class","righter");
                    start_time_tab.innerHTML = starthr+':'+startminute+' '+startmeridian;
                    end_time_tab.innerHTML = endhr+':'+endminute+' '+endmeridian;
                    start_time_tab.style.paddingRight='0px';
                    time_tab_row.appendChild(start_time_tab);
                    time_tab_row.appendChild(end_time_tab);
                    sub_tab.appendChild(time_tab_row);
                    doot.appendChild(sub_tab);
                //doot.innerHTML+='<br> '+starthr+':'+startminute+' '+startmeridian+' - '+endhr+':'+endminute+' '+endmeridian;*/
                }else{
                    doot.innerHTML = config.data.table1_db[index].name;
                    if(config.data.table1_db[index].room!="" && config.data.table1_db[index].room!=undefined){doot.innerHTML+='<br> Room: '+config.data.table1_db[index].room}
                    if(config.data.table1_db[index].course_code!="" && config.data.table1_db[index].course_code!=undefined){doot.innerHTML+='<br> Code: '+config.data.table1_db[index].course_code}
                    if(config.data.table1_db[index].Lecturer!="" && config.data.table1_db[index].Lecturer!=undefined){doot.innerHTML+='<br> Lecturer: '+config.data.table1_db[index].Lecturer}
                    if(config.data.table1_db[index].type!="" && config.data.table1_db[index].type!=undefined){doot.innerHTML+='<br> Type: '+config.data.table1_db[index].type}
                    doot.innerHTML+='<br> '+starthr+':'+startminute+' '+startmeridian+' - '+endhr+':'+endminute+' '+endmeridian;
                }
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
                    if(tempblock.name=="on"){
                        tempblock.name="off";
                        tempblock.setAttribute("class", "data_block hue"+config.data.table1_db[index].color);
                    }else{
                        tempblock.name="on";
                        tempblock.setAttribute("class", "data_block_active hue"+config.data.table1_db[index].color);
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
                this.clear();
                utility.toast(' This table is empty...');
            }
            console.log('Table validated');
        }
    },
    clock:{
        clock_tick_trigger:null,//setInterval(()=>{table.clock.clock_tick()},1000),
        clock_tick:function(){
            console.log('Clock ticks');
            var date = new Date();
            document.getElementById('live_clock').innerHTML=date.toLocaleTimeString();
            switch(date.getDay()){//Date switch
                case 0: 
                    document.getElementById('day0').style.backgroundColor='red';
                    document.getElementById('day1').style.backgroundColor='';
                    document.getElementById('day2').style.backgroundColor='';
                    document.getElementById('day3').style.backgroundColor='';
                    document.getElementById('day4').style.backgroundColor='';
                    document.getElementById('day5').style.backgroundColor='';
                    document.getElementById('day6').style.backgroundColor='';
                break;
                case 1: 
                    document.getElementById('day0').style.backgroundColor='';
                    document.getElementById('day1').style.backgroundColor='red';
                    document.getElementById('day2').style.backgroundColor='';
                    document.getElementById('day3').style.backgroundColor='';
                    document.getElementById('day4').style.backgroundColor='';
                    document.getElementById('day5').style.backgroundColor='';
                    document.getElementById('day6').style.backgroundColor='';
                break;
                case 2: 
                    document.getElementById('day0').style.backgroundColor='';
                    document.getElementById('day1').style.backgroundColor='';
                    document.getElementById('day2').style.backgroundColor='red';
                    document.getElementById('day3').style.backgroundColor='';
                    document.getElementById('day4').style.backgroundColor='';
                    document.getElementById('day5').style.backgroundColor='';
                    document.getElementById('day6').style.backgroundColor='';
                break;
                case 3: 
                    document.getElementById('day0').style.backgroundColor='';
                    document.getElementById('day1').style.backgroundColor='';
                    document.getElementById('day2').style.backgroundColor='';
                    document.getElementById('day3').style.backgroundColor='red';
                    document.getElementById('day4').style.backgroundColor='';
                    document.getElementById('day5').style.backgroundColor='';
                    document.getElementById('day6').style.backgroundColor='';
                break;
                case 4: 
                    document.getElementById('day0').style.backgroundColor='';
                    document.getElementById('day1').style.backgroundColor='';
                    document.getElementById('day2').style.backgroundColor='';
                    document.getElementById('day3').style.backgroundColor='';
                    document.getElementById('day4').style.backgroundColor='red';
                    document.getElementById('day5').style.backgroundColor='';
                    document.getElementById('day6').style.backgroundColor='';
                break;
                case 5: 
                    document.getElementById('day0').style.backgroundColor='';
                    document.getElementById('day1').style.backgroundColor='';
                    document.getElementById('day2').style.backgroundColor='';
                    document.getElementById('day3').style.backgroundColor='';
                    document.getElementById('day4').style.backgroundColor='';
                    document.getElementById('day5').style.backgroundColor='red';
                    document.getElementById('day6').style.backgroundColor='';
                break;
                case 6: 
                    document.getElementById('day0').style.backgroundColor='';
                    document.getElementById('day1').style.backgroundColor='';
                    document.getElementById('day2').style.backgroundColor='';
                    document.getElementById('day3').style.backgroundColor='';
                    document.getElementById('day4').style.backgroundColor='';
                    document.getElementById('day5').style.backgroundColor='';
                    document.getElementById('day6').style.backgroundColor='red';
                break;
            }
            switch(date.getHours()){//Hour switch
                case 0:
                        document.getElementById('timerow_0').className='glowrow';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 1:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='glowrow';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 2:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='glowrow';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 3:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='glowrow';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 4:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='glowrow';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 5:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='glowrow';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 6:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='glowrow';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 7:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='glowrow';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 8:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='glowrow';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 9:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='glowrow';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 10:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='glowrow';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 11:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='glowrow';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 12:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='glowrow';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 13:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='glowrow';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 14:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='glowrow';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 15:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='glowrow';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 16:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='glowrow';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 17:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='glowrow';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 18:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='glowrow';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 19:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='glowrow';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 20:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='glowrow';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 21:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='glowrow';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='';
                break;
                case 22:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='glowrow';
                        document.getElementById('timerow_23').className='';
                break;
                case 23:
                        document.getElementById('timerow_0').className='';
                        document.getElementById('timerow_1').className='';
                        document.getElementById('timerow_2').className='';
                        document.getElementById('timerow_3').className='';
                        document.getElementById('timerow_4').className='';
                        document.getElementById('timerow_5').className='';
                        document.getElementById('timerow_6').className='';
                        document.getElementById('timerow_7').className='';
                        document.getElementById('timerow_8').className='';
                        document.getElementById('timerow_9').className='';
                        document.getElementById('timerow_10').className='';
                        document.getElementById('timerow_11').className='';
                        document.getElementById('timerow_12').className='';
                        document.getElementById('timerow_13').className='';
                        document.getElementById('timerow_14').className='';
                        document.getElementById('timerow_15').className='';
                        document.getElementById('timerow_16').className='';
                        document.getElementById('timerow_17').className='';
                        document.getElementById('timerow_18').className='';
                        document.getElementById('timerow_19').className='';
                        document.getElementById('timerow_20').className='';
                        document.getElementById('timerow_21').className='';
                        document.getElementById('timerow_22').className='';
                        document.getElementById('timerow_23').className='glowrow';
                break;
                default:console.error('THEY CHANGED THE RULES FOR DATES NIBBA!!!');
            }
            /**
                //Old method, less efficient

            document.getElementById('day0').style.backgroundColor='';
            document.getElementById('day1').style.backgroundColor='';
            document.getElementById('day2').style.backgroundColor='';
            document.getElementById('day3').style.backgroundColor='';
            document.getElementById('day4').style.backgroundColor='';
            document.getElementById('day5').style.backgroundColor='';
            document.getElementById('day6').style.backgroundColor='';*/
            /*document.getElementById('timerow_0').className='';
            document.getElementById('timerow_1').className='';
            document.getElementById('timerow_2').className='';
            document.getElementById('timerow_3').className='';
            document.getElementById('timerow_4').className='';
            document.getElementById('timerow_5').className='';
            document.getElementById('timerow_6').className='';
            document.getElementById('timerow_7').className='';
            document.getElementById('timerow_8').className='';
            document.getElementById('timerow_9').className='';
            document.getElementById('timerow_10').className='';
            document.getElementById('timerow_11').className='';
            document.getElementById('timerow_12').className='';
            document.getElementById('timerow_13').className='';
            document.getElementById('timerow_14').className='';
            document.getElementById('timerow_15').className='';
            document.getElementById('timerow_16').className='';
            document.getElementById('timerow_17').className='';
            document.getElementById('timerow_18').className='';
            document.getElementById('timerow_19').className='';
            document.getElementById('timerow_20').className='';
            document.getElementById('timerow_21').className='';
            document.getElementById('timerow_22').className='';
            document.getElementById('timerow_23').className='';*/
            //document.getElementById('day'+date.getDay()).style.backgroundColor='red';//Set the appropriate title background to red
            //document.getElementById('timerow_'+date.getHours()).className='glowrow';//set the appropriate row to glow
        },
        stop_clock:function(){
            console.log('Clock was stopped');
            clearInterval(this.clock_tick_trigger);//stops teh clock ticking
        },
        start_clock:function(){
            console.log('Clock started');
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
                    if(event.target.name!="sub_element"){
                        event.target.style.color='white';
                        event.target.style.backgroundColor='hsl('+ utility.rand.number(360,0) +',100%,40%)';//color the target
                    }
                }else if(config.data.theme=="dark"){
                    if(event.target.name!="sub_element"){
                        event.target.style.color='black';
                        event.target.style.backgroundColor='hsl('+ utility.rand.number(360,0) +',100%,60%)';//color the target
                    }
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
        document.getElementById('tableselector_text').innerText=config.data.table_details[config.data.table_selected-1].purpose;
        document.getElementById('view_put_text').innerText=config.data.table_details[config.data.table_selected-1].purpose;
        document.getElementById('1_selectorsub').innerHTML = config.data.table_details[0].purpose;
        document.getElementById('1_selectormain').innerHTML = config.data.table_details[0].purpose;
        document.getElementById('2_selectorsub').innerHTML= config.data.table_details[1].purpose;
        document.getElementById('2_selectormain').innerHTML= config.data.table_details[1].purpose;
        document.getElementById('3_selectorsub').innerHTML= config.data.table_details[2].purpose;
        document.getElementById('3_selectormain').innerHTML= config.data.table_details[2].purpose;
        document.getElementById('4_selectorsub').innerHTML= config.data.table_details[3].purpose;
        document.getElementById('4_selectormain').innerHTML= config.data.table_details[3].purpose;
        document.getElementById('menu_button1').innerHTML= config.data.table_details[0].purpose;
        document.getElementById('menu_button2').innerHTML= config.data.table_details[1].purpose;
        document.getElementById('menu_button3').innerHTML= config.data.table_details[2].purpose;
        document.getElementById('menu_button4').innerHTML= config.data.table_details[3].purpose;
        document.getElementById('menu_button'+config.data.table_selected).style.display='none';
        this.data.render();
        if(typeof(device)!="undefined"){
            if(device.platform=='Android'||'iOS'){//mobile
                
            }else{//Desktop
                
            }
        }else{
            console.error('"device" plugin broke!');
            
        }
        document.getElementById('cancel_btn').addEventListener('click',this.action.cancel_btn);//Click because touch start gay
        document.getElementById('save_btn').addEventListener('click',this.dialogue.save); //Save button
        document.getElementById('savepluss_btn').addEventListener('click',this.dialogue.saveplus);
        document.getElementById('delete_btn').addEventListener('click',function(){      // save button
            console.log('Delete pseudo function called');
            //document.getElementById('page_shade').style.display='block';
            document.getElementById('delete_confirm_pannel').style.display='block';
        });
        document.getElementById('yes_btn').addEventListener('click',function(){         // Delete yes button
            console.log('Delete Confirmation called');
            config.data.table1_db[config.properties.overwrite].deleted=true;//pseudo delete function
            manage.initalize();
            manage.dialogue.clear();
            manage.dialogue.close();
            config.properties.changed=true;
            config.save();
            document.getElementById('delete_confirm_pannel').style.display='none';
        });
        document.getElementById('no_btn').addEventListener('click',function(){          // Delete No button
            console.log('Delete denial called');
            document.getElementById('delete_confirm_pannel').style.display='none';
        });
        document.getElementById('color_put').addEventListener('change',function(){      // Change color put color on change
            console.log('Color selection changed to :',document.getElementById('color_put').value);
            document.getElementById('color_put_container').className='select_container hue'+document.getElementById('color_put').value;
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
            document.getElementById('tableselector_text').innerText=config.data.table_details[config.data.table_selected-1].purpose;
            config.properties.changed=true;
            manage.data.render();
            config.save();
        });
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
        document.getElementById('view_put').addEventListener('change',function(){/* Switches dates on change */
            console.log('View put changed');
            document.getElementById('view_put_text').innerText=config.data.table_details[document.getElementById('view_put').value-1].purpose;
        });
        document.getElementById('menu_button1').addEventListener('click',function(){
            manage.action.table_menu(1);
        });
        document.getElementById('menu_button2').addEventListener('click',function(){
            manage.action.table_menu(2);
        });
        document.getElementById('menu_button3').addEventListener('click',function(){
            manage.action.table_menu(3);
        });
        document.getElementById('menu_button4').addEventListener('click',function(){
            manage.action.table_menu(4);
        });
    },
    action:{
        table_menu:function(doot){
            config.data.table_selected=doot;
            config.properties.changed=true;
            config.save();
            setTimeout(()=> {
                document.getElementById('Loading').style.display='block';
                location.reload();
            },500 );
        },
        cancel_btn:function(){
            console.log('Cancel button clicked');
            manage.dialogue.clear();
            manage.dialogue.close();
            config.properties.overwrite=null;
        },
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
            document.getElementById('dataspace').appendChild(tempblock);
            var plusimg = document.createElement('div');//plus image
            plusimg.setAttribute("class","plusimg");
            tempblock.appendChild(plusimg);
            tempblock.addEventListener('click',function(){manage.dialogue.open();console.log('Add new button clicked')});//add new btn listener
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
                tempblock.innerHTML=config.data.table1_db[index].name+'<br> Marked for delete, click to undo';
                tempblock.setAttribute("class", "data_bar hue0");
                tempblock.style.border="0.3vh solid red";
                //alow editing function
                tempblock.setAttribute('id','bar_'+index);
                tempblock.addEventListener('click',function(){config.data.table1_db[index].deleted=false;config.save();manage.data.render();});//un-"delete"
            }else{
                //populate the block with relivant data
                if(true){//Slap a customization setting here
                    //make table in tempblock to keep things even
                    var name_sub_tab = document.createElement("table");
                    var name_tab_row = document.createElement("tr");
                    var name_tab_content = document.createElement("th");
                    name_tab_content.innerHTML=config.data.table1_db[index].name;
                    name_tab_content.setAttribute("colspan",2);
                    name_tab_row.appendChild(name_tab_content);
                    name_sub_tab.appendChild(name_tab_row);
                    tempblock.appendChild(name_sub_tab);
                    var day_sub_tab = document.createElement("table");
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
                    day_sub_tab.appendChild(day_tab_row);
                    tempblock.appendChild(day_sub_tab);
                    var time_sub_tab = document.createElement("table");
                    var time_tab_row = document.createElement("tr");
                    var start_time_tab = document.createElement("td");
                    var end_time_tab = document.createElement("td");
                    start_time_tab.setAttribute("class","lefter");
                    end_time_tab.setAttribute("class","righter");
                    start_time_tab.innerHTML = starthr+':'+startminute+' '+startmeridian+' -';
                    end_time_tab.innerHTML = '  '+endhr+':'+endminute+' '+endmeridian;
                    start_time_tab.style.paddingRight='0px';
                    time_tab_row.appendChild(start_time_tab);
                    time_tab_row.appendChild(end_time_tab);
                    time_sub_tab.appendChild(time_tab_row);
                    tempblock.appendChild(time_sub_tab);
                }else{
                    tempblock.innerHTML=config.data.table1_db[index].name+'<br>'+day+' '+config.data.table1_db[index].type+' '+config.data.table1_db[index].room+' '+starthr+':'+startminute+' '+startmeridian+' - '+endhr+':'+endminute+' '+endmeridian;    
                }
                //alow editing function
                tempblock.setAttribute('id','bar_'+index);
                tempblock.addEventListener('click',function(){manage.dialogue.edit(index)});//Edit btn
            }
            var noot = document.createElement('div');
            if(config.data.table1_db[index].show==0){noot.innerHTML='<del>'+config.data.table1_db[index].show+'</del>';noot.style.color='red';}//noot is hidden
            else{noot.innerHTML=config.data.table1_db[index].show;}//not gets a number
            noot.setAttribute('class','data_noot');
            tempblock.appendChild(noot)
            document.getElementById('dataspace').appendChild(tempblock);//put the bar into the dukument
            console.log('Bar: ',index,' Complete');
        },
        clear:function(){
            console.log('Dataspace clear called');
            document.getElementById('dataspace').innerHTML='';
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
            document.getElementById('color_put_container').className='select_container hue'+config.data.table1_db[index].color;    //set color class to make the feild glow
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
        },
        open:function(){//The listener for the add open btn is in manage.data.render()
            console.log('Dialogue open called');
            document.getElementById('view_put').value=config.data.table_selected;//if new
            document.getElementById('dataentry_screen').style.display="block";
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
            document.getElementById('dataentry_screen').style.display="none";
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
                this.setting.theme.set_dark();
        }
        this.setting.hilight.setpostition();
        if(typeof(device)!="undefined"){//sometimes plugins break
            if(device.platform=='Android'||'iOS'){//mobile
                document.getElementById('table_btn').addEventListener('touchstart',UI.navigate.TABLE)
                document.getElementById('manage_btn').addEventListener('touchstart',UI.navigate.MANAGE)
                document.getElementById('setting_btn').addEventListener('touchstart',UI.navigate.SETTING)
                document.getElementById('task_btn').addEventListener('click',UI.navigate.TASK)
                document.getElementById('hilight_btn').addEventListener('touchstart',UI.setting.hilight.flip)
            }else{//Desktop
                document.getElementById('table_btn').addEventListener('click',UI.navigate.TABLE)
                document.getElementById('manage_btn').addEventListener('click',UI.navigate.MANAGE)
                document.getElementById('setting_btn').addEventListener('click',UI.navigate.SETTING)
                document.getElementById('task_btn').addEventListener('click',UI.navigate.TASK)
                document.getElementById('hilight_btn').addEventListener('click',UI.setting.hilight.flip)
            }
        }
        else{
            console.error('"device" plugin broke!');
            document.getElementById('table_btn').addEventListener('click',UI.navigate.TABLE)
            document.getElementById('manage_btn').addEventListener('click',UI.navigate.MANAGE)
            document.getElementById('setting_btn').addEventListener('click',UI.navigate.SETTING)
            document.getElementById('task_btn').addEventListener('click',UI.navigate.TASK)
            document.getElementById('hilight_btn').addEventListener('click',UI.setting.hilight.flip)
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
            if(config.properties.view=="table"){
                this.exitstrategy();
            }else{
                this.TABLE();
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
                if(config.properties.view=="table" && config.properties.startup!=true){
                    UI.submenu();
                }
                config.properties.view="table";
                document.getElementById('table1').style.display='block';
                document.getElementById('manage_view').style.display='none';
                document.getElementById('setting_view').style.display='none';
                document.getElementById('task_view').style.display='none';
                document.getElementById('setting_btn_icon').style.transform='rotate(0deg)';//Rotate the button
                table.clock.start_clock();
                document.getElementById('setting_btn').className="menubtn";
                document.getElementById('task_btn').className="menubtn";
                document.getElementById('manage_btn').className="menubtn";
                document.getElementById('table_btn').className="menubtn_active";
            }
            
        },
        MANAGE:function(){
            UI.submenuclose();
            console.log('MANAGE navigation started');
            config.properties.view="manage";
            table.clock.stop_clock();
            document.getElementById('table1').style.display='none';
            document.getElementById('manage_view').style.display='block';
            document.getElementById('setting_view').style.display='none';
            document.getElementById('task_view').style.display='none';
            document.getElementById('setting_btn').className="menubtn";
            document.getElementById('task_btn').className="menubtn";
            document.getElementById('manage_btn').className="menubtn_active";
            document.getElementById('table_btn').className="menubtn";
        },
        SETTING:function(){
            UI.submenuclose();
            console.log('SETTING navigation started');
            config.properties.view="setting";
            table.clock.stop_clock();
            document.getElementById('table1').style.display='none';
            document.getElementById('manage_view').style.display='none';
            document.getElementById('setting_view').style.display='block';
            document.getElementById('task_view').style.display='none';
            document.getElementById('setting_btn_icon').style.transform='rotate(90deg)';//Rotate the button
            document.getElementById('setting_btn').className="menubtn_active";
            document.getElementById('task_btn').className="menubtn";
            document.getElementById('manage_btn').className="menubtn";
            document.getElementById('table_btn').className="menubtn";
        },
        TASK:function(){
            UI.submenuclose();
            console.log('TASK navigation started');
            config.properties.view="task";
            table.clock.stop_clock();
            document.getElementById('table1').style.display='none';
            document.getElementById('manage_view').style.display='none';
            document.getElementById('setting_view').style.display='none';
            document.getElementById('task_view').style.display='block';
            document.getElementById('setting_btn_icon').style.transform='rotate(0deg)';//Rotate the button
            document.getElementById('setting_btn').className="menubtn";
            document.getElementById('task_btn').className="menubtn_active";
            document.getElementById('manage_btn').className="menubtn";
            document.getElementById('table_btn').className="menubtn";
        }
    },
    setting:{
        theme:{
            set_dark:function(){
                console.warn('Theme set Dark');
                config.data.theme='dark'
                document.getElementById('theme').href="css/dark-theme.css"
                document.getElementById('light_selection_put').checked=false;
                document.getElementById('dark_selection_put').checked=true;
                config.save();
            },
            set_light:function(){
                console.warn('Theme set Light');
                config.data.theme='light'
                document.getElementById('theme').href="css/light-theme.css"
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
    },
    submenu:function(){//renders and displays sub menus
        if(document.getElementById('sub_menu').style.display=='block'){
            this.submenuclose();
        }else{
            this.submenuopen();
        }
    },
    submenuclose:function(){
        console.log('Closing sub menu...');
        document.getElementById('sub_menu').style.display='none';
        document.getElementById('table1').removeEventListener('touchstart',UI.submenuclose);
    },
    submenuopen:function(){
        console.log('Displaying sub menu...');
        document.getElementById('sub_menu').style.display='block';
        document.getElementById('table1').addEventListener('touchstart',UI.submenuclose);
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