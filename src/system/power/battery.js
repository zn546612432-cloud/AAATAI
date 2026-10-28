// Battery and civil game clock evolve independently.
// From 08:00 at 100%, ordinary use reaches 20% around 23:00.
export const LOW_BATTERY_PERCENT=20;
export const BATTERY_DRAIN_INTERVAL_MS=1_125_000/80;
export const batteryPercent=s=>Number.isFinite(Number(s.batteryPercent))?Math.max(0,Math.min(100,Math.round(Number(s.batteryPercent)))):82;
export const needsCharge=s=>batteryPercent(s)<=LOW_BATTERY_PERCENT;
export function drainBattery(s,ms){
 if(!Number.isFinite(ms)||ms<=0||s.powerMode==='charging'||s.powerMode==='sleeping'||s.emergencyCharge)return 0;
 const before=batteryPercent(s),saved=Number.isFinite(s.powerActiveMs)?Math.max(0,s.powerActiveMs):0;
 const total=saved+ms,points=Math.floor(total/BATTERY_DRAIN_INTERVAL_MS);
 s.powerActiveMs=total%BATTERY_DRAIN_INTERVAL_MS;
 s.batteryPercent=Math.max(1,before-points);
 if(s.batteryPercent===1)s.emergencyCharge=true;
 return before-s.batteryPercent;
}
export const canCharge=s=>!!s&&s.day<90&&s.powerMode!=='charging'&&s.powerMode!=='sleeping';
export function plugIn(s){
 if(!canCharge(s))return false;
 s.powerMode='charging';s.emergencyCharge=false;s.poweredOff=false;s.powerActiveMs=0;s.worldMinuteFraction=0;
 return true;
}
export function unplug(s){
 if(s.powerMode!=='charging'||s.batteryPercent<=1)return false;
 s.powerMode='idle';s.sleepWakeAt=null;s.chargeFraction=0;s.worldMinuteFraction=0;
 return true;
}
