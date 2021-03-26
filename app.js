/* ----------------------------- require packages ---------------------------- */
const express=require("express");
const bodyParser=require("body-parser");
const app =express();
const date=require(__dirname+"/date.js")
const _=require("lodash");

/* ----------------------------------- app use ----------------------------------- */
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public_static_page"));
app.set('view engine', 'ejs');

/* ----------------------------   intial the server ---------------------------- */
var portNumber=process.env.PORT || 1000;
app.listen(portNumber,()=>{
    console.log("server start at the port number " +portNumber);
});
/* ----------------------- connect with mongoDataBase ----------------------- */
const mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/toDoListDb', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.connection.once("open",()=>{
            console.log("successfully connected to mango Database..")
        }).on("error",(error)=>{
            console.log("error:"+error)
    });

/* --------------------------- todolist collection -------------------------- */

const toDoListShema=new mongoose.Schema({
    name:String
});

const todolistModel=mongoose.model("toDoListColl",toDoListShema);
const item_1=new todolistModel({
    name:"Welcome to your to do list!"
});
const item_2=new todolistModel({
    name:"Hit the + button to add a new item"
});
const item_3=new todolistModel({
    name:"<-- Hit checkbox  to delete an item."
});
const defaultItems=[item_1,item_2,item_3];

/* ------------------------- customerList collection ------------------------ */
customerListShema=new mongoose.Schema({
    name:String,
    items:[toDoListShema]
});
const customerListModel=mongoose.model("customerList",customerListShema);




/* ----------------------------- global variable ---------------------------- */
//let req_date=date.getDate();
let req_date =date.getDay();
req_date += " , "+date.getDate();

/* -------------------------- deal with  get request -------------------------- */
app.get("/",(req,res)=>{
    //sending the data to list.ejs to show data after insert default Items
    todolistModel.find({},(err,foundItems)=>{
        if(foundItems.length==0){
            todolistModel.insertMany(defaultItems,(err_2)=>{
                if(err_2){
                    console.log("error=>"+err)
                }
                else{
                    console.log("Items add to defautl list successfully")
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list",{listTitle:"Today",items:foundItems});

        }

    })
    
});

app.get("/:customListName",(req,res)=>{
    let customerListName=_.capitalize(req.params.customListName);
    customerListModel.findOne({name:customerListName},(err,foundItem)=>{
        if(!foundItem){
            const addCustomerList=new customerListModel({
                name:customerListName,
                items:defaultItems
            });
            addCustomerList.save();
            res.redirect("/"+customerListName);
        }
        else{
            res.render("list",{listTitle:customerListName,items:foundItem.items})
        }
    })
   


})
/* ------------------------- deal with post request ------------------------- */
app.post("/",(req,res)=>{
    //make a new object of todolistModel and save beside to that push that object to customer list model item
 let new_item=req.body.new_item;
 let buttonValue=req.body.buttonValue;
 const newItem=new todolistModel({
    name:new_item
 });
 if(buttonValue=="Today"){
    newItem.save();
    res.redirect("/");
 }
else{
     customerListModel.findOne({name:buttonValue},(err,foundItem)=>{
        
        foundItem.items.push(newItem);
        foundItem.save();
        res.redirect("/"+buttonValue);
        })
    }

});

app.post("/checkbox",(req,res)=>{
    //delete items from mongoDb
let deleteId=req.body.checkbox;
let customListName=req.body.nameOfList;
    if(customListName==="Today"){
        todolistModel.findByIdAndRemove(deleteId,(err)=>{
            if(err){
                console.log("error=>"+err)
            }
            else{
                console.log("successful delete items")
            }
        })
        res.redirect("/");

    }
    else{
        customerListModel.findOneAndUpdate({name:customListName},{$pull:{items:{_id:deleteId}}},(err)=>{
            if(!err){
                res.redirect("/"+customListName);
            }
            //res.redirect("/"+customListName);
        })

    }
//console.log(deleteId);

  
 

});

   


 

  

