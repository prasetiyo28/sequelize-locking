function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
async function withRetry(fn,{retries=3,delayMs=100}={}){let lastErr;for(let i=0;i<retries;i++){try{return await fn();}catch(err){const code=err?.original?.code||err?.original?.errno||err?.code||'';const retriable=code==='ER_LOCK_DEADLOCK'||code==='ER_LOCK_WAIT_TIMEOUT'||String(code)==='1213'||String(code)==='1205'||String(code)==='40001';if(!retriable||i===retries-1)throw err;await sleep(delayMs*(i+1));lastErr=err;}}throw lastErr;}
module.exports={withRetry};
