import express from "express";
import bodyParser  from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";

const connectionString = "mongodb://127.0.0.1:27017/todo-data"; 



//let arr=[];


// let arr=[
//     {
//         title: "Task-1",
//         todo:" Brush"
//     },
//     {
//         title: "Task-2",
//         todo:"Break-fast"
//     },
//     {
//         title: "Task-3",
//         todo:"Study"
//     }
// ]


/*

const app =express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


async function run(){
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }).then(()=>console.log(" Connected Sucessfully"))
             .catch((err)=> {console.error(err);}  );

    
        app.get("/",(req,res)=>{
        res.render("index.ejs",{
        data: arr
        });

        })




app.post("/post",(req,res)=>{
   // Taking the value of title from the body
    // Taking the value of todo from the body

    const currTodo={
        title:req.body.title,   // Taking the value of title from the body
        // Taking the value of todo from the body    
        todo: req.body.todo
    }
    arr.push(currTodo);
    res.redirect("/")

})






app.listen(3000,function(){
    console.log("Server is running on the port 3000");
})

}catch (err) {
    console.error(err);
}
}
run();

*/

const app =express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


async function run(){
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          }).then(()=>console.log(" Connected Sucessfully"))
             .catch((err)=> {console.error(err);}  );

        
         const Schema = mongoose.Schema;

         const itemSchema={
            titleName: String,
            descrip: String
         }

         const Item = mongoose.model("Item", itemSchema);
      
        //  const task1= new Item ({
        //     titleName: "Welcome to our todo-list",
        //     descrip:"This is task one"

        //  })

        //  const task2= new Item({
        //     titleName: "Task",
        //     descrip: "this is task two"
        //  })

        //  const task3= new Item({
        //     titleName: "Task",
        //     descrip:"this is task3"
        //  })

         const defaultArray=[];

        //  await Item.insertMany(defaultArray)
        //  .then(()=>console.log(" Data inserted Sucessfully"))
        //   .catch((err)=> {console.error(err);}  );


        
        const listSchema={
            name: String,
            items : [itemSchema]  // Embedded data 
         }
        const List = mongoose.model("List",listSchema);



        app.get("/",(req,res)=>{
            
            async function run(){
                const allItem = await Item.find({}); // getting all the item in the form of array.
              //  console.log(allItem); 
                res.render("index.ejs",{
                    data: allItem,
                    listTitle: "Today"
                    });
             }
            run();

        })


        app.post("/post",(req,res)=>{
        
        const listName= req.body.list;
        const newItem= new Item({
            titleName: req.body.title,  // Taking the value of title from the body
            descrip: req.body.todo     // Taking the value of todo from the body
         })

        if(listName==="Today"){
            newItem.save();
            res.redirect("/");
        }else{
            //using the query name
            List.findOne({name:listName}) // Getting that particular document with name =Listname
            .then((docs)=>{ //docs consits of a name ,id and a items
                const Items=docs.items; //Already jo items[array] tha in that particular doc
                Items.push(newItem);  // Push the newItem
                docs.save();
                res.redirect("/"+listName)
            }).catch((err)=>{
                console.log(err);
            })
        }

       // newItem.save(); // saving to the database then next time it should not be deleted
       // res.redirect("/")// Then redirect to the root 

        })
        

        app.post("/delete", (req, res) => {
            // const listName= req.body.list;
            // if(listName==="Today"){
            // const id=req.body.button;
            async function run(){
                const listName= req.body.listName;
                const id=req.body.button;
                if(listName==="Today"){
                await Item.deleteOne({_id: id});
                res.redirect("/");
                }
                else{ 
                    //Delete the particular item with id from doc.items array with pull operator 
                  List.findOneAndUpdate({name:listName},{$pull: {items:{_id:id}}})
                  .then((doc)=>{
                    res.redirect("/"+listName);
                  }).catch((err)=>{
                    console.log(err);
                  });
                }
            }
            run();

        });

        app.get("/:customListName",function(req,res){
            const listName= _.capitalize(req.params.customListName);

            List.findOne({name:listName}) // name : ListName is the query
            .then((docs)=>{
                if(docs){ // doc with that naame: listName
                   // Document already exist no need to make again the same document
                  // console.log(docs);
                   res.render("list.ejs", { // We can use index.ejs as both of them are same
                    listTitle : docs.name, 
                     data: docs.items,
                   });
                                                         
                }else{
                    // Document not exist so make a new document  and save it
                    const list = new List({
                        name: listName,
                        items: defaultArray,
                      })
                      list.save(); // And redirect to the /listName then as it is saved so if statement works and render the 
                      res.redirect("/"+listName);
                }
            }).catch((err)=>{
                console.log(err);
            })

            /*
            const list = new List({
                name: listName,
                items: defaultArray
            })
            list.save();
            */

        })

     





app.listen(3000,function(){
    console.log("Server is running on the port 3000");
})

}catch (err) {
    console.error(err);
}
}
run();
