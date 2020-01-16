/**
 * Module dependencies.
 */
const mime = require("mime");
const fs = require("fs");
const path = require("path");
/**
 * staic()
 */
module.exports = static;

/**
 * 
 * @param {String} [url] static root of server default:process.cwd()
 * @param {Object} [opts] 
 * @param {String} [opts.index] default "index.html"
 * @param {Object} [opts.resHeader] response header
 * 
 */
function static(url,opts={}){
    opts = Object.assign({index:"index.html",maxAge:0,resHeader:{}},opts);
    if(!path.isAbsolute(url)){
        url = path.resolve("./",url);
    }
    return async function(ctx,next){
        let reqPath = path.join(url,ctx.path);
        try {
            let stats = await getStats(reqPath);
            if(stats.isDirectory()){
                reqPath = path.resolve(reqPath,opts.index);
            }
            let type = mime.getType(reqPath);
            let res;
            if(/image|audio|video|font/.test(type)){
                res = await readBuffer(reqPath);
            }else{
                res = await readFile(reqPath);
            }
            //set header
            ctx.set("Cache-control",`max-age=${opts.maxAge}`);
            ctx.set(opts.resHeader);
            //set type
            ctx.type = type; 
            //set status
            ctx.status = 200;
            if (ctx.fresh) {
                //if fresh set Not Modified
                ctx.status = 304;
                return;
            }
            ctx.body = res;
        } catch(e) {
            await next();
        }
    }
}
/**
 * 
 * @param {String} url filepath
 * @returns {Object} Promise thenable
 */
function readBuffer(url){
    return new Promise((resolve,reject)=>{
        let readStream = fs.createReadStream(url);
        let data = [];
        readStream.on("data",chunk=>{
            data.push(chunk);
        })
        readStream.on("end",()=>{
            resolve(Buffer.concat(data));
        })
        readStream.on("error",(err)=>{
            reject(err);
        })
    })
}
/**
 * 
 * @param {String} url filepath
 * @returns {Object} Promise thenable
 */
function readFile(url){
    return new Promise((resolve,reject)=>{
        fs.readFile(url,"utf8",(err,data)=>{
            if(err){
                reject(err);
            } 
            resolve(data);
        })
    })
}
/**
 * 
 * @param {String} url filepath
 * @returns {Object} Promise thenable
 */
function getStats(url){
    return new Promise((resolve,reject)=>{
        fs.stat(url,(err,stats)=>{
            if(err){
                reject(err);
            }
            resolve(stats);
        })
    })
}
