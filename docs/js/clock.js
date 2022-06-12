//days
const day0 = document.getElementById('day0')
const day1 = document.getElementById('day1')
const day2 = document.getElementById('day2')
const day3 = document.getElementById('day3')
const day4 = document.getElementById('day4')
const day5 = document.getElementById('day5')
const day6 = document.getElementById('day6')

//timerows

const timerow = [//for timey wimey logic
    document.getElementById('timerow_0'),
    document.getElementById('timerow_1'),
    document.getElementById('timerow_2'),
    document.getElementById('timerow_3'),
    document.getElementById('timerow_4'),
    document.getElementById('timerow_5'),
    document.getElementById('timerow_6'),
    document.getElementById('timerow_7'),
    document.getElementById('timerow_8'),
    document.getElementById('timerow_9'),
    document.getElementById('timerow_10'),
    document.getElementById('timerow_11'),
    document.getElementById('timerow_12'),
    document.getElementById('timerow_13'),
    document.getElementById('timerow_14'),
    document.getElementById('timerow_15'),
    document.getElementById('timerow_16'),
    document.getElementById('timerow_17'),
    document.getElementById('timerow_18'),
    document.getElementById('timerow_19'),
    document.getElementById('timerow_20'),
    document.getElementById('timerow_21'),
    document.getElementById('timerow_22'),
    document.getElementById('timerow_23')
]

//time arrays for individual cells
const timesets = [//array of arrays to make things easier
    [
        document.getElementById('1_0'),
        document.getElementById('1_1'),
        document.getElementById('1_2'),
        document.getElementById('1_3'),
        document.getElementById('1_4'),
        document.getElementById('1_5'),
        document.getElementById('1_6'),
        document.getElementById('1_7'),
        document.getElementById('1_8'),
        document.getElementById('1_9'),
        document.getElementById('1_10'),
        document.getElementById('1_11'),
        document.getElementById('1_12'),
        document.getElementById('1_13'),
        document.getElementById('1_14'),
        document.getElementById('1_15'),
        document.getElementById('1_16'),
        document.getElementById('1_17'),
        document.getElementById('1_18'),
        document.getElementById('1_19'),
        document.getElementById('1_20'),
        document.getElementById('1_21'),
        document.getElementById('1_22'),
        document.getElementById('1_23')
    ],
    [
        document.getElementById('2_0'),
        document.getElementById('2_1'),
        document.getElementById('2_2'),
        document.getElementById('2_3'),
        document.getElementById('2_4'),
        document.getElementById('2_5'),
        document.getElementById('2_6'),
        document.getElementById('2_7'),
        document.getElementById('2_8'),
        document.getElementById('2_9'),
        document.getElementById('2_10'),
        document.getElementById('2_11'),
        document.getElementById('2_12'),
        document.getElementById('2_13'),
        document.getElementById('2_14'),
        document.getElementById('2_15'),
        document.getElementById('2_16'),
        document.getElementById('2_17'),
        document.getElementById('2_18'),
        document.getElementById('2_19'),
        document.getElementById('2_20'),
        document.getElementById('2_21'),
        document.getElementById('2_22'),
        document.getElementById('2_23')
    ],
    [
        document.getElementById('3_0'),
        document.getElementById('3_1'),
        document.getElementById('3_2'),
        document.getElementById('3_3'),
        document.getElementById('3_4'),
        document.getElementById('3_5'),
        document.getElementById('3_6'),
        document.getElementById('3_7'),
        document.getElementById('3_8'),
        document.getElementById('3_9'),
        document.getElementById('3_10'),
        document.getElementById('3_11'),
        document.getElementById('3_12'),
        document.getElementById('3_13'),
        document.getElementById('3_14'),
        document.getElementById('3_15'),
        document.getElementById('3_16'),
        document.getElementById('3_17'),
        document.getElementById('3_18'),
        document.getElementById('3_19'),
        document.getElementById('3_20'),
        document.getElementById('3_21'),
        document.getElementById('3_22'),
        document.getElementById('3_23')
    ],
    [
        document.getElementById('4_0'),
        document.getElementById('4_1'),
        document.getElementById('4_2'),
        document.getElementById('4_3'),
        document.getElementById('4_4'),
        document.getElementById('4_5'),
        document.getElementById('4_6'),
        document.getElementById('4_7'),
        document.getElementById('4_8'),
        document.getElementById('4_9'),
        document.getElementById('4_10'),
        document.getElementById('4_11'),
        document.getElementById('4_12'),
        document.getElementById('4_13'),
        document.getElementById('4_14'),
        document.getElementById('4_15'),
        document.getElementById('4_16'),
        document.getElementById('4_17'),
        document.getElementById('4_18'),
        document.getElementById('4_19'),
        document.getElementById('4_20'),
        document.getElementById('4_21'),
        document.getElementById('4_22'),
        document.getElementById('4_23')
    ],
    [
        document.getElementById('5_0'),
        document.getElementById('5_1'),
        document.getElementById('5_2'),
        document.getElementById('5_3'),
        document.getElementById('5_4'),
        document.getElementById('5_5'),
        document.getElementById('5_6'),
        document.getElementById('5_7'),
        document.getElementById('5_8'),
        document.getElementById('5_9'),
        document.getElementById('5_10'),
        document.getElementById('5_11'),
        document.getElementById('5_12'),
        document.getElementById('5_13'),
        document.getElementById('5_14'),
        document.getElementById('5_15'),
        document.getElementById('5_16'),
        document.getElementById('5_17'),
        document.getElementById('5_18'),
        document.getElementById('5_19'),
        document.getElementById('5_20'),
        document.getElementById('5_21'),
        document.getElementById('5_22'),
        document.getElementById('5_23')
    ],
    [
        document.getElementById('6_0'),
        document.getElementById('6_1'),
        document.getElementById('6_2'),
        document.getElementById('6_3'),
        document.getElementById('6_4'),
        document.getElementById('6_5'),
        document.getElementById('6_6'),
        document.getElementById('6_7'),
        document.getElementById('6_8'),
        document.getElementById('6_9'),
        document.getElementById('6_10'),
        document.getElementById('6_11'),
        document.getElementById('6_12'),
        document.getElementById('6_13'),
        document.getElementById('6_14'),
        document.getElementById('6_15'),
        document.getElementById('6_16'),
        document.getElementById('6_17'),
        document.getElementById('6_18'),
        document.getElementById('6_19'),
        document.getElementById('6_20'),
        document.getElementById('6_21'),
        document.getElementById('6_22'),
        document.getElementById('6_23')
    ],
    [
        document.getElementById('7_0'),
        document.getElementById('7_1'),
        document.getElementById('7_2'),
        document.getElementById('7_3'),
        document.getElementById('7_4'),
        document.getElementById('7_5'),
        document.getElementById('7_6'),
        document.getElementById('7_7'),
        document.getElementById('7_8'),
        document.getElementById('7_9'),
        document.getElementById('7_10'),
        document.getElementById('7_11'),
        document.getElementById('7_12'),
        document.getElementById('7_13'),
        document.getElementById('7_14'),
        document.getElementById('7_15'),
        document.getElementById('7_16'),
        document.getElementById('7_17'),
        document.getElementById('7_18'),
        document.getElementById('7_19'),
        document.getElementById('7_20'),
        document.getElementById('7_21'),
        document.getElementById('7_22'),
        document.getElementById('7_23')
    ]
]


