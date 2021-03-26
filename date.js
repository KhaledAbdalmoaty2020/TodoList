
module.exports.getDate = ()=>{
    const today=new Date;
    let option={
        weekend:"long",
        month:"long",
        day:"2-digit",
        //year:"numeric",
        //hour:"2-digit",
       // hour:"numeric",
        //minute:"2-digit",
        //second:"2-digit",
        //time:"numeric"
    };
    //let day=today.toLocaleString();
    let day=today.toLocaleDateString("en-us",option);

    return day;
}
module.exports.getDay= ()=>{
   
    let today=new Date;
    switch(today.getDay()){
        case 0: 

            return "Sunday";
            break;
        case 1:
            return "Monday";
            break;
        case 2:
            return "Tuesday";
            break;
        case 3:
            return "Wensday";
            break;
        case 4:
            return "Thursday";
            break;
        case 5:
            return "Friday";
            break;
        default:
            return "There is an error";
            break;
    }
}
//weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };