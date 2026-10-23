/* Blessings form (Web3Forms, falls back to email) */
const FORM_KEY='43c030dd-2c7e-4ae8-92a4-b2d13f8f3cad';
const TXT={ok:'Email sent successfully. Thank you for your blessings!',err:'Sorry, the message could not be sent. Please try again.'};
let flashT=null;
function flash(text,ok){const el=$('ty');el.textContent=text;el.style.color=ok?'var(--gt)':'#8a1c1c';el.hidden=false;clearTimeout(flashT);flashT=setTimeout(()=>{el.hidden=true;},4000);}
$('f').addEventListener('submit',async e=>{
  e.preventDefault();
  const btn=$('f').querySelector('button[type=submit]');
  const name=$('fn').value.trim(),msg=$('fm').value.trim();
  if(!FORM_KEY||FORM_KEY.indexOf('PASTE')===0){
    location.href='mailto:'+C.email+'?subject='+encodeURIComponent('Wedding blessings from '+name)+'&body='+encodeURIComponent(msg);return;}
  btn.disabled=true;
  try{
    const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({access_key:FORM_KEY,subject:'Wedding blessings from '+name,name:name,message:msg})});
    const j=await r.json();
    if(j.success){$('f').reset();flash(TXT.ok,true);}else{flash(TXT.err,false);}
  }catch(err){flash(TXT.err,false);}
  finally{btn.disabled=false;}
});