const timestamp = [//arry of timestamps
    document.getElementById('time0'),
    document.getElementById('time1'),
    document.getElementById('time2'),
    document.getElementById('time3'),
    document.getElementById('time4'),
    document.getElementById('time5'),
    document.getElementById('time6'),
    document.getElementById('time7'),
    document.getElementById('time8'),
    document.getElementById('time9'),
    document.getElementById('time10'),
    document.getElementById('time11'),
    document.getElementById('time12'),
    document.getElementById('time13'),
    document.getElementById('time14'),
    document.getElementById('time15'),
    document.getElementById('time16'),
    document.getElementById('time17'),
    document.getElementById('time18'),
    document.getElementById('time19'),
    document.getElementById('time20'),
    document.getElementById('time21'),
    document.getElementById('time22'),
    document.getElementById('time23'),
]

//Row time
const day_cell = document.getElementById('day_cell');
const timerow_23 = document.getElementById('timerow_23');
const timerow_22 = document.getElementById('timerow_22');
const timerow_21 = document.getElementById('timerow_21');
const timerow_20 = document.getElementById('timerow_20');
const timerow_19 = document.getElementById('timerow_19');
const timerow_18 = document.getElementById('timerow_18');
const timerow_17 = document.getElementById('timerow_17');
const timerow_16 = document.getElementById('timerow_16');
const timerow_15 = document.getElementById('timerow_15');
const timerow_14 = document.getElementById('timerow_14');
const timerow_13 = document.getElementById('timerow_13');
const timerow_12 = document.getElementById('timerow_12');
const timerow_11 = document.getElementById('timerow_11');
const timerow_10 = document.getElementById('timerow_10');
const timerow_9 = document.getElementById('timerow_9');
const timerow_8 = document.getElementById('timerow_8');
const timerow_7 = document.getElementById('timerow_7');
const timerow_6 = document.getElementById('timerow_6');
const timerow_5 = document.getElementById('timerow_5');
const timerow_4 = document.getElementById('timerow_4');
const timerow_3 = document.getElementById('timerow_3');
const timerow_2 = document.getElementById('timerow_2');
const timerow_1 = document.getElementById('timerow_1');
const timerow_0 = document.getElementById('timerow_0');
const live_clock = document.getElementById('live_clock');



