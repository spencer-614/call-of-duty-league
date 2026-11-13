/* Canonical per-tournament price settings; legacy defaults preserve existing events. */
(() => {
 const legacy={entry:5,reroll:10,lock:15,unlock:15,nuke:20};
 function validate(p){for(const k of Object.keys(legacy))if(!Number.isInteger(p[k])||p[k]<0||p[k]>10000)throw Error('Enter whole-dollar Switch prices from $0 to $10,000.');return p;}
 function base(t){return validate({...legacy,...(t.switch_prices||{})});}
 function current(t,session){if(session?.state?.prices)return session.state.prices;const p=base(t),n=Number(session?.state?.blowup_count||0);return Object.fromEntries(Object.entries(p).map(([k,v])=>[k,v+(k==='entry'?0:5*n)]));}
 function read(prefix,entryFee,paid){const text=String(entryFee).trim();const m=text.match(/^\$?(\d+)(?:\.00)?(?:\s*(?:\/|per)\s*(?:duo|team|squad))?$/i);if(paid&&!m)throw Error('For Switch entry, enter a whole-dollar amount such as $10 / Duo.');const p={entry:paid?Number(m[1]):0};for(const k of ['reroll','lock','unlock','nuke']){const raw=document.getElementById(prefix+k).value;if(!String(raw).trim())throw Error('Enter all four Switch power-up prices.');p[k]=Number(raw);}return validate(p);}
 function fill(prefix,t){const p=base(t);for(const k of ['reroll','lock','unlock','nuke'])document.getElementById(prefix+k).value=p[k];}
 window.SwitchPricing={base,current,read,fill,validate};
})();
