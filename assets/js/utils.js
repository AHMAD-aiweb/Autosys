// Simple ID generator for human-friendly userIds/code
function shortId(prefix=""){ return prefix + Math.random().toString(36).slice(2,6) + Date.now().toString(36).slice(-4); }

// Pakistan phone validator: 03XXXXXXXXX or +92 3XXXXXXXXX
function isPkPhone(v){
  const s = v.replace(/[\s-]/g,'');
  return /^03\d{9}$/.test(s) || /^\+923\d{9}$/.test(s);
}

// Google Drive link validator
function isDriveLink(v){
  return /^(https?:\/\/)?(www\.)?drive\.google\.com\/.+/i.test(v);
}

// Email validator
function isEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

// Search in table rows
function bindTableSearch(inputEl, tableEl){
  inputEl.addEventListener('input', ()=>{
    const q = inputEl.value.trim().toLowerCase();
    tableEl.querySelectorAll('tbody tr').forEach(tr=>{
      tr.classList.toggle('hidden', !tr.innerText.toLowerCase().includes(q));
    });
  });
}

// Sort table by column on header click
function makeTableSortable(table){
  const ths = table.querySelectorAll('th');
  ths.forEach((th,idx)=>{
    let dir = 1;
    th.addEventListener('click', ()=>{
      const rows = Array.from(table.tBodies[0].rows);
      rows.sort((a,b)=>{
        const ta = a.cells[idx].innerText.toLowerCase();
        const tb = b.cells[idx].innerText.toLowerCase();
        const na = parseFloat(ta.replace(/[^0-9.-]/g,'')); const nb = parseFloat(tb.replace(/[^0-9.-]/g,''));
        if(!isNaN(na) && !isNaN(nb)) return (na-nb)*dir;
        return ta>tb?dir:ta<tb?-dir:0;
      });
      dir *= -1;
      rows.forEach(r=>table.tBodies[0].appendChild(r));
    });
  });
}

// Rewards tiers
const TIERS = [
  { key:"starter", name:"Starter", threshold:10, reward:null, label:"badge blue" },
  { key:"bronze", name:"Bronze", threshold:7500, reward:"Rs 5,000", label:"badge yellow" },
  { key:"silver", name:"Silver", threshold:15000, reward:"Rs 10,000", label:"badge pink" },
  { key:"gold", name:"Gold", threshold:50000, reward:"$100", label:"badge green" },
  { key:"diamond", name:"Diamond", threshold:100000, reward:"Rs 50,000", label:"badge blue" },
];

function monthKey(d=new Date()){
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,'0');
}

// Country detection (client-side)
async function detectCountry(){
  try {
    const res = await fetch("https://ipapi.co/json/"); // free for light usage
    const data = await res.json();
    return data.country_name || "Unknown";
  } catch(e){
    return "Unknown";
  }
}

// Guard public vs private pages
function requireAuth(redirect=true){
  return new Promise(resolve=>{
    auth.onAuthStateChanged(async (user)=>{
      if(user){ resolve(user); }
      else { if(redirect) window.location.href="index.html"; else resolve(null); }
    });
  });
}

// Extract query param
function qp(name){ return new URLSearchParams(location.search).get(name); }

// Format number with commas
function fmt(n){ return (n||0).toLocaleString(); }
