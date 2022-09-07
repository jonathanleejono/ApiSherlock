/*

1.
hour: 20
day: 2
Tues 8:29 PM GMT -4  ------>  * 29 0 * * 3


hour: 18
day: 1
Mon 6:25 PM GMT +5  ------>  * 25 1 * * 1

15
4
Thurs 3:02 PM GMT +6  ------>  * 2 9 * * 4

2.
hour: 19
day: 5
Fri 7:30 PM GMT -6  ------>  * 30 1 * * 6

3
1
Mon 3:58 AM GMT +7  ------>  * 58 20 * * 0

2
1
Mon 2:30 AM GMT -4 ------>  * 30 6 * * 1

4.
hour: 12
day: 1
Mon 12:00PM GMT -12 ------> * 0 0 * * 2

5.
hour: 11
day: 1
Mon 11:00 AM GMT -12 ------> * 0 23 * * 1

6.
hour: 0
day: 1
Mon 12:00 AM GMT -12 ------> * 0 12 * * 1

7.
hour: 12
day: 1
Mon 12:00PM GMT 13 ------> * 0 23 * * 0 (SUN 11:00PM)

8.
hour: 11
day: 1
Mon 11:00 AM GMT 13 ------> * 0 22 * * 0 (SUN 10:00PM)

9.
hour: 0
day: 1
Mon 12:00 AM GMT 13 ------> * 0 11 * * 0 (SUN 11:00AM)

10.
hour: 20
day: 2
Tues 8:00 PM GMT 5 ------> * 0 15 * * 2 (TUES 3:00PM)

11.
hour: 16
day: 2
Tues 4:00 PM GMT 5 ------> * 0 11 * * 2 (TUES 11:00AM)

12.
hour: 4
day: 2
Tues 4:00 AM GMT 5 ------> * 0 23 * * 1 (MON 11:00PM)

-12 <----------> 13

if timezone < 0:
    if (input hour - timezone >= 24):
        +1 to the day
        -24 to the (input hour - timezone) hr
    else:
     use (input hour - timezone) and normal day

if timezone > 0:
    if (input hour - timezone <= 0):
        -1 to the day
        +24 to the (input hour - timezone) hr
    else:
     use (input hour - timezone) and normal day

    7.
    PM
    num: 12 - (13) = -1 
    hour: (-1) + 24 = 23  -> good
    day: 1 - 1 = 0 -> good

    8.
    AM
    num: 11 - (13) = -2
    hour: (-2) + 24 = 22  -> good
    day: 1 - 1 = 0 -> good

    9.
    AM
    num: 0 - (13) = -13
    hour: (-13) + 24 = 11  -> good
    day: 1 - 1 = 0 -> good

    10.
    PM
    num: 20 - (5) = 15 
    hour: 15  -> good
    day: 2 -> good

    11.
    AM
    num: 16 - (5) = 11
    hour: 11 -> good
    day: 2 -> good

    12.
    AM
    num: 4 - (5) = -1
    hour: (-1) + 24 = 23  -> good
    day: 2 - 1 = 1 -> good


    1.
    PM
    num: 20 - (-4) = 24 
    hour: 24 - 24 = 0  -> good
    day: 2 + 1 = 3 -> good

    2.
    PM
    num: 19 - (-6) = 25
    hour: 25 - 24 = 1 -> good
    day: 5 + 1 = 6 -> good

    3.
    2 - (-4) = 6 -> correct

    4.
    PM
    num: 12 - ( -12) = 24
    hour: 24 - 24 = 0 -> good
    day: 1 + 1 = 2 -> good

    5.
    AM
    num: 11 - (-12) = 23
    hour: 23 -> good
    day: 1 -> good

    6.
    AM
    num: 0 - (-12) = 12
    hour: 12 -> good
    day: 1 -> good

*/
