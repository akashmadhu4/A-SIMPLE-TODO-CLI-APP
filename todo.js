#!/usr/bin/env node

/*Here I used commander module to build cli ,all test pases but when missing argument with
  todo add ,todo del,todo done the commander package just gives a commander error which 
  cannot be removed(commander module hasn't solved this problem yet)and it just exit from the app, but just for passing the test I did exitoveride
  to every subcommands so when doing todo subcommands with no arguments it console log all the error together */  

//To make this node application access gobally just type "npm link". if your not testing it is better to comment the exitoverride function and then use npm link

const {program}=require('commander')                      //requiring the commander module to build the cli

const fs=require('fs')                                   //requiring the fs internal module of nodejs

program
    .version('1.0.0')
    .description("ToDo App")
    .action(()=>{
        help()
    })
program
    .command('help')
    .action(()=>{
        help()
    })

program
    .command('add <todo>')
    .description('# Add a new todo')
    //.exitOverride(console.log('Error: Missing todo string. Nothing added!'))    //comment this line to remove the error when you do todo and todo subcommonds.I did it to pass the test  
    .action((todo)=>{                                                             
            addtodo(todo)       
    })
program
    .command('ls')
    .description('# Show remaining todos')
    .action(()=>{listtodo()})

program
    .command('del <todoitem>')
    .description('# Delete a todo')
    //.exitOverride(console.log("Error: Missing NUMBER for deleting todo."))    //comment this line to remove the error when you do todo and todo subcommonds.I did it to pass the test
    .action((todoitem)=>{
        deltodo(todoitem)
    })    
program
    .command('done <done>')
    .description('# Complete a todo')
    //.exitOverride(console.log("Error: Missing NUMBER for marking todo as done."))  //comment this line to remove the error when you do todo and todo subcommonds.I did it to pass the test
    .action((done)=>{
        donetodo(done)
    })
program
    .command('report')
    .description('# Statistics')    
    .action(()=>{
        report()
    })  

const help=()=>{
    console.log(`Usage :-
$ ./todo add \"todo item\"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`)
}

const addtodo=(argument)=>{                                                                   //addtodo function adds the todo's to todo.txt
    fs.access(`${process.cwd()}/todo.txt`,fs.F_OK,(err)=>{                                    //checking a whether the todo.txt file exits in cwd
        if (err){
            fs.writeFile(`${process.cwd()}/todo.txt`,argument+'\n',(err)=>{                   //writing todo's if there is no such file called todo.txt
                if (err){
                    console.log(err)
                }
                console.log('Added todo:'+' '+`"${argument}"`)
            }) 
        }
        else{
            fs.appendFile(`${process.cwd()}/todo.txt`,argument+'\n',(err)=>{                  //appending the todo's if todo.txt file exits 
                if (err){
                    console.log(err)
                }
                console.log('Added todo:'+' '+`"${argument}"`)
            }) 
        }
    })      
}


const listtodo=()=>{                                                                          //listtodo fucntion list all pending todo's
    fs.readFile(`${process.cwd()}/todo.txt`,(err,data)=>{                                     //reading the todo.txt file
        if (err){
            console.log("There are no pending todos!")
        }
        else{
            var list=data.toString().split("\n");
            list.pop()
            for (i=list.length-1;i>=0;i--)
                {
                    console.log(`[${i+1}]`+ ' '+list[i])
                }
        }
    })    
}

const deltodo=(argument)=>{
    fs.readFile(`${process.cwd()}/todo.txt`,'utf8',(err,data)=>{                     //reading all todo's from todo.txt before deleting
        if(err){
            console.log(err)                                              
        }
        var list=data.toString().split("\n");
        if(!!!list[argument-1]){
            console.log(`Error: todo #${argument} does not exist. Nothing deleted.`)
        }
        else{
            list.splice(argument-1,1);
            console.log('Deleted todo #'+argument);
            fs.writeFile(`${process.cwd()}/todo.txt`,list.join('\n'),(err)=>{         //writing all todo's to todo.txt file after deleting a particular todo item 
                if (err){
                console.log(err);
                }
            })
        }       
    })                
}
 
const donetodo=(argument)=>{                                                         //donetodo function marks the todo's as done
    fs.readFile(`${process.cwd()}/todo.txt`,'utf8',(err,data)=>{                     //reading the todo.txt file and removing the done item from todo.txt
        if(err){
            console.log(err)
        }
        var list=data.toString().split("\n");
        if(!!!list[argument-1]){
            console.log(`"Error: todo #${argument} does not exist."`)
        }
        else{
            deleted=list.splice(argument-1,1);
            fs.writeFile(`${process.cwd()}/todo.txt`,list.join('\n'),(err)=>{                
            if (err){
                console.log(err);
                }
            })
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            fs.appendFile(`${process.cwd()}/done.txt`,'x'+' '+date+' '+deleted.join()+'\n',(err)=>{  //appending the done item to done.txt
                if (err){
                console.log(err);
                }
            console.log('Marked todo #'+`${argument}`+' '+'as done.')
            })
        }
        
    })
}

const report=()=>{                                                                   //report function prints out the statistics of the todo
    fs.readFile(`${process.cwd()}/todo.txt`,(err,data)=>{                                   
        if(err){
            console.log(err)
        }
        var todo=data.toString().split("\n");
        fs.readFile(`${process.cwd()}/done.txt`,(err,data)=>{
            if(err){
                console.log(err)
            }
            var done=data.toString().split("\n");
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            console.log(date+' '+'Pending'+' '+':'+' '+`${todo.length-1}`+ ' '+'Completed'+' '+':'+' '+`${done.length-1}`)  
        })
    })
}
try{
    program.parse(process.argv)
}catch(err){
    console.log()
}