async function clocktick() {
    const date = new Date;

    live_clock.innerHTML = date.toLocaleTimeString();

    //Hours
    switch (date.getHours()) {
        case 0:// 12am
            timerow_0.className = 'glowrow';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 1:// 1am
            timerow_0.className = '';
            timerow_1.className = 'glowrow';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 2:// 2am
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = 'glowrow';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 3:// 3am
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = 'glowrow';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 4:// 4am
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = 'glowrow';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 5:// 5am
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = 'glowrow';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 6:// 6am
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = 'glowrow';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 7:// 7am
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = 'glowrow';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 8:// 8am
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = 'glowrow';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 9:// 9am
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = 'glowrow';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 10:// 10am
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = 'glowrow';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 11:// 11am
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = 'glowrow';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 12:// 12pm
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = 'glowrow';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 13:// 1pm
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = 'glowrow';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 14:// 2pm
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = 'glowrow';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 15:// 3pm
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = 'glowrow';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 16:// 4pm
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = 'glowrow';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 17:// 5pm
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = 'glowrow';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 18:// 6pm
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = 'glowrow';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 19:// 7pm
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = 'glowrow';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 20:// 8pm
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = 'glowrow';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 21:// 9pm
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = 'glowrow';
            timerow_22.className = '';
            timerow_23.className = '';
            break;
        case 22:// 10pm
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = 'glowrow';
            timerow_23.className = '';
            break;
        case 23:// 11pm
            timerow_0.className = '';
            timerow_1.className = '';
            timerow_2.className = '';
            timerow_3.className = '';
            timerow_4.className = '';
            timerow_5.className = '';
            timerow_6.className = '';
            timerow_7.className = '';
            timerow_8.className = '';
            timerow_9.className = '';
            timerow_10.className = '';
            timerow_11.className = '';
            timerow_12.className = '';
            timerow_13.className = '';
            timerow_14.className = '';
            timerow_15.className = '';
            timerow_16.className = '';
            timerow_17.className = '';
            timerow_18.className = '';
            timerow_19.className = '';
            timerow_20.className = '';
            timerow_21.className = '';
            timerow_22.className = '';
            timerow_23.className = 'glowrow';
            break;
        default:
            console.error(date);
    }

}

function setday() {
    const date = new Date;
    switch (date.getDay()) { //Date switch
        case 0:
            day0.className = 'maincell glowcell';
            day1.className = 'maincell';
            day2.className = 'maincell';
            day3.className = 'maincell';
            day4.className = 'maincell';
            day5.className = 'maincell';
            day6.className = 'maincell';
            break;
        case 1:
            day0.className = 'maincell';
            day1.className = 'maincell glowcell';
            day2.className = 'maincell';
            day3.className = 'maincell';
            day4.className = 'maincell';
            day5.className = 'maincell';
            day6.className = 'maincell';
            break;
        case 2:
            day0.className = 'maincell';
            day1.className = 'maincell';
            day2.className = 'maincell glowcell';
            day3.className = 'maincell';
            day4.className = 'maincell';
            day5.className = 'maincell';
            day6.className = 'maincell';
            break;
        case 3:
            day0.className = 'maincell';
            day1.className = 'maincell';
            day2.className = 'maincell';
            day3.className = 'maincell glowcell';
            day4.className = 'maincell';
            day5.className = 'maincell';
            day6.className = 'maincell';
            break;
        case 4:
            day0.className = 'maincell';
            day1.className = 'maincell';
            day2.className = 'maincell';
            day3.className = 'maincell';
            day4.className = 'maincell glowcell';
            day5.className = 'maincell';
            day6.className = 'maincell';
            break;
        case 5:
            day0.className = 'maincell';
            day1.className = 'maincell';
            day2.className = 'maincell';
            day3.className = 'maincell';
            day4.className = 'maincell';
            day5.className = 'maincell glowcell';
            day6.className = 'maincell';
            break;
        case 6:
            day0.className = 'maincell';
            day1.className = 'maincell';
            day2.className = 'maincell';
            day3.className = 'maincell';
            day4.className = 'maincell';
            day5.className = 'maincell';
            day6.className = 'maincell glowcell';
            break;
    }
}
