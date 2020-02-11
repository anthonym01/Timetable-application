/*
    Author: Samuel A. Matheson
    Email:samuelmatheson15@gmail.com
                        ║\
                        ║▒\
                        ║▒▒\
                        ║░▒║
                        ║░▒║
                        ║░▒║
                        ║░▒║
                        ║░▒║ 
                        ║░▒║
                        ║░▒║
                        ║░▒║
                        ▓▓▓▓
                        [█▓]
                        [█▓]
                        [█▓]
                        [█▓]
            U steal the code, U get new holes
*/

/*
    If u dont nunderstand my code barf just use 'notify.new(notifiaction_title,notification_body);' to call the notification
*/

let notify = {  /*  Notification handler  */
    preset_height: 22,//2 more than the height in the css
    previous_type: 1,
    animate_old: false,//turn on and off old notification Animation
    current: 0,//Current is incimented every time theres a new notifyer
    resizecheck: window.addEventListener('resize', () => { notify.clearall() }),
    new: function (title, body, style) {
        var doot;
        this.current++;//Inciment the current pisition
        if (this.previous_type != style) {
            this.clearall();
        }
        this.previous_type = style;

        //create the notification holder
        var tempnotif = document.createElement("div");      //create a div
        document.body.appendChild(tempnotif);               //Put the div into the body of the page
        tempnotif.setAttribute("id", "notif" + this.current); //set an id to the div

        //create the title
        var tmptitle = document.createElement("div");       //create a div
        tmptitle.setAttribute("class", "title");             //set the class of the div to 'title'
        tmptitle.setAttribute("id", "title" + this.current);   //set an id to the 'title' div
        document.getElementById("notif" + this.current).appendChild(tmptitle);    //Put the 'title' div into the 'notification' div from before
        document.getElementById("title" + this.current).innerHTML = title;  //Puts the title text into the 'title' div

        //create the body
        var tmpbdy = document.createElement("div"); //create a div
        tmpbdy.setAttribute("class", "notifbody");   //set the class of the div to 'notifbody'
        tmpbdy.setAttribute("id", "body" + this.current);  //set an id to the 'notifbody' div
        document.getElementById("notif" + this.current).appendChild(tmpbdy);  //put the 'notifbody' div into the 'notification' div from before
        document.getElementById("body" + this.current).innerHTML = body;    //puts body text into the 'notifbody' div

        tempnotif.addEventListener('click', function () { notify.clearall() });//click to close notifications
        tempnotif.title = 'click to dismiss';

        switch (style) {//style switch change default to change default
            case 1:
                tempnotif.setAttribute("class", "notification_style1");    //set the class of the div to 'notification_style1'
                this.preset_height = 22;
                break;
            case 2:
                tempnotif.setAttribute("class", "notification_style2");    //set the class of the div to 'notification_style2'
                this.preset_height = 16;
                break;
            case 3:
                tempnotif.setAttribute("class", "notification_style3");    //set the class of the div to 'notification_style2'
                this.preset_height = 16;
                break;
            case 4:
                tempnotif.setAttribute("class", "notification_style4");    //set the class of the div to 'notification_style2'
                this.preset_height = 22;
                break;
            default: tempnotif.setAttribute("class", "notification_style1");    //defaults the class of the div to 'notification_style1'
                console.warn('Notifier takes style value selectors 1-4, you have selected', style);
                this.preset_height = 22;
        }

        this.timing_effects(this.current, tempnotif);//Timing in seperate function to avoid using 'new' object calls or extra variables

        //manuver old notifications out of the way
        if (window.innerHeight >= window.innerWidth) {
            if (this.animate_old) {
                if (document.getElementById('notif' + Number(this.current - 1))) {//stars at -1 because 1 less than the latest notification
                    document.getElementById('notif' + Number(this.current - 1)).style.transform = 'translate(-100vw,0vh)';
                }
                if (document.getElementById('notif' + Number(this.current - 2))) {
                    document.getElementById('notif' + Number(this.current - 2)).style.transform = 'translate(-100vw,0vh)';
                }
                if (document.getElementById('notif' + Number(this.current - 3))) {
                    document.getElementById('notif' + Number(this.current - 3)).style.transform = 'translate(-100vw,0vh)';
                }
                if (document.getElementById('notif' + Number(this.current - 4))) {
                    document.getElementById('notif' + Number(this.current - 4)).style.transform = 'translate(-100vw,0vh)';
                }
                if (document.getElementById('notif' + Number(this.current - 5))) {
                    document.getElementById('notif' + Number(this.current - 5)).style.transform = 'translate(-100vw,0vh)';
                }
                if (document.getElementById('notif' + Number(this.current - 6))) {
                    document.getElementById('notif' + Number(this.current - 6)).style.transform = 'translate(-100vw,0vh)';
                }
                if (document.getElementById('notif' + Number(this.current - 7))) {
                    document.getElementById('notif' + Number(this.current - 7)).style.transform = 'translate(-100vw,0vh)';
                }
            }
        } else {
            if (this.animate_old) {
                if (document.getElementById('notif' + Number(this.current - 1))) {//stars at -1 because 1 less than the latest notification
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
        }
        console.table(notify);
    },
    timing_effects: function (notificationindex, tempnotif) {
        setTimeout(() => { document.getElementById('notif' + notificationindex).style.transform = 'translate(0vw,0vh)' }, 50);
        setTimeout(() => { document.getElementById('notif' + notificationindex).style.opacity = '0.0' }, 10000);
        setTimeout(() => { document.body.removeChild(tempnotif); }, 11000);
    },
    clearall: function () {
        //This could be replaced with a "querySelectorAll", but this runs faster, so ill stick with it
        if (document.getElementById('notif' + Number(this.current))) {//nep them from latest going up
            document.getElementById('notif' + Number(this.current)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current)).style.zIndex = '-999';
        }
        if (document.getElementById('notif' + Number(this.current - 1))) {
            document.getElementById('notif' + Number(this.current - 1)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 1)).style.zIndex = '-999';
        }
        if (document.getElementById('notif' + Number(this.current - 2))) {
            document.getElementById('notif' + Number(this.current - 2)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 2)).style.zIndex = '-999';
        }
        if (document.getElementById('notif' + Number(this.current - 3))) {
            document.getElementById('notif' + Number(this.current - 3)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 3)).style.zIndex = '-999';
        }
        if (document.getElementById('notif' + Number(this.current - 4))) {
            document.getElementById('notif' + Number(this.current - 4)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 4)).style.zIndex = '-999';
        }
        if (document.getElementById('notif' + Number(this.current - 5))) {
            document.getElementById('notif' + Number(this.current - 5)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 5)).style.zIndex = '-999';
        }
        if (document.getElementById('notif' + Number(this.current - 6))) {
            document.getElementById('notif' + Number(this.current - 6)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 6)).style.zIndex = '-999';
        }
        if (document.getElementById('notif' + Number(this.current - 7))) {
            document.getElementById('notif' + Number(this.current - 7)).style.opacity = '0.0';
            document.getElementById('notif' + Number(this.current - 7)).style.zIndex = '-999';
        }
    }
}