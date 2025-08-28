const { withRetry } = require('../utils/withRetry');
const { transfer } = require('../services/transfer');
const sequelize = require('../db');

(async()=>{
  try{
    await sequelize.authenticate();
    const tasks=[];
    const N=100;
    for(let i=0;i<N;i++){
      const fromId=i%2===0?1:2;
      const toId=i%2===0?2:1;
      // Log setiap task transfer yang akan dijalankan
      console.log(`Task ${i+1}: Transfer 5 dari akun ${fromId} ke akun ${toId}`);
      tasks.push(withRetry(()=>transfer({fromId,toId,amount:5}),{retries:5,delayMs:50}));
    }
    const results=await Promise.allSettled(tasks);
    // Log hasil setiap task
    results.forEach((r, i) => {
      if(r.status==='fulfilled')
        console.log(`Task ${i+1} SUCCESS:`, r.value);
      else
        console.log(`Task ${i+1} FAIL:`, r.reason.message);
    });
    const summary=results.reduce((acc,r)=>{if(r.status==='fulfilled')acc.ok++;else acc.fail++;return acc;},{ok:0,fail:0});
    console.log('Concurrency result:',summary);
    process.exit(0);
  }catch(err){
    console.error(err);
    process.exit(1);
  }
})();
// Penjelasan:
// Script ini menjalankan 20 transfer secara paralel antara akun 1 dan 2 (bolak-balik).
// Setiap transfer menggunakan transaction dan pessimistic locking.
// Jika locking berjalan baik, tidak akan ada race condition dan saldo tetap konsisten.
// Jika ada kegagalan (misal saldo tidak cukup), task akan gagal dan dicatat di log.
// Contoh hasil log:
// Task 1: Transfer 5 dari akun 1 ke akun 2
// Task 2: Transfer 5 dari akun 2 ke akun 1
// ...
// Task 1 SUCCESS: { ok: true, fromId: 1, toId: 2, amount: 5 }
// Task 2 SUCCESS: { ok: true, fromId: 2, toId: 1, amount: 5 }
// ...
// Task 19 FAIL: Insufficient balance
// Task 20 FAIL: Insufficient balance
// Concurrency result: { ok: 18, fail: 2 }
// Artinya, 18 transfer berhasil, 2 gagal karena saldo tidak cukup, dan tidak ada race condition.
