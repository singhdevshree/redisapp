
import express from 'express';
import fetch from 'node-fetch';

import { createClient } from 'redis';

const PORT=28345;

const connectionString=`rediss://admin:devshree-redis@9eb346c1-d640-41dd-a0a3-fb6d3b86b2bc.c4n4trid0tl3n7uvrtlg.databases.appdomain.cloud:32374/0`;
const client = createClient(connectionString, {
     tls: { servername: new URL(connectionString).hostname }
   });

(async () => {
    await client.connect();
})();

const app= express();

function setResponse(username, repo_count){
    return`<h2>${username} has ${repo_count} `;
}

async function getRepos(req,res,next){

        console.log('req sent...');
        const {username}=  req.params;
        console.log('username', username);

        var redisVal=await client.GET(String(username));
        console.log('redisval pull',redisVal)

        if (redisVal !=null){
            redisVal=redisVal+" repos, fetched from ibm cloud";
            res.send(setResponse(username,redisVal));
        }
        else{
            const response= await fetch(`https://api.github.com/users/${username}`);
            const data= await response.json();
            var repo_count=data.public_repos;
            console.log('wesedddfxdfxzf',repo_count);
            await client.set(String(username),String(repo_count));
            repo_count=repo_count+ "repos, stored in ibm redis";
            res.send(setResponse(username,repo_count));
        }
          

}

app.get  ('/repos/:username',getRepos);
app.listen(PORT,()=>{
console.log(`App listenong on port ${PORT}`);
});









// const PORT=28345;//process.env.PORT ||7000;
// //const Redis_PORT= 6379;//process.env.Redis_PORT||6379;

// const ibmredis='rediss://Admin:Devshree-redis@9eb346c1-d640-41dd-a0a3-fb6d3b86b2bc.c4n4trid0tl3n7uvrtlg.databases.appdomain.cloud:32374/0'

// //const client= createClient(Redis_PORT);
// // (async () => {
// //     const client = createClient(Redis_PORT);
// //     client.on('error', (err) => console.log('Redis Client Error', err));
    
// //     console.log(await client.connect());
// // })();

// const app= express();

// async function getRepos(req,res,next){
//    //try{
//         console.log('req sent...');
//         const {username}= req.params;
//         const response= await fetch(`https://api.github.com/users/${username}`);
//         const data= await response.json();
//         const repo_count=data.public_repos;

//         //client.hset(username, repo_count);
//         const client = createClient(ibmredis);
//         client.on('error', (err) => console.log('Redis Client Error', err));    
//         console.log(await client.connect());
//         await client.hSet(String(username), 'public_repos', repo_count);
//         const getvalue= await client.hGetAll(String(username));
        
//         console.log("getvalue is",getvalue);
//         res.send(data);

// // }catch(err){
// //        console.error(err);
// //     }

// }


// async function cache(req,res,next){
//     const {username}= req.params;
//     const client = createClient(ibmredis);
//     await client.connect()
//     //client.get(username,(err,data)=>{
//     await client.hGetAll(String(username),(err,data)=>{  
//     if (err)throw err;
//         if (data!=null){
//             res.send(setResponse(username,data));

//         }else{
//             next();
//         }
//     })
// }

// app.get('/repos/:username',cache,getRepos);


//  app.listen(PORT,()=>{
// console.log(`App listenong on port ${PORT}`);
// });